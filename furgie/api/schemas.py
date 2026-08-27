from typing import List, Optional, Union
from pydantic import BaseModel, Field
from furgie_core.schema import (
    SUPPORTED_SOLVERS,
    SUPPORTED_SCHEDULERS,
    SUPPORTED_TARGET_RATES,
    SUPPORTED_HEADROOM_MODES,
)


class FurgieInferenceConfig(BaseModel):
    ode_steps: int = Field(
        default=16,
        ge=1,
        description="2nd-Order Runge-Kutta / Heun ODE integration steps",
    )
    solver: str = Field(
        default="heun",
        description=f"Flow ODE solver trajectory: {SUPPORTED_SOLVERS}",
    )
    guidance_scale: float = Field(
        default=0.0,
        ge=0.0,
        description="Classifier-Free Guidance (CFG) scale",
    )
    scheduler_type: str = Field(
        default="uniform",
        description=f"Time-grid discretization scheduler: {SUPPORTED_SCHEDULERS}",
    )
    time_warp_gamma: float = Field(
        default=1.0,
        ge=0.1,
        description="Polynomial time-grid warping exponent",
    )
    seed: Optional[int] = Field(
        default=42,
        description="Deterministic Gaussian noise seed",
    )
    cross_band_gain_match: bool = Field(
        default=True,
        description="Linear power-space cross-band spectral energy normalization",
    )
    crossover_blend_bins: int = Field(
        default=0,
        ge=0,
        description="One-sided upper-band crossover blend width in bins",
    )
    input_sr_anchor: int = Field(
        default=24000,
        description="Conditioning anchor sample rate in Hz (8000, 12000, 16000, 24000)",
    )
    headroom_mode: str = Field(
        default="bypass",
        description=f"Lossless headroom scaling mode: {SUPPORTED_HEADROOM_MODES}",
    )
    target_peak_dbfs: float = Field(
        default=0.0,
        description="Target maximum True-Peak ceiling in dBTP",
    )
    target_rate: str = Field(
        default="48k",
        description=f"Target delivery master format: {SUPPORTED_TARGET_RATES}",
    )


class ArrayProcessRequest(BaseModel):
    audio: Union[List[List[float]], List[float]] = Field(
        ...,
        description="Raw float32 audio samples formatted as [Channels, Samples] or 1D [Samples]",
    )
    sample_rate: int = Field(
        default=32000,
        description="Input sampling rate in Hz",
    )
    config: Optional[FurgieInferenceConfig] = Field(
        default_factory=FurgieInferenceConfig,
        description="Inference solver parameters",
    )


class ArrayProcessResponse(BaseModel):
    audio: List[List[float]] = Field(
        ...,
        description="Synthesized float32 audio samples formatted as [Channels, Samples]",
    )
    sample_rate: int = Field(
        default=48000,
        description="Output sampling rate in Hz",
    )
    duration_sec: float
    peak_vram_gb: float
    peak_dbfs: float
    true_peak_dbtp: float
    master_gain_scalar: float
    crossover_magnitude_step_db: Optional[float] = None
    crossover_phase_delta_rad: Optional[float] = None
    top_octave_sfm: Optional[float] = None
    spectral_tilt_slope: Optional[float] = None


class StatusResponse(BaseModel):
    status: str
    cuda_available: bool
    device: str
    active_model: str