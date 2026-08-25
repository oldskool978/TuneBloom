#ifndef OPUS_ENCODER_CORE_H
#define OPUS_ENCODER_CORE_H

#include <stdint.h>
#include <opus/opus.h>

typedef enum {
    OPUS_RATE_CBR = 0,
    OPUS_RATE_VBR = 1,
    OPUS_RATE_CVBR = 2
} OpusRateControl;

typedef struct {
    int sample_rate;
    int channels;
    int bitrate_bps;
    int complexity;
    OpusRateControl rate_control;
} OpusEncoderConfig;

typedef struct {
    OpusEncoder *st;
    OpusEncoderConfig config;
    int lookahead;
    int frame_size;
} OpusEncoderWrapper;

int opus_core_init(OpusEncoderWrapper *wrap, const OpusEncoderConfig *config);
int opus_core_encode_float(OpusEncoderWrapper *wrap, const float *pcm_interleaved, int frame_size, uint8_t *out_payload, int max_payload_bytes);
int opus_core_get_lookahead(const OpusEncoderWrapper *wrap);
void opus_core_destroy(OpusEncoderWrapper *wrap);

#endif