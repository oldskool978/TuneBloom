#include "wav_reader.h"
#include <stdlib.h>
#include <string.h>

static uint16_t read_uint16_le(const uint8_t *buf) {
    return (uint16_t)(buf[0] | (buf[1] << 8));
}

static uint32_t read_uint32_le(const uint8_t *buf) {
    return (uint32_t)(buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24));
}

int wav_read_header(FILE *fp, WavInfo *info) {
    if (!fp || !info) return -1;
    memset(info, 0, sizeof(WavInfo));

    uint8_t header[12];
    if (fread(header, 1, 12, fp) != 12) return -2;

    if (memcmp(header, "RIFF", 4) != 0 || memcmp(header + 8, "WAVE", 4) != 0) {
        return -3;
    }

    int fmt_found = 0;
    int data_found = 0;

    while (!feof(fp)) {
        uint8_t chunk_hdr[8];
        if (fread(chunk_hdr, 1, 8, fp) != 8) break;

        uint32_t chunk_size = read_uint32_le(chunk_hdr + 4);

        if (memcmp(chunk_hdr, "fmt ", 4) == 0) {
            if (chunk_size < 16) return -4;
            uint8_t fmt_buf[40];
            uint32_t read_len = chunk_size < sizeof(fmt_buf) ? chunk_size : (uint32_t)sizeof(fmt_buf);
            if (fread(fmt_buf, 1, read_len, fp) != read_len) return -5;

            info->audio_format = read_uint16_le(fmt_buf);
            info->num_channels = read_uint16_le(fmt_buf + 2);
            info->sample_rate = read_uint32_le(fmt_buf + 4);
            info->byte_rate = read_uint32_le(fmt_buf + 8);
            info->block_align = read_uint16_le(fmt_buf + 12);
            info->bits_per_sample = read_uint16_le(fmt_buf + 14);

            if (info->audio_format == 3) {
                info->is_float = 1;
            } else if (info->audio_format == 0xFFFE && chunk_size >= 40) {
                uint16_t sub_format = read_uint16_le(fmt_buf + 24);
                if (sub_format == 3) {
                    info->is_float = 1;
                }
            }

            if (chunk_size > read_len) {
                fseek(fp, (long)(chunk_size - read_len), SEEK_CUR);
            }
            fmt_found = 1;
        } else if (memcmp(chunk_hdr, "data", 4) == 0) {
            info->data_offset = (uint32_t)ftell(fp);
            info->data_size = chunk_size;
            data_found = 1;
            break;
        } else {
            fseek(fp, (long)chunk_size, SEEK_CUR);
        }
    }

    if (!fmt_found || !data_found) return -6;
    if (info->block_align == 0) return -7;

    info->total_samples_per_channel = info->data_size / info->block_align;
    return 0;
}

int wav_read_float_interleaved(FILE *fp, const WavInfo *info, float *out_buffer, int samples_per_channel) {
    if (!fp || !info || !out_buffer) return 0;

    int total_elements = samples_per_channel * info->num_channels;

    if (info->is_float && info->bits_per_sample == 32) {
        size_t read_count = fread(out_buffer, sizeof(float), (size_t)total_elements, fp);
        return (int)(read_count / info->num_channels);
    }

    if (info->bits_per_sample == 16) {
        int16_t *tmp = (int16_t *)malloc(sizeof(int16_t) * (size_t)total_elements);
        if (!tmp) return 0;
        size_t read_count = fread(tmp, sizeof(int16_t), (size_t)total_elements, fp);
        for (size_t i = 0; i < read_count; i++) {
            out_buffer[i] = (float)tmp[i] / 32768.0f;
        }
        free(tmp);
        return (int)(read_count / info->num_channels);
    }

    if (info->bits_per_sample == 24) {
        uint8_t *tmp = (uint8_t *)malloc(3 * (size_t)total_elements);
        if (!tmp) return 0;
        size_t read_bytes = fread(tmp, 1, 3 * (size_t)total_elements, fp);
        size_t read_samples = read_bytes / 3;
        for (size_t i = 0; i < read_samples; i++) {
            int32_t val = (int32_t)((tmp[i * 3 + 0] << 8) | (tmp[i * 3 + 1] << 16) | (tmp[i * 3 + 2] << 24));
            val >>= 8;
            out_buffer[i] = (float)val / 8388608.0f;
        }
        free(tmp);
        return (int)(read_samples / info->num_channels);
    }

    return 0;
}