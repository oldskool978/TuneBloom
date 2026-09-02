import os
import sys

os.environ["CUBLAS_WORKSPACE_CONFIG"] = ":4096:8"

import gc
import uuid
import time
import hmac
import json
import logging
import asyncio
import hashlib
import tempfile
import argparse
import mimetypes
import threading
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional, Tuple, Callable, List, Union

import torch
import numpy as np
import soundfile as sf
import uvicorn

from fastapi import FastAPI, APIRouter, HTTPException, Header, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator
from starlette.middleware.base import BaseHTTPMiddleware

mimetypes.add_type("application/wasm", ".wasm")
mimetypes.add_type("audio/ogg", ".opus")
mimetypes.add_type("audio/mpeg", ".mp3")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

SERVICES_DIR = Path(__file__).resolve().parent
BACKEND_ROOT = SERVICES_DIR.parent

PATH_ANCHORS = [
    BACKEND_ROOT,
    BACKEND_ROOT / "Intelligen",
    BACKEND_ROOT / "furgie",
    BACKEND_ROOT / "SICKOMODE",
    BACKEND_ROOT / "Boompus",
    BACKEND_ROOT / "OP3Transcode",
]

for p in reversed(PATH_ANCHORS):
    p_str = str(p)
    if p.exists() and p_str not in sys.path:
        sys.path.insert(0, p_str)

for pkg_dir in [
    BACKEND_ROOT / "Intelligen",
    BACKEND_ROOT / "furgie",
    BACKEND_ROOT / "furgie" / "furgie_core",
    BACKEND_ROOT / "SICKOMODE",
    BACKEND_ROOT / "SICKOMODE" / "core",
    BACKEND_ROOT / "Boompus",
    SERVICES_DIR,
]:
    if pkg_dir.exists():
        init_file = pkg_dir / "__init__.py"
        if not init_file.exists():
            try:
                init_file.touch()
            except OSError:
                pass

try:
    import Intelligen.schema as intelligen_schema_mod
    sys.modules["schema"] = intelligen_schema_mod
except Exception:
    pass

ARTIFACTS_DIR = BACKEND_ROOT / "artifacts"
STORAGE_ROOT = BACKEND_ROOT / "storage" / "users"
CONFIG_DIR = BACKEND_ROOT / "config"

for d in [ARTIFACTS_DIR, STORAGE_ROOT, CONFIG_DIR]:
    d.mkdir(parents=True, exist_ok=True)

POW_SECRET = os.environ.get("TUNEBLOOM_POW_SECRET", "tb_pow_entropy_matrix_2026_secure")
SESSION_SECRET = os.environ.get("TUNEBLOOM_SESSION_SECRET", "tb_session_key_2026_master")
POW_DIFFICULTY = int(os.environ.get("TUNEBLOOM_POW_DIFFICULTY", "4"))
POW_EXPIRATION_SECONDS = 300
ARTIFACT_TTL_SECONDS = 86400

_REPLAY_CACHE: Dict[str, float] = {}
_IS_STANDALONE: bool = os.environ.get("TUNEBLOOM_STANDALONE", "0").lower() in ("1", "true", "yes")
_CLI_SITE_ROOT: Optional[Path] = None
_CLI_CONFIG_FILE: Optional[Path] = None


def _bootstrap_cli_environment():
    global _IS_STANDALONE, _CLI_SITE_ROOT, _CLI_CONFIG_FILE
    for i, arg in enumerate(sys.argv):
        if arg == "--site-root" and i + 1 < len(sys.argv):
            _CLI_SITE_ROOT = Path(sys.argv[i + 1]).resolve()
        elif arg.startswith("--site-root="):
            _CLI_SITE_ROOT = Path(arg.split("=", 1)[1]).resolve()
        elif arg == "--config" and i + 1 < len(sys.argv):
            _CLI_CONFIG_FILE = Path(sys.argv[i + 1]).resolve()
        elif arg.startswith("--config="):
            _CLI_CONFIG_FILE = Path(arg.split("=", 1)[1]).resolve()
        elif arg == "--standalone":
            _IS_STANDALONE = True
            os.environ["TUNEBLOOM_STANDALONE"] = "1"
        elif arg == "--headless":
            _IS_STANDALONE = False
            os.environ["TUNEBLOOM_STANDALONE"] = "0"


_bootstrap_cli_environment()


def set_cli_overrides(
    standalone: Optional[bool] = None,
    site_root: Optional[str] = None,
    config_file: Optional[str] = None,
) -> None:
    global _IS_STANDALONE, _CLI_SITE_ROOT, _CLI_CONFIG_FILE
    if standalone is not None:
        _IS_STANDALONE = standalone
        os.environ["TUNEBLOOM_STANDALONE"] = "1" if standalone else "0"
    if site_root:
        _CLI_SITE_ROOT = Path(site_root).resolve()
    if config_file:
        _CLI_CONFIG_FILE = Path(config_file).resolve()


def is_standalone_mode() -> bool:
    return _IS_STANDALONE or os.environ.get("TUNEBLOOM_STANDALONE", "0").lower() in ("1", "true", "yes")


def resolve_site_root() -> Path:
    if is_standalone_mode():
        candidates = [
            BACKEND_ROOT / "webui",
            Path.cwd() / "webui",
        ]
        for c in candidates:
            if (c / "index.html").exists():
                return c.resolve()
        return (BACKEND_ROOT / "webui").resolve()

    if _CLI_SITE_ROOT and _CLI_SITE_ROOT.exists():
        return _CLI_SITE_ROOT.resolve()

    env_site = os.environ.get("TUNEBLOOM_SITE_DIR")
    if env_site and Path(env_site).exists():
        return Path(env_site).resolve()

    candidates = [
        BACKEND_ROOT / "site",
        Path.cwd() / "site",
        BACKEND_ROOT / "webui",
        Path.cwd() / "webui",
        Path.cwd(),
        BACKEND_ROOT,
    ]
    for c in candidates:
        if (c / "index.html").exists():
            return c.resolve()
    return (BACKEND_ROOT / "webui").resolve()


