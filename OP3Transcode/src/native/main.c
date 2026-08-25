#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "../bridge/op3transcode_bridge.h"

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stdout, "Usage: tunebloom-transcode <input.opus> <output.mp3> [vbr_quality: 0-9]\n");
        return 1;
    }

    const char *in_path = argv[1];
    const char *out_path = argv[2];
    int vbr_q = 0;
    if (argc >= 4) {
        vbr_q = atoi(argv[3]);
        if (vbr_q < 0 || vbr_q > 9) {
            vbr_q = 0;
        }
    }

    FILE *in_fp = fopen(in_path, "rb");
    if (!in_fp) {
        fprintf(stderr, "[!] Error opening input file: %s\n", in_path);
        return 1;
    }

    fseek(in_fp, 0, SEEK_END);
    long file_sz = ftell(in_fp);
    fseek(in_fp, 0, SEEK_SET);

    if (file_sz <= 0) {
        fprintf(stderr, "[!] Input file is empty: %s\n", in_path);
        fclose(in_fp);
        return 1;
    }

    uint8_t *in_data = (uint8_t *)malloc((size_t)file_sz);
    if (!in_data || fread(in_data, 1, (size_t)file_sz, in_fp) != (size_t)file_sz) {
        fprintf(stderr, "[!] Failed reading input stream.\n");
        fclose(in_fp);
        if (in_data) free(in_data);
        return 1;
    }
    fclose(in_fp);

    fprintf(stdout, "[*] Transcoding: %s -> %s (VBR V%d, 48.0 kHz Master)...\n", in_path, out_path, vbr_q);
    clock_t start = clock();

    uint8_t *out_mp3 = NULL;
    uint32_t out_len = 0;

    int res = op3_transcode_monolithic(
        in_data,
        (uint32_t)file_sz,
        &out_mp3,
        &out_len,
        vbr_q,
        "TuneBloom Master Output",
        "TuneBloom Engine",
        "Mastering Stage V0",
        "Electronic / Master",
        "Engine: SICKOMODE -> Boompus -> OP3Transcode"
    );

    double elapsed = (double)(clock() - start) / (double)CLOCKS_PER_SEC;
    free(in_data);

    if (res != 0 || !out_mp3 || out_len == 0) {
        fprintf(stderr, "[!] Transcoding failed with error code: %d\n", res);
        return 1;
    }

    FILE *out_fp = fopen(out_path, "wb");
    if (!out_fp || fwrite(out_mp3, 1, out_len, out_fp) != out_len) {
        fprintf(stderr, "[!] Failed writing output MP3 artifact: %s\n", out_path);
        if (out_fp) fclose(out_fp);
        wasm_free(out_mp3);
        return 1;
    }
    fclose(out_fp);
    wasm_free(out_mp3);

    fprintf(stdout, "[+] Transcode completed in %.3fs | Output: %u bytes (Bit-Exact VBR V0)\n", elapsed, out_len);
    return 0;
}