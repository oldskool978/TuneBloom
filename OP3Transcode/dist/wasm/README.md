# TuneBloom OP3Transcode WASM Engine (`op3transcode.wasm`)

**WebAssembly C ABI & Web Worker Integration Specification**

This document specifies the Application Binary Interface (ABI), memory model, and Web Worker integration contract for `op3transcode.wasm`.

## 1. Module Specifications

* **Target Architecture**: `wasm32-wasip1` (Bare LLVM/Clang compilation without Emscripten runtime glue).
* **Instruction Extensions**: WASM SIMD128 (`-msimd128`), Bulk Memory Operations (`-mbulk-memory`).
* **Memory Allocation**: Initial 16 MB (256 pages), max 64 MB (1024 pages), 1 MB stack.
* **Footprint**: <85 KB gzipped wire payload.

## 2. Exported C ABI Functions

### Memory Management

```c
void *wasm_malloc(uint32_t bytes);
void  wasm_free(void *ptr);
```

* **`wasm_malloc`**: Allocates memory on the WASM linear heap. Returns a 32-bit pointer.
* **`wasm_free`**: Frees heap memory at `ptr`.

### Monolithic Transcode Primitive

```c
int32_t op3_transcode_monolithic(
    const uint8_t *opus_bytes,
    uint32_t       opus_len,
    uint8_t      **out_mp3_ptr,
    uint32_t      *out_mp3_len,
    int32_t        vbr_quality,
    const char    *title,
    const char    *artist,
    const char    *album,
    const char    *genre,
    const char    *comment
);
```

#### Parameters:
* `opus_bytes`: Pointer to the raw Ogg Opus byte array in WASM memory.
* `opus_len`: Byte size of the Ogg Opus container.
* `out_mp3_ptr`: Pointer to a `uint32_t` where the address of the generated MP3 buffer will be stored.
* `out_mp3_len`: Pointer to a `uint32_t` where the length of the MP3 buffer will be stored.
* `vbr_quality`: LAME VBR quality index (`0` for V0).
* `title`, `artist`, `album`, `genre`, `comment`: Null-terminated UTF-8 strings for ID3v2.4 tagging.

#### Returns:
* `0` on success; non-zero error code on failure.

### Streaming Lifecycle Primitives

```c
uint32_t op3_stream_init(uint32_t sample_rate, uint32_t channels, int32_t vbr_quality);
int32_t  op3_stream_feed_packet(uint32_t handle, const uint8_t *pkt, uint32_t pkt_len, uint8_t *out_mp3, uint32_t max_out);
int32_t  op3_stream_flush(uint32_t handle, uint8_t *out_mp3, uint32_t max_out);
void     op3_stream_destroy(uint32_t handle);
```

## 3. Web Worker Integration Pattern

```javascript
const worker = new Worker("dist/wasm/op3transcode-worker.js");

// 1. Initialize WASM Runtime
const wasmBytes = await (await fetch("dist/wasm/op3transcode.wasm")).arrayBuffer();
worker.postMessage({ type: "INIT", wasmBytes });

// 2. Transcode Opus Buffer to MP3 Blob
worker.onmessage = (e) => {
  const { type, mp3Bytes, elapsedMs } = e.data;
  if (type === "TRANSCODE_COMPLETE") {
    const blob = new Blob([mp3Bytes], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    // Trigger download or direct playback
  }
};

worker.postMessage({
  type: "TRANSCODE",
  oggOpusBytes: cachedOpusUint8Array,
  metadata: {
    title: "Master Track",
    artist: "TuneBloom",
    album: "Master Release"
  },
  vbrQuality: 0
}, [cachedOpusUint8Array.buffer]);
```
