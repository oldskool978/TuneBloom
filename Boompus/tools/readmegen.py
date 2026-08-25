from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
DIST_BIN_DIR = ROOT_DIR / "dist" / "bin"
DIST_WASM_DIR = ROOT_DIR / "dist" / "wasm"

ROOT_README_PATH = ROOT_DIR / "README.md"
BIN_README_PATH = DIST_BIN_DIR / "README.md"
WASM_README_PATH = DIST_WASM_DIR / "README.md"

TICK = chr(96)
TICK3 = chr(96) * 3


def generate_root_readme() -> None:
    content = f"""# TuneBloom Boompus: Standalone Opus Engine & WebAssembly Runtime

Boompus is the final mastering and delivery subsystem of the **TuneBloom** audio pipeline. It ingests 48.0 kHz 32-bit Float PCM masters from **SICKOMODE** and encodes them into fullband, psychoacoustically optimized Opus bitstreams via a standalone native C executable ({TICK}tunebloom-opusenc{TICK}), while providing a sub-80 KB SIMD128 WebAssembly decoder ({TICK}tunebloom_decoder.wasm{TICK}) for zero-latency client-side streaming on the Web Audio {TICK}AudioWorklet{TICK} thread.

---

## Complete Pipeline Topography

{TICK3}text
[MiniMax-Music3 Generative ODE]
              │ (32.0 kHz Audio Output)
              ▼
[Furgie V2 Complex STFT Flow Matching]
              │ (48.0 kHz 32-bit Float PCM Master)
              ▼
[SICKOMODE 21-Band CELT Psychoacoustic Limiter]
              │ (48.0 kHz True-Peak Compliant Float PCM: -0.3 dBTP Cap)
              ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Boompus Standalone Subsystem                                              │
├─────────────────────────────────────┬─────────────────────────────────────┤
│ dist/bin/tunebloom-opusenc          │ dist/wasm/tunebloom_decoder.wasm    │
│  • Complexity 10 (Fullband 20 kHz)  │  • wasm32-wasip1 Bare Output (<80KB)│
│  • Constrained VBR (160 - 320 kbps) │  • Hardware SIMD128 Vectorization   │
│  • Direct IEEE 754 Float Ingestion  │  • Lock-Free SPSC Worklet Ring Buffer│
└─────────────────────────────────────┴─────────────────────────────────────┘
{TICK3}

---

## Hermetic Build & Verification Sequence

Execute the complete toolchain hydration, compilation, and validation pipeline in sequence:

{TICK3}powershell
python .\\tools\\hydrate.py
python .\\tools\\sanitize_opus.py
python .\\tools\\build_native.py
python .\\tools\\build_wasi.py
python .\\tools\\forge_dag.py
python .\\tools\\sanitycheck.py
python .\\test\\test_harness.py
{TICK3}

---

## Local WebAudio Test Server

To test browser playback without CORS or SharedArrayBuffer cross-origin isolation blocks:

{TICK3}powershell
python .\\tools\\serve.py
{TICK3}

Launches a local HTTP server with {TICK}Cross-Origin-Opener-Policy: same-origin{TICK}, {TICK}Cross-Origin-Embedder-Policy: require-corp{TICK}, and standard WebAssembly MIME types at {TICK}http://localhost:8080/test/test_bench.html{TICK}.
"""
    ROOT_README_PATH.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"[+] Root README generated: {ROOT_README_PATH.relative_to(ROOT_DIR)}")


