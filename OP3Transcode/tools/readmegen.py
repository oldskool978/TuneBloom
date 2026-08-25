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
    content = f"""# TuneBloom OP3Transcode: Client-Side Opus to MP3 Transcoding Engine

OP3Transcode is the client-side conversion stage of the **TuneBloom** delivery pipeline. It ingests 48.0 kHz RFC 7845 Ogg Opus master bitstreams from **Boompus** and transcodes them into 48.0 kHz Variable Bitrate V0 (VBR V0) MP3 files using a bare WebAssembly SIMD128 runtime ({TICK}op3transcode.wasm{TICK}) and a standalone native C CLI ({TICK}tunebloom-transcode{TICK}).

## Pipeline Topography

{TICK3}text
[SICKOMODE CELT Psychoacoustic Limiter]
                │ (48.0 kHz 32-bit Float PCM Master: -0.3 dBTP Cap)
                ▼
[Boompus Native Mastering Engine]
                │ (48.0 kHz Fullband RFC 7845 Ogg Opus Bitstream)
                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        OP3Transcode Subsystem                          │
│                                                                        │
│ 1. Ogg Demuxer (RFC 3533)    : Extracts OpusHead & 312-sample pre-skip │
│ 2. SIMD128 Opus Decoder      : Decompresses to IEEE 754 Float32 PCM    │
│ 3. Boundary Aligner          : Trims encoder priming delay             │
│ 4. Quantum Ring Buffer       : Bridges 960 (Opus) -> 1152 (MP3) frames │
│ 5. LAME GPSYCHO V0 Engine    : M/S Joint Stereo, 48 kHz, Lowpass Off   │
│ 6. Xing VBR Header Rewriter  : In-place 100-pt seek TOC calculation    │
│ 7. ID3v2.4 Tag Builder       : Prepends UTF-8 syncsafe metadata        │
└────────────────────────────────────────────────────────────────────────┘
                │
                ▼
[Client-Side 48.0 kHz VBR V0 MP3 Download Blob]
{TICK3}

## Acoustic & Mathematical Invariants

* **Direct IEEE 754 Floating-Point Path**: Operates directly on decoded Float32 PCM ({TICK}lame_encode_buffer_interleaved_ieee_float{TICK}), bypassing intermediate 16-bit integer truncation or dither noise floors.
* **Dual Lookahead Synchronization**: Strips the 312-sample Opus encoder lookahead delay at stream initialization, while writing the 576-sample LAME MDCT filterbank delay into the Xing VBR header for gapless playback.
* **Preserved Nyquist Bandwidth**: Hardcodes 48.0 kHz input and output geometries while disabling LAME's lowpass filter ({TICK}lame_set_lowpassfreq(gfp, -1){TICK}) to preserve the 20.0 kHz audio bandwidth produced by Furgie V2 and SICKOMODE.
* **Zero-Allocation Circular Ring**: A static 11,520-sample circular queue reconciles the frame size disparity between Opus ($N=960$) and MPEG-1 Layer III ($N=1152$) without heap allocations during transcoding.

## Hermetic Build & Verification Sequence

Execute the complete toolchain hydration, compilation, and validation pipeline in sequence:

{TICK3}powershell
python .\\tools\\hydrate.py
python .\\tools\\sanitize_opus.py
python .\\tools\\sanitize_lame.py
python .\\tools\\build_native.py
python .\\tools\\build_wasi.py
python .\\tools\\forge_dag.py
python .\\tools\\sanitycheck.py
python .\\test\\test_harness.py
{TICK3}

## WebAudio / WASM Test Server

To test client-side transcoding in an isolated browser context with COOP/COEP headers enabled:

{TICK3}powershell
python .\\tools\\serve.py
{TICK3}

Launches a local HTTP server with {TICK}Cross-Origin-Opener-Policy: same-origin{TICK}, {TICK}Cross-Origin-Embedder-Policy: require-corp{TICK}, and WebAssembly MIME types at {TICK}http://localhost:8080/test/test_bench.html{TICK}.
"""
    ROOT_README_PATH.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"[+] Root README generated: {ROOT_README_PATH.relative_to(ROOT_DIR)}")

def generate_bin_readme() -> None:
    DIST_BIN_DIR.mkdir(parents=True, exist_ok=True)
    content = f"""# {TICK}tunebloom-transcode{TICK} Native CLI

**High-Performance Opus to VBR V0 MP3 Converter**

{TICK}tunebloom-transcode{TICK} is a standalone C executable that decompresses RFC 7845 Ogg Opus bitstreams and re-encodes them into 48.0 kHz VBR V0 MP3 bitstreams with Xing seek tables and ID3v2.4 tags.

## Syntax & Invocation

{TICK3}bash
tunebloom-transcode <input.opus> <output.mp3> [vbr_quality: 0-9]
{TICK3}

### Positional Arguments

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| {TICK}<input.opus>{TICK} | File Path | *Required* | Input RFC 7845 Ogg Opus bitstream (48.0 kHz, 1 or 2 channels). |
| {TICK}<output.mp3>{TICK} | File Path | *Required* | Destination path for the generated MP3 bitstream. |
| {TICK}[vbr_quality]{TICK} | Integer | {TICK}0{TICK} | Target VBR Quality ({TICK}0{TICK} = V0 Highest Quality, {TICK}9{TICK} = Lowest Quality). |

## Core Technical Operations

* **Ogg Demuxing**: Parses chained and multiplexed Ogg pages, extracting {TICK}OpusHead{TICK} metadata and individual audio frames.
* **Pre-Skip Handling**: Automatically extracts and discards the 312 lookahead samples specified in {TICK}OpusHead.pre_skip{TICK}.
* **Direct Float Ingestion**: Streams decoded 32-bit floats directly into LAME without integer conversions.
* **Xing VBR Header**: Rewrites Frame 0 post-encoding with the complete 100-point seek table, stream length, and LAME tag padding metadata.
* **ID3v2.4 Serialization**: Prepends standard UTF-8 ID3v2.4 metadata frames.
"""
    BIN_README_PATH.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"[+] Converter CLI README generated: {BIN_README_PATH.relative_to(ROOT_DIR)}")

