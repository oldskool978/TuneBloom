#ifndef OP3TRANSCODE_BRIDGE_H
#define OP3TRANSCODE_BRIDGE_H

#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

void *wasm_malloc(uint32_t size);
void wasm_free(void *ptr);

int32_t op3_transcode_monolithic(
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
);

uint32_t op3_stream_init(uint32_t sample_rate, uint32_t channels, int32_t vbr_quality);
int32_t op3_stream_feed_packet(uint32_t handle, const uint8_t *pkt, uint32_t pkt_len, uint8_t *out_mp3, uint32_t max_out);
int32_t op3_stream_flush(uint32_t handle, uint8_t *out_mp3, uint32_t max_out);
void op3_stream_destroy(uint32_t handle);

#ifdef __cplusplus
}
#endif

#endif