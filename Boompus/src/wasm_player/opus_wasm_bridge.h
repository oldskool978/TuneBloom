#ifndef OPUS_WASM_BRIDGE_H
#define OPUS_WASM_BRIDGE_H

#include <stdint.h>

void *wasm_malloc(uint32_t size);
void wasm_free(void *ptr);
uint32_t tb_decoder_init(uint32_t sample_rate, uint32_t channels);
int32_t tb_decoder_decode(uint32_t handle, const uint8_t *in_ptr, uint32_t in_len, float *out_ptr, uint32_t max_samples);
int32_t tb_decoder_decode_to_ring(uint32_t handle, const uint8_t *in_ptr, uint32_t in_len);
uint32_t tb_decoder_ring_read(uint32_t handle, float *out_ptr, uint32_t count);
uint32_t tb_decoder_ring_avail(uint32_t handle);
void tb_decoder_ring_reset(uint32_t handle);
void tb_decoder_reset(uint32_t handle);
void tb_decoder_destroy(uint32_t handle);

#endif