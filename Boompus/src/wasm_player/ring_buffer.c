#include "ring_buffer.h"
#include <stdlib.h>
#include <string.h>

static uint32_t next_power_of_two(uint32_t val) {
    if (val < 2) return 2;
    val--;
    val |= val >> 1;
    val |= val >> 2;
    val |= val >> 4;
    val |= val >> 8;
    val |= val >> 16;
    return val + 1;
}

RingBuffer *ring_buffer_create(uint32_t capacity) {
    uint32_t pow2_cap = next_power_of_two(capacity);
    RingBuffer *rb = (RingBuffer *)malloc(sizeof(RingBuffer));
    if (!rb) return NULL;

    rb->buffer = (float *)malloc(sizeof(float) * pow2_cap);
    if (!rb->buffer) {
        free(rb);
        return NULL;
    }

    rb->capacity = pow2_cap;
    rb->mask = pow2_cap - 1;
    rb->write_idx = 0;
    rb->read_idx = 0;
    return rb;
}

void ring_buffer_destroy(RingBuffer *rb) {
    if (rb) {
        if (rb->buffer) {
            free(rb->buffer);
        }
        free(rb);
    }
}

void ring_buffer_reset(RingBuffer *rb) {
    if (rb) {
        rb->write_idx = 0;
        rb->read_idx = 0;
    }
}

uint32_t ring_buffer_available_read(const RingBuffer *rb) {
    if (!rb) return 0;
    return rb->write_idx - rb->read_idx;
}

uint32_t ring_buffer_available_write(const RingBuffer *rb) {
    if (!rb) return 0;
    return rb->capacity - (rb->write_idx - rb->read_idx);
}

uint32_t ring_buffer_write(RingBuffer *rb, const float *data, uint32_t count) {
    if (!rb || !data || count == 0) return 0;

    uint32_t avail = ring_buffer_available_write(rb);
    uint32_t to_write = count < avail ? count : avail;
    if (to_write == 0) return 0;

    uint32_t w_idx = rb->write_idx & rb->mask;
    uint32_t first_chunk = rb->capacity - w_idx;

    if (to_write <= first_chunk) {
        memcpy(rb->buffer + w_idx, data, to_write * sizeof(float));
    } else {
        memcpy(rb->buffer + w_idx, data, first_chunk * sizeof(float));
        memcpy(rb->buffer, data + first_chunk, (to_write - first_chunk) * sizeof(float));
    }

    rb->write_idx += to_write;
    return to_write;
}

uint32_t ring_buffer_read(RingBuffer *rb, float *data, uint32_t count) {
    if (!rb || !data || count == 0) return 0;

    uint32_t avail = ring_buffer_available_read(rb);
    uint32_t to_read = count < avail ? count : avail;
    if (to_read == 0) return 0;

    uint32_t r_idx = rb->read_idx & rb->mask;
    uint32_t first_chunk = rb->capacity - r_idx;

    if (to_read <= first_chunk) {
        memcpy(data, rb->buffer + r_idx, to_read * sizeof(float));
    } else {
        memcpy(data, rb->buffer + r_idx, first_chunk * sizeof(float));
        memcpy(data + first_chunk, rb->buffer, (to_read - first_chunk) * sizeof(float));
    }

    rb->read_idx += to_read;
    return to_read;
}