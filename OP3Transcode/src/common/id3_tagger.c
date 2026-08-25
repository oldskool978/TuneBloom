#include "id3_tagger.h"
#include <string.h>

static void write_syncsafe32(uint8_t *p, uint32_t val) {
    p[0] = (uint8_t)((val >> 21) & 0x7F);
    p[1] = (uint8_t)((val >> 14) & 0x7F);
    p[2] = (uint8_t)((val >> 7) & 0x7F);
    p[3] = (uint8_t)(val & 0x7F);
}

static size_t write_text_frame(uint8_t *buf, const char *frame_id, const char *text) {
    if (!text || !text[0]) return 0;
    size_t text_len = strlen(text);
    size_t frame_payload_len = 1 + text_len;

    memcpy(buf, frame_id, 4);
    write_syncsafe32(buf + 4, (uint32_t)frame_payload_len);
    buf[8] = 0x00;
    buf[9] = 0x00;
    buf[10] = 0x03; /* UTF-8 encoding marker */
    memcpy(buf + 11, text, text_len);

    return 10 + frame_payload_len;
}

static size_t write_comment_frame(uint8_t *buf, const char *comment) {
    if (!comment || !comment[0]) return 0;
    size_t text_len = strlen(comment);
    size_t frame_payload_len = 1 + 3 + 1 + text_len;

    memcpy(buf, "COMM", 4);
    write_syncsafe32(buf + 4, (uint32_t)frame_payload_len);
    buf[8] = 0x00;
    buf[9] = 0x00;
    buf[10] = 0x03;
    memcpy(buf + 11, "eng", 3);
    buf[14] = 0x00;
    memcpy(buf + 15, comment, text_len);

    return 10 + frame_payload_len;
}

size_t id3_calculate_tag_size(const ID3Metadata *meta) {
    if (!meta) return 0;
    size_t payload_size = 0;
    if (meta->title && meta->title[0]) payload_size += 10 + 1 + strlen(meta->title);
    if (meta->artist && meta->artist[0]) payload_size += 10 + 1 + strlen(meta->artist);
    if (meta->album && meta->album[0]) payload_size += 10 + 1 + strlen(meta->album);
    if (meta->genre && meta->genre[0]) payload_size += 10 + 1 + strlen(meta->genre);
    if (meta->comment && meta->comment[0]) payload_size += 10 + 4 + 1 + strlen(meta->comment);
    return payload_size > 0 ? (10 + payload_size) : 0;
}

size_t id3_serialize_tag(const ID3Metadata *meta, uint8_t *out_buffer, size_t max_size) {
    size_t needed = id3_calculate_tag_size(meta);
    if (needed == 0 || needed > max_size) return 0;

    out_buffer[0] = 'I';
    out_buffer[1] = 'D';
    out_buffer[2] = '3';
    out_buffer[3] = 0x04;
    out_buffer[4] = 0x00;
    out_buffer[5] = 0x00;
    write_syncsafe32(out_buffer + 6, (uint32_t)(needed - 10));

    size_t offset = 10;
    offset += write_text_frame(out_buffer + offset, "TIT2", meta->title);
    offset += write_text_frame(out_buffer + offset, "TPE1", meta->artist);
    offset += write_text_frame(out_buffer + offset, "TALB", meta->album);
    offset += write_text_frame(out_buffer + offset, "TCON", meta->genre);
    offset += write_comment_frame(out_buffer + offset, meta->comment);

    return offset;
}