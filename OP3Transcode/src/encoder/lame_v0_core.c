#include "lame_v0_core.h"
#include <string.h>

int lame_v0_init(LameV0Encoder *encoder, uint32_t sample_rate, uint32_t channels, int vbr_quality) {
    if (!encoder || channels < 1 || channels > 2) {
        return -1;
    }
    memset(encoder, 0, sizeof(LameV0Encoder));

    encoder->gfp = lame_init();
    if (!encoder->gfp) {
        return -2;
    }

    encoder->sample_rate = sample_rate;
    encoder->channels = channels;
    encoder->vbr_quality = vbr_quality;

    lame_set_in_samplerate(encoder->gfp, (int)sample_rate);
    lame_set_num_channels(encoder->gfp, (int)channels);
    lame_set_out_samplerate(encoder->gfp, (int)sample_rate);
    lame_set_VBR(encoder->gfp, vbr_default);
    lame_set_VBR_q(encoder->gfp, vbr_quality);
    lame_set_VBR_quality(encoder->gfp, (float)vbr_quality);
    lame_set_mode(encoder->gfp, (channels == 2) ? JOINT_STEREO : MONO);
    lame_set_quality(encoder->gfp, 0);

    lame_set_lowpassfreq(encoder->gfp, -1);
    lame_set_highpassfreq(encoder->gfp, -1);
    lame_set_bWriteVbrTag(encoder->gfp, 1);

    if (lame_init_params(encoder->gfp) < 0) {
        lame_close(encoder->gfp);
        encoder->gfp = NULL;
        return -3;
    }

    encoder->is_initialized = 1;
    return 0;
}

int lame_v0_encode_float(LameV0Encoder *encoder, const float *pcm_interleaved, int num_samples_per_channel, uint8_t *mp3_out, int max_mp3_bytes) {
    if (!encoder || !encoder->is_initialized || !pcm_interleaved || !mp3_out) {
        return -1;
    }
    return lame_encode_buffer_interleaved_ieee_float(
        encoder->gfp,
        pcm_interleaved,
        num_samples_per_channel,
        mp3_out,
        max_mp3_bytes
    );
}

int lame_v0_flush(LameV0Encoder *encoder, uint8_t *mp3_out, int max_mp3_bytes) {
    if (!encoder || !encoder->is_initialized || !mp3_out) {
        return -1;
    }
    return lame_encode_flush(encoder->gfp, mp3_out, max_mp3_bytes);
}

size_t lame_v0_finalize_vbr_tag(LameV0Encoder *encoder, uint8_t *mp3_stream_start, size_t stream_size) {
    if (!encoder || !encoder->is_initialized || !mp3_stream_start || stream_size < 1152) {
        return 0;
    }
    return (size_t)lame_get_lametag_frame(encoder->gfp, mp3_stream_start, stream_size);
}

void lame_v0_destroy(LameV0Encoder *encoder) {
    if (encoder && encoder->gfp) {
        lame_close(encoder->gfp);
        encoder->gfp = NULL;
        encoder->is_initialized = 0;
    }
}