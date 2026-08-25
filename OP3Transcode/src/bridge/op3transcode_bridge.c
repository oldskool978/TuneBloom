#include "op3transcode_bridge.h"
#include "../common/ogg_demux.h"
#include "../common/id3_tagger.h"
#include "../encoder/lame_v0_core.h"
#include <opus.h>
#include <stdlib.h>
#include <string.h>

#define WASM_EXPORT __attribute__((visibility("default")))

typedef struct {
    OpusDecoder *decoder;
    LameV0Encoder encoder;
    uint32_t sample_rate;
    uint32_t channels;
    uint32_t pre_skip_remaining;
    float ring_buffer[11520 * 2];
    uint32_t ring_samples;
    int header_seen;
} StreamState;

WASM_EXPORT void *wasm_malloc(uint32_t size) {
    return malloc((size_t)size);
}

WASM_EXPORT void wasm_free(void *ptr) {
    if (ptr) {
        free(ptr);
    }
}

static int append_to_buffer(uint8_t **buf, size_t *cap, size_t *len, const uint8_t *src, size_t src_len) {
    if (*len + src_len > *cap) {
        size_t new_cap = (*cap == 0) ? (src_len + 65536) : ((*cap + src_len) * 2);
        uint8_t *new_buf = (uint8_t *)realloc(*buf, new_cap);
        if (!new_buf) {
            return -1;
        }
        *buf = new_buf;
        *cap = new_cap;
    }
    memcpy(*buf + *len, src, src_len);
    *len += src_len;
    return 0;
}

WASM_EXPORT int32_t op3_transcode_monolithic(
    const uint8_t *opus_bytes,
    uint32_t opus_len,
    uint8_t **out_mp3_ptr,
    uint32_t *out_mp3_len,
    int32_t vbr_quality,
    const char *title,
    const char *artist,
    const char *album,
    const char *genre,
    const char *comment
) {
    if (!opus_bytes || opus_len < 27 || !out_mp3_ptr || !out_mp3_len) {
        return -1;
    }

    OggDemuxer demux;
    if (ogg_demux_init(&demux, opus_bytes, (size_t)opus_len) != 0) {
        return -2;
    }

    const uint8_t *first_pkt = NULL;
    size_t first_len = 0;
    int status = ogg_demux_get_next_packet(&demux, &first_pkt, &first_len);
    if (status != 1 || !demux.head_parsed) {
        return -3;
    }

    uint32_t channels = (demux.head.channels > 0) ? (uint32_t)demux.head.channels : 2;
    uint32_t sample_rate = 48000;

    int err = OPUS_OK;
    OpusDecoder *dec = opus_decoder_create((opus_int32)sample_rate, (int)channels, &err);
    if (err != OPUS_OK || !dec) {
        return -4;
    }

    LameV0Encoder enc;
    if (lame_v0_init(&enc, sample_rate, channels, vbr_quality) != 0) {
        opus_decoder_destroy(dec);
        return -5;
    }

    uint8_t *mp3_buffer = NULL;
    size_t mp3_capacity = 0;
    size_t mp3_length = 0;

    ID3Metadata meta = { title, artist, album, genre, comment };
    size_t id3_sz = id3_calculate_tag_size(&meta);
    if (id3_sz > 0) {
        uint8_t *id3_buf = (uint8_t *)malloc(id3_sz);
        if (id3_buf) {
            size_t serialized = id3_serialize_tag(&meta, id3_buf, id3_sz);
            append_to_buffer(&mp3_buffer, &mp3_capacity, &mp3_length, id3_buf, serialized);
            free(id3_buf);
        }
    }

    size_t mp3_stream_start_offset = mp3_length;
    uint32_t pre_skip = (uint32_t)demux.head.pre_skip;
    float pcm_frame[5760 * 2];
    uint8_t enc_chunk[65536];

    const uint8_t *cur_pkt = first_pkt;
    size_t cur_len = first_len;

    while (1) {
        int decoded = opus_decode_float(dec, cur_pkt, (opus_int32)cur_len, pcm_frame, 5760, 0);
        if (decoded > 0) {
            const float *pcm_in = pcm_frame;
            int active_samples = decoded;

            if (pre_skip > 0) {
                if ((uint32_t)active_samples <= pre_skip) {
                    pre_skip -= (uint32_t)active_samples;
                    active_samples = 0;
                } else {
                    pcm_in += (size_t)pre_skip * (size_t)channels;
                    active_samples -= (int)pre_skip;
                    pre_skip = 0;
                }
            }

            if (active_samples > 0) {
                int encoded_bytes = lame_v0_encode_float(&enc, pcm_in, active_samples, enc_chunk, (int)sizeof(enc_chunk));
                if (encoded_bytes > 0) {
                    append_to_buffer(&mp3_buffer, &mp3_capacity, &mp3_length, enc_chunk, (size_t)encoded_bytes);
                }
            }
        }

        int next_st = ogg_demux_get_next_packet(&demux, &cur_pkt, &cur_len);
        if (next_st != 1) {
            break;
        }
    }

    int flushed_bytes = lame_v0_flush(&enc, enc_chunk, (int)sizeof(enc_chunk));
    if (flushed_bytes > 0) {
        append_to_buffer(&mp3_buffer, &mp3_capacity, &mp3_length, enc_chunk, (size_t)flushed_bytes);
    }

    if (mp3_length > mp3_stream_start_offset) {
        lame_v0_finalize_vbr_tag(
            &enc,
            mp3_buffer + mp3_stream_start_offset,
            mp3_length - mp3_stream_start_offset
        );
    }

    opus_decoder_destroy(dec);
    lame_v0_destroy(&enc);

    *out_mp3_ptr = mp3_buffer;
    *out_mp3_len = (uint32_t)mp3_length;
    return 0;
}

