#include "ogg_demux.h"
#include <string.h>

static uint16_t read_le16(const uint8_t *p) {
    return (uint16_t)(p[0] | ((uint16_t)p[1] << 8));
}

static uint32_t read_le32(const uint8_t *p) {
    return (uint32_t)(p[0] | ((uint32_t)p[1] << 8) | ((uint32_t)p[2] << 16) | ((uint32_t)p[3] << 24));
}

static int parse_opus_head(OggDemuxer *demuxer, const uint8_t *data, size_t len) {
    if (len < 19 || memcmp(data, "OpusHead", 8) != 0) {
        return -1;
    }
    demuxer->head.version = data[8];
    demuxer->head.channels = data[9];
    demuxer->head.pre_skip = read_le16(data + 10);
    demuxer->head.input_sample_rate = read_le32(data + 12);
    demuxer->head.output_gain = (int16_t)read_le16(data + 16);
    demuxer->head.channel_mapping_family = data[18];
    demuxer->head_parsed = 1;
    return 0;
}

int ogg_demux_init(OggDemuxer *demuxer, const uint8_t *ogg_data, size_t size) {
    if (!demuxer || !ogg_data || size < 27) {
        return -1;
    }
    memset(demuxer, 0, sizeof(OggDemuxer));
    demuxer->data = ogg_data;
    demuxer->size = size;
    demuxer->offset = 0;
    demuxer->in_page = 0;
    return 0;
}

int ogg_demux_get_next_packet(OggDemuxer *demuxer, const uint8_t **packet_data, size_t *packet_len) {
    if (!demuxer || !packet_data || !packet_len) {
        return -1;
    }

    while (1) {
        if (!demuxer->in_page) {
            while (demuxer->offset + 27 <= demuxer->size) {
                const uint8_t *p = demuxer->data + demuxer->offset;
                if (p[0] == 'O' && p[1] == 'g' && p[2] == 'g' && p[3] == 'S') {
                    break;
                }
                demuxer->offset++;
            }

            if (demuxer->offset + 27 > demuxer->size) {
                return 0;
            }

            const uint8_t *hdr = demuxer->data + demuxer->offset;
            demuxer->num_segments = hdr[26];
            size_t header_len = 27 + (size_t)demuxer->num_segments;

            if (demuxer->offset + header_len > demuxer->size) {
                return 0;
            }

            demuxer->page_offset = demuxer->offset;
            demuxer->seg_table = hdr + 27;
            demuxer->page_body_offset = demuxer->offset + header_len;
            demuxer->current_body_pos = demuxer->page_body_offset;
            demuxer->current_seg_idx = 0;
            demuxer->in_page = 1;
        }

        while (demuxer->current_seg_idx < demuxer->num_segments) {
            size_t pkt_sz = 0;
            const uint8_t *pkt_start = demuxer->data + demuxer->current_body_pos;

            while (demuxer->current_seg_idx < demuxer->num_segments) {
                uint8_t seg = demuxer->seg_table[demuxer->current_seg_idx++];
                pkt_sz += seg;
                demuxer->current_body_pos += seg;
                if (seg < 255) {
                    break;
                }
            }

            if (demuxer->current_body_pos > demuxer->size) {
                return -2;
            }

            if (!demuxer->head_parsed) {
                if (parse_opus_head(demuxer, pkt_start, pkt_sz) == 0) {
                    continue;
                }
            } else if (!demuxer->tags_parsed) {
                if (pkt_sz >= 8 && memcmp(pkt_start, "OpusTags", 8) == 0) {
                    demuxer->tags_parsed = 1;
                    continue;
                }
            }

            *packet_data = pkt_start;
            *packet_len = pkt_sz;
            return 1;
        }

        demuxer->offset = demuxer->current_body_pos;
        demuxer->in_page = 0;
    }
}