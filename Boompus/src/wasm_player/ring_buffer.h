#ifndef RING_BUFFER_H
#define RING_BUFFER_H

#include <stdint.h>
#include <stddef.h>

typedef struct {
    void *raw_buffer;
    float *buffer;
    uint32_t capacity;
    uint32_t mask;
    uint32_t write_idx;
    uint32_t read_idx;
} RingBuffer;

RingBuffer *ring_buffer_create(uint32_t capacity);
void ring_buffer_destroy(RingBuffer *rb);
void ring_buffer_reset(RingBuffer *rb);
uint32_t ring_buffer_available_read(const RingBuffer *rb);
uint32_t ring_buffer_available_write(const RingBuffer *rb);
uint32_t ring_buffer_write(RingBuffer *rb, const float *data, uint32_t count);
uint32_t ring_buffer_read(RingBuffer *rb, float *data, uint32_t count);

#endif