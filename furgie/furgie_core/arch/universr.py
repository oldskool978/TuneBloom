import math
from typing import Dict, List, Optional, Tuple
import torch
import torch.nn as nn
import torch.nn.functional as F

class SinusoidalTimeEmbedding(nn.Module):
    def __init__(self, dim: int = 256, mode: str = "learnable", time_scale: float = 1.0):
        super().__init__()
        assert dim % 2 == 0, "Dimension must be even"
        self.dim = dim
        self.half_dim = dim // 2
        self.mode = mode
        self.time_scale = time_scale
        if self.mode == "learnable":
            self.weights = nn.Parameter(torch.randn(1, self.half_dim))
        else:
            self.register_buffer("weights", torch.empty(0))

    def forward(self, t: torch.Tensor) -> torch.Tensor:
        t = t.view(-1, 1).float()
        device = t.device
        if self.mode == "fixed":
            pos = torch.arange(self.half_dim, device=device, dtype=torch.float32).unsqueeze(0)
            freqs = self.time_scale * t * 10.0 ** (pos * 4.0 / (self.half_dim - 1))
            sin_embed = torch.sin(freqs)
            cos_embed = torch.cos(freqs)
            return torch.cat([sin_embed, cos_embed], dim=-1)
        elif self.mode == "learnable":
            freqs = t * self.weights.float() * (2.0 * math.pi)
            sin_embed = torch.sin(freqs)
            cos_embed = torch.cos(freqs)
            return torch.cat([sin_embed, cos_embed], dim=-1) * math.sqrt(2.0)
        raise ValueError(f"Unsupported mode: {self.mode}")

class GRN(nn.Module):
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.gamma = nn.Parameter(torch.zeros(1, 1, 1, dim))
        self.beta = nn.Parameter(torch.zeros(1, 1, 1, dim))
        self.eps = eps

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        gx = torch.norm(x.float(), p=2, dim=(1, 2), keepdim=True)
        nx = gx / (gx.mean(dim=-1, keepdim=True) + self.eps)
        return self.gamma * (x * nx.to(x.dtype)) + self.beta + x

class LayerNorm(nn.Module):
    def __init__(self, normalized_shape: int, eps: float = 1e-6, data_format: str = "channels_last"):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(normalized_shape))
        self.bias = nn.Parameter(torch.zeros(normalized_shape))
        self.eps = eps
        self.data_format = data_format
        self.normalized_shape = (normalized_shape,)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        if self.data_format == "channels_last":
            return F.layer_norm(x, self.normalized_shape, self.weight, self.bias, self.eps)
        elif self.data_format == "channels_first":
            x_f = x.float()
            u = x_f.mean(1, keepdim=True)
            s = (x_f - u).pow(2).mean(1, keepdim=True)
            x_norm = (x_f - u) / torch.sqrt(s + self.eps)
            return self.weight[:, None, None] * x_norm.to(x.dtype) + self.bias[:, None, None]
        raise NotImplementedError(f"Unsupported data format: {self.data_format}")

