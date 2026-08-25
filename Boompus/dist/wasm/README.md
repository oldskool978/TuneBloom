# TuneBloom WebAssembly Opus Decoder (`tunebloom_decoder.wasm`)
**Upstream Integration Ruler & AudioWorklet Interface Specification**

This document specifies the Application Binary Interface (ABI), memory topography, and Web Audio API integration contracts for `tunebloom_decoder.wasm`.

---

## 1. WebAssembly Module Characteristics

* **Target Architecture**: `wasm32-wasip1` (Bare LLVM/Clang compilation without runtime glue)
* **Instruction Extensions**: WASM SIMD128 (`-msimd128`), Bulk Memory Operations (`-mbulk-memory`)
* **Memory Model**: 32-bit Linear Memory (`WebAssembly.Memory`), 16 MB initial allocation, 1 MB stack
* **Audio Geometry**: 48,000 Hz, 1 or 2 Channels (Stereo), 32-bit IEEE 754 Floating-Point PCM output
* **Payload Footprint**: <80 KB binary image

---

## 2. Exported C ABI Functions

### Memory Allocation Primitives

```c
void *wasm_malloc(uint32_t bytes);
void wasm_free(void *ptr);
```
* **`wasm_malloc`**: Allocates `bytes` in the WASM heap. Returns a 32-bit linear memory byte offset (pointer).
* **`wasm_free`**: Releases previously allocated heap memory at `ptr`.

### Decoder Lifecycle & Processing Primitives

```c
uint32_t tb_decoder_init(uint32_t sample_rate, uint32_t channels);
int32_t tb_decoder_decode(uint32_t handle, const uint8_t *in_ptr, uint32_t in_len, float *out_ptr, uint32_t max_samples);
void tb_decoder_destroy(uint32_t handle);
```

#### `tb_decoder_init`
* **Parameters**:
  * `sample_rate`: Sampling frequency in Hz (`48000`, `24000`, `16000`, `12000`, or `8000`). Must match stream parameters (`48000` recommended).
  * `channels`: Interleaved channel count (`1` for Mono, `2` for Stereo).
* **Returns**: Non-zero integer handle identifying the decoder context; returns `0` on allocation or parameter failure.

#### `tb_decoder_decode`
* **Parameters**:
  * `handle`: Pointer handle returned by `tb_decoder_init`.
  * `in_ptr`: Byte offset in WASM linear memory containing raw, demuxed Opus packet payload bytes.
  * `in_len`: Size of the raw Opus packet in bytes.
  * `out_ptr`: Byte offset in WASM linear memory targeting a destination float buffer (`Float32Array`).
  * `max_samples`: Maximum capacity per channel in the destination buffer (minimum `960` samples for 20ms frames at 48 kHz).
* **Returns**: The exact number of decoded samples per channel. Returns negative integers on bitstream corruption or decode errors.

#### `tb_decoder_destroy`
* **Parameters**:
  * `handle`: Pointer handle returned by `tb_decoder_init`. Deallocates internal Opus decoder structures and ring buffers.

---

## 3. Linear Memory Layout & Frame Sizing

For 48.0 kHz 2-channel streams operating with 20.0 ms frame boundaries:

| Entity | Sample Count | Format | Byte Sizing |
| :--- | :--- | :--- | :--- |
| **Opus Packet Ingest** | N/A | Raw Compressed Stream | 128 to 1,500 bytes (typical) |
| **Decoded PCM Frame** | 960 samples / ch | 32-bit Float Interleaved | 960 x 2 x 4 bytes = 7,680 bytes |
| **WASM Scratch Buffer** | 5,760 samples / ch | 32-bit Float Interleaved | 5,760 x 2 x 4 bytes = 46,080 bytes |

---

## 4. Upstream AudioWorklet Implementation

### AudioWorkletProcessor (`tunebloom-worklet.js`)

```javascript
class TuneBloomWorkletProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.wasmInstance = null;
    this.wasmMemory = null;
    this.decoderHandle = 0;
    this.inPtr = 0;
    this.outPtr = 0;
    this.maxFrameSamples = 960;
    this.channels = 2;

    this.port.onmessage = async (event) => {
      const { type, wasmBytes, packet } = event.data;
      if (type === "INIT") {
        await this.initWasm(wasmBytes);
      } else if (type === "PACKET" && this.decoderHandle) {
        this.processOpusPacket(packet);
      }
    };
  }

  async initWasm(wasmBytes) {
    const { instance } = await WebAssembly.instantiate(wasmBytes, {});
    this.wasmInstance = instance;
    this.wasmMemory = instance.exports.memory;

    this.decoderHandle = instance.exports.tb_decoder_init(48000, this.channels);
    this.inPtr = instance.exports.wasm_malloc(4096);
    this.outPtr = instance.exports.wasm_malloc(this.maxFrameSamples * this.channels * 4);
    this.pcmQueue = [];
    this.port.postMessage({ type: "READY" });
  }

  processOpusPacket(packetBytes) {
    const inBuffer = new Uint8Array(this.wasmMemory.buffer, this.inPtr, packetBytes.length);
    inBuffer.set(packetBytes);

    const decodedSamples = this.wasmInstance.exports.tb_decoder_decode(
      this.decoderHandle,
      this.inPtr,
      packetBytes.length,
      this.outPtr,
      this.maxFrameSamples
    );

    if (decodedSamples > 0) {
      const floatView = new Float32Array(
        this.wasmMemory.buffer,
        this.outPtr,
        decodedSamples * this.channels
      );
      const interleaved = new Float32Array(floatView);
      this.pcmQueue.push(interleaved);
    }
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const left = output[0];
    const right = output[1];
    const quantum = left.length;

    let written = 0;
    while (written < quantum && this.pcmQueue.length > 0) {
      const head = this.pcmQueue[0];
      const availableSamples = head.length / this.channels;
      const needed = quantum - written;
      const toTake = Math.min(availableSamples, needed);

      for (let i = 0; i < toTake; i++) {
        left[written + i] = head[i * 2];
        right[written + i] = head[i * 2 + 1];
      }

      written += toTake;
      if (toTake === availableSamples) {
        this.pcmQueue.shift();
      } else {
        this.pcmQueue[0] = head.subarray(toTake * this.channels);
      }
    }

    for (let i = written; i < quantum; i++) {
      left[i] = 0.0;
      right[i] = 0.0;
    }

    return true;
  }
}

registerProcessor("tunebloom-worklet-processor", TuneBloomWorkletProcessor);
```

---

## 5. Client-Side MP3 Conversion Hooks (LAME WASM Companion)

The decoded 32-bit Float PCM buffer generated by `tb_decoder_decode` uses standard IEEE 754 format:

```text
[Cached .opus stream] -> [tunebloom_decoder.wasm] -> [Float32Array PCM] -> [tunebloom_lame.wasm] -> [.mp3 Blob]
```

When connecting to the client-side MP3 conversion worker, pipe the `Float32Array` directly into `lame_encode_buffer_interleaved_ieee_float()` without intermediate bit-depth conversions.
