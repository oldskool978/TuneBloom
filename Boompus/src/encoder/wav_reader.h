#ifndef WAV_READER_H
#define WAV_READER_H

#include <stdio.h>
#include <stdint.h>

typedef struct {
    uint16_t audio_format;
    uint16_t num_channels;
    uint32_t sample_rate;
    uint32_t byte_rate;
    uint16_t block_align;
    uint16_t bits_per_sample;
    uint32_t data_offset;
    uint32_t data_size;
    uint64_t total_samples_per_channel;
    int is_float;
} WavInfo;

int wav_read_header(FILE *fp, WavInfo *info);
int wav_read_float_interleaved(FILE *fp, const WavInfo *info, float *out_buffer, int samples_per_channel);

#endif