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
    void *raw_scratch;
    float *decode_scratch;
    uint32_t scratch_capacity;
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
    state->ring_buf = ring_buffer_create(131072);
    state->scratch_capacity = 5760 * channels;
    
    size_t scratch_bytes = (size_t)state->scratch_capacity * sizeof(float);
    state->raw_scratch = malloc(scratch_bytes + 16);
    if (state->raw_scratch) {
        state->decode_scratch = (float *)(((uintptr_t)state->raw_scratch + 15) & ~(uintptr_t)15);
    } else {
        state->decode_scratch = NULL;
    }

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

WASM_EXPORT int32_t tb_decoder_decode_to_ring(uint32_t handle, const uint8_t *in_ptr, uint32_t in_len) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (!state || !state->decoder || !state->ring_buf || !state->decode_scratch) return -1;

    int decoded_samples = opus_decode_float(
        state->decoder,
        in_ptr,
        (opus_int32)in_len,
        state->decode_scratch,
        (int)(state->scratch_capacity / state->channels),
        0
    );

    if (decoded_samples > 0) {
        uint32_t total_floats = (uint32_t)decoded_samples * state->channels;
        ring_buffer_write(state->ring_buf, state->decode_scratch, total_floats);
    }
    return (int32_t)decoded_samples;
}

WASM_EXPORT uint32_t tb_decoder_ring_read(uint32_t handle, float *out_ptr, uint32_t count) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (!state || !state->ring_buf || !out_ptr || count == 0) return 0;
    return ring_buffer_read(state->ring_buf, out_ptr, count);
}

WASM_EXPORT uint32_t tb_decoder_ring_avail(uint32_t handle) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (!state || !state->ring_buf) return 0;
    return ring_buffer_available_read(state->ring_buf);
}

WASM_EXPORT void tb_decoder_ring_reset(uint32_t handle) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (state && state->ring_buf) {
        ring_buffer_reset(state->ring_buf);
    }
}

WASM_EXPORT void tb_decoder_reset(uint32_t handle) {
    TunebloomWasmState *state = (TunebloomWasmState *)(uintptr_t)handle;
    if (state) {
        if (state->decoder) {
            opus_decoder_ctl(state->decoder, OPUS_RESET_STATE);
        }
        if (state->ring_buf) {
            ring_buffer_reset(state->ring_buf);
        }
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
        if (state->raw_scratch) {
            free(state->raw_scratch);
            state->raw_scratch = NULL;
            state->decode_scratch = NULL;
        }
        free(state);
    }
}