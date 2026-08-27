import yaml
import torch
import torch.nn as nn
import torch.nn.functional as F
import soundfile as sf
import numpy as np
from pathlib import Path
from typing import Optional, Union, Callable

from furgie_core.dsp_cuda import generate_c_infinite_ola_window
from furgie_core.arch.model import UniverSRModel

VALID_UNIVERSR_SRS = [8000, 12000, 16000, 24000]


class UniverSRWrapper(nn.Module):
    def __init__(self, config_path: Path, weight_dir: Path):
        super().__init__()
        with open(config_path, "r", encoding="utf-8") as f:
            self.cfg = yaml.safe_load(f)
        audio_cfg = self.cfg.get("audio", {})
        flow_cfg = self.cfg.get("universr_flow_core", {})
        self.target_sr = audio_cfg.get("target_sample_rate", 48000)
        self.ode_steps = flow_cfg.get("ode_steps", 16)
        self.solver = flow_cfg.get("solver", "heun")
        self.guidance_scale = flow_cfg.get("guidance_scale", 0.0)
        self.weight_dir = Path(weight_dir)
        self.model: Optional[UniverSRModel] = None
        self._is_loaded = False
        self.device = torch.device("cpu")

    def load_weights(self, device: torch.device, model_repo_id: str = "OLDSKOOL978/universr-audio") -> None:
        self.device = device
        sf_path = self.weight_dir / "model.safetensors"
        cfg_path = self.weight_dir / "config.yaml"
        if cfg_path.exists():
            with open(cfg_path, "r", encoding="utf-8") as f:
                arch_cfg = yaml.safe_load(f)
        else:
            arch_cfg = self.cfg
        self.model = UniverSRModel(config=arch_cfg)
        if sf_path.exists():
            self.model.load_safetensors_weights(sf_path, device=device)
        self._is_loaded = True

    def _load_audio_tensor(self, audio_input: Union[str, Path, torch.Tensor, np.ndarray]) -> torch.Tensor:
        if isinstance(audio_input, (str, Path)):
            data, _ = sf.read(str(audio_input), dtype="float32")
            wav = torch.from_numpy(data.T if data.ndim > 1 else data)
            if wav.ndim == 1:
                wav = wav.unsqueeze(0)
            return wav.to(device=self.device, dtype=torch.float32)
        elif isinstance(audio_input, torch.Tensor):
            wav = audio_input.to(device=self.device, dtype=torch.float32)
            if wav.ndim == 1:
                wav = wav.unsqueeze(0)
            return wav
        elif isinstance(audio_input, np.ndarray):
            wav = torch.from_numpy(audio_input.T if audio_input.ndim > 1 else audio_input)
            if wav.ndim == 1:
                wav = wav.unsqueeze(0)
            return wav
        raise TypeError(f"Unsupported audio input type: {type(audio_input)}")

    @torch.inference_mode()
    def _enhance_tiled(
        self,
        wav_tensor: torch.Tensor,
        input_sr: int,
        steps: int,
        solve_method: str,
        cfg_scale: float,
        progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> torch.Tensor:
        channels, total_samples = wav_tensor.shape
        pad_len = min(int(0.200 * self.target_sr), max(0, total_samples - 1))
        chunk_len = 261120
        overlap_len = 30720
        stride_len = chunk_len - overlap_len
        if pad_len > 0:
            wav_padded = F.pad(wav_tensor.unsqueeze(0), (pad_len, pad_len), mode="reflect").squeeze(0)
        else:
            wav_padded = wav_tensor
        padded_samples = wav_padded.shape[-1]
        if padded_samples < chunk_len:
            extra_pad = chunk_len - padded_samples
            wav_padded = F.pad(wav_padded, (0, extra_pad), mode="constant", value=0.0)
            padded_samples = chunk_len
        starts = list(range(0, padded_samples - chunk_len + 1, stride_len))
        if not starts or starts[-1] + chunk_len < padded_samples:
            starts.append(padded_samples - chunk_len)
        total_tiles = len(starts)
        output_acc = torch.zeros((channels, padded_samples), dtype=torch.float32, device=self.device)
        weight_acc = torch.zeros((1, padded_samples), dtype=torch.float32, device=self.device)
        window = generate_c_infinite_ola_window(
            chunk_len=chunk_len, overlap_len=overlap_len, device=self.device
        )
        win_expanded = window.unsqueeze(0)

        for tile_idx, start in enumerate(starts):
            end = start + chunk_len
            chunk_in = wav_padded[:, start:end]
            res_tensor = self.model.enhance(
                waveform=chunk_in,
                input_sr=input_sr,
                ode_method=solve_method,
                ode_steps=steps,
                guidance_scale=cfg_scale,
            )
            if res_tensor.shape[-1] != chunk_len:
                res_tensor = F.interpolate(
                    res_tensor.unsqueeze(0), size=chunk_len, mode="linear", align_corners=False
                ).squeeze(0)
            output_acc[:, start:end] += res_tensor * win_expanded
            weight_acc[:, start:end] += win_expanded
            if progress_callback:
                progress_callback(tile_idx + 1, total_tiles)

        weight_acc = torch.clamp(weight_acc, min=1e-6)
        final_padded = output_acc / weight_acc
        return final_padded[:, pad_len : pad_len + total_samples]

    @torch.inference_mode()
    def forward(
        self,
        audio_input: Union[str, Path, torch.Tensor, np.ndarray],
        input_sr: int = 24000,
        ode_steps: Optional[int] = None,
        solver: Optional[str] = None,
        guidance_scale: Optional[float] = None,
        tile_progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> torch.Tensor:
        if not self._is_loaded or self.model is None:
            raise RuntimeError("UniverSRWrapper weights are not loaded. Call load_weights() first.")
        audio_tensor = self._load_audio_tensor(audio_input)
        mapped_input_sr = min(VALID_UNIVERSR_SRS, key=lambda s: abs(s - input_sr))
        steps = ode_steps if ode_steps is not None else self.ode_steps
        solve_method = solver if solver is not None else self.solver
        cfg_scale = guidance_scale if guidance_scale is not None else self.guidance_scale
        return self._enhance_tiled(
            wav_tensor=audio_tensor,
            input_sr=mapped_input_sr,
            steps=steps,
            solve_method=solve_method,
            cfg_scale=cfg_scale,
            progress_callback=tile_progress_callback,
        )