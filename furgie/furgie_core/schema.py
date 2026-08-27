import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional

SUPPORTED_SOLVERS = ["heun", "midpoint", "euler"]
SUPPORTED_TARGET_RATES = ["48k", "44.1k", "both"]
SUPPORTED_HEADROOM_MODES = ["bypass", "peak_resistant", "strict_ceiling"]


@dataclass
class FurgieRequest:
    input_path: Optional[str] = None
    output_path: str = "workspace/output/master_Furgie_48k.wav"
    input_sr_anchor: int = 24000
    target_sample_rate: int = 48000
    target_rate: str = "48k"
    headroom_mode: str = "bypass"
    target_peak_dbfs: float = 0.0
    ode_steps: int = 16
    solver: str = "heun"
    guidance_scale: float = 0.0
    device: str = "cuda"
    repo_id: str = "OLDSKOOL978/universr-audio"

    def save_preset(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(asdict(self), f, indent=2)

    @classmethod
    def load_preset(cls, path: Path) -> "FurgieRequest":
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls(**data)


@dataclass
class FurgieTelemetry:
    input_path: str
    output_path: str
    output_44k1_path: Optional[str]
    sample_rate: int
    duration_seconds: float
    total_samples: int
    generation_time_seconds: float
    real_time_factor: float
    peak_vram_gb: float
    solver_used: str
    ode_steps: int
    guidance_scale: float
    input_sr_anchor: int
    target_rate: str
    headroom_mode: str
    input_peak_linear: float
    input_peak_dbfs: float
    input_true_peak_linear: float
    input_true_peak_dbtp: float
    peak_linear: float
    peak_dbfs: float
    true_peak_linear: float
    true_peak_dbtp: float
    rms_dbfs: float
    crest_factor_db: float
    master_gain_scalar: float
    crossover_magnitude_step_db: float
    crossover_phase_delta_rad: float
    top_octave_sfm: float
    spectral_tilt_slope: float
    peak_linear_44k1: Optional[float] = None
    peak_dbfs_44k1: Optional[float] = None
    true_peak_linear_44k1: Optional[float] = None
    true_peak_dbtp_44k1: Optional[float] = None
    rms_dbfs_44k1: Optional[float] = None
    crest_factor_db_44k1: Optional[float] = None
    master_gain_scalar_44k1: Optional[float] = None