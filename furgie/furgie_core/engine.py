import os
import json
import yaml
import time
import warnings
import numpy as np
import soundfile as sf
from pathlib import Path
from typing import Union, Dict, Any, Optional, Tuple, Callable

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
WEIGHTS_DIR = PROJECT_ROOT / "weights"
LOCAL_CACHE_DIR = WEIGHTS_DIR / ".hf_cache"
MANIFEST_FILE = PROJECT_ROOT / "scripts" / "hydrated_models_manifest.json"

os.environ["HF_HOME"] = str(LOCAL_CACHE_DIR)
os.environ["HF_HUB_CACHE"] = str(LOCAL_CACHE_DIR)
os.environ["TRANSFORMERS_CACHE"] = str(LOCAL_CACHE_DIR)
os.environ["MIOPEN_LOG_LEVEL"] = "0"
os.environ["MIOPEN_FIND_MODE"] = "3"
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

import torch
import torchaudio
from furgie_core.network_wrapper import UniverSRWrapper
from furgie_core.schema import (
    FurgieRequest,
    FurgieTelemetry,
    SUPPORTED_TARGET_RATES,
    SUPPORTED_HEADROOM_MODES,
)
from furgie_core.dsp_cuda import measure_true_peak_linear

DEFAULT_MODEL_REPO = "OLDSKOOL978/universr-audio"


