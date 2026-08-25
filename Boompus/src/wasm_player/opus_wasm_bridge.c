#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include "opus.h"
#include "ring_buffer.h"

#define WASM_EXPORT __attribute__((visibility("default")))

typedef struct {
    OpusDecoder *decoder;
    uint32_t sample_rate;
    uint32_t channels;
    RingBuffer *ring_buf;
} TunebloomWasmState;

WASM_EXPORT void *wasm_malloc(uint32_t size) {
    return malloc((size_t)size);
}

WASM_EXPORT void wasm_free(void *ptr) {
    if (ptr) {
        free(ptr);
    }
}

WASM_EXPORT uint32_t tb_decoder_init(uint32_t sample_rate, uint32_t channels) {
    if (channels < 1 || channels > 2) return 0;
    if (sample_rate != 8000 && sample_rate != 12000 && sample_rate != 16000 &&
        sample_rate != 24000 && sample_rate != 48000) {
        return 0;
    }

    TunebloomWasmState *state = (TunebloomWasmState *)malloc(sizeof(TunebloomWasmState));
    if (!state) return 0;

    int err = OPUS_OK;
    state->decoder = opus_decoder_create((opus_int32)sample_rate, (int)channels, &err);
    if (err != OPUS_OK || !state->decoder) {
        free(state);
        return 0;
    }

    state->sample_rate = sample_rate;
    state->channels = channels;
    state->ring_buf = ring_buffer_create(65536);

    return (uint32_t)(uintptr_t)state;
}

WASM_EXPORT int32_t tb_decoder_decode(uint32_t handle, const uint8_t *in_ptr, uint32_t in_len, float *out_ptr, uint32_t max_samples) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (!state || !state->decoder || !out_ptr) return -1;

    int decoded_samples = opus_decode_float(
        state->decoder,
        in_ptr,
        (opus_int32)in_len,
        out_ptr,
        (int)max_samples,
        0
    );

    return (int32_t)decoded_samples;
}

WASM_EXPORT void tb_decoder_reset(uint32_t handle) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (state && state->decoder) {
        opus_decoder_ctl(state->decoder, OPUS_RESET_STATE);
    }
}

WASM_EXPORT void tb_decoder_destroy(uint32_t handle) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (state) {
        if (state->decoder) {
            opus_decoder_destroy(state->decoder);
            state->decoder = NULL;
        }
        if (state->ring_buf) {
            ring_buffer_destroy(state->ring_buf);
            state->ring_buf = NULL;
        }
        free(state);
    }
}