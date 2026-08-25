# Furgie V2: Flow-Matching Audio Super-Resolution Harness

[![SafeTensors](https://img.shields.io/badge/SafeTensors-Native%20FP32-blue.svg)](https://huggingface.co/OLDSKOOL978/universr-audio)
[![Sample Rate](https://img.shields.io/badge/Resolution-48.0%20kHz%20Master-green.svg)](https://github.com/oldskool978/Furgie)
[![Inference Engine](https://img.shields.io/badge/ODE%20Solver-Midpoint%20RK2%20(16%20Steps)-orange.svg)](https://github.com/oldskool978/Furgie)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

**Furgie V2** is a filterless, vocoder-free audio super-resolution and spectral restoration engine operating in the complex Short-Time Fourier Transform (STFT) domain. It extends band-limited audio (8 kHz, 12 kHz, 16 kHz, 24 kHz) up to a full **48.0 kHz 32-bit Float PCM master** using Continuous Normalizing Flows (Flow Matching ODEs).

Passbands are preserved bit-for-bit in the complex domain, while missing harmonic overtones (up to 24.0 kHz) are inpainted through deterministic 2nd-order Runge-Kutta numerical trajectories.

---

## Core Technical Innovations

* **Complex STFT Flow Matching**: Operates directly on power-compressed complex spectrograms ($|X|^{0.2} e^{j\angle X}$), bypassing neural vocoder artifacts, phase smearing, and transient degradation.
* **Bit-Exact Passband Splicing**: Original low-frequency complex bins ($0 - 12.0\text{ kHz}$) are joined with generated upper bands ($12.0 - 24.0\text{ kHz}$) via direct frequency concatenation, eliminating crossover phase distortion and comb filtering.
* **Partition of Unity Overlap-Add (OLA)**: Bounded-memory continuous streaming via squared-cosine transitions ($\sin^2\theta + \cos^2\theta = 1.0$) with exact linear accumulation normalization.
* **Native SafeTensors Integration**: Direct zero-overhead memory mapping with verified [SafeTensors weights on Hugging Face](https://huggingface.co/OLDSKOOL978/universr-audio), completely eliminating unsafe pickle deserialization.
* **ITU-R BS.1770 True-Peak Lossless Gain Staging**: Integrated $4\times$ sinc-oversampled True-Peak metering and dynamic headroom scaling with optional strict ceiling limits.
* **Dual Master Delivery**: Native support for independent $48.0\text{ kHz}$ and polyphase sinc-decimated $44.1\text{ kHz}$ master outputs.

---

## Optimal Architecture Baseline

Extensive empirical convergence profiling establishes the following canonical default configuration:

| Stage | Parameter | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **Stage 1** | Target Delivery Mode | `48k` | 48.0 kHz Master Only (32-bit Float PCM) |
| **Stage 2** | ODE Solver | `midpoint` | 2nd-Order Midpoint Runge-Kutta (RK2) |
| **Stage 2** | Integration Steps | `16` | Symplectic time steps ($O(\Delta t^2)$ convergence) |
| **Stage 2** | Guidance Scale ($w$) | `0.00` | Pure conditional trajectory (halves compute per step) |
| **Stage 2** | Conditioning Anchor | `24000` Hz | Harmonic Inpainting split: 12.0 kHz to 24.0 kHz |
| **Stage 3** | Headroom Mode | `bypass` | Passband Bit-Exact Unity ($1.0\times$ linear scalar) |

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/oldskool978/Furgie.git
cd Furgie
```

### 2. Environment Preparation

Python 3.10+ and a CUDA-capable GPU are recommended.

```bash
pip install -r requirements.txt
```

### 3. Hydrate SafeTensors Weights

Download and verify the official native SafeTensors weights from [Hugging Face](https://huggingface.co/OLDSKOOL978/universr-audio):

```bash
python scripts/hydrate_models.py
```

---

## Execution Modes

### Interactive Audio Restoration Harness

Launch the interactive terminal interface for parameter mutation, file processing, and acoustic telemetry analysis:

```bash
python harness.py
```

```text
====================================================================================
        FURGIE V2 OPTIMAL TRANSPORT AUDIO SUPER-RESOLUTION HARNESS
====================================================================================
 --- [I/O & TARGET SAMPLING RESOLUTION] ---
 [1]  Input Audio Path:          workspace/input_vocal.wav
 [2]  Output WAV Destination:    workspace/output/master_Furgie_48k.wav
 [3]  Target Delivery Mode:      48.0 kHz Master Only
 --- [STAGE 1: DETERMINISTIC CONTINUOUS FLOW ODE] ---
 [4]  Flow ODE Solver:           MIDPOINT (2nd-Order Midpoint RK2)
 [5]  Trajectory Steps / CFG:    Steps: 16 | Guidance Scale w: 0.00
 [6]  Conditioning Anchor:       24 kHz Anchor (Harmonic Inpainting: 12 - 24.0 kHz)
 --- [STAGE 2: ITU-R BS.1770 TRUE-PEAK LOSSLESS GAIN STAGING] ---
 [7]  Headroom Strategy:         BYPASS (Passband Bit-Exact Unity 1.0x)
 --- [STAGE 3: COMPUTE HARDWARE] ---
 [8]  Target Device:             CUDA
------------------------------------------------------------------------------------
 [L] Load Preset (JSON)   [S] Save Preset (JSON)
 [G] Generate Audio       [Q] Quit
====================================================================================
```

### Non-Interactive Batch Execution

Execute deterministic single-command super-resolution passes:

```bash
python harness.py --batch --input "workspace/track.wav" --output "workspace/output/master_48k.wav" --steps 16 --solver midpoint --cfg 0.0 --anchor 24000 --headroom-mode bypass
```

### REST API Service (FastAPI / Uvicorn)

Run the high-throughput asynchronous REST microservice:

```bash
uvicorn api.app:app --host 0.0.0.0 --port 8000 --workers 1
```

#### API Endpoints:
* `POST /v1/process/file`: Multipart binary WAV upload with JSON inference config.
* `POST /v1/process/array`: Direct JSON float32 sample buffer array processing.
* `GET  /v1/models/status`: Telemetry on hardware acceleration and loaded weights.

---

## Python API Integration

Embed Furgie directly into audio processing pipelines:

```python
import torch
from furgie_core.engine import FurgieEngine
from furgie_core.schema import FurgieRequest

# Initialize neural engine
engine = FurgieEngine(
    device="cuda" if torch.cuda.is_available() else "cpu",
    model_repo_id="OLDSKOOL978/universr-audio"
)

# Configure restoration request
request = FurgieRequest(
    input_path="workspace/input_audio.wav",
    output_path="workspace/output/restored_48k.wav",
    ode_steps=16,
    solver="midpoint",
    guidance_scale=0.0,
    input_sr_anchor=24000,
    headroom_mode="bypass",
    target_rate="48k"
)

# Run super-resolution pass
telemetry = engine.synthesize_request(request)

print(f"Generation Completed: {telemetry.duration_seconds}s in {telemetry.generation_time_seconds}s (RTF: {telemetry.real_time_factor}x)")
print(f"True Peak: {telemetry.true_peak_dbtp:.2f} dBTP | Crest Factor: {telemetry.crest_factor_db:.2f} dB")
```

---

## Telemetry & Quality Metrics

Every execution generates a comprehensive Acoustic Telemetry Report detailing dynamics, peak measurements, and latency metrics:

```text
====================================================================================
                        ACOUSTIC TELEMETRY REPORT
====================================================================================
Input Source File:       workspace/audio_source.wav
Master Destination:      workspace/output/master_Furgie_48k.wav
Sampling Resolution:     48000 Hz (32-bit Float PCM)
Audio Duration:          30.00s (1,440,000 samples)
Inference Latency:       1.42s (RTF: 0.047x)
Peak VRAM Footprint:     4.21 GB
Flow ODE Integrator:     MIDPOINT (16 steps, CFG w=0.00)
Harmonic Splicing:       24 kHz Anchor (Neural Upper-Band: 12 - 24.0 kHz)
Target Delivery Mode:    48K
Headroom Strategy:       BYPASS
 --- [INPUT SOURCE DYNAMICS] ---
Input Sample Peak:       0.944061 (-0.50 dBFS)
Input True Peak (4x):    0.988553 (-0.10 dBTP)
 --- [PRIMARY RESTORATION DYNAMICS] ---
Signal Dynamics (Peak):  0.944061 (-0.50 dBFS)
True Peak (4x Sinc):     0.989211 (-0.09 dBTP)
Signal Dynamics (RMS):   -16.42 dBFS
Acoustic Crest Factor:   15.92 dB
Linear Gain Scalar:      1.000000 (0.00 dB)
====================================================================================
```

---

## Repository Structure

```text
Furgie/
├── api/                             # FastAPI microservice endpoints & Pydantic schemas
│   ├── app.py
│   ├── endpoints.py
│   └── schemas.py
├── furgie_core/                     # Core computational & neural graph engine
│   ├── arch/                        # PyTorch model definitions & ODE solvers
│   │   ├── model.py
│   │   ├── solver.py
│   │   ├── spectral_ops.py
│   │   └── universr.py
│   ├── config/                      # Inference configuration profiles
│   │   └── inference/
│   │       └── Furgie_Convergent_48k.yaml
│   ├── dsp_cuda.py                  # CUDA/C++ accelerated DSP, OLA windows, True-Peak
│   ├── engine.py                    # Top-level Furgie orchestration engine
│   ├── network_wrapper.py           # Tiled inference and state manager
│   └── schema.py                    # Structured dataclasses and serialization
├── scripts/                         # Automation & model hydration scripts
│   ├── hydrate_models.py
│   └── hydrated_models_manifest.json
├── weights/                         # Local SafeTensors weight repository
├── workspace/                       # Default staging workspace for I/O
├── harness.py                       # Interactive & CLI super-resolution harness
├── requirements.txt                 # Production dependencies
└── README.md
```

---

## Citations

### Original UniverSR Architecture

```bibtex
@inproceedings{choi2026universr,
  title     = {{UniverSR}: Unified and Versatile Audio Super-Resolution via Vocoder-Free Flow Matching},
  author    = {Choi, Woongjib and Lee, Sangmin and Lim, Hyungseob and Kang, Hong-Goo},
  booktitle = {IEEE International Conference on Acoustics, Speech, and Signal Processing (ICASSP)},
  year      = {2026}
}
```

### Furgie SafeTensors & Super-Resolution Harness

```bibtex
@software{furgie2026,
  author    = {OLDSKOOL978},
  title     = {Furgie: Optimal Transport Flow-Matching Audio Super-Resolution Harness},
  url       = {https://github.com/oldskool978/Furgie},
  year      = {2026}
}
```
