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

    size_t bytes = sizeof(float) * (size_t)pow2_cap;
    rb->raw_buffer = malloc(bytes + 16);
    if (!rb->raw_buffer) {
        free(rb);
        return NULL;
    }
    rb->buffer = (float *)(((uintptr_t)rb->raw_buffer + 15) & ~(uintptr_t)15);
    rb->capacity = pow2_cap;
    rb->mask = pow2_cap - 1;
    __atomic_store_n(&rb->write_idx, 0, __ATOMIC_RELAXED);
    __atomic_store_n(&rb->read_idx, 0, __ATOMIC_RELAXED);
    return rb;
}

void ring_buffer_destroy(RingBuffer *rb) {
    if (rb) {
        if (rb->raw_buffer) {
            free(rb->raw_buffer);
            rb->raw_buffer = NULL;
            rb->buffer = NULL;
        }
        free(rb);
    }
}

void ring_buffer_reset(RingBuffer *rb) {
    if (rb) {
        __atomic_store_n(&rb->write_idx, 0, __ATOMIC_RELAXED);
        __atomic_store_n(&rb->read_idx, 0, __ATOMIC_RELAXED);
    }
}

uint32_t ring_buffer_available_read(const RingBuffer *rb) {
    if (!rb) return 0;
    uint32_t w = __atomic_load_n(&rb->write_idx, __ATOMIC_ACQUIRE);
    uint32_t r = __atomic_load_n(&rb->read_idx, __ATOMIC_RELAXED);
    return w - r;
}

uint32_t ring_buffer_available_write(const RingBuffer *rb) {
    if (!rb) return 0;
    uint32_t w = __atomic_load_n(&rb->write_idx, __ATOMIC_RELAXED);
    uint32_t r = __atomic_load_n(&rb->read_idx, __ATOMIC_ACQUIRE);
    return rb->capacity - (w - r);
}

uint32_t ring_buffer_write(RingBuffer *rb, const float *data, uint32_t count) {
    if (!rb || !data || count == 0) return 0;
    uint32_t w = __atomic_load_n(&rb->write_idx, __ATOMIC_RELAXED);
    uint32_t r = __atomic_load_n(&rb->read_idx, __ATOMIC_ACQUIRE);
    uint32_t avail = rb->capacity - (w - r);
    if (avail < count) return 0;
    uint32_t to_write = count;

    uint32_t w_idx = w & rb->mask;
    uint32_t first_chunk = rb->capacity - w_idx;
    if (to_write <= first_chunk) {
        memcpy(rb->buffer + w_idx, data, (size_t)to_write * sizeof(float));
    } else {
        memcpy(rb->buffer + w_idx, data, (size_t)first_chunk * sizeof(float));
        memcpy(rb->buffer, data + first_chunk, (size_t)(to_write - first_chunk) * sizeof(float));
    }

    __atomic_store_n(&rb->write_idx, w + to_write, __ATOMIC_RELEASE);
    return to_write;
}

uint32_t ring_buffer_read(RingBuffer *rb, float *data, uint32_t count) {
    if (!rb || !data || count == 0) return 0;
    uint32_t w = __atomic_load_n(&rb->write_idx, __ATOMIC_ACQUIRE);
    uint32_t r = __atomic_load_n(&rb->read_idx, __ATOMIC_RELAXED);
    uint32_t avail = w - r;
    uint32_t to_read = count < avail ? count : avail;
    to_read &= ~1;
    if (to_read == 0) return 0;

    uint32_t r_idx = r & rb->mask;
    uint32_t first_chunk = rb->capacity - r_idx;
    if (to_read <= first_chunk) {
        memcpy(data, rb->buffer + r_idx, (size_t)to_read * sizeof(float));
    } else {
        memcpy(data, rb->buffer + r_idx, (size_t)first_chunk * sizeof(float));
        memcpy(data + first_chunk, rb->buffer, (size_t)(to_read - first_chunk) * sizeof(float));
    }

    __atomic_store_n(&rb->read_idx, r + to_read, __ATOMIC_RELEASE);
    return to_read;
}