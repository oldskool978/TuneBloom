#ifndef OGG_DEMUX_H
#define OGG_DEMUX_H

#include <stdint.h>
#include <stddef.h>

typedef struct {
    uint8_t version;
    uint8_t channels;
    uint16_t pre_skip;
    uint32_t input_sample_rate;
    int16_t output_gain;
    uint8_t channel_mapping_family;
} OpusHeadInfo;

typedef struct {
    const uint8_t *data;
    size_t size;
    size_t offset;
    
    size_t page_offset;
    size_t page_body_offset;
    size_t current_body_pos;
    uint8_t num_segments;
    uint8_t current_seg_idx;
    const uint8_t *seg_table;
    
    OpusHeadInfo head;
    int head_parsed;
    int tags_parsed;
    int in_page;
} OggDemuxer;

int ogg_demux_init(OggDemuxer *demuxer, const uint8_t *ogg_data, size_t size);
int ogg_demux_get_next_packet(OggDemuxer *demuxer, const uint8_t **packet_data, size_t *packet_len);

#endif