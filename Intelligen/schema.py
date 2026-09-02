from __future__ import annotations

import re
import json
from pathlib import Path
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, field_validator
from pipeline.prompt_compiler import clean_caption, normalize_lyrics

SUPPORTED_SCHEDULERS = ["heun", "euler", "native"]
SUPPORTED_NOISE_TOPOLOGIES = ["blue_noise", "gaussian"]


class GenerationRequest(BaseModel):
    genre: str = Field(default="", max_length=60)
    subgenre: str = Field(default="", max_length=60)
    bpm: int = Field(default=0, ge=0, le=300)
    key: str = Field(default="", max_length=30)
    mood: str = Field(default="", max_length=200)
    vocals: str = Field(default="", max_length=300)
    arrangement: str = Field(default="", max_length=300)
    lyrics: str = Field(default="", max_length=4000)
    raw_prompt: Optional[str] = Field(default=None, max_length=5000)
    prompt: Optional[str] = Field(default=None, max_length=5000)

    temperature: Optional[float] = Field(default=0.9100, ge=0.0001, le=3.0)
    top_p: Optional[float] = Field(default=0.9600, ge=0.0001, le=1.0)
    top_k: Optional[int] = Field(default=44, ge=1, le=500)
    top_k_layers: List[int] = Field(
        default_factory=lambda: [44, 44, 44, 44, 44, 44, 44, 44]
    )
    ar_guidance_scale: Optional[float] = Field(default=1.5200, ge=0.0, le=10.0)

    scheduler_type: str = Field(default="heun")
    num_inference_steps: Optional[int] = Field(default=42, ge=1, le=200)
    guidance_scale: Optional[float] = Field(default=1.7800, ge=0.0, le=20.0)
    noise_topology: str = Field(default="blue_noise")
    blue_noise_alpha: float = Field(default=0.7500, ge=0.0, le=2.0)
    enable_pm_diffusion: bool = Field(default=True)
    pm_iterations: int = Field(default=5, ge=1, le=30)
    pm_conductance: float = Field(default=0.1500, ge=0.0001, le=5.0)
    pm_lambda: float = Field(default=0.2000, ge=0.0001, le=0.25)

    audio_duration: float = Field(default=300.0, ge=1.0, le=600.0)
    seed: Optional[int] = Field(default=None, ge=0)
    output_path: str = Field(default="output.wav")
    device: str = Field(default="cuda")
    apply_declick: bool = Field(default=True)
    cpu_offload: bool = Field(default=False)
    repo_id: Optional[str] = Field(default=None)
    blocks: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

    @field_validator("bpm", mode="before")
    @classmethod
    def coerce_bpm(cls, v: Any) -> int:
        if v is None or (isinstance(v, str) and not v.strip()):
            return 0
        try:
            val = int(v)
            return max(0, min(300, val))
        except (ValueError, TypeError):
            return 0

    @field_validator("seed", mode="before")
    @classmethod
    def coerce_seed(cls, v: Any) -> Optional[int]:
        if v is None or (isinstance(v, str) and not v.strip()):
            return None
        try:
            return int(v)
        except (ValueError, TypeError):
            return None

    @field_validator(
        "temperature",
        "top_p",
        "ar_guidance_scale",
        "guidance_scale",
        "blue_noise_alpha",
        "pm_conductance",
        "pm_lambda",
        "audio_duration",
        mode="before",
    )
    @classmethod
    def coerce_floats(cls, v: Any) -> Any:
        if v is None or (isinstance(v, str) and not v.strip()):
            return None
        try:
            return float(v)
        except (ValueError, TypeError):
            return v

    @field_validator("top_k_layers", mode="before")
    @classmethod
    def coerce_top_k_layers(cls, v: Any) -> List[int]:
        if v is None:
            return [44] * 8
        if isinstance(v, str):
            parts = [p.strip() for p in v.split(",") if p.strip()]
            try:
                parsed = [max(1, min(500, int(p))) for p in parts]
                if len(parsed) == 8:
                    return parsed
                elif len(parsed) == 1:
                    return parsed * 8
            except (ValueError, TypeError):
                pass
            return [44] * 8
        if isinstance(v, (int, float)):
            k_val = max(1, min(500, int(v)))
            return [k_val] * 8
        if isinstance(v, (list, tuple)):
            if len(v) == 8:
                try:
                    return [max(1, min(500, int(x))) for x in v]
                except (ValueError, TypeError):
                    return [44] * 8
            elif len(v) == 1:
                try:
                    k_val = max(1, min(500, int(v[0])))
                    return [k_val] * 8
                except (ValueError, TypeError):
                    return [44] * 8
        return [44] * 8

    def set_macro_k(self, fundamental: int, acoustic: int, fine: int) -> None:
        f_val = max(1, min(500, int(fundamental)))
        a_val = max(1, min(500, int(acoustic)))
        fn_val = max(1, min(500, int(fine)))
        self.top_k_layers = [f_val, a_val, a_val, a_val, fn_val, fn_val, fn_val, fn_val]

    def set_layer_k(self, layer_idx: int, k_val: int) -> None:
        if not (0 <= layer_idx <= 7):
            raise IndexError("Layer index must be within [0, 7]")
        self.top_k_layers[layer_idx] = max(1, min(500, int(k_val)))

    def resolve_top_k_layers(self) -> List[int]:
        if len(self.top_k_layers) == 8:
            return [int(k) for k in self.top_k_layers]
        fallback_k = int(self.top_k) if self.top_k is not None else 44
        return [fallback_k] * 8

    def compile_prompt(self) -> str:
        candidate_prompt = self.prompt or self.raw_prompt
        if candidate_prompt and candidate_prompt.strip():
            return clean_caption(candidate_prompt.strip())

        key_clean = self.key.strip() if self.key else ""
        attr_parts = []
        if self.bpm and self.bpm > 0:
            attr_parts.append(f"bpm is {self.bpm}")
        if key_clean:
            key_match = re.match(r"^([A-G][b#]?)\s*(major|minor|m)?", key_clean, re.IGNORECASE)
            if key_match:
                key_root = key_match.group(1).upper()
                if len(key_root) > 1 and key_root[1] == "B":
                    key_root = key_root[0] + "b"
                mode_token = (key_match.group(2) or "").lower()
                scale_mode = "major" if mode_token == "major" else "minor"
                attr_parts.append(f"key is {key_root}, and scale is {scale_mode}")
            else:
                attr_parts.append(f"key is {key_clean}")

        genre_desc = " / ".join(filter(None, [self.genre.strip(), self.subgenre.strip()]))
        if genre_desc:
            attr_parts.append(genre_desc)

        segments = []
        if attr_parts:
            segments.append(f"Basic Attributes: {'. '.join(attr_parts)}.")
        if self.mood and self.mood.strip():
            m = self.mood.strip()
            segments.append(f"Mood: {m if m.endswith('.') else m + '.'}")
        if self.vocals and self.vocals.strip():
            v = self.vocals.strip()
            segments.append(f"Vocals: {v if v.endswith('.') else v + '.'}")
        if self.arrangement and self.arrangement.strip():
            a = self.arrangement.strip()
            segments.append(f"Arrangement: {a if a.endswith('.') else a + '.'}")

        compiled = " ".join(segments).strip()
        return clean_caption(compiled) if compiled else "Instrumental Music"

    def sanitize_lyrics(self) -> str:
        if self.blocks and len(self.blocks) > 0:
            compiled_blocks = []
            for b in self.blocks:
                if not isinstance(b, dict):
                    continue
                lbl = b.get("label") or b.get("type") or "verse"
                txt = (b.get("text") or "").strip()
                compiled_blocks.append(f"[{lbl.strip()}]\n{txt}" if txt else f"[{lbl.strip()}]")
            return normalize_lyrics("\n\n".join(compiled_blocks))
        if self.lyrics and self.lyrics.strip():
            return normalize_lyrics(self.lyrics)
        return ""

    def validate(self) -> None:
        if self.audio_duration <= 0.0 or self.audio_duration > 600.0:
            raise ValueError(f"Duration {self.audio_duration}s out of bounds (0.0 < t <= 600.0s).")
        if self.bpm is not None and self.bpm != 0 and (self.bpm < 30 or self.bpm > 300):
            raise ValueError(f"BPM {self.bpm} out of practical range (30-300 or 0 for unmetered).")
        if self.scheduler_type not in SUPPORTED_SCHEDULERS:
            raise ValueError(f"Scheduler '{self.scheduler_type}' invalid. Must be one of: {SUPPORTED_SCHEDULERS}")
        if self.num_inference_steps is not None and (self.num_inference_steps < 1 or self.num_inference_steps > 200):
            raise ValueError(f"Inference steps {self.num_inference_steps} out of bounds (1-200).")
        if self.guidance_scale is not None and (self.guidance_scale < 0.0 or self.guidance_scale > 20.0):
            raise ValueError(f"DiT Guidance scale {self.guidance_scale} out of bounds (0.0-20.0).")
        if self.ar_guidance_scale is not None and (self.ar_guidance_scale < 0.0 or self.ar_guidance_scale > 10.0):
            raise ValueError(f"AR Guidance scale {self.ar_guidance_scale} out of bounds (0.0-10.0).")
        if self.temperature is not None and (self.temperature <= 0.0 or self.temperature > 3.0):
            raise ValueError(f"Temperature {self.temperature} out of bounds (0.0 < T <= 3.0).")
        if self.top_p is not None and (self.top_p <= 0.0 or self.top_p > 1.0):
            raise ValueError(f"Top-P {self.top_p} out of bounds (0.0 < p <= 1.0).")
        if self.top_k is not None and (self.top_k < 1 or self.top_k > 500):
            raise ValueError(f"Top-K {self.top_k} out of bounds (1-500).")
        if self.noise_topology not in SUPPORTED_NOISE_TOPOLOGIES:
            raise ValueError(f"Noise topology '{self.noise_topology}' invalid. Must be one of: {SUPPORTED_NOISE_TOPOLOGIES}")
        if self.blue_noise_alpha < 0.0 or self.blue_noise_alpha > 2.0:
            raise ValueError(f"Blue noise alpha {self.blue_noise_alpha} out of bounds (0.0-2.0).")
        if self.pm_iterations < 1 or self.pm_iterations > 30:
            raise ValueError(f"Perona-Malik iterations {self.pm_iterations} out of bounds (1-30).")
        if self.pm_conductance <= 0.0 or self.pm_conductance > 5.0:
            raise ValueError(f"Perona-Malik conductance {self.pm_conductance} out of bounds (0.0 < K <= 5.0).")
        if self.pm_lambda <= 0.0 or self.pm_lambda > 0.25:
            raise ValueError(f"Perona-Malik lambda {self.pm_lambda} exceeds stability bound (0.0 < lambda <= 0.25).")

    def save_preset(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.model_dump(), f, indent=2, ensure_ascii=False)

    @classmethod
    def load_preset(cls, path: Path) -> GenerationRequest:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls(**data)


class GenerationResponse(BaseModel):
    output_path: str
    sample_rate: int
    duration_seconds: float
    total_samples: int
    generation_time_seconds: float
    real_time_factor: float
    peak_vram_gb: float
    cpu_offload_active: bool
    scheduler_used: str
    noise_topology_used: str
    pm_diffusion_used: bool
    declick_applied: bool
    peak_linear: float
    peak_dbfs: float
    rms_dbfs: float
    crest_factor_db: float
    effective_prompt: str
    top_k_vector_used: List[int]