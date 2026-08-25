#ifndef LAME_V0_CORE_H
#define LAME_V0_CORE_H

#include <stdint.h>
#include <stddef.h>

#if defined(__has_include)
  #if __has_include(<lame/lame.h>)
    #include <lame/lame.h>
  #elif __has_include("lame.h")
    #include "lame.h"
  #else
    #include <lame.h>
  #endif
#else
  #include <lame/lame.h>
#endif

typedef struct {
    lame_global_flags *gfp;
    uint32_t sample_rate;
    uint32_t channels;
    int vbr_quality;
    int is_initialized;
} LameV0Encoder;

int lame_v0_init(LameV0Encoder *encoder, uint32_t sample_rate, uint32_t channels, int vbr_quality);
int lame_v0_encode_float(LameV0Encoder *encoder, const float *pcm_interleaved, int num_samples_per_channel, uint8_t *mp3_out, int max_mp3_bytes);
int lame_v0_flush(LameV0Encoder *encoder, uint8_t *mp3_out, int max_mp3_bytes);
size_t lame_v0_finalize_vbr_tag(LameV0Encoder *encoder, uint8_t *mp3_stream_start, size_t stream_size);
void lame_v0_destroy(LameV0Encoder *encoder);

#endif