def generate_bin_readme() -> None:
    DIST_BIN_DIR.mkdir(parents=True, exist_ok=True)
    content = f"""# {TICK}tunebloom-opusenc{TICK} Native Mastering CLI
**High-Fidelity IEEE 754 32-Bit Float Opus Converter**

{TICK}tunebloom-opusenc{TICK} is a high-performance, standalone C executable designed to encode master audio into production-grade Opus streams encapsulated within RFC 7845 compliant Ogg bitstreams.

---

## Syntax & Command-Line Invocation

{TICK3}bash
tunebloom-opusenc <input.wav> <output.opus> [bitrate_kbps] [--cvbr|--vbr|--cbr]
{TICK3}

### Positional Arguments & Options

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| {TICK}<input.wav>{TICK} | File Path | *Required* | 48.0 kHz 32-bit Float PCM RIFF WAV file (SICKOMODE / Furgie master output). |
| {TICK}<output.opus>{TICK} | File Path | *Required* | Destination path for the generated Ogg Opus bitstream. |
| {TICK}[bitrate_kbps]{TICK} | Integer | {TICK}192{TICK} | Target bitrate in kilobits per second (Valid range: {TICK}32{TICK} to {TICK}512{TICK} kbps). |
| {TICK}--cvbr{TICK} | Flag | **Default** | **Constrained Variable Bitrate**: Enforces bounded bit allocation for streaming delivery. |
| {TICK}--vbr{TICK} | Flag | Optional | **Unconstrained Variable Bitrate**: Maximizes fidelity during complex transient passages. |
| {TICK}--cbr{TICK} | Flag | Optional | **Constant Bitrate**: Hard-locks bit output per frame for rigid transport links. |

---

## Acoustic & Algorithmic Parameters

* **Float-Direct Processing**: Uses {TICK}opus_encode_float(){TICK} directly on 32-bit floating-point samples to prevent integer quantization errors or clipping.
* **Algorithmic Complexity**: Hardcoded to {TICK}10{TICK} (maximum psychoacoustic lookahead and dynamic bit allocation).
* **Audio Bandwidth**: {TICK}OPUS_BANDWIDTH_FULLBAND{TICK} (hard 20.0 kHz audio cutoff, covering all 21 CELT subbands).
* **Frame Duration**: 20.0 ms (960 samples @ 48 kHz), aligning with the CELT transient synthesis geometry.
* **Lookahead Accounting**: Queries the encoder lookahead pre-skip directly and embeds it into the {TICK}OpusHead{TICK} packet header.

---

## Example Invocations

{TICK3}powershell
# Web Delivery Master (160 kbps CVBR)
.\\tunebloom-opusenc.exe master_48k.wav web_release.opus 160 --cvbr

# Reference Studio Master (256 kbps Unconstrained VBR)
.\\tunebloom-opusenc.exe master_48k.wav reference_master.opus 256 --vbr

# Archival Quality Master (320 kbps CVBR)
.\\tunebloom-opusenc.exe master_48k.wav archive_320k.opus 320 --cvbr
{TICK3}
"""
    BIN_README_PATH.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"[+] Converter CLI README generated: {BIN_README_PATH.relative_to(ROOT_DIR)}")


