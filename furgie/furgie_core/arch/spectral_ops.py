from typing import Optional, Tuple, Dict
import torch
import torch.nn.functional as F

_ANALYSIS_WINDOWS: Dict[Tuple[int, str, torch.dtype], torch.Tensor] = {}

def get_hann_window(
    win_length: int,
    device: torch.device,
    dtype: torch.dtype = torch.float32,
) -> torch.Tensor:
    key = (win_length, str(device), dtype)
    if key not in _ANALYSIS_WINDOWS:
        _ANALYSIS_WINDOWS[key] = torch.hann_window(
            win_length, periodic=False, device=device, dtype=dtype
        )
    return _ANALYSIS_WINDOWS[key]

def forward_stft(
    waveform: torch.Tensor,
    n_fft: int = 1024,
    hop_length: int = 512,
    alpha: float = 0.2,
    beta: float = 1.0,
    comp_eps: float = 1.0e-4,
) -> torch.Tensor:
    if waveform.ndim == 1:
        waveform = waveform.unsqueeze(0)
    elif waveform.ndim == 3 and waveform.shape[1] == 1:
        waveform = waveform.squeeze(1)

    window = get_hann_window(n_fft, waveform.device, waveform.dtype)
    spec = torch.stft(
        waveform,
        n_fft=n_fft,
        hop_length=hop_length,
        win_length=n_fft,
        window=window,
        center=True,
        onesided=True,
        return_complex=True,
        pad_mode="reflect",
    )
    if alpha != 1.0:
        mag = torch.clamp(spec.abs(), min=comp_eps)
        spec = (mag ** alpha) * torch.exp(1j * spec.angle())
    spec = spec * beta
    real = torch.view_as_real(spec)
    real = real.permute(0, 3, 1, 2)
    return real[:, :, :-1, :].contiguous()

def inverse_stft(
    spec: torch.Tensor,
    n_fft: int = 1024,
    hop_length: int = 512,
    alpha: float = 0.2,
    beta: float = 1.0,
    orig_length: Optional[int] = None,
    magnitude_ceiling: float = 1.0e2,
) -> torch.Tensor:
    spec_padded = F.pad(spec, [0, 0, 0, 1], value=0.0)
    spec_c = spec_padded.permute(0, 2, 3, 1).contiguous()
    X = torch.view_as_complex(spec_c)
    X = X / beta
    if alpha != 1.0:
        mag = torch.clamp(X.abs(), max=magnitude_ceiling)
        X = (mag ** (1.0 / alpha)) * torch.exp(1j * X.angle())

    window = get_hann_window(n_fft, spec.device, spec.dtype)
    waveform = torch.istft(
        X,
        n_fft=n_fft,
        hop_length=hop_length,
        win_length=n_fft,
        window=window,
        center=True,
        onesided=True,
        return_complex=False,
        length=orig_length,
    )
    return waveform