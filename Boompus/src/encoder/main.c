#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include "wav_reader.h"
#include "ogg_writer.h"
#include "opus_encoder_core.h"

static void print_telemetry(const char *in_path, const char *out_path, const WavInfo *wav, int bitrate_bps, OpusRateControl rc, double encode_sec, int64_t total_bytes, float peak_lin, float rms_lin) {
    double duration_sec = (double)wav->total_samples_per_channel / (double)wav->sample_rate;
    double rtf = encode_sec / (duration_sec > 0.0 ? duration_sec : 1.0);
    double actual_bitrate_kbps = ((double)total_bytes * 8.0) / (duration_sec > 0.0 ? duration_sec : 1.0) / 1000.0;
    float peak_dbfs = 20.0f * log10f(peak_lin > 1e-9f ? peak_lin : 1e-9f);
    float rms_dbfs = 20.0f * log10f(rms_lin > 1e-9f ? rms_lin : 1e-9f);
    float crest_factor_db = peak_dbfs - rms_dbfs;

    const char *rc_str = (rc == OPUS_RATE_CVBR) ? "CONSTRAINED VBR (CVBR)" : ((rc == OPUS_RATE_VBR) ? "UNCONSTRAINED VBR" : "HARD CBR");

    fprintf(stdout, "\n====================================================================================\n");
    fprintf(stdout, "                      TUNEBLOOM BOOMPUS ACOUSTIC TELEMETRY                          \n");
    fprintf(stdout, "====================================================================================\n");
    fprintf(stdout, "Input Master File:       %s\n", in_path);
    fprintf(stdout, "Output Opus File:        %s\n", out_path);
    fprintf(stdout, "Sampling Resolution:     %u Hz (%s)\n", wav->sample_rate, wav->is_float ? "32-bit Float PCM" : "Integer PCM");
    fprintf(stdout, "Audio Duration:          %.2fs (%llu samples)\n", duration_sec, (unsigned long long)wav->total_samples_per_channel);
    fprintf(stdout, "Encoder Latency:         %.3fs (RTF: %.3fx)\n", encode_sec, rtf);
    fprintf(stdout, "Target Bitrate:          %d kbps (%s)\n", bitrate_bps / 1000, rc_str);
    fprintf(stdout, "Achieved Bitrate:        %.2f kbps\n", actual_bitrate_kbps);
    fprintf(stdout, "Compression Ratio:       %.2f:1 (Payload: %lld bytes)\n", ((double)wav->data_size / (double)total_bytes), (long long)total_bytes);
    fprintf(stdout, "Peak Amplitude:          %.6f (%.2f dBFS)\n", peak_lin, peak_dbfs);
    fprintf(stdout, "Signal RMS:              %.6f (%.2f dBFS)\n", rms_lin, rms_dbfs);
    fprintf(stdout, "Acoustic Crest Factor:   %.2f dB\n", crest_factor_db);
    fprintf(stdout, "CELT Subband Coverage:   20.0 kHz Fullband (Complexity 10)\n");
    fprintf(stdout, "====================================================================================\n\n");
}

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stderr, "Usage: tunebloom-opusenc <input.wav> <output.opus> [bitrate_kbps] [--cbr|--vbr|--cvbr]\n");
        return 1;
    }

    const char *in_path = argv[1];
    const char *out_path = argv[2];
    int target_kbps = 192;
    OpusRateControl rc = OPUS_RATE_CVBR;

    for (int i = 3; i < argc; i++) {
        if (strcmp(argv[i], "--cbr") == 0) {
            rc = OPUS_RATE_CBR;
        } else if (strcmp(argv[i], "--vbr") == 0) {
            rc = OPUS_RATE_VBR;
        } else if (strcmp(argv[i], "--cvbr") == 0) {
            rc = OPUS_RATE_CVBR;
        } else {
            int val = atoi(argv[i]);
            if (val >= 32 && val <= 512) {
                target_kbps = val;
            }
        }
    }

    FILE *in_fp = fopen(in_path, "rb");
    if (!in_fp) {
        fprintf(stderr, "[!] Failed to open input WAV: %s\n", in_path);
        return 1;
    }

    WavInfo wav;
    if (wav_read_header(in_fp, &wav) != 0) {
        fprintf(stderr, "[!] Invalid or unsupported WAV container: %s\n", in_path);
        fclose(in_fp);
        return 1;
    }

    if (wav.sample_rate != 48000) {
        fprintf(stderr, "[!] Input sampling rate must be 48000 Hz for fullband mastering (Got %u Hz)\n", wav.sample_rate);
        fclose(in_fp);
        return 1;
    }

    FILE *out_fp = fopen(out_path, "wb");
    if (!out_fp) {
        fprintf(stderr, "[!] Failed to open output Opus destination: %s\n", out_path);
        fclose(in_fp);
        return 1;
    }

    OpusEncoderConfig enc_cfg;
    enc_cfg.sample_rate = wav.sample_rate;
    enc_cfg.channels = wav.num_channels;
    enc_cfg.bitrate_bps = target_kbps * 1000;
    enc_cfg.complexity = 10;
    enc_cfg.rate_control = rc;

    OpusEncoderWrapper enc;
    if (opus_core_init(&enc, &enc_cfg) != 0) {
        fprintf(stderr, "[!] Failed to initialize Opus encoder engine.\n");
        fclose(in_fp);
        fclose(out_fp);
        return 1;
    }

    int64_t exact_final_granule = (int64_t)enc.lookahead + (int64_t)wav.total_samples_per_channel;

    OggWriterContext ogg;
    ogg_writer_init(&ogg, out_fp, 0x54424D50);
    ogg_writer_write_opus_headers(&ogg, wav.num_channels, wav.sample_rate, enc.lookahead, 0.0f);

    int frame_samples = enc.frame_size;
    int channels = wav.num_channels;
    float *pcm_buf = (float *)calloc((size_t)(frame_samples * channels), sizeof(float));
    uint8_t payload_buf[4000];

    float peak_val = 0.0f;
    double sum_sq = 0.0;
    uint64_t total_samples_processed = 0;
    clock_t start_clk = clock();

    int drain_needed = 1;

    while (1) {
        int read_samples = wav_read_float_interleaved(in_fp, &wav, pcm_buf, frame_samples);
        
        if (read_samples > 0) {
            for (int i = 0; i < read_samples * channels; i++) {
                float v = fabsf(pcm_buf[i]);
                if (v > peak_val) peak_val = v;
                sum_sq += (double)(pcm_buf[i] * pcm_buf[i]);
            }
            total_samples_processed += (uint64_t)read_samples;

            if (read_samples < frame_samples) {
                memset(pcm_buf + (read_samples * channels), 0, sizeof(float) * (size_t)((frame_samples - read_samples) * channels));
            }

            int bytes_enc = opus_core_encode_float(&enc, pcm_buf, frame_samples, payload_buf, sizeof(payload_buf));
            if (bytes_enc > 0) {
                int is_last_chunk = (read_samples < frame_samples || ftell(in_fp) >= (long)(wav.data_offset + wav.data_size));
                if (is_last_chunk && drain_needed <= 0) {
                    ogg_writer_write_packet(&ogg, payload_buf, bytes_enc, frame_samples, 1, exact_final_granule);
                    break;
                } else {
                    ogg_writer_write_packet(&ogg, payload_buf, bytes_enc, frame_samples, 0, 0);
                }
            }

            if (read_samples < frame_samples) {
                break;
            }
        } else {
            break;
        }
    }

    /* Drain encoder lookahead memory */
    while (drain_needed > 0) {
        memset(pcm_buf, 0, sizeof(float) * (size_t)(frame_samples * channels));
        int bytes_enc = opus_core_encode_float(&enc, pcm_buf, frame_samples, payload_buf, sizeof(payload_buf));
        if (bytes_enc > 0) {
            drain_needed--;
            int is_eos = (drain_needed == 0);
            ogg_writer_write_packet(&ogg, payload_buf, bytes_enc, frame_samples, is_eos, is_eos ? exact_final_granule : 0);
        } else {
            break;
        }
    }

    double encode_sec = (double)(clock() - start_clk) / (double)CLOCKS_PER_SEC;
    int64_t total_bytes = (int64_t)ftell(out_fp);

    ogg_writer_close(&ogg);
    opus_core_destroy(&enc);
    free(pcm_buf);
    fclose(in_fp);
    fclose(out_fp);

    float rms_val = (total_samples_processed > 0) ? (float)sqrt(sum_sq / (double)(total_samples_processed * (uint64_t)channels)) : 0.0f;
    print_telemetry(in_path, out_path, &wav, enc_cfg.bitrate_bps, rc, encode_sec, total_bytes, peak_val, rms_val);

    return 0;
}