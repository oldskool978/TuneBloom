#ifndef OGG_WRITER_H
#define OGG_WRITER_H

#include <stdio.h>
#include <stdint.h>
#include <ogg/ogg.h>

typedef struct {
    FILE *out_file;
    ogg_stream_state os;
    int serial_no;
    int64_t packet_count;
    int64_t granule_pos;
} OggWriterContext;

int ogg_writer_init(OggWriterContext *ctx, FILE *out_file, int serial_no);
int ogg_writer_write_opus_headers(OggWriterContext *ctx, int channels, int sample_rate, int preskip, float gain_db);
int ogg_writer_write_packet(OggWriterContext *ctx, const uint8_t *packet_data, int packet_len, int samples_in_packet, int is_eos, int64_t exact_final_granule);
int ogg_writer_close(OggWriterContext *ctx);

#endif