class Block(nn.Module):
    def __init__(self, dim: int):
        super().__init__()
        self.dwconv = nn.Conv2d(dim, dim, kernel_size=7, padding=3, groups=dim, padding_mode="reflect")
        self.norm = LayerNorm(dim, eps=1e-6, data_format="channels_last")
        self.pwconv1 = nn.Linear(dim, 4 * dim)
        self.act = nn.GELU()
        self.grn = GRN(4 * dim)
        self.pwconv2 = nn.Linear(4 * dim, dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        res = x
        x = self.dwconv(x)
        x = x.permute(0, 2, 3, 1)
        x = self.norm(x)
        x = self.pwconv1(x)
        x = self.act(x)
        x = self.grn(x)
        x = self.pwconv2(x)
        x = x.permute(0, 3, 1, 2)
        return res + x

class BlockWithEmbedding(nn.Module):
    def __init__(self, dim: int, time_embed_dim: int = 256):
        super().__init__()
        self.block = Block(dim=dim)
        self.time_adapter = nn.Sequential(
            nn.Linear(time_embed_dim, time_embed_dim),
            nn.SiLU(),
            nn.Linear(time_embed_dim, dim),
        )

    def forward(self, x: torch.Tensor, t_embed: torch.Tensor) -> torch.Tensor:
        mod = self.time_adapter(t_embed).unsqueeze(-1).unsqueeze(-1)
        x = x + mod
        return self.block(x)

class EncoderBlock(nn.Module):
    def __init__(self, dim_in: int, dim_out: int, num_blocks: int, time_embed_dim: int = 256):
        super().__init__()
        self.blocks = nn.ModuleList([
            BlockWithEmbedding(dim_in, time_embed_dim=time_embed_dim) for _ in range(num_blocks)
        ])
        self.downsampler = nn.Sequential(
            LayerNorm(dim_in, eps=1e-6, data_format="channels_first"),
            nn.Conv2d(dim_in, dim_out, kernel_size=2, stride=2),
        )

    def forward(self, x: torch.Tensor, t_emb: torch.Tensor) -> torch.Tensor:
        for block in self.blocks:
            x = block(x, t_emb)
        x = self.downsampler(x)
        return x

class Midcoder(nn.Module):
    def __init__(self, dim: int, num_blocks: int, time_embed_dim: int = 256):
        super().__init__()
        self.blocks = nn.ModuleList([
            BlockWithEmbedding(dim, time_embed_dim=time_embed_dim) for _ in range(num_blocks)
        ])

    def forward(self, x: torch.Tensor, t_emb: torch.Tensor) -> torch.Tensor:
        for block in self.blocks:
            x = block(x, t_emb)
        return x

class DecoderBlock(nn.Module):
    def __init__(self, dim_in: int, dim_out: int, num_blocks: int, time_embed_dim: int = 256):
        super().__init__()
        self.upsampler = nn.ConvTranspose2d(dim_in, dim_out, kernel_size=2, stride=2)
        self.blocks = nn.ModuleList([
            BlockWithEmbedding(dim_out, time_embed_dim=time_embed_dim) for _ in range(num_blocks)
        ])

    def forward(self, x: torch.Tensor, t_emb: torch.Tensor) -> torch.Tensor:
        x = self.upsampler(x)
        for block in self.blocks:
            x = block(x, t_emb)
        return x

class ConditioningEncoder2D(nn.Module):
    def __init__(self, cond_dim: int = 384, num_blocks: int = 4):
        super().__init__()
        self.cond_dim = cond_dim
        self.film_generator = nn.Linear(cond_dim, 4)
        self.head = nn.Conv2d(2, cond_dim, kernel_size=1)
        self.sr_adapter = nn.Sequential(
            nn.Linear(cond_dim, cond_dim),
            nn.GELU(),
            nn.Linear(cond_dim, cond_dim * 2),
        )
        self.blocks = nn.Sequential(*[Block(dim=cond_dim) for _ in range(num_blocks)])
        self.freq_pool = nn.AdaptiveAvgPool2d((1, None))

    def forward(self, y_lr: torch.Tensor, f_emb_lr: torch.Tensor, sr_emb: torch.Tensor) -> torch.Tensor:
        film_params = self.film_generator(f_emb_lr)
        gamma, beta = torch.chunk(film_params, chunks=2, dim=-1)
        gamma = gamma.permute(1, 0).unsqueeze(0).unsqueeze(-1)
        beta = beta.permute(1, 0).unsqueeze(0).unsqueeze(-1)
        z = y_lr * gamma + beta
        z = self.head(z)
        sr_film_params = self.sr_adapter(sr_emb)
        sr_gamma, sr_beta = torch.chunk(sr_film_params, 2, dim=-1)
        sr_gamma = sr_gamma.unsqueeze(-1).unsqueeze(-1)
        sr_beta = sr_beta.unsqueeze(-1).unsqueeze(-1)
        z = z * sr_gamma + sr_beta
        z = self.blocks(z)
        z = self.freq_pool(z).squeeze(2)
        return z

class FrequencyPositionalEmbedding(nn.Module):
    def __init__(self, num_bins: int = 512, emb_dim: int = 384):
        super().__init__()
        pe = torch.zeros(num_bins, emb_dim)
        position = torch.arange(num_bins, dtype=torch.float32).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, emb_dim, 2, dtype=torch.float32) * -(math.log(10000.0) / float(emb_dim))
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer("pe", pe)

    def forward(self) -> torch.Tensor:
        return self.pe