WASM_EXPORT uint32_t op3_stream_init(uint32_t sample_rate, uint32_t channels, int32_t vbr_quality) {
    if (sample_rate != 48000 || (channels != 1 && channels != 2)) {
        return 0;
    }

    StreamState *st = (StreamState *)malloc(sizeof(StreamState));
    if (!st) {
        return 0;
    }
    memset(st, 0, sizeof(StreamState));

    int err = OPUS_OK;
    st->decoder = opus_decoder_create((opus_int32)sample_rate, (int)channels, &err);
    if (err != OPUS_OK || !st->decoder) {
        free(st);
        return 0;
    }

    if (lame_v0_init(&st->encoder, sample_rate, channels, vbr_quality) != 0) {
        opus_decoder_destroy(st->decoder);
        free(st);
        return 0;
    }

    st->sample_rate = sample_rate;
    st->channels = channels;
    st->pre_skip_remaining = 312;
    st->ring_samples = 0;
    st->header_seen = 0;
    return (uint32_t)(uintptr_t)st;
}

WASM_EXPORT int32_t op3_stream_feed_packet(uint32_t handle, const uint8_t *pkt, uint32_t pkt_len, uint8_t *out_mp3, uint32_t max_out) {
    StreamState *st = (StreamState *)(uintptr_t)handle;
    if (!st || !pkt || pkt_len == 0 || !out_mp3) {
        return -1;
    }

    float temp_pcm[5760 * 2];
    int decoded = opus_decode_float(st->decoder, pkt, (opus_int32)pkt_len, temp_pcm, 5760, 0);
    if (decoded <= 0) {
        return 0;
    }

    const float *pcm_in = temp_pcm;
    int samples = decoded;

    if (st->pre_skip_remaining > 0) {
        if ((uint32_t)samples <= st->pre_skip_remaining) {
            st->pre_skip_remaining -= (uint32_t)samples;
            return 0;
        } else {
            pcm_in += (size_t)st->pre_skip_remaining * (size_t)st->channels;
            samples -= (int)st->pre_skip_remaining;
            st->pre_skip_remaining = 0;
        }
    }

    return lame_v0_encode_float(&st->encoder, pcm_in, samples, out_mp3, (int)max_out);
}

WASM_EXPORT int32_t op3_stream_flush(uint32_t handle, uint8_t *out_mp3, uint32_t max_out) {
    StreamState *st = (StreamState *)(uintptr_t)handle;
    if (!st || !out_mp3) {
        return -1;
    }
    return lame_v0_flush(&st->encoder, out_mp3, (int)max_out);
}

WASM_EXPORT void op3_stream_destroy(uint32_t handle) {
    StreamState *st = (StreamState *)(uintptr_t)handle;
    if (st) {
        if (st->decoder) {
            opus_decoder_destroy(st->decoder);
            st->decoder = NULL;
        }
        lame_v0_destroy(&st->encoder);
        free(st);
    }
}