def compute_spectral_diagnostics(
    waveform: torch.Tensor,
    anchor_hz: int = 24000,
    sample_rate: int = 48000,
    n_fft: int = 1024,
) -> Tuple[float, float, float, float]:
    x = waveform.mean(dim=0) if waveform.ndim > 1 else waveform
    w = torch.hann_window(n_fft, device=x.device)
    spec = torch.stft(
        x.unsqueeze(0),
        n_fft=n_fft,
        hop_length=n_fft // 2,
        win_length=n_fft,
        window=w,
        center=True,
        return_complex=True,
    ).squeeze(0)
    mag = torch.abs(spec)
    mean_mag = torch.mean(mag, dim=-1)
    phase = torch.angle(spec)
    mean_phase = torch.atan2(torch.mean(torch.sin(phase), dim=-1), torch.mean(torch.cos(phase), dim=-1))

    crossover_bin = int((anchor_hz / 2.0) / (sample_rate / n_fft))
    k = max(2, min(crossover_bin, (n_fft // 2) - 2))

    mag_pre = 20.0 * torch.log10(torch.clamp(mean_mag[k - 1], min=1e-8))
    mag_post = 20.0 * torch.log10(torch.clamp(mean_mag[k], min=1e-8))
    delta_mag = float(torch.abs(mag_post - mag_pre).item())

    p0 = mean_phase[k - 2]
    p1 = mean_phase[k - 1]
    p2 = mean_phase[k]
    curv = p2 - 2.0 * p1 + p0
    curv_wrapped = torch.atan2(torch.sin(curv), torch.cos(curv))
    delta_phi = float(torch.abs(curv_wrapped).item())

    top_start = k
    top_end = n_fft // 2
    top_energy = mean_mag[top_start:top_end] ** 2 + 1e-12
    geom_mean = torch.exp(torch.mean(torch.log(top_energy)))
    arith_mean = torch.mean(top_energy)
    sfm = float((geom_mean / arith_mean).item())

    freqs = torch.linspace(anchor_hz / 2.0, sample_rate / 2.0, top_end - top_start, device=x.device)
    log_f = torch.log10(torch.clamp(freqs, min=1.0))
    log_e = 10.0 * torch.log10(top_energy)
    log_f_mean = torch.mean(log_f)
    log_e_mean = torch.mean(log_e)
    slope = torch.sum((log_f - log_f_mean) * (log_e - log_e_mean)) / (torch.sum((log_f - log_f_mean) ** 2) + 1e-8)
    tilt_slope = float(slope.item())

    return delta_mag, delta_phi, sfm, tilt_slope


class FurgieEngine:
    def __init__(
        self,
        config_path: Optional[Union[str, Path]] = None,
        device: str = "cuda" if torch.cuda.is_available() else "cpu",
        weights_dir: Optional[Union[str, Path]] = None,
        model_repo_id: str = DEFAULT_MODEL_REPO,
    ):
        self.project_root = PROJECT_ROOT
        self.device = torch.device(device)
        self.current_model_repo = model_repo_id
        if config_path is None:
            self.config_path = self.project_root / "furgie_core" / "config" / "inference" / "Furgie_Convergent_48k.yaml"
        else:
            self.config_path = Path(config_path)
        if not self.config_path.exists():
            self.config_path.parent.mkdir(parents=True, exist_ok=True)
            self._write_default_config(self.config_path)
        with open(self.config_path, "r", encoding="utf-8") as f:
            self.config = yaml.safe_load(f)
        self.custom_weights_dir = Path(weights_dir) if weights_dir else None
        self.resolved_weights_dir = self._resolve_weight_directory(self.current_model_repo)
        self.wrapper = UniverSRWrapper(config_path=self.config_path, weight_dir=self.resolved_weights_dir)
        self.wrapper.load_weights(device=self.device, model_repo_id=self.current_model_repo)
        audio_cfg = self.config.get("audio", {})
        self.target_sr = audio_cfg.get("target_sample_rate", 48000)
        self._resamplers: Dict[Tuple[int, int], torchaudio.transforms.Resample] = {}

    def _write_default_config(self, target_path: Path) -> None:
        cfg = {
            "model_metadata": {
                "name": "Furgie-Convergent-48K",
                "version": "2.0.0",
                "description": "Filterless Complex STFT Generative Super-Resolution Engine.",
            },
            "audio": {
                "target_sample_rate": 48000,
                "n_fft": 1024,
                "hop_length": 512,
                "win_length": 1024,
                "power_alpha": 0.2,
            },
            "model": {
                "dims": [96, 192, 384, 768],
                "depths": [2, 2, 4, 2],
                "time_dim": 256,
                "cond_dim": 384,
                "total_freq_bins": 512,
                "hr_freq_bins": 432,
                "feature_enc_layers": 4,
                "sr_to_lr_bins": {8: 80, 12: 128, 16: 170, 24: 256},
            },
            "universr_flow_core": {
                "enabled": True,
                "repo_id": "OLDSKOOL978/universr-audio",
                "solver": "heun",
                "ode_steps": 16,
                "guidance_scale": 0.0,
                "scheduler_type": "uniform",
                "time_warp_gamma": 1.0,
                "seed": 42,
                "cross_band_gain_match": True,
                "crossover_blend_bins": 0,
                "input_sr_anchor": 24000,
            },
        }
        with open(target_path, "w", encoding="utf-8") as f:
            yaml.safe_dump(cfg, f, sort_keys=False)

    def _resolve_weight_directory(self, repo_id: str) -> Path:
        if self.custom_weights_dir and self.custom_weights_dir.exists():
            return self.custom_weights_dir
        if MANIFEST_FILE.exists():
            try:
                with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
                    manifest = json.load(f)
                if repo_id in manifest and manifest[repo_id].get("status") == "READY":
                    raw_local = manifest[repo_id]["local_path"]
                    local_path = Path(raw_local)
                    if not local_path.is_absolute():
                        local_path = (self.project_root / local_path).resolve()
                    if local_path.exists():
                        return local_path
            except Exception:
                pass
        repo_subfolder = WEIGHTS_DIR / repo_id.split("/")[-1]
        if repo_subfolder.exists():
            return repo_subfolder
        if LOCAL_CACHE_DIR.exists():
            return LOCAL_CACHE_DIR
        return repo_subfolder

    def _get_resampler(self, orig_sr: int, new_sr: int) -> torchaudio.transforms.Resample:
        key = (orig_sr, new_sr)
        if key not in self._resamplers:
            self._resamplers[key] = torchaudio.transforms.Resample(
                orig_freq=orig_sr,
                new_freq=new_sr,
                lowpass_filter_width=64,
                resampling_method="sinc_interpolation",
            ).to(self.device)
        return self._resamplers[key]

    def load_audio(self, audio_path: Union[str, Path]) -> Tuple[torch.Tensor, int]:
        data, sr = sf.read(str(audio_path), dtype="float32")
        waveform = torch.from_numpy(data.T if data.ndim > 1 else data)
        if waveform.ndim == 1:
            waveform = waveform.unsqueeze(0)
        return waveform.to(device=self.device, dtype=torch.float32), sr

    def resample_if_needed(self, waveform: torch.Tensor, orig_sr: int, target_sr: int) -> torch.Tensor:
        waveform = waveform.to(device=self.device, dtype=torch.float32)
        if orig_sr != target_sr:
            resampler = self._get_resampler(orig_sr, target_sr)
            waveform = resampler(waveform)
        return waveform

    @torch.inference_mode()
    def synthesize_request(
        self,
        req: FurgieRequest,
        tile_progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> FurgieTelemetry:
        start_time = time.time()
        audio_path = Path(req.input_path)
        output_path = Path(req.output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        if self.device.type == "cuda":
            torch.cuda.reset_peak_memory_stats(self.device)

        waveform, orig_sr = self.load_audio(audio_path)
        waveform_48k = self.resample_if_needed(waveform, orig_sr, self.target_sr)
        in_peak_lin = float(torch.max(torch.abs(waveform_48k)).item())
        in_peak_dbfs = 20.0 * np.log10(max(in_peak_lin, 1e-9))
        in_tp_lin = measure_true_peak_linear(waveform_48k, sample_rate=self.target_sr)
        in_tp_dbtp = 20.0 * np.log10(max(in_tp_lin, 1e-9))

        restored_48k = self.wrapper(
            audio_input=waveform_48k,
            input_sr=req.input_sr_anchor,
            ode_steps=req.ode_steps,
            solver=req.solver,
            guidance_scale=req.guidance_scale,
            scheduler_type=req.scheduler_type,
            time_warp_gamma=req.time_warp_gamma,
            seed=req.seed,
            cross_band_gain_match=req.cross_band_gain_match,
            crossover_blend_bins=req.crossover_blend_bins,
            tile_progress_callback=tile_progress_callback,
        )

        d_mag, d_phi, sfm_val, t_slope = compute_spectral_diagnostics(
            restored_48k, anchor_hz=req.input_sr_anchor, sample_rate=self.target_sr
        )

        target_mode = req.target_rate.lower() if req.target_rate in SUPPORTED_TARGET_RATES else "48k"
        mode_headroom = req.headroom_mode.lower() if req.headroom_mode in SUPPORTED_HEADROOM_MODES else "bypass"
        target_linear = 10.0 ** (req.target_peak_dbfs / 20.0)
        tp_48k = measure_true_peak_linear(restored_48k, sample_rate=self.target_sr)

        if mode_headroom == "peak_resistant":
            t_eff_48k = max(target_linear, in_tp_lin)
            gain_48k = float(min(1.0, t_eff_48k / max(tp_48k, 1e-9)))
        elif mode_headroom == "strict_ceiling":
            gain_48k = float(min(1.0, target_linear / max(tp_48k, 1e-9)))
        else:
            gain_48k = 1.0

        restored_48k_staged = restored_48k * gain_48k
        final_tp_48k = tp_48k * gain_48k
        master_48k_data = restored_48k_staged.cpu().numpy()
        if master_48k_data.ndim == 2 and master_48k_data.shape[0] < master_48k_data.shape[1]:
            master_48k_data = master_48k_data.T
        elif master_48k_data.ndim == 1:
            master_48k_data = master_48k_data[:, np.newaxis]

        waveform_44k1: Optional[torch.Tensor] = None
        master_44k1_data: Optional[np.ndarray] = None
        gain_44k1: Optional[float] = None
        final_tp_44k1: Optional[float] = None
        delivered_44k1_path: Optional[Path] = None

        if target_mode in ["44.1k", "both"]:
            waveform_unscaled_44k1 = self.resample_if_needed(restored_48k, self.target_sr, 44100)
            tp_44k1 = measure_true_peak_linear(waveform_unscaled_44k1, sample_rate=44100)
            if mode_headroom == "peak_resistant":
                waveform_in_44k1 = self.resample_if_needed(waveform_48k, self.target_sr, 44100)
                in_tp_44k1 = measure_true_peak_linear(waveform_in_44k1, sample_rate=44100)
                t_eff_44k1 = max(target_linear, in_tp_44k1)
                gain_44k1 = float(min(1.0, t_eff_44k1 / max(tp_44k1, 1e-9)))
            elif mode_headroom == "strict_ceiling":
                gain_44k1 = float(min(1.0, target_linear / max(tp_44k1, 1e-9)))
            else:
                gain_44k1 = 1.0
            waveform_44k1 = waveform_unscaled_44k1 * gain_44k1
            final_tp_44k1 = tp_44k1 * gain_44k1
            master_44k1_data = waveform_44k1.cpu().numpy()
            if master_44k1_data.ndim == 2 and master_44k1_data.shape[0] < master_44k1_data.shape[1]:
                master_44k1_data = master_44k1_data.T
            elif master_44k1_data.ndim == 1:
                master_44k1_data = master_44k1_data[:, np.newaxis]

        delivered_primary_path = output_path
        delivered_sr = self.target_sr
        primary_data = master_48k_data
        primary_peak_linear = float(np.max(np.abs(master_48k_data)))
        primary_peak_dbfs = 20.0 * np.log10(max(primary_peak_linear, 1e-9))
        primary_tp_linear = final_tp_48k
        primary_tp_dbtp = 20.0 * np.log10(max(final_tp_48k, 1e-9))
        primary_rms_val = float(np.sqrt(np.mean(master_48k_data ** 2)))
        primary_rms_dbfs = 20.0 * np.log10(max(primary_rms_val, 1e-9))
        primary_crest_factor = primary_peak_dbfs - primary_rms_dbfs
        primary_gain_scalar = gain_48k

        if target_mode == "48k":
            sf.write(str(output_path), master_48k_data, 48000, subtype="FLOAT")
        elif target_mode == "44.1k":
            sf.write(str(output_path), master_44k1_data, 44100, subtype="FLOAT")
            delivered_sr = 44100
            primary_data = master_44k1_data
            primary_peak_linear = float(np.max(np.abs(master_44k1_data)))
            primary_peak_dbfs = 20.0 * np.log10(max(primary_peak_linear, 1e-9))
            primary_tp_linear = final_tp_44k1
            primary_tp_dbtp = 20.0 * np.log10(max(final_tp_44k1, 1e-9))
            primary_rms_val = float(np.sqrt(np.mean(master_44k1_data ** 2)))
            primary_rms_dbfs = 20.0 * np.log10(max(primary_rms_val, 1e-9))
            primary_crest_factor = primary_peak_dbfs - primary_rms_dbfs
            primary_gain_scalar = gain_44k1
        elif target_mode == "both":
            sf.write(str(output_path), master_48k_data, 48000, subtype="FLOAT")
            delivered_44k1_path = output_path.parent / f"{output_path.stem}_44k1.wav"
            sf.write(str(delivered_44k1_path), master_44k1_data, 44100, subtype="FLOAT")

        elapsed_sec = time.time() - start_time
        peak_vram_gb = 0.0
        if self.device.type == "cuda":
            peak_vram_gb = torch.cuda.max_memory_allocated(self.device) / (1024**3)
        total_samples = primary_data.shape[0]
        duration_sec = total_samples / float(delivered_sr)
        rtf = elapsed_sec / max(duration_sec, 1e-6)

        peak_linear_44k1 = None
        peak_dbfs_44k1 = None
        true_peak_linear_44k1 = None
        true_peak_dbtp_44k1 = None
        rms_dbfs_44k1 = None
        crest_factor_db_44k1 = None
        master_gain_scalar_44k1 = None

        if target_mode == "both" and master_44k1_data is not None:
            p_lin_44 = float(np.max(np.abs(master_44k1_data)))
            p_dbfs_44 = 20.0 * np.log10(max(p_lin_44, 1e-9))
            tp_dbtp_44 = 20.0 * np.log10(max(final_tp_44k1, 1e-9))
            rms_val_44 = float(np.sqrt(np.mean(master_44k1_data ** 2)))
            rms_dbfs_44 = 20.0 * np.log10(max(rms_val_44, 1e-9))
            peak_linear_44k1 = p_lin_44
            peak_dbfs_44k1 = p_dbfs_44
            true_peak_linear_44k1 = final_tp_44k1
            true_peak_dbtp_44k1 = tp_dbtp_44
            rms_dbfs_44k1 = rms_dbfs_44
            crest_factor_db_44k1 = p_dbfs_44 - rms_dbfs_44
            master_gain_scalar_44k1 = gain_44k1

        return FurgieTelemetry(
            input_path=str(audio_path.resolve()),
            output_path=str(delivered_primary_path.resolve()),
            output_44k1_path=str(delivered_44k1_path.resolve()) if delivered_44k1_path else None,
            sample_rate=delivered_sr,
            duration_seconds=round(duration_sec, 2),
            total_samples=total_samples,
            generation_time_seconds=round(elapsed_sec, 2),
            real_time_factor=round(rtf, 3),
            peak_vram_gb=round(peak_vram_gb, 2),
            solver_used=req.solver,
            ode_steps=req.ode_steps,
            guidance_scale=req.guidance_scale,
            scheduler_type=req.scheduler_type,
            time_warp_gamma=req.time_warp_gamma,
            seed=req.seed,
            cross_band_gain_match=req.cross_band_gain_match,
            crossover_blend_bins=req.crossover_blend_bins,
            input_sr_anchor=req.input_sr_anchor,
            target_rate=target_mode,
            headroom_mode=mode_headroom,
            input_peak_linear=in_peak_lin,
            input_peak_dbfs=in_peak_dbfs,
            input_true_peak_linear=in_tp_lin,
            input_true_peak_dbtp=in_tp_dbtp,
            peak_linear=primary_peak_linear,
            peak_dbfs=primary_peak_dbfs,
            true_peak_linear=primary_tp_linear,
            true_peak_dbtp=primary_tp_dbtp,
            rms_dbfs=primary_rms_dbfs,
            crest_factor_db=primary_crest_factor,
            master_gain_scalar=primary_gain_scalar,
            crossover_magnitude_step_db=round(d_mag, 3),
            crossover_phase_delta_rad=round(d_phi, 4),
            top_octave_sfm=round(sfm_val, 4),
            spectral_tilt_slope=round(t_slope, 3),
            peak_linear_44k1=peak_linear_44k1,
            peak_dbfs_44k1=peak_dbfs_44k1,
            true_peak_linear_44k1=true_peak_linear_44k1,
            true_peak_dbtp_44k1=true_peak_dbtp_44k1,
            rms_dbfs_44k1=rms_dbfs_44k1,
            crest_factor_db_44k1=crest_factor_db_44k1,
            master_gain_scalar_44k1=master_gain_scalar_44k1,
        )

    @torch.inference_mode()
    def synthesize(
        self,
        audio_path: Union[str, Path],
        output_path: Union[str, Path],
        ode_steps: int = 16,
        solver: str = "heun",
        guidance_scale: float = 0.0,
        scheduler_type: str = "uniform",
        time_warp_gamma: float = 1.0,
        seed: Optional[int] = 42,
        cross_band_gain_match: bool = True,
        crossover_blend_bins: int = 0,
        input_sr_anchor: int = 24000,
        headroom_mode: str = "bypass",
        target_peak_dbfs: float = 0.0,
        target_rate: str = "48k",
        tile_progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> Dict[str, Any]:
        req = FurgieRequest(
            input_path=str(audio_path),
            output_path=str(output_path),
            target_rate=target_rate,
            headroom_mode=headroom_mode,
            target_peak_dbfs=target_peak_dbfs,
            ode_steps=ode_steps,
            solver=solver,
            guidance_scale=guidance_scale,
            scheduler_type=scheduler_type,
            time_warp_gamma=time_warp_gamma,
            seed=seed,
            cross_band_gain_match=cross_band_gain_match,
            crossover_blend_bins=crossover_blend_bins,
            input_sr_anchor=input_sr_anchor,
            device=str(self.device),
            repo_id=self.current_model_repo,
        )
        telemetry = self.synthesize_request(req, tile_progress_callback=tile_progress_callback)
        return {
            "status": "SUCCESS",
            "model_used": self.current_model_repo,
            "input_file": str(Path(audio_path).name),
            "output_path": telemetry.output_path,
            "output_44k1_path": telemetry.output_44k1_path,
            "duration_sec": telemetry.generation_time_seconds,
            "peak_vram_gb": telemetry.peak_vram_gb,
            "samplerate": telemetry.sample_rate,
            "target_rate": telemetry.target_rate,
            "headroom_mode": telemetry.headroom_mode,
            "ode_steps": telemetry.ode_steps,
            "solver": telemetry.solver_used,
            "input_sr_anchor": telemetry.input_sr_anchor,
            "peak_dbfs": telemetry.peak_dbfs,
            "true_peak_dbtp": telemetry.true_peak_dbtp,
            "master_gain_scalar": telemetry.master_gain_scalar,
            "crossover_magnitude_step_db": telemetry.crossover_magnitude_step_db,
            "crossover_phase_delta_rad": telemetry.crossover_phase_delta_rad,
            "top_octave_sfm": telemetry.top_octave_sfm,
            "spectral_tilt_slope": telemetry.spectral_tilt_slope,
        }