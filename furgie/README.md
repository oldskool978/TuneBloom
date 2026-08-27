# Furgie V2: Flow-Matching Audio Super-Resolution Harness

[![SafeTensors](https://img.shields.io/badge/SafeTensors-Native%20FP32-blue.svg)](https://huggingface.co/OLDSKOOL978/universr-audio)
[![Sample Rate](https://img.shields.io/badge/Resolution-48.0%20kHz%20Master-green.svg)](https://github.com/oldskool978/Furgie)
[![Inference Engine](https://img.shields.io/badge/ODE%20Solver-Heun%202nd--Order%20(16%20Steps)-orange.svg)](https://github.com/oldskool978/Furgie)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

**Furgie V2** is a vocoder-free, filterless audio super-resolution and spectral reconstruction engine operating natively in the complex Short-Time Fourier Transform (STFT) domain. It reconstructs band-limited audio (8 kHz, 12 kHz, 16 kHz, 24 kHz) up to a full **48.0 kHz 32-bit Float PCM master** using Continuous Normalizing Flows (Flow Matching ODEs).

Passbands are preserved bit-for-bit in the complex domain without intermediate filtering or phase smearing, while missing harmonic overtones (up to 24.0 kHz) are synthesized along continuous Optimal Transport vector field trajectories.

---

## Core Technical Innovations

* **Complex STFT Flow Matching**: Operates directly on power-compressed complex spectrograms ($|X|^{0.2} e^{j\angle X}$), eliminating neural vocoder phase artifacts, pitch tracking errors, and transient dispersion.
* **Parseval-Compliant Latent Energy Calibration**: Resolves the 5th-power STFT expansion artifact by computing cross-band spectral energy ratios $\beta$ in linear power space ($p = 1/\alpha = 5.0$) before applying them in the latent domain ($\beta_{\text{latent}} = \beta_{\text{linear}}^{0.2}$).
* **Phase-Locked Global OLA Noise Prior**: Slices Gaussian noise priors from a single, time-contiguous prior field across overlap-add (OLA) streaming tiles, guaranteeing $100\%$ constructive phase interference in overlap cross-fades.
* **Bit-Exact Passband Splicing**: Original low-frequency complex bins ($0 - 12.0\text{ kHz}$) are joined with generated upper bands ($12.0 - 24.0\text{ kHz}$) via direct frequency concatenation ($b = 0\text{ bins}$), avoiding boundary attenuation and transient softening.
* **ITU-R BS.1770 True-Peak Lossless Gain Staging**: Integrated $4\times$ sinc-oversampled True-Peak metering and dynamic headroom scaling with optional strict ceiling limits.
* **Multi-Anchor Dynamic Conditioning**: Dynamic spectral partitioning across 8 kHz ($K_{\text{lr}}=80$), 12 kHz ($K_{\text{lr}}=128$), 16 kHz ($K_{\text{lr}}=170$), and 24 kHz ($K_{\text{lr}}=256$) anchors with zero fixed indexing.

---

## Optimal Production Architecture Baseline

Extensive empirical sweep benchmarking establishes the following convergent configuration:

| Stage | Parameter | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **Stage 1** | Target Delivery Mode | `48k` | 48.0 kHz Master Only (32-bit Float PCM) |
| **Stage 2** | Flow ODE Solver | `heun` | 2nd-Order Predictor-Corrector Trapezoidal Scheme |
| **Stage 2** | Integration Steps ($N$) | `16` | Empirical optimum; prevents unvoiced upper-band over-densification |
| **Stage 2** | Guidance Scale ($w$) | `0.00` | Single-pass conditional field; avoids distribution warping |
| **Stage 2** | Time Discretization | `uniform` | Linear velocity trajectory grid ($\gamma = 1.0$) |
| **Stage 2** | Cross-Band Gain Match | `True` | Linear-to-latent power-space spectral calibration |
| **Stage 2** | Crossover Blend Width | `0` bins | Bit-exact passband concatenation ($0 - 12.0\text{ kHz}$) |
| **Stage 2** | Conditioning Anchor | `24000` Hz | Harmonic Inpainting split: 12.0 kHz to 24.0 kHz |
| **Stage 3** | Headroom Strategy | `bypass` | Passband Bit-Exact Unity ($1.0\times$ linear scalar) |

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
Download and verify official SafeTensors weights from Hugging Face:
```bash
python scripts/hydrate_models.py --precision fp32
```

---

## Execution Modes

### Interactive Terminal Restoration Harness
Launch the terminal interface for interactive parameter mutation, file processing, and acoustic telemetry analysis:
```bash
python harness.py
```

```text
====================================================================================
      FURGIE V2 OPTIMAL TRANSPORT AUDIO SUPER-RESOLUTION HARNESS
====================================================================================
 --- [I/O & TARGET SAMPLING RESOLUTION] ---
 [1]  Input Audio Path:          workspace/input/track.wav
 [2]  Output WAV Destination:    workspace/output/master_Furgie_48k.wav
 [3]  Target Delivery Mode:      48.0 kHz Master Only
 --- [STAGE 1: ADVANCED ODE TRAJECTORY & PRECISION CONTROL] ---
 [4]  Flow ODE Solver:           HEUN (2nd-Order Predictor-Corrector)
 [5]  Trajectory Steps / CFG:    Steps: 16 | Guidance Scale w: 0.00
 [6]  Time-Grid Warping (gamma): UNIFORM (gamma=1.00)
 [7]  Deterministic Seed:        42
 --- [STAGE 2: MANIFOLD CROSSOVER NORMALIZATION] ---
 [8]  Cross-Band Gain Matching:  ENABLED
 [9]  One-Sided Crossover Blend: 0 Bins (Bit-Exact Concatenation)
 [10] Conditioning Anchor:       24 kHz Anchor (12.0 - 24.0 kHz Inpainting)
 --- [STAGE 3: ITU-R BS.1770 TRUE-PEAK LOSSLESS GAIN STAGING] ---
 [11] Headroom Strategy:         BYPASS (Passband Bit-Exact Unity 1.0x)
 --- [STAGE 4: COMPUTE HARDWARE] ---
 [12] Target Device:             CUDA
------------------------------------------------------------------------------------
 [L] Load Preset (JSON)   [S] Save Preset (JSON)
 [G] Generate Audio       [P] Permutation Benchmark Sweep    [Q] Quit
====================================================================================
```

### Non-Interactive Batch Execution
Execute deterministic single-pass command-line restorations:
```bash
python harness.py --batch --input "workspace/track.wav" --output "workspace/output/master_48k.wav" --solver heun --steps 16 --gain-match --blend-bins 0 --anchor 24000 --headroom-mode bypass
```

### Automated Scientific Benchmark Sweep
Run controlled permutation sweeps across solvers, schedulers, and blend modes:
```bash
python harness.py --sweep --input "workspace/track.wav"
```

### REST API Microservice (FastAPI / Uvicorn)
Start the high-throughput asynchronous REST microservice:
```bash
uvicorn api.app:app --host 0.0.0.0 --port 8000 --workers 1
```

#### Endpoints:
* `POST /v1/process/file`: Multipart binary audio upload with optional JSON inference config.
* `POST /v1/process/array`: Direct JSON float32 sample buffer array processing.
* `GET  /v1/models/status`: Telemetry on hardware acceleration and loaded neural graph state.

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
    solver="heun",
    ode_steps=16,
    guidance_scale=0.0,
    scheduler_type="uniform",
    time_warp_gamma=1.0,
    cross_band_gain_match=True,
    crossover_blend_bins=0,
    input_sr_anchor=24000,
    headroom_mode="bypass",
    target_rate="48k"
)

# Run super-resolution pass
telemetry = engine.synthesize_request(request)
print(f"Completed in {telemetry.generation_time_seconds}s (RTF: {telemetry.real_time_factor}x)")
print(f"True Peak: {telemetry.true_peak_dbtp:.2f} dBTP | Boundary Step: {telemetry.crossover_magnitude_step_db:.3f} dB")
```

---

## Telemetry & Quality Diagnostics

Every execution outputs an Acoustic Telemetry Report detailing dynamics, peak measurements, and spectral continuity:

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
Flow ODE Integrator:     HEUN (16 steps, CFG w=0.00)
Time-Grid Warping:       UNIFORM (gamma=1.00)
Spectral Normalization:  Gain Matching=ON | Blend Width=0 bins
Harmonic Splicing:       24 kHz Anchor (Neural Upper-Band: 12 - 24.0 kHz)
Target Delivery Mode:    48K
Headroom Strategy:       BYPASS
 --- [SPECTRAL INTEGRATION DIAGNOSTICS] ---
Crossover Step Disc.:     2.535 dB  (Ideal: < 3.0 dB)
Boundary Phase Curv.:     0.8094 rad (Ideal: < 1.0 rad)
Top-Octave Flatness SFM:  0.0730     (Natural Acoustic Decay: 0.05 - 0.40)
Spectral Tilt Slope:     -143.175 dB/oct
 --- [INPUT SOURCE DYNAMICS] ---
Input Sample Peak:        0.944061 (-0.50 dBFS)
Input True Peak (4x):     0.988553 (-0.10 dBTP)
 --- [PRIMARY RESTORATION DYNAMICS] ---
Signal Dynamics (Peak):   0.944061 (-0.50 dBFS)
True Peak (4x Sinc):      0.989211 (-0.09 dBTP)
Signal Dynamics (RMS):   -16.42 dBFS
Acoustic Crest Factor:    15.92 dB
Linear Gain Scalar:       1.000000 (0.00 dB)
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
├── furgie_core/                     # Computational graph & neural flow engine
│   ├── arch/                        # PyTorch model definitions & ODE solvers
│   │   ├── model.py
│   │   ├── solver.py
│   │   ├── spectral_ops.py
│   │   └── universr.py
│   ├── config/                      # Inference configuration profiles
│   │   └── inference/
│   │       └── Furgie_Convergent_48k.yaml
│   ├── dsp_cuda.py                  # Polyphase sinc True-Peak & OLA window generators
│   ├── engine.py                    # Core orchestration engine & diagnostics
│   ├── network_wrapper.py           # Phase-locked tiled streaming manager
│   └── schema.py                    # Dataclass schemas & preset serialization
├── scripts/                         # Weight hydration & verification scripts
│   ├── hydrate_models.py
│   └── hydrated_models_manifest.json
├── weights/                         # Local SafeTensors model cache
├── workspace/                       # Default staging workspace for I/O
├── harness.py                       # CLI & interactive super-resolution harness
├── requirements.txt                 # Production dependencies
└── README.md
```

---

## Citations

### UniverSR Architecture
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