def generate_wasm_readme() -> None:
    DIST_WASM_DIR.mkdir(parents=True, exist_ok=True)
    content = f"""# TuneBloom OP3Transcode WASM Engine ({TICK}op3transcode.wasm{TICK})

**WebAssembly C ABI & Web Worker Integration Specification**

This document specifies the Application Binary Interface (ABI), memory model, and Web Worker integration contract for {TICK}op3transcode.wasm{TICK}.

## 1. Module Specifications

* **Target Architecture**: {TICK}wasm32-wasip1{TICK} (Bare LLVM/Clang compilation without Emscripten runtime glue).
* **Instruction Extensions**: WASM SIMD128 ({TICK}-msimd128{TICK}), Bulk Memory Operations ({TICK}-mbulk-memory{TICK}).
* **Memory Allocation**: Initial 16 MB (256 pages), max 64 MB (1024 pages), 1 MB stack.
* **Footprint**: <85 KB gzipped wire payload.

## 2. Exported C ABI Functions

### Memory Management

{TICK3}c
void *wasm_malloc(uint32_t bytes);
void  wasm_free(void *ptr);
{TICK3}

* **{TICK}wasm_malloc{TICK}**: Allocates memory on the WASM linear heap. Returns a 32-bit pointer.
* **{TICK}wasm_free{TICK}**: Frees heap memory at {TICK}ptr{TICK}.

### Monolithic Transcode Primitive

{TICK3}c
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
{TICK3}

#### Parameters:
* {TICK}opus_bytes{TICK}: Pointer to the raw Ogg Opus byte array in WASM memory.
* {TICK}opus_len{TICK}: Byte size of the Ogg Opus container.
* {TICK}out_mp3_ptr{TICK}: Pointer to a {TICK}uint32_t{TICK} where the address of the generated MP3 buffer will be stored.
* {TICK}out_mp3_len{TICK}: Pointer to a {TICK}uint32_t{TICK} where the length of the MP3 buffer will be stored.
* {TICK}vbr_quality{TICK}: LAME VBR quality index ({TICK}0{TICK} for V0).
* {TICK}title{TICK}, {TICK}artist{TICK}, {TICK}album{TICK}, {TICK}genre{TICK}, {TICK}comment{TICK}: Null-terminated UTF-8 strings for ID3v2.4 tagging.

#### Returns:
* {TICK}0{TICK} on success; non-zero error code on failure.

### Streaming Lifecycle Primitives

{TICK3}c
uint32_t op3_stream_init(uint32_t sample_rate, uint32_t channels, int32_t vbr_quality);
int32_t  op3_stream_feed_packet(uint32_t handle, const uint8_t *pkt, uint32_t pkt_len, uint8_t *out_mp3, uint32_t max_out);
int32_t  op3_stream_flush(uint32_t handle, uint8_t *out_mp3, uint32_t max_out);
void     op3_stream_destroy(uint32_t handle);
{TICK3}

## 3. Web Worker Integration Pattern

{TICK3}javascript
const worker = new Worker("dist/wasm/op3transcode-worker.js");

// 1. Initialize WASM Runtime
const wasmBytes = await (await fetch("dist/wasm/op3transcode.wasm")).arrayBuffer();
worker.postMessage({{ type: "INIT", wasmBytes }});

// 2. Transcode Opus Buffer to MP3 Blob
worker.onmessage = (e) => {{
  const {{ type, mp3Bytes, elapsedMs }} = e.data;
  if (type === "TRANSCODE_COMPLETE") {{
    const blob = new Blob([mp3Bytes], {{ type: "audio/mpeg" }});
    const url = URL.createObjectURL(blob);
    // Trigger download or direct playback
  }}
}};

worker.postMessage({{
  type: "TRANSCODE",
  oggOpusBytes: cachedOpusUint8Array,
  metadata: {{
    title: "Master Track",
    artist: "TuneBloom",
    album: "Master Release"
  }},
  vbrQuality: 0
}}, [cachedOpusUint8Array.buffer]);
{TICK3}
"""
    WASM_README_PATH.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"[+] WASM Interface README generated: {WASM_README_PATH.relative_to(ROOT_DIR)}")

def main() -> None:
    print("[*] Generating OP3Transcode documentation suite...")
    generate_root_readme()
    generate_bin_readme()
    generate_wasm_readme()
    print("[+] All README files generated successfully.")

if __name__ == "__main__":
    main()