def resolve_boompus_binary() -> Optional[Path]:
    bin_name = "tunebloom-opusenc.exe" if sys.platform == "win32" else "tunebloom-opusenc"
    candidates = [
        BACKEND_ROOT / "Boompus" / "dist" / "bin" / bin_name,
        Path.cwd() / "Boompus" / "dist" / "bin" / bin_name,
        BACKEND_ROOT / "dist" / "bin" / bin_name,
    ]
    for c in candidates:
        if c.exists() and c.is_file():
            return c.resolve()
    return None


def get_themes_root() -> Path:
    return resolve_site_root() / "themes"


def get_jewelcases_root() -> Path:
    return resolve_site_root() / "public" / "jewelcases"


RESERVED_DEFAULT_COVERS = {"default.jpg", "default.png", "midnight.jpg", "case_default.png"}


class PollingLogFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        msg = record.getMessage()
        if '"GET ' in msg:
            if "/jobs/" in msg or "/health" in msg:
                if " 200 " in msg or " 304 " in msg or " 200 OK" in msg or " 304 Not Modified" in msg:
                    return False
        return True


def slugify(username: str) -> str:
    slug = username.strip().lower()
    slug = "".join([c if c.isalnum() or c in ("-", "_") else "_" for c in slug])
    return "_".join(filter(None, slug.split("_")))


def get_user_registry_candidates() -> List[Path]:
    if _CLI_CONFIG_FILE and _CLI_CONFIG_FILE.exists():
        return [_CLI_CONFIG_FILE.resolve()]
    custom_file = os.environ.get("TUNEBLOOM_USERS_FILE")
    if custom_file and Path(custom_file).exists():
        return [Path(custom_file).resolve()]
    custom_dir = os.environ.get("TUNEBLOOM_CONFIG_DIR")
    if custom_dir and (Path(custom_dir) / "users.json").exists():
        return [(Path(custom_dir) / "users.json").resolve()]
    if is_standalone_mode():
        return [
            BACKEND_ROOT / "webui" / "config" / "users.json",
            Path.cwd() / "webui" / "config" / "users.json",
            BACKEND_ROOT / "config" / "users.json",
        ]
    resolved_site = resolve_site_root()
    return [
        resolved_site / "config" / "users.json",
        BACKEND_ROOT / "config" / "users.json",
        Path.cwd() / "config" / "users.json",
        BACKEND_ROOT / "webui" / "config" / "users.json",
        SERVICES_DIR / "config" / "users.json",
    ]


def load_user_registry() -> Tuple[Dict[str, Any], Path]:
    candidates = get_user_registry_candidates()
    seen_paths = set()
    for p in candidates:
        resolved = p.resolve()
        if resolved in seen_paths:
            continue
        seen_paths.add(resolved)
        if resolved.exists() and resolved.is_file():
            try:
                with open(resolved, "r", encoding="utf-8-sig") as f:
                    raw_data = json.load(f)
                    data = raw_data.get("users", raw_data) if isinstance(raw_data, dict) else {}
                    if isinstance(data, dict) and data:
                        return data, resolved
            except Exception as e:
                logging.getLogger("uvicorn.error").warning(f"Failed parsing user registry at {resolved}: {e}")

    fallback = {
        "administrator": {
            "display_name": "Administrator",
            "daily_quota": 999,
            "assigned_theme": "cyber_neon",
            "custom_permissions": ["admin", "unlimited_quota"],
        },
        "admin": {
            "display_name": "Administrator",
            "daily_quota": 999,
            "assigned_theme": "cyber_neon",
            "custom_permissions": ["admin", "unlimited_quota"],
        },
    }
    return fallback, Path("EMBEDDED_MEMORY_FALLBACK")


def create_session_token(slug: str) -> str:
    ts = str(int(time.time()))
    payload = f"{slug}:{ts}"
    signature = hmac.new(SESSION_SECRET.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload}:{signature}"


