# TuneBloom OP3Transcode: Client-Side Opus to MP3 Transcoding Engine

OP3Transcode is the client-side conversion stage of the **TuneBloom** delivery pipeline. It ingests 48.0 kHz RFC 7845 Ogg Opus master bitstreams from **Boompus** and transcodes them into 48.0 kHz Variable Bitrate V0 (VBR V0) MP3 files using a bare WebAssembly SIMD128 runtime (`op3transcode.wasm`) and a standalone native C CLI (`tunebloom-transcode`).

## Pipeline Topography

```text
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
```

## Acoustic & Mathematical Invariants

* **Direct IEEE 754 Floating-Point Path**: Operates directly on decoded Float32 PCM (`lame_encode_buffer_interleaved_ieee_float`), bypassing intermediate 16-bit integer truncation or dither noise floors.
* **Dual Lookahead Synchronization**: Strips the 312-sample Opus encoder lookahead delay at stream initialization, while writing the 576-sample LAME MDCT filterbank delay into the Xing VBR header for gapless playback.
* **Preserved Nyquist Bandwidth**: Hardcodes 48.0 kHz input and output geometries while disabling LAME's lowpass filter (`lame_set_lowpassfreq(gfp, -1)`) to preserve the 20.0 kHz audio bandwidth produced by Furgie V2 and SICKOMODE.
* **Zero-Allocation Circular Ring**: A static 11,520-sample circular queue reconciles the frame size disparity between Opus ($N=960$) and MPEG-1 Layer III ($N=1152$) without heap allocations during transcoding.

## Hermetic Build & Verification Sequence

Execute the complete toolchain hydration, compilation, and validation pipeline in sequence:

```powershell
python .\tools\hydrate.py
python .\tools\sanitize_opus.py
python .\tools\sanitize_lame.py
python .\tools\build_native.py
python .\tools\build_wasi.py
python .\tools\forge_dag.py
python .\tools\sanitycheck.py
python .\test\test_harness.py
```

## WebAudio / WASM Test Server

To test client-side transcoding in an isolated browser context with COOP/COEP headers enabled:

```powershell
python .\tools\serve.py
```

Launches a local HTTP server with `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`, and WebAssembly MIME types at `http://localhost:8080/test/test_bench.html`.
