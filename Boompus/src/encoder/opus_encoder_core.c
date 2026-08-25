#include "opus_encoder_core.h"
#include <string.h>

int opus_core_init(OpusEncoderWrapper *wrap, const OpusEncoderConfig *config) {
    if (!wrap || !config) return -1;
    memset(wrap, 0, sizeof(OpusEncoderWrapper));
    wrap->config = *config;
    wrap->frame_size = (config->sample_rate * 20) / 1000;

    int err = OPUS_OK;
    wrap->st = opus_encoder_create(config->sample_rate, config->channels, OPUS_APPLICATION_AUDIO, &err);
    if (err != OPUS_OK || !wrap->st) return -2;

    opus_encoder_ctl(wrap->st, OPUS_SET_COMPLEXITY(config->complexity));
    opus_encoder_ctl(wrap->st, OPUS_SET_BITRATE(config->bitrate_bps));
    opus_encoder_ctl(wrap->st, OPUS_SET_BANDWIDTH(OPUS_BANDWIDTH_FULLBAND));
    opus_encoder_ctl(wrap->st, OPUS_SET_SIGNAL(OPUS_SIGNAL_MUSIC));

    if (config->rate_control == OPUS_RATE_CBR) {
        opus_encoder_ctl(wrap->st, OPUS_SET_VBR(0));
        opus_encoder_ctl(wrap->st, OPUS_SET_VBR_CONSTRAINT(0));
    } else if (config->rate_control == OPUS_RATE_VBR) {
        opus_encoder_ctl(wrap->st, OPUS_SET_VBR(1));
        opus_encoder_ctl(wrap->st, OPUS_SET_VBR_CONSTRAINT(0));
    } else {
        opus_encoder_ctl(wrap->st, OPUS_SET_VBR(1));
        opus_encoder_ctl(wrap->st, OPUS_SET_VBR_CONSTRAINT(1));
    }

    opus_encoder_ctl(wrap->st, OPUS_GET_LOOKAHEAD(&wrap->lookahead));
    return 0;
}

int opus_core_encode_float(OpusEncoderWrapper *wrap, const float *pcm_interleaved, int frame_size, uint8_t *out_payload, int max_payload_bytes) {
    if (!wrap || !wrap->st || !pcm_interleaved || !out_payload) return -1;
    return opus_encode_float(wrap->st, pcm_interleaved, frame_size, out_payload, max_payload_bytes);
}

int opus_core_get_lookahead(const OpusEncoderWrapper *wrap) {
    return wrap ? wrap->lookahead : 0;
}

void opus_core_destroy(OpusEncoderWrapper *wrap) {
    if (wrap && wrap->st) {
        opus_encoder_destroy(wrap->st);
        wrap->st = NULL;
    }
}