def verify_session_token(token: Optional[str]) -> str:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    try:
        parts = token.split(":")
        if len(parts) != 3:
            raise ValueError
        slug, ts, sig = parts[0], parts[1], parts[2]
        payload = f"{slug}:{ts}"
        expected = hmac.new(SESSION_SECRET.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            raise ValueError
        if time.time() - int(ts) > 604800:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired.")
        return slug
    except (ValueError, IndexError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session credentials.")


def generate_pow_challenge() -> Dict[str, Any]:
    now = int(time.time())
    nonce = uuid.uuid4().hex
    raw = f"{now}:{nonce}:{POW_DIFFICULTY}"
    sig = hmac.new(POW_SECRET.encode("utf-8"), raw.encode("utf-8"), hashlib.sha256).hexdigest()
    return {
        "timestamp": now,
        "nonce": nonce,
        "difficulty": POW_DIFFICULTY,
        "challenge": raw,
        "signature": sig,
    }


def verify_pow_solution(challenge: str, signature: str, solution_nonce: str) -> bool:
    global _REPLAY_CACHE
    now = time.time()
    _REPLAY_CACHE = {k: v for k, v in _REPLAY_CACHE.items() if now - v < POW_EXPIRATION_SECONDS}
    cache_key = f"{challenge}:{solution_nonce}"
    if cache_key in _REPLAY_CACHE:
        return False
    expected_sig = hmac.new(POW_SECRET.encode("utf-8"), challenge.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_sig):
        return False
    try:
        ts_str, _, diff_str = challenge.split(":")
        ts = int(ts_str)
        diff = int(diff_str)
        if now - ts > POW_EXPIRATION_SECONDS or ts > now + 30:
            return False
    except Exception:
        return False

    attempt = f"{challenge}:{solution_nonce}".encode("utf-8")
    h = hashlib.sha256(attempt).hexdigest()
    if not h.startswith("0" * diff):
        return False
    _REPLAY_CACHE[cache_key] = now
    return True


class PowSubmission(BaseModel):
    challenge: str
    signature: str
    solution_nonce: str


class AuthPayload(BaseModel):
    username: str


class SynthesisPayload(BaseModel):
    title: str = Field(default="Untitled Master", max_length=80)
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
    audio_duration: float = Field(default=300.0, ge=1.0, le=600.0)
    seed: Optional[int] = Field(default=None, ge=0)
    assigned_jewelcase: Optional[str] = Field(default=None, max_length=120)
    blocks: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    temperature: Optional[float] = Field(default=0.9100, ge=0.0001, le=3.0)
    top_p: Optional[float] = Field(default=0.9600, ge=0.0001, le=1.0)
    top_k: Optional[int] = Field(default=44, ge=1, le=500)
    top_k_layers: Optional[List[int]] = Field(
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
    apply_declick: bool = Field(default=True)
    cpu_offload: bool = Field(default=False)
    pow: PowSubmission

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


class SynthesisJob:
    def __init__(self, user_slug: str, request_data: Dict[str, Any]):
        self.job_id = f"tb_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}"
        self.user_slug = user_slug
        self.request_data = request_data
        self.status = "QUEUED"
        self.progress_pct = 0
        self.stage_description = "Studio Queue Position Registered"
        self.created_at = datetime.now(timezone.utc).isoformat()
        self.output_file: Optional[Path] = None
        self.telemetry: Optional[Dict[str, Any]] = None
        self.recipe: Optional[Dict[str, Any]] = None
        self.working_draft: Optional[Dict[str, Any]] = None
        self.error_message: Optional[str] = None


class EnginePipeline:
    def __init__(self):
        self.device_str = "cuda" if torch.cuda.is_available() else "cpu"
        self.device = torch.device(self.device_str)

    def _flush_hardware_memory(self):
        if torch.cuda.is_available():
            torch.cuda.synchronize()
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()

    def run_stage1_composition(
        self,
        request_data: Dict[str, Any],
        target_duration: float,
        seed: int,
        out_path: Path,
        progress_cb: Callable[[int, str], None],
    ) -> Any:
        progress_cb(5, "Arranging Harmonic Structure & Instrumentation...")
        from Intelligen.schema import GenerationRequest
        from Intelligen.engine import MusicEngine

        raw_lyrics = request_data.get("lyrics", "")
        blocks = request_data.get("blocks", [])

        raw_k_layers = request_data.get("top_k_layers")
        if raw_k_layers and len(raw_k_layers) == 8:
            k_layers = [int(k) for k in raw_k_layers]
        else:
            base_k = int(request_data.get("top_k", 44))
            k_layers = [base_k] * 8

        gen_req = GenerationRequest(
            genre=request_data.get("genre", ""),
            subgenre=request_data.get("subgenre", ""),
            bpm=int(request_data.get("bpm", 0)),
            key=request_data.get("key", ""),
            mood=request_data.get("mood", ""),
            vocals=request_data.get("vocals", ""),
            arrangement=request_data.get("arrangement", ""),
            lyrics=raw_lyrics,
            raw_prompt=request_data.get("raw_prompt"),
            prompt=request_data.get("prompt"),
            temperature=float(request_data.get("temperature", 0.9100)),
            top_p=float(request_data.get("top_p", 0.9600)),
            top_k=int(request_data.get("top_k", 44)),
            top_k_layers=k_layers,
            ar_guidance_scale=float(request_data.get("ar_guidance_scale", 1.5200)),
            scheduler_type=str(request_data.get("scheduler_type", "heun")),
            num_inference_steps=int(request_data.get("num_inference_steps", 42)),
            guidance_scale=float(request_data.get("guidance_scale", 1.7800)),
            noise_topology=str(request_data.get("noise_topology", "blue_noise")),
            blue_noise_alpha=float(request_data.get("blue_noise_alpha", 0.7500)),
            enable_pm_diffusion=bool(request_data.get("enable_pm_diffusion", True)),
            pm_iterations=int(request_data.get("pm_iterations", 5)),
            pm_conductance=float(request_data.get("pm_conductance", 0.1500)),
            pm_lambda=float(request_data.get("pm_lambda", 0.2000)),
            audio_duration=target_duration,
            seed=seed,
            output_path=str(out_path),
            device=self.device_str,
            apply_declick=bool(request_data.get("apply_declick", True)),
            cpu_offload=bool(request_data.get("cpu_offload", False)),
            blocks=blocks,
        )

        def on_intelli_step(stage: str, cur: int, tot: int):
            if stage == "stage1":
                emitted_sec = cur / 25.0
                pct = 5 + int((cur / max(1, tot)) * 20)
                progress_cb(pct, f"Arranging Acoustic Composition ({emitted_sec:.1f}s composed)...")
            elif stage == "stage2":
                pct = 25 + int((cur / max(1, tot)) * 20)
                progress_cb(pct, f"Synthesizing Vector Field ({cur}/{tot} steps)...")

        music_eng = MusicEngine(device=self.device_str)
        try:
            with torch.inference_mode():
                resp = music_eng.synthesize(gen_req, progress_callback=on_intelli_step)
                return resp
        finally:
            del music_eng
            self._flush_hardware_memory()

    def run_stage2_enhancement(
        self,
        raw_path: Path,
        out_path: Path,
        progress_cb: Callable[[int, str], None],
    ) -> Any:
        progress_cb(45, "Refining Acoustic Space & High-Frequency Detail...")
        try:
            from furgie.furgie_core.schema import FurgieRequest
            from furgie.furgie_core.engine import FurgieEngine
        except ImportError:
            from furgie_core.schema import FurgieRequest
            from furgie_core.engine import FurgieEngine

        furgie_req = FurgieRequest(
            input_path=str(raw_path),
            output_path=str(out_path),
            input_sr_anchor=24000,
            target_rate="48k",
            headroom_mode="bypass",
            target_peak_dbfs=0.0,
            ode_steps=16,
            solver="heun",
            guidance_scale=0.0,
            device=self.device_str,
        )
        furgie_eng = FurgieEngine(device=self.device_str)

        def furgie_progress(tile_cur: int, tile_tot: int) -> None:
            pct = 45 + int((tile_cur / max(1, tile_tot)) * 25)
            progress_cb(pct, f"Refining Acoustic Space ({tile_cur}/{tile_tot} tiles)...")

        try:
            with torch.inference_mode():
                return furgie_eng.synthesize_request(furgie_req, tile_progress_callback=furgie_progress)
        finally:
            del furgie_eng
            self._flush_hardware_memory()

    def run_stage3_limiting(
        self,
        stage2_path: Path,
        stage3_wav_path: Path,
        seed: int,
        intelli_resp: Any,
        furgie_telem: Any,
        progress_cb: Callable[[int, str], None],
    ) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        progress_cb(70, "Balancing Dynamic Range & Psychoacoustic Profile...")
        from SICKOMODE.core.schema import LimiterConfig
        from SICKOMODE.core.engine import PsychoacousticLimiterEngine

        config = LimiterConfig(
            sample_rate=48000,
            mode="psychoacoustic_celt",
            true_peak_ceiling_db=-0.30,
            prepass_enabled=True,
            device=self.device_str,
        )
        limiter = PsychoacousticLimiterEngine(config)
        audio_tensor = None
        limited_tensor = None
        final_audio_np = None

        try:
            audio_48k, _ = sf.read(str(stage2_path), dtype="float32")
            if audio_48k.ndim == 1:
                audio_48k = np.stack([audio_48k, audio_48k], axis=0)
            elif audio_48k.shape[0] > audio_48k.shape[1]:
                audio_48k = audio_48k.T

            with torch.inference_mode():
                host_tensor = torch.from_numpy(audio_48k)
                if self.device_str == "cuda":
                    audio_tensor = host_tensor.pin_memory().to(self.device, non_blocking=True)
                else:
                    audio_tensor = host_tensor.to(self.device)
                del host_tensor
                del audio_48k
                limited_tensor = limiter.process_full_prepass(audio_tensor)
                final_audio_np = limited_tensor.detach().cpu().numpy().T

            sf.write(str(stage3_wav_path), final_audio_np, 48000, subtype="FLOAT")

            peak_val = float(np.max(np.abs(final_audio_np)))
            peak_dbfs = float(20.0 * np.log10(max(peak_val, 1e-9)))
            rms_val = float(np.sqrt(np.mean(final_audio_np**2)))
            rms_dbfs = float(20.0 * np.log10(max(rms_val, 1e-9)))
            crest_factor = peak_dbfs - rms_dbfs
            actual_duration = float(final_audio_np.shape[0] / 48000.0)

            master_telemetry = {
                "seed": seed,
                "duration_seconds": round(actual_duration, 4),
                "sample_rate": 48000,
                "true_peak_dbtp": round(peak_dbfs, 4),
                "integrated_loudness_db": round(rms_dbfs, 4),
                "dynamic_punch_db": round(crest_factor, 4),
                "master_format": "48.0 kHz Master Audio Bitstream",
                "top_k_vector_used": getattr(intelli_resp, "top_k_vector_used", [44] * 8) if intelli_resp else [44] * 8,
                "stage1_rtf": round(getattr(intelli_resp, "real_time_factor", 0.0), 4) if intelli_resp else None,
                "stage1_vram_gb": round(getattr(intelli_resp, "peak_vram_gb", 0.0), 3) if intelli_resp else None,
                "stage1_scheduler": getattr(intelli_resp, "scheduler_used", "heun") if intelli_resp else None,
                "stage1_noise_topology": getattr(intelli_resp, "noise_topology_used", "blue_noise") if intelli_resp else None,
                "stage1_pm_diffusion": getattr(intelli_resp, "pm_diffusion_used", True) if intelli_resp else None,
                "stage2_rtf": round(getattr(furgie_telem, "real_time_factor", 0.0), 4) if furgie_telem else None,
                "stage2_vram_gb": round(getattr(furgie_telem, "peak_vram_gb", 0.0), 3) if furgie_telem else None,
            }
            master_recipe = {
                "stage1_profile": "Studio Master Acoustic Arrangement",
                "stage2_profile": "Spatial Air & Harmonic Balancing",
                "stage3_profile": "Dynamic Envelope Optimization",
                "stage4_profile": "Boompus Standalone Bitstream Delivery",
            }
            return master_telemetry, master_recipe
        finally:
            del audio_tensor
            del limited_tensor
            del final_audio_np
            del limiter
            self._flush_hardware_memory()

    def run_stage4_encoding(
        self,
        stage3_wav_path: Path,
        output_opus_path: Path,
        progress_cb: Callable[[int, str], None],
    ) -> None:
        progress_cb(90, "Mastering Delivery Bitstream via Boompus Engine...")
        boompus_bin = resolve_boompus_binary()
        if boompus_bin and boompus_bin.exists():
            cmd = [str(boompus_bin), str(stage3_wav_path), str(output_opus_path), "192", "--cvbr"]
            proc = subprocess.run(cmd, capture_output=True, text=True)
            if proc.returncode != 0:
                data, sr = sf.read(str(stage3_wav_path), dtype="float32")
                sf.write(str(output_opus_path), data, sr, format="OGG", subtype="OPUS")
        else:
            data, sr = sf.read(str(stage3_wav_path), dtype="float32")
            sf.write(str(output_opus_path), data, sr, format="OGG", subtype="OPUS")
        progress_cb(98, "Finalizing Master Container...")

    def run(
        self,
        job: SynthesisJob,
        progress_cb: Callable[[int, str], None],
    ) -> Tuple[Path, Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
        raw_seed = job.request_data.get("seed")
        seed = int(raw_seed) if (raw_seed is not None and str(raw_seed).strip() != "") else int(np.random.randint(100000, 99999999))
        target_duration = float(job.request_data.get("audio_duration", 300.0))
        output_opus_path = ARTIFACTS_DIR / f"{job.job_id}.opus"

        with tempfile.TemporaryDirectory() as tmp_dir_str:
            tmp_dir = Path(tmp_dir_str)
            raw_stage1_path = tmp_dir / "stage1_raw.wav"
            furgie_stage2_path = tmp_dir / "stage2_48k.wav"
            stage3_wav_path = tmp_dir / "stage3_limited_48k.wav"

            try:
                intelli_resp = self.run_stage1_composition(
                    request_data=job.request_data,
                    target_duration=target_duration,
                    seed=seed,
                    out_path=raw_stage1_path,
                    progress_cb=progress_cb,
                )
                furgie_telem = self.run_stage2_enhancement(
                    raw_path=raw_stage1_path,
                    out_path=furgie_stage2_path,
                    progress_cb=progress_cb,
                )
                telemetry, recipe_meta = self.run_stage3_limiting(
                    stage2_path=furgie_stage2_path,
                    stage3_wav_path=stage3_wav_path,
                    seed=seed,
                    intelli_resp=intelli_resp,
                    furgie_telem=furgie_telem,
                    progress_cb=progress_cb,
                )
                self.run_stage4_encoding(
                    stage3_wav_path=stage3_wav_path,
                    output_opus_path=output_opus_path,
                    progress_cb=progress_cb,
                )

                full_recipe = {
                    "genre": job.request_data.get("genre", ""),
                    "subgenre": job.request_data.get("subgenre", ""),
                    "bpm": int(job.request_data.get("bpm", 0)),
                    "key": job.request_data.get("key", ""),
                    "mood": job.request_data.get("mood", ""),
                    "vocals": job.request_data.get("vocals", ""),
                    "arrangement": job.request_data.get("arrangement", ""),
                    "lyrics": job.request_data.get("lyrics", ""),
                    **recipe_meta,
                }

                working_draft = {
                    "title": job.request_data.get("title", "Untitled Master"),
                    "genre": job.request_data.get("genre", ""),
                    "subgenre": job.request_data.get("subgenre", ""),
                    "bpm": int(job.request_data.get("bpm", 0)),
                    "key": job.request_data.get("key", ""),
                    "mood": job.request_data.get("mood", ""),
                    "vocals": job.request_data.get("vocals", ""),
                    "arrangement": job.request_data.get("arrangement", ""),
                    "lyrics": job.request_data.get("lyrics", ""),
                    "blocks": job.request_data.get("blocks", []),
                    "seed": seed,
                    "top_k_layers": getattr(intelli_resp, "top_k_vector_used", [44] * 8) if intelli_resp else [44] * 8,
                }

                return output_opus_path, telemetry, full_recipe, working_draft
            finally:
                if raw_stage1_path.exists():
                    raw_stage1_path.unlink(missing_ok=True)
                if furgie_stage2_path.exists():
                    furgie_stage2_path.unlink(missing_ok=True)
                if stage3_wav_path.exists():
                    stage3_wav_path.unlink(missing_ok=True)
                self._flush_hardware_memory()


class ComputeQueue:
    def __init__(self):
        self.queue: asyncio.Queue[SynthesisJob] = asyncio.Queue()
        self.jobs: Dict[str, SynthesisJob] = {}
        self.events: Dict[str, asyncio.Event] = {}
        self.pipeline = EnginePipeline()
        self.worker_task: Optional[asyncio.Task] = None
        self.cleanup_task: Optional[asyncio.Task] = None
        self.active_job: Optional[SynthesisJob] = None
        self._loop: Optional[asyncio.AbstractEventLoop] = None

    def start(self):
        self._loop = asyncio.get_running_loop()
        if self.worker_task is None or self.worker_task.done():
            self.worker_task = asyncio.create_task(self._worker_loop())
        if self.cleanup_task is None or self.cleanup_task.done():
            self.cleanup_task = asyncio.create_task(self._cleanup_loop())

    def get_job_event(self, job_id: str) -> asyncio.Event:
        if job_id not in self.events:
            self.events[job_id] = asyncio.Event()
        return self.events[job_id]

    def notify_job(self, job_id: str):
        if job_id in self.events:
            ev = self.events[job_id]
            if self._loop and self._loop.is_running():
                self._loop.call_soon_threadsafe(ev.set)
            else:
                ev.set()

    def enqueue(self, user_slug: str, request_data: Dict[str, Any]) -> SynthesisJob:
        job = SynthesisJob(user_slug, request_data)
        self.jobs[job.job_id] = job
        self.get_job_event(job.job_id)
        self.queue.put_nowait(job)
        return job

    def get_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        job = self.jobs.get(job_id)
        if not job:
            return None
        ahead_count = 0
        if job.status == "QUEUED":
            queue_items = list(self.queue._queue)
            try:
                ahead_count = queue_items.index(job)
                if self.active_job is not None:
                    ahead_count += 1
            except ValueError:
                ahead_count = 1 if self.active_job is not None else 0

        est_seconds = 0
        if job.status == "QUEUED":
            est_seconds = ahead_count * 60 + 60
        elif job.status == "PROCESSING":
            est_seconds = max(5, int(60 * (1.0 - job.progress_pct / 100.0)))

        return {
            "job_id": job.job_id,
            "status": job.status,
            "stage": job.stage_description,
            "progress_pct": job.progress_pct,
            "users_ahead": ahead_count,
            "estimated_wait_seconds": est_seconds,
            "created_at": job.created_at,
            "telemetry": job.telemetry,
            "recipe": job.recipe,
            "working_draft": job.working_draft,
            "error": job.error_message,
        }

    async def _cleanup_loop(self):
        while True:
            await asyncio.sleep(3600)
            now = time.time()
            for artifact in ARTIFACTS_DIR.glob("*.opus"):
                try:
                    if artifact.is_file() and (now - artifact.stat().st_mtime) > ARTIFACT_TTL_SECONDS:
                        artifact.unlink(missing_ok=True)
                except Exception:
                    pass

            dead_jobs = [
                jid
                for jid, j in self.jobs.items()
                if j.status in ("COMPLETED", "FAILED")
                and (now - datetime.fromisoformat(j.created_at).timestamp()) > ARTIFACT_TTL_SECONDS
            ]
            for jid in dead_jobs:
                self.jobs.pop(jid, None)
                self.events.pop(jid, None)

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            self.active_job = job
            job.status = "PROCESSING"
            job.progress_pct = 5
            job.stage_description = "Initializing Master Audio Engine..."
            self.notify_job(job.job_id)

            loop = asyncio.get_running_loop()

            def progress_hook(pct: int, desc: str):
                job.progress_pct = pct
                job.stage_description = desc
                self.notify_job(job.job_id)

            try:
                output_file, telemetry, recipe, working_draft = await loop.run_in_executor(
                    None,
                    self.pipeline.run,
                    job,
                    progress_hook,
                )

                job.output_file = output_file
                job.telemetry = telemetry
                job.recipe = recipe
                job.working_draft = working_draft
                job.progress_pct = 100
                job.stage_description = "Studio Master Complete"
                job.status = "COMPLETED"

                user_dir = STORAGE_ROOT / job.user_slug
                user_tracks_dir = user_dir / "tracks"
                user_tracks_dir.mkdir(parents=True, exist_ok=True)
                stored_file = user_tracks_dir / f"{job.job_id}_master.opus"
                if output_file.exists():
                    stored_file.write_bytes(output_file.read_bytes())

                seed = telemetry.get("seed", 42)
                realized_duration = telemetry.get("duration_seconds", float(job.request_data.get("audio_duration", 300.0)))

                covers = []
                jewelcases_dir = get_jewelcases_root()
                if jewelcases_dir.exists():
                    covers = sorted([
                        f.name
                        for f in jewelcases_dir.iterdir()
                        if f.is_file()
                        and f.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp", ".avif")
                        and f.name not in RESERVED_DEFAULT_COVERS
                    ])
                if not covers:
                    covers = ["default.jpg"]

                history_file = user_dir / "history.json"
                history_data = {"user_slug": job.user_slug, "tracks": []}
                if history_file.exists():
                    try:
                        with open(history_file, "r", encoding="utf-8-sig") as f:
                            history_data = json.load(f)
                    except Exception:
                        pass

                requested_cover = job.request_data.get("assigned_jewelcase")
                if requested_cover and requested_cover not in RESERVED_DEFAULT_COVERS:
                    assigned_cover = requested_cover
                else:
                    used_covers = [
                        t.get("assigned_jewelcase")
                        for t in history_data.get("tracks", [])
                        if t.get("assigned_jewelcase") and t.get("assigned_jewelcase") not in RESERVED_DEFAULT_COVERS
                    ]
                    window_size = max(1, len(covers) - 1)
                    recent_used = set(used_covers[:window_size])
                    candidates = [c for c in covers if c not in recent_used]
                    if not candidates:
                        candidates = covers
                    cover_digest = hashlib.sha256(f"{job.user_slug}:{job.job_id}:{seed}".encode("utf-8")).hexdigest()
                    assigned_cover = candidates[int(cover_digest[:8], 16) % len(candidates)]

                track_entry = {
                    "track_id": job.job_id,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "title": job.request_data.get("title", "Untitled Master"),
                    "artist": "TuneBloom Master",
                    "audio_url": f"api/v1/audio/stream/{job.user_slug}/{job.job_id}_master.opus",
                    "duration_seconds": realized_duration,
                    "assigned_jewelcase": assigned_cover,
                    "recipe": recipe,
                    "working_draft": working_draft,
                    "telemetry": telemetry,
                }

                history_data.setdefault("tracks", []).insert(0, track_entry)
                with open(history_file, "w", encoding="utf-8") as f:
                    json.dump(history_data, f, indent=2)

            except Exception as e:
                job.status = "FAILED"
                job.error_message = str(e)
            finally:
                self.notify_job(job.job_id)
                self.active_job = None
                self.queue.task_done()


compute_queue = ComputeQueue()


@asynccontextmanager
async def lifespan(app: FastAPI):
    compute_queue.start()
    users, src = load_user_registry()
    boompus_bin = resolve_boompus_binary()
    print("=" * 76)
    print("  TUNEBLOOM UNIFIED AUDIO ENGINE // SERVICE ROUTER ACTIVE")
    print(f"  Mode            : {'STANDALONE DESKTOP' if is_standalone_mode() else 'HEADLESS / PROXY DAEMON'}")
    print(f"  Site Root       : {resolve_site_root()}")
    print(f"  User Registry   : {src}")
    print(f"  Boompus Binary  : {boompus_bin if boompus_bin else 'Built-in Audio Fallback'}")
    print(f"  Accounts ({len(users)}) : {', '.join(users.keys())}")
    print("=" * 76)
    yield


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
        return response


app = FastAPI(
    title="TuneBloom Unified Audio Daemon",
    version="2.0.0",
    root_path="",
    lifespan=lifespan,
)

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()


@api_router.get("/auth/challenge")
async def get_challenge():
    return generate_pow_challenge()


@api_router.post("/auth/login")
async def login(payload: AuthPayload):
    raw_input = payload.username.strip()
    input_slug = slugify(raw_input)
    users_map, _ = load_user_registry()

    matched_slug = None
    if input_slug in users_map:
        matched_slug = input_slug
    else:
        for key, meta in users_map.items():
            if slugify(key) == input_slug:
                matched_slug = key
                break
            display_name = str(meta.get("display_name", "")).strip()
            if display_name and (display_name.lower() == raw_input.lower() or slugify(display_name) == input_slug):
                matched_slug = key
                break

    if not matched_slug:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid creator credentials.",
        )

    raw_slug = slugify(matched_slug)
    user_meta = users_map.get(matched_slug, {})
    token = create_session_token(raw_slug)

    history_file = STORAGE_ROOT / raw_slug / "history.json"
    tracks = []
    if history_file.exists():
        try:
            with open(history_file, "r", encoding="utf-8-sig") as f:
                raw_tracks = json.load(f).get("tracks", [])
                for trk in raw_tracks:
                    url = trk.get("audio_url", "")
                    if url.startswith("/"):
                        trk["audio_url"] = url.lstrip("/")
                    if not trk["audio_url"].startswith("api/"):
                        if trk["audio_url"].startswith("v1/"):
                            trk["audio_url"] = f"api/{trk['audio_url']}"
                    tracks.append(trk)
        except Exception:
            pass

    today_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    tokens_used_today = sum(
        1
        for trk in tracks
        if trk.get("created_at", "").startswith(today_utc)
        and not trk.get("is_default", False)
        and not str(trk.get("track_id", "")).startswith("default_")
    )
    daily_quota = int(user_meta.get("daily_quota", 2))
    tokens_remaining = max(0, daily_quota - tokens_used_today)

    registry_path = get_themes_root() / "registry.json"
    assigned_theme = user_meta.get("assigned_theme") or "sky_peace"
    theme_manifest = {}
    if registry_path.exists():
        try:
            with open(registry_path, "r", encoding="utf-8-sig") as f:
                theme_manifest = json.load(f).get("themes", {}).get(assigned_theme, {})
        except Exception:
            pass

    return {
        "status": "authenticated",
        "token": token,
        "user": {
            "slug": raw_slug,
            "display_name": user_meta.get("display_name", payload.username),
            "daily_quota": daily_quota,
            "tokens_remaining": tokens_remaining,
            "assigned_theme": assigned_theme,
        },
        "theme": {
            "theme_id": assigned_theme,
            "manifest": theme_manifest,
        },
        "tracks": tracks,
    }


@api_router.get("/themes/registry")
async def get_themes():
    registry_path = get_themes_root() / "registry.json"
    if not registry_path.exists():
        return {"revolving_pool": [], "themes": {}}
    try:
        with open(registry_path, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    except Exception:
        return {"revolving_pool": [], "themes": {}}


@api_router.get("/health")
async def health():
    return {
        "status": "online",
        "engine_device": compute_queue.pipeline.device_str,
        "active_job": compute_queue.active_job.job_id if compute_queue.active_job else None,
        "queue_depth": compute_queue.queue.qsize(),
    }


@api_router.post("/synthesize")
async def synthesize(
    payload: SynthesisPayload,
    authorization: Optional[str] = Header(None),
):
    token = authorization.replace("Bearer ", "").strip() if authorization else None
    slug = verify_session_token(token)

    users_map, _ = load_user_registry()
    user_meta = users_map.get(slug, {})
    perms = user_meta.get("custom_permissions", [])
    is_unlimited = "admin" in perms or "unlimited_quota" in perms

    if not is_unlimited:
        history_file = STORAGE_ROOT / slug / "history.json"
        tokens_used_today = 0
        if history_file.exists():
            try:
                with open(history_file, "r", encoding="utf-8-sig") as f:
                    raw_tracks = json.load(f).get("tracks", [])
                    today_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                    tokens_used_today = sum(
                        1
                        for trk in raw_tracks
                        if trk.get("created_at", "").startswith(today_utc)
                        and not trk.get("is_default", False)
                        and not str(trk.get("track_id", "")).startswith("default_")
                    )
            except Exception:
                pass

        daily_quota = int(user_meta.get("daily_quota", 2))
        if tokens_used_today >= daily_quota:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Daily generation token quota reached. Quotas reset at 00:00 UTC.",
            )

    if not verify_pow_solution(payload.pow.challenge, payload.pow.signature, payload.pow.solution_nonce):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bot defense verification failed.")

    job = compute_queue.enqueue(slug, payload.model_dump())
    return compute_queue.get_status(job.job_id)


@api_router.get("/jobs/{job_id}")
async def get_job_status(
    job_id: str,
    request: Request,
    authorization: Optional[str] = Header(None),
):
    token = authorization.replace("Bearer ", "").strip() if authorization else None
    verify_session_token(token)

    info = compute_queue.get_status(job_id)
    if not info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Master job record not found.")

    etag = f'W/"{job_id}-{info.get("status")}-{info.get("progress_pct")}-{info.get("users_ahead")}"'
    if_none_match = request.headers.get("if-none-match")
    if if_none_match and if_none_match == etag:
        return Response(status_code=status.HTTP_304_NOT_MODIFIED, headers={"ETag": etag})

    return JSONResponse(content=info, headers={"ETag": etag})


@api_router.get("/jobs/{job_id}/stream")
async def stream_job_status(
    job_id: str,
    request: Request,
    authorization: Optional[str] = Header(None),
    token: Optional[str] = None,
):
    auth_token = token or (authorization.replace("Bearer ", "").strip() if authorization else None)
    verify_session_token(auth_token)

    job = compute_queue.jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Master job record not found.")

    async def event_generator():
        last_state_str = None
        event = compute_queue.get_job_event(job_id)
        while True:
            if await request.is_disconnected():
                break

            current_status = compute_queue.get_status(job_id)
            if not current_status:
                break

            state_str = json.dumps(current_status)
            if state_str != last_state_str:
                last_state_str = state_str
                yield f"data: {state_str}\n\n"

            if current_status.get("status") in ("COMPLETED", "FAILED"):
                break

            try:
                await asyncio.wait_for(event.wait(), timeout=1.0)
                event.clear()
            except asyncio.TimeoutError:
                pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@api_router.get("/audio/{job_id}")
async def get_audio_stream_direct(job_id: str):
    job = compute_queue.jobs.get(job_id)
    if not job or job.status != "COMPLETED" or not job.output_file or not job.output_file.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Master audio stream not ready.")

    return FileResponse(
        str(job.output_file),
        media_type="audio/ogg",
        headers={
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Accept-Ranges": "bytes",
            "Cache-Control": "no-cache",
        },
    )


@api_router.get("/audio/stream/{user_slug}/{filename}")
async def get_audio_stream_user(user_slug: str, filename: str):
    safe_slug = slugify(user_slug)
    safe_name = Path(filename).name
    target_file = STORAGE_ROOT / safe_slug / "tracks" / safe_name

    headers = {
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache",
    }

    if not target_file.exists() or not target_file.is_file():
        default_file = resolve_site_root() / "public" / "default.opus"
        if default_file.exists():
            return FileResponse(str(default_file), media_type="audio/ogg", headers=headers)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Master stream artifact unavailable.")

    return FileResponse(str(target_file), media_type="audio/ogg", headers=headers)


ROUTE_PREFIXES = [
    "",
    "/api",
    "/v1",
    "/api/v1",
    "/TuneBloom/api",
    "/TuneBloom/api/v1",
    "/tunebloom/api",
    "/tunebloom/api/v1",
]

for prefix in ROUTE_PREFIXES:
    app.include_router(api_router, prefix=prefix)


def mount_static_and_spa():
    site_dir = resolve_site_root()
    if site_dir.exists() and (site_dir / "index.html").exists():
        for sub in ["assets", "themes", "public", "wasm"]:
            sub_dir = site_dir / sub
            if sub_dir.exists():
                app.mount(f"/{sub}", StaticFiles(directory=str(sub_dir)), name=sub)
                app.mount(f"/TuneBloom/{sub}", StaticFiles(directory=str(sub_dir)), name=f"tb_sub_{sub}")
                app.mount(f"/tunebloom/{sub}", StaticFiles(directory=str(sub_dir)), name=f"tb_sub_lc_{sub}")

        @app.get("/")
        @app.get("/TuneBloom")
        @app.get("/TuneBloom/")
        @app.get("/tunebloom")
        @app.get("/tunebloom/")
        async def serve_index():
            return FileResponse(str(resolve_site_root() / "index.html"))

        @app.get("/{full_path:path}")
        async def serve_spa(full_path: str):
            path_lower = full_path.lower()
            if (
                path_lower.startswith("auth/")
                or path_lower.startswith("synthesize")
                or path_lower.startswith("jobs/")
                or path_lower.startswith("audio/")
                or path_lower.startswith("health")
                or path_lower.startswith("themes/registry")
                or path_lower.startswith("api/")
                or path_lower.startswith("v1/")
                or "api/" in path_lower
            ):
                return JSONResponse(status_code=404, content={"detail": f"Route not found: /{full_path}"})

            cleaned_path = full_path
            if cleaned_path.lower().startswith("tunebloom/"):
                cleaned_path = cleaned_path[len("tunebloom/") :]

            current_site = resolve_site_root()
            try:
                target = (current_site / cleaned_path).resolve()
                if not target.is_relative_to(current_site.resolve()):
                    raise HTTPException(status_code=403, detail="Forbidden")
            except Exception:
                return FileResponse(str(current_site / "index.html"))

            if target.exists() and target.is_file():
                if any(
                    part in ["config", "storage", "Intelligen", "furgie", "SICKOMODE", "Boompus", "OP3Transcode"]
                    for part in target.parts
                ):
                    raise HTTPException(status_code=403, detail="Forbidden")
                return FileResponse(str(target))

            return FileResponse(str(current_site / "index.html"))


mount_static_and_spa()


def run_server(host: str, port: int):
    uv_access = logging.getLogger("uvicorn.access")
    uv_access.addFilter(PollingLogFilter())
    uvicorn.run(app, host=host, port=port, log_level="info")


def launch_standalone(host: str, port: int):
    try:
        import webview
    except ImportError:
        import webbrowser
        threading.Thread(target=run_server, args=(host, port), daemon=True).start()
        time.sleep(1.0)
        webbrowser.open(f"http://{host}:{port}/")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            sys.exit(0)

    server_thread = threading.Thread(target=run_server, args=(host, port), daemon=True)
    server_thread.start()
    time.sleep(1.0)
    window = webview.create_window(
        title="TuneBloom - Studio Master Audio Creation",
        url=f"http://{host}:{port}/",
        width=1280,
        height=860,
        min_size=(960, 680),
        background_color="#020617",
    )
    webview.start(debug=False)
    sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TuneBloom Unified Services & Compute Daemon Router")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host interface to bind")
    parser.add_argument("--port", type=int, default=8765, help="Port to bind")
    parser.add_argument("--standalone", action="store_true", help="Launch native desktop window")
    parser.add_argument("--headless", action="store_true", help="Run strictly as headless daemon")
    parser.add_argument("--site-root", type=str, default=None, help="Explicit path to site/webui assets directory")
    parser.add_argument("--config", type=str, default=None, help="Explicit path to users.json file")
    args = parser.parse_args()

    set_cli_overrides(
        standalone=args.standalone if args.standalone else (False if args.headless else None),
        site_root=args.site_root,
        config_file=args.config,
    )

    if is_standalone_mode():
        launch_standalone(args.host, args.port)
    else:
        run_server(args.host, args.port)