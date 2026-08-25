#include "ogg_writer.h"
#include <stdlib.h>
#include <string.h>

static void write_uint16_le(uint8_t *p, uint16_t v) {
    p[0] = (uint8_t)(v & 0xFF);
    p[1] = (uint8_t)((v >> 8) & 0xFF);
}

static void write_uint32_le(uint8_t *p, uint32_t v) {
    p[0] = (uint8_t)(v & 0xFF);
    p[1] = (uint8_t)((v >> 8) & 0xFF);
    p[2] = (uint8_t)((v >> 16) & 0xFF);
    p[3] = (uint8_t)((v >> 24) & 0xFF);
}

static int flush_stream_pages(OggWriterContext *ctx, int force_flush) {
    ogg_page og;
    while (force_flush ? ogg_stream_flush(&ctx->os, &og) : ogg_stream_pageout(&ctx->os, &og)) {
        if (fwrite(og.header, 1, (size_t)og.header_len, ctx->out_file) != (size_t)og.header_len) return -1;
        if (fwrite(og.body, 1, (size_t)og.body_len, ctx->out_file) != (size_t)og.body_len) return -1;
    }
    return 0;
}

int ogg_writer_init(OggWriterContext *ctx, FILE *out_file, int serial_no) {
    if (!ctx || !out_file) return -1;
    memset(ctx, 0, sizeof(OggWriterContext));
    ctx->out_file = out_file;
    ctx->serial_no = serial_no;
    if (ogg_stream_init(&ctx->os, serial_no) != 0) return -2;
    return 0;
}

int ogg_writer_write_opus_headers(OggWriterContext *ctx, int channels, int sample_rate, int preskip, float gain_db) {
    if (!ctx) return -1;

    uint8_t head_data[19];
    memcpy(head_data, "OpusHead", 8);
    head_data[8] = 1;
    head_data[9] = (uint8_t)channels;
    write_uint16_le(head_data + 10, (uint16_t)preskip);
    write_uint32_le(head_data + 12, (uint32_t)sample_rate);
    int16_t gain_val = (int16_t)(gain_db * 256.0f);
    write_uint16_le(head_data + 16, (uint16_t)gain_val);
    head_data[18] = 0;

    ogg_packet op_head;
    memset(&op_head, 0, sizeof(op_head));
    op_head.packet = head_data;
    op_head.bytes = sizeof(head_data);
    op_head.b_o_s = 1;
    op_head.e_o_s = 0;
    op_head.granulepos = 0;
    op_head.packetno = ctx->packet_count++;

    ogg_stream_packetin(&ctx->os, &op_head);
    if (flush_stream_pages(ctx, 1) != 0) return -2;

    const char *vendor = "TuneBloom Boompus Reference Master";
    uint32_t vendor_len = (uint32_t)strlen(vendor);
    uint32_t tags_size = 8 + 4 + vendor_len + 4;
    uint8_t *tags_data = (uint8_t *)calloc(1, tags_size);
    if (!tags_data) return -3;

    memcpy(tags_data, "OpusTags", 8);
    write_uint32_le(tags_data + 8, vendor_len);
    memcpy(tags_data + 12, vendor, vendor_len);
    write_uint32_le(tags_data + 12 + vendor_len, 0);

    ogg_packet op_tags;
    memset(&op_tags, 0, sizeof(op_tags));
    op_tags.packet = tags_data;
    op_tags.bytes = (long)tags_size;
    op_tags.b_o_s = 0;
    op_tags.e_o_s = 0;
    op_tags.granulepos = 0;
    op_tags.packetno = ctx->packet_count++;

    ogg_stream_packetin(&ctx->os, &op_tags);
    free(tags_data);

    if (flush_stream_pages(ctx, 1) != 0) return -4;
    return 0;
}

int ogg_writer_write_packet(OggWriterContext *ctx, const uint8_t *packet_data, int packet_len, int samples_in_packet, int is_eos, int64_t exact_final_granule) {
    if (!ctx || !packet_data || packet_len <= 0) return -1;

    if (is_eos && exact_final_granule > 0) {
        ctx->granule_pos = exact_final_granule;
    } else {
        ctx->granule_pos += samples_in_packet;
    }

    ogg_packet op;
    memset(&op, 0, sizeof(op));
    op.packet = (unsigned char *)packet_data;
    op.bytes = packet_len;
    op.b_o_s = 0;
    op.e_o_s = is_eos ? 1 : 0;
    op.granulepos = ctx->granule_pos;
    op.packetno = ctx->packet_count++;

    ogg_stream_packetin(&ctx->os, &op);
    return flush_stream_pages(ctx, is_eos);
}

int ogg_writer_close(OggWriterContext *ctx) {
    if (!ctx) return -1;
    flush_stream_pages(ctx, 1);
    ogg_stream_clear(&ctx->os);
    return 0;
}