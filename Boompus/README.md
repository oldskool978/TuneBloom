# TuneBloom Boompus: Standalone Opus Engine & WebAssembly Runtime

Boompus is the final mastering and delivery subsystem of the **TuneBloom** audio pipeline. It ingests 48.0 kHz 32-bit Float PCM masters from **SICKOMODE** and encodes them into fullband, psychoacoustically optimized Opus bitstreams via a standalone native C executable (`tunebloom-opusenc`), while providing a sub-80 KB SIMD128 WebAssembly decoder (`tunebloom_decoder.wasm`) for zero-latency client-side streaming on the Web Audio `AudioWorklet` thread.

---

## Complete Pipeline Topography

```text
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
```

---

## Hermetic Build & Verification Sequence

Execute the complete toolchain hydration, compilation, and validation pipeline in sequence:

```powershell
python .\tools\hydrate.py
python .\tools\sanitize_opus.py
python .\tools\build_native.py
python .\tools\build_wasi.py
python .\tools\forge_dag.py
python .\tools\sanitycheck.py
python .\test\test_harness.py
```

---

## Local WebAudio Test Server

To test browser playback without CORS or SharedArrayBuffer cross-origin isolation blocks:

```powershell
python .\tools\serve.py
```

Launches a local HTTP server with `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`, and standard WebAssembly MIME types at `http://localhost:8080/test/test_bench.html`.
