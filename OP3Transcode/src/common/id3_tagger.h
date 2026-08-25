#ifndef ID3_TAGGER_H
#define ID3_TAGGER_H

#include <stdint.h>
#include <stddef.h>

typedef struct {
    const char *title;
    const char *artist;
    const char *album;
    const char *genre;
    const char *comment;
} ID3Metadata;

size_t id3_calculate_tag_size(const ID3Metadata *meta);
size_t id3_serialize_tag(const ID3Metadata *meta, uint8_t *out_buffer, size_t max_size);

#endif