def generate_wasm_readme() -> None:
    DIST_WASM_DIR.mkdir(parents=True, exist_ok=True)
    content = f"""# TuneBloom WebAssembly Opus Decoder ({TICK}tunebloom_decoder.wasm{TICK})
**Upstream Integration Ruler & AudioWorklet Interface Specification**

This document specifies the Application Binary Interface (ABI), memory topography, and Web Audio API integration contracts for {TICK}tunebloom_decoder.wasm{TICK}.

---

## 1. WebAssembly Module Characteristics

* **Target Architecture**: {TICK}wasm32-wasip1{TICK} (Bare LLVM/Clang compilation without runtime glue)
* **Instruction Extensions**: WASM SIMD128 ({TICK}-msimd128{TICK}), Bulk Memory Operations ({TICK}-mbulk-memory{TICK})
* **Memory Model**: 32-bit Linear Memory ({TICK}WebAssembly.Memory{TICK}), 16 MB initial allocation, 1 MB stack
* **Audio Geometry**: 48,000 Hz, 1 or 2 Channels (Stereo), 32-bit IEEE 754 Floating-Point PCM output
* **Payload Footprint**: <80 KB binary image

---

## 2. Exported C ABI Functions

### Memory Allocation Primitives

{TICK3}c
void *wasm_malloc(uint32_t bytes);
void wasm_free(void *ptr);
{TICK3}
* **{TICK}wasm_malloc{TICK}**: Allocates {TICK}bytes{TICK} in the WASM heap. Returns a 32-bit linear memory byte offset (pointer).
* **{TICK}wasm_free{TICK}**: Releases previously allocated heap memory at {TICK}ptr{TICK}.

### Decoder Lifecycle & Processing Primitives

{TICK3}c
uint32_t tb_decoder_init(uint32_t sample_rate, uint32_t channels);
int32_t tb_decoder_decode(uint32_t handle, const uint8_t *in_ptr, uint32_t in_len, float *out_ptr, uint32_t max_samples);
void tb_decoder_destroy(uint32_t handle);
{TICK3}

#### {TICK}tb_decoder_init{TICK}
* **Parameters**:
  * {TICK}sample_rate{TICK}: Sampling frequency in Hz ({TICK}48000{TICK}, {TICK}24000{TICK}, {TICK}16000{TICK}, {TICK}12000{TICK}, or {TICK}8000{TICK}). Must match stream parameters ({TICK}48000{TICK} recommended).
  * {TICK}channels{TICK}: Interleaved channel count ({TICK}1{TICK} for Mono, {TICK}2{TICK} for Stereo).
* **Returns**: Non-zero integer handle identifying the decoder context; returns {TICK}0{TICK} on allocation or parameter failure.

#### {TICK}tb_decoder_decode{TICK}
* **Parameters**:
  * {TICK}handle{TICK}: Pointer handle returned by {TICK}tb_decoder_init{TICK}.
  * {TICK}in_ptr{TICK}: Byte offset in WASM linear memory containing raw, demuxed Opus packet payload bytes.
  * {TICK}in_len{TICK}: Size of the raw Opus packet in bytes.
  * {TICK}out_ptr{TICK}: Byte offset in WASM linear memory targeting a destination float buffer ({TICK}Float32Array{TICK}).
  * {TICK}max_samples{TICK}: Maximum capacity per channel in the destination buffer (minimum {TICK}960{TICK} samples for 20ms frames at 48 kHz).
* **Returns**: The exact number of decoded samples per channel. Returns negative integers on bitstream corruption or decode errors.

#### {TICK}tb_decoder_destroy{TICK}
* **Parameters**:
  * {TICK}handle{TICK}: Pointer handle returned by {TICK}tb_decoder_init{TICK}. Deallocates internal Opus decoder structures and ring buffers.

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

### AudioWorkletProcessor ({TICK}tunebloom-worklet.js{TICK})

{TICK3}javascript
class TuneBloomWorkletProcessor extends AudioWorkletProcessor {{
  constructor(options) {{
    super();
    this.wasmInstance = null;
    this.wasmMemory = null;
    this.decoderHandle = 0;
    this.inPtr = 0;
    this.outPtr = 0;
    this.maxFrameSamples = 960;
    this.channels = 2;

    this.port.onmessage = async (event) => {{
      const {{ type, wasmBytes, packet }} = event.data;
      if (type === "INIT") {{
        await this.initWasm(wasmBytes);
      }} else if (type === "PACKET" && this.decoderHandle) {{
        this.processOpusPacket(packet);
      }}
    }};
  }}

  async initWasm(wasmBytes) {{
    const {{ instance }} = await WebAssembly.instantiate(wasmBytes, {{}});
    this.wasmInstance = instance;
    this.wasmMemory = instance.exports.memory;

    this.decoderHandle = instance.exports.tb_decoder_init(48000, this.channels);
    this.inPtr = instance.exports.wasm_malloc(4096);
    this.outPtr = instance.exports.wasm_malloc(this.maxFrameSamples * this.channels * 4);
    this.pcmQueue = [];
    this.port.postMessage({{ type: "READY" }});
  }}

  processOpusPacket(packetBytes) {{
    const inBuffer = new Uint8Array(this.wasmMemory.buffer, this.inPtr, packetBytes.length);
    inBuffer.set(packetBytes);

    const decodedSamples = this.wasmInstance.exports.tb_decoder_decode(
      this.decoderHandle,
      this.inPtr,
      packetBytes.length,
      this.outPtr,
      this.maxFrameSamples
    );

    if (decodedSamples > 0) {{
      const floatView = new Float32Array(
        this.wasmMemory.buffer,
        this.outPtr,
        decodedSamples * this.channels
      );
      const interleaved = new Float32Array(floatView);
      this.pcmQueue.push(interleaved);
    }}
  }}

  process(inputs, outputs, parameters) {{
    const output = outputs[0];
    const left = output[0];
    const right = output[1];
    const quantum = left.length;

    let written = 0;
    while (written < quantum && this.pcmQueue.length > 0) {{
      const head = this.pcmQueue[0];
      const availableSamples = head.length / this.channels;
      const needed = quantum - written;
      const toTake = Math.min(availableSamples, needed);

      for (let i = 0; i < toTake; i++) {{
        left[written + i] = head[i * 2];
        right[written + i] = head[i * 2 + 1];
      }}

      written += toTake;
      if (toTake === availableSamples) {{
        this.pcmQueue.shift();
      }} else {{
        this.pcmQueue[0] = head.subarray(toTake * this.channels);
      }}
    }}

    for (let i = written; i < quantum; i++) {{
      left[i] = 0.0;
      right[i] = 0.0;
    }}

    return true;
  }}
}}

registerProcessor("tunebloom-worklet-processor", TuneBloomWorkletProcessor);
{TICK3}

---

## 5. Client-Side MP3 Conversion Hooks (LAME WASM Companion)

The decoded 32-bit Float PCM buffer generated by {TICK}tb_decoder_decode{TICK} uses standard IEEE 754 format:

{TICK3}text
[Cached .opus stream] -> [tunebloom_decoder.wasm] -> [Float32Array PCM] -> [tunebloom_lame.wasm] -> [.mp3 Blob]
{TICK3}

When connecting to the client-side MP3 conversion worker, pipe the {TICK}Float32Array{TICK} directly into {TICK}lame_encode_buffer_interleaved_ieee_float(){TICK} without intermediate bit-depth conversions.
"""
    WASM_README_PATH.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"[+] WASM Interface README generated: {WASM_README_PATH.relative_to(ROOT_DIR)}")


def main() -> None:
    print("[*] Generating comprehensive TuneBloom Boompus documentation suite...")
    generate_root_readme()
    generate_bin_readme()
    generate_wasm_readme()
    print("[+] All README files forged successfully.")


if __name__ == "__main__":
    main()