from typing import List, Optional, Union
from pydantic import BaseModel, Field
from furgie_core.schema import SUPPORTED_SOLVERS, SUPPORTED_TARGET_RATES, SUPPORTED_HEADROOM_MODES


class FurgieInferenceConfig(BaseModel):
    ode_steps: int = Field(
        default=16,
        description="2nd-Order Midpoint ODE integration steps",
    )
    solver: str = Field(
        default="midpoint",
        description="ODE solver trajectory ('midpoint' or 'euler')",
    )
    guidance_scale: float = Field(
        default=0.0,
        description="Classifier-Free Guidance (CFG) scale",
    )
    input_sr_anchor: int = Field(
        default=24000,
        description="Conditioning anchor sample rate in Hz (8000, 12000, 16000, 24000)",
    )
    headroom_mode: str = Field(
        default="bypass",
        description="Lossless headroom scaling mode ('bypass', 'peak_resistant', or 'strict_ceiling')",
    )
    target_peak_dbfs: float = Field(
        default=0.0,
        description="Target maximum True-Peak ceiling in dBTP (0.0 dBTP is Full Scale Zero)",
    )
    target_rate: str = Field(
        default="48k",
        description="Target delivery master format ('48k', '44.1k', or 'both')",
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
        description="Output sampling rate",
    )
    duration_sec: float
    peak_vram_gb: float
    peak_dbfs: float
    true_peak_dbtp: float
    master_gain_scalar: float


class StatusResponse(BaseModel):
    status: str
    cuda_available: bool
    device: str
    active_model: str