class UniverSRBackbone(nn.Module):
    def __init__(
        self,
        in_channels: int = 2,
        out_channels: int = 2,
        dims: List[int] = [96, 192, 384, 768],
        depths: List[int] = [2, 2, 4, 2],
        time_dim: int = 256,
        cond_dim: int = 384,
        total_freq_bins: int = 512,
        hr_freq_bins: int = 432,
        feature_enc_layers: int = 4,
        sr_to_lr_bins: Optional[Dict[int, int]] = None,
        **kwargs,
    ):
        super().__init__()
        self.dims = dims
        self.depths = depths
        self.strides = 2 ** len(dims)
        self.total_freq_bins = total_freq_bins
        self.hr_freq_bins = hr_freq_bins
        self.cond_dim = cond_dim
        self.sr_to_lr_bins = sr_to_lr_bins or {8: 80, 12: 128, 16: 170, 24: 256}
        self.sr_values_list = sorted(list(self.sr_to_lr_bins.keys()))
        self.sr_to_idx = {sr: i for i, sr in enumerate(self.sr_values_list)}
        self.time_embedder = SinusoidalTimeEmbedding(dim=time_dim, mode="learnable")
        self.sr_embedder = nn.Embedding(len(self.sr_values_list), cond_dim)
        self.sr_projector = nn.Linear(cond_dim, time_dim)
        self.uncond_emb = nn.Parameter(torch.randn(cond_dim))
        self.freq_pos_enc = FrequencyPositionalEmbedding(num_bins=total_freq_bins, emb_dim=cond_dim)
        self.film_generator = nn.Linear(cond_dim, cond_dim * 2)
        self.conditioning_encoder = ConditioningEncoder2D(
            cond_dim=cond_dim,
            num_blocks=feature_enc_layers,
        )
        self.init_conv = nn.Sequential(
            nn.Conv2d(in_channels + cond_dim, dims[0], kernel_size=1),
            LayerNorm(dims[0], eps=1e-6, data_format="channels_first"),
        )
        self.encoders = nn.ModuleList()
        for i in range(len(depths)):
            dim_in = dims[i]
            dim_out = dims[i + 1] if i + 1 < len(dims) else dims[i]
            self.encoders.append(
                EncoderBlock(dim_in=dim_in, dim_out=dim_out, num_blocks=depths[i], time_embed_dim=time_dim)
            )
        self.midcoder = Midcoder(dim=dims[-1], num_blocks=depths[-1], time_embed_dim=time_dim)
        self.decoders = nn.ModuleList()
        for i in reversed(range(len(depths))):
            dim_in = dims[i + 1] if i + 1 < len(dims) else dims[i]
            dim_out = dims[i]
            self.decoders.append(
                DecoderBlock(dim_in=dim_in, dim_out=dim_out, num_blocks=depths[i], time_embed_dim=time_dim)
            )
        self.final_conv = nn.Conv2d(dims[0], out_channels, kernel_size=1)

    def _pad_frames(self, x: torch.Tensor) -> Tuple[torch.Tensor, int]:
        num_frames = x.shape[-1]
        pad_len = (self.strides - (num_frames % self.strides)) % self.strides
        if pad_len > 0:
            x = F.pad(x, [0, pad_len, 0, 0], mode="reflect")
        return x, pad_len

    def precompute_spatial_conditioning(
        self,
        y_lr: Optional[torch.Tensor],
        sr_khz: int,
        batch_size: int = 1,
        time_steps: int = 1,
        is_unconditional: bool = False,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        device = y_lr.device if y_lr is not None else self.uncond_emb.device
        dtype = y_lr.dtype if y_lr is not None else self.uncond_emb.dtype
        pe_full = self.freq_pos_enc().to(device=device, dtype=dtype)
        hf_start_bin = self.total_freq_bins - self.hr_freq_bins
        pe_high = pe_full[hf_start_bin:, :]
        sr_idx = self.sr_to_idx[sr_khz]
        sr_idx_t = torch.tensor([sr_idx], device=device, dtype=torch.long)
        sr_emb = self.sr_embedder(sr_idx_t)
        sr_proj = self.sr_projector(sr_emb)
        if is_unconditional or (y_lr is None):
            y_cond = self.uncond_emb.to(device=device, dtype=dtype).reshape(1, self.cond_dim, 1).expand(
                batch_size, self.cond_dim, time_steps
            )
        else:
            lr_bin_count = self.sr_to_lr_bins[sr_khz]
            pe_low = pe_full[:lr_bin_count, :]
            sr_emb_expanded = sr_emb.expand(batch_size, -1)
            y_cond = self.conditioning_encoder(y_lr, pe_low, sr_emb_expanded)
        y_cond = y_cond.unsqueeze(2)
        film_params = self.film_generator(pe_high)
        gamma_high, beta_high = torch.chunk(film_params, chunks=2, dim=-1)
        gamma_high = gamma_high.permute(1, 0).unsqueeze(0).unsqueeze(-1)
        beta_high = beta_high.permute(1, 0).unsqueeze(0).unsqueeze(-1)
        spatial_cond = y_cond * gamma_high + beta_high
        return sr_proj, spatial_cond

    def forward_with_precomputed_cond(
        self,
        x: torch.Tensor,
        t: torch.Tensor,
        sr_proj: torch.Tensor,
        spatial_cond: torch.Tensor,
    ) -> torch.Tensor:
        x_padded, pad_len = self._pad_frames(x)
        if pad_len > 0 and spatial_cond.shape[-1] != x_padded.shape[-1]:
            spatial_cond = F.pad(spatial_cond, [0, pad_len, 0, 0], mode="reflect")
        t_embed = self.time_embedder(t) + sr_proj
        h = torch.cat([x_padded, spatial_cond], dim=1)
        h = self.init_conv(h)
        skip_connections = [h]
        for encoder in self.encoders:
            h = encoder(h, t_embed)
            skip_connections.append(h)
        h = self.midcoder(h, t_embed)
        for decoder in self.decoders:
            skip = skip_connections.pop()
            if h.shape != skip.shape:
                h = F.interpolate(h, size=skip.shape[2:], mode="nearest")
            h = h + skip
            h = decoder(h, t_embed)
        skip = skip_connections.pop()
        h = h + skip
        h = self.final_conv(h)
        if pad_len > 0:
            h = h[..., :-pad_len]
        return h