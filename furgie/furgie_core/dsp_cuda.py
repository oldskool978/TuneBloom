import math
from typing import Dict, Tuple, Optional
import torch
import torchaudio

_WINDOW_CACHE: Dict[Tuple[int, int, str, torch.dtype], torch.Tensor] = {}
_RESAMPLER_CACHE: Dict[Tuple[int, int, str], torchaudio.transforms.Resample] = {}


def generate_c_infinite_ola_window(
    chunk_len: int,
    overlap_len: int,
    device: Optional[torch.device] = None,
    dtype: torch.dtype = torch.float32,
) -> torch.Tensor:
    dev = device if device is not None else torch.device("cuda" if torch.cuda.is_available() else "cpu")
    dev_str = str(dev)
    cache_key = (chunk_len, overlap_len, dev_str, dtype)
    if cache_key in _WINDOW_CACHE:
        return _WINDOW_CACHE[cache_key]

    window = torch.ones((chunk_len,), dtype=dtype, device=dev)
    if overlap_len > 0:
        theta = torch.linspace(0.0, math.pi / 2.0, overlap_len, device=dev, dtype=dtype)
        fade_in = torch.sin(theta) ** 2
        fade_out = torch.cos(theta) ** 2
        window[:overlap_len] = fade_in
        window[-overlap_len:] = fade_out

    _WINDOW_CACHE[cache_key] = window
    return window


def _get_4x_resampler(device: torch.device, sample_rate: int = 48000) -> torchaudio.transforms.Resample:
    target_sr = sample_rate * 4
    cache_key = (sample_rate, target_sr, str(device))
    if cache_key not in _RESAMPLER_CACHE:
        _RESAMPLER_CACHE[cache_key] = torchaudio.transforms.Resample(
            orig_freq=sample_rate,
            new_freq=target_sr,
            lowpass_filter_width=64,
            resampling_method="sinc_interpolation",
        ).to(device)
    return _RESAMPLER_CACHE[cache_key]


@torch.inference_mode()
def measure_true_peak_linear(waveform: torch.Tensor, sample_rate: int = 48000) -> float:
    if waveform.numel() == 0:
        return 0.0
    x = waveform.to(torch.float32)
    if x.ndim == 1:
        x = x.unsqueeze(0)
    resampler = _get_4x_resampler(x.device, sample_rate=sample_rate)
    x_4x = resampler(x)
    return float(torch.max(torch.abs(x_4x)).item())
