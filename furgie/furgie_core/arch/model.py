from pathlib import Path
from typing import Dict, Any, Tuple, Optional
import math
import torch
import torch.nn as nn
from safetensors.torch import load_file as load_safetensors

from furgie_core.arch.universr import UniverSRBackbone
from furgie_core.arch.solver import FlowMatchingODESolver
from furgie_core.arch.spectral_ops import forward_stft, inverse_stft


class UniverSRModel(nn.Module):
    def __init__(self, config: Dict[str, Any]):
        super().__init__()
        self.config = config
        audio_cfg = config.get("audio", config.get("transform", {}))
        self.target_sr = audio_cfg.get("target_sample_rate", audio_cfg.get("sampling_rate", 48000))
        self.n_fft = audio_cfg.get("n_fft", 1024)
        self.hop_length = audio_cfg.get("hop_length", 512)
        self.alpha = audio_cfg.get("power_alpha", audio_cfg.get("alpha", 0.2))
        self.beta = audio_cfg.get("beta", 1.0)
        self.comp_eps = audio_cfg.get("comp_eps", 1.0e-4)
        model_cfg = config.get("model", {})
        arch_kwargs = {
            "dims": model_cfg.get("dims", [96, 192, 384, 768]),
            "depths": model_cfg.get("depths", [2, 2, 4, 2]),
            "time_dim": model_cfg.get("time_dim", 256),
            "cond_dim": model_cfg.get("cond_dim", 384),
            "total_freq_bins": model_cfg.get("total_freq_bins", 512),
            "hr_freq_bins": model_cfg.get("hr_freq_bins", 432),
            "feature_enc_layers": model_cfg.get("feature_enc_layers", 4),
            "sr_to_lr_bins": model_cfg.get("sr_to_lr_bins", {8: 80, 12: 128, 16: 170, 24: 256}),
        }
        self.backbone = UniverSRBackbone(**arch_kwargs)
        self.sr_to_lr_bins = arch_kwargs["sr_to_lr_bins"]
        self.hr_freq_bins = arch_kwargs["hr_freq_bins"]
        self.total_freq_bins = arch_kwargs["total_freq_bins"]
        self.model_dtype = torch.float32

    def load_safetensors_weights(self, safetensors_path: Path, device: torch.device) -> None:
        state_dict = load_safetensors(str(safetensors_path), device="cpu")
        clean_sd = {}
        target_dtype = torch.float32
        for k, v in state_dict.items():
            k_clean = k
            for prefix in ["unet.", "model.", "net.", "generator."]:
                if k_clean.startswith(prefix):
                    k_clean = k_clean[len(prefix):]
            clean_sd[k_clean] = v
            if v.is_floating_point():
                target_dtype = v.dtype
        self.model_dtype = target_dtype
        self.backbone.to(dtype=self.model_dtype)
        self.backbone.load_state_dict(clean_sd, strict=True)
        self.backbone.to(device=device, dtype=self.model_dtype)
        self.backbone.eval()

    def _map_sr_to_index(self, sr_val: int) -> Tuple[int, int]:
        sr_khz = sr_val // 1000 if sr_val > 1000 else sr_val
        valid_map = {8: 80, 12: 128, 16: 170, 24: 256}
        if sr_khz in valid_map:
            return sr_khz, valid_map[sr_khz]
        closest_sr = min(valid_map.keys(), key=lambda s: abs(s - sr_khz))
        return closest_sr, valid_map[closest_sr]

    @torch.inference_mode()
    def enhance(
        self,
        waveform: torch.Tensor,
        input_sr: int = 24000,
        ode_method: str = "midpoint",
        ode_steps: int = 16,
        guidance_scale: float = 0.0,
        scheduler_type: str = "uniform",
        time_warp_gamma: float = 1.0,
        noise_prior: Optional[torch.Tensor] = None,
        seed: Optional[int] = 42,
        cross_band_gain_match: bool = True,
        crossover_blend_bins: int = 0,
    ) -> torch.Tensor:
        orig_device = waveform.device
        orig_len = waveform.shape[-1]
        if waveform.ndim == 1:
            wav_tensor = waveform.unsqueeze(0)
        elif waveform.ndim == 3 and waveform.shape[1] == 1:
            wav_tensor = waveform.squeeze(1)
        else:
            wav_tensor = waveform
        b_sz = wav_tensor.shape[0]

        Y = forward_stft(
            waveform=wav_tensor,
            n_fft=self.n_fft,
            hop_length=self.hop_length,
            alpha=self.alpha,
            beta=self.beta,
            comp_eps=self.comp_eps,
        )
        sr_khz, lr_bin_count = self._map_sr_to_index(input_sr)
        hf_start_bin = self.total_freq_bins - self.hr_freq_bins
        t_frames = Y.shape[-1]
        Y_lr = Y[:, :, :lr_bin_count, :].to(dtype=self.model_dtype)
        Y_hr = Y[:, :, hf_start_bin:, :]

        if noise_prior is not None:
            x_0 = noise_prior.to(device=orig_device, dtype=self.model_dtype)
        else:
            generator = None
            if seed is not None:
                generator = torch.Generator(device=orig_device)
                generator.manual_seed(int(seed))
            x_0 = torch.randn(Y_hr.shape, generator=generator, device=orig_device, dtype=self.model_dtype)

        w = float(guidance_scale)

        sr_proj_c, spatial_cond_c = self.backbone.precompute_spatial_conditioning(
            y_lr=Y_lr, sr_khz=sr_khz, batch_size=b_sz, time_steps=t_frames, is_unconditional=False
        )
        if w > 1.0:
            sr_proj_u, spatial_cond_u = self.backbone.precompute_spatial_conditioning(
                y_lr=None, sr_khz=sr_khz, batch_size=b_sz, time_steps=t_frames, is_unconditional=True
            )
            sr_proj_dual = sr_proj_c
            spatial_cond_dual = torch.cat([spatial_cond_c, spatial_cond_u], dim=0)
        else:
            sr_proj_dual = sr_proj_c
            spatial_cond_dual = spatial_cond_c

        def guided_velocity_field(x_current: torch.Tensor, t_current: torch.Tensor) -> torch.Tensor:
            x_in = x_current.to(dtype=self.model_dtype)
            t_in = t_current.to(dtype=self.model_dtype)
            if w > 1.0:
                x_in_dual = torch.cat([x_in, x_in], dim=0)
                t_in_dual = torch.cat([t_in, t_in], dim=0)
                v_both = self.backbone.forward_with_precomputed_cond(
                    x=x_in_dual,
                    t=t_in_dual,
                    sr_proj=sr_proj_dual,
                    spatial_cond=spatial_cond_dual,
                )
                v_cond, v_uncond = v_both.chunk(2, dim=0)
                v = v_uncond + w * (v_cond - v_uncond)
            else:
                v = self.backbone.forward_with_precomputed_cond(
                    x=x_in,
                    t=t_in,
                    sr_proj=sr_proj_dual,
                    spatial_cond=spatial_cond_dual,
                )
            return v.float()

        method = ode_method.lower()
        if method == "euler":
            x_1 = FlowMatchingODESolver.solve_euler(
                model_fn=guided_velocity_field,
                x_0=x_0,
                num_steps=ode_steps,
                scheduler_type=scheduler_type,
                gamma=time_warp_gamma,
            )
        elif method == "rk4":
            x_1 = FlowMatchingODESolver.solve_rk4(
                model_fn=guided_velocity_field,
                x_0=x_0,
                num_steps=ode_steps,
                scheduler_type=scheduler_type,
                gamma=time_warp_gamma,
            )
        elif method == "heun":
            x_1 = FlowMatchingODESolver.solve_heun(
                model_fn=guided_velocity_field,
                x_0=x_0,
                num_steps=ode_steps,
                scheduler_type=scheduler_type,
                gamma=time_warp_gamma,
            )
        else:
            x_1 = FlowMatchingODESolver.solve_midpoint(
                model_fn=guided_velocity_field,
                x_0=x_0,
                num_steps=ode_steps,
                scheduler_type=scheduler_type,
                gamma=time_warp_gamma,
            )

        overlap_start_lr = hf_start_bin
        overlap_end_lr = lr_bin_count
        overlap_len = overlap_end_lr - overlap_start_lr

        if cross_band_gain_match and overlap_len > 0:
            lr_overlap = Y_lr[:, :, overlap_start_lr:overlap_end_lr, :].float()
            gen_overlap = x_1[:, :, :overlap_len, :].float()
            p_decomp = 1.0 / self.alpha
            mag_lr_lin = torch.pow(torch.clamp(torch.sqrt(lr_overlap[:, 0]**2 + lr_overlap[:, 1]**2), min=1e-8), p_decomp)
            mag_gen_lin = torch.pow(torch.clamp(torch.sqrt(gen_overlap[:, 0]**2 + gen_overlap[:, 1]**2), min=1e-8), p_decomp)
            energy_lr = torch.mean(mag_lr_lin**2, dim=(-2, -1), keepdim=True)
            energy_gen = torch.mean(mag_gen_lin**2, dim=(-2, -1), keepdim=True)
            gain_lin = torch.sqrt((energy_lr + 1e-12) / (energy_gen + 1e-12))
            gain_lin = torch.clamp(gain_lin, min=0.35, max=2.85)
            gain_latent = torch.pow(gain_lin, self.alpha).unsqueeze(1)
            x_1 = x_1 * gain_latent

        splice_idx = lr_bin_count
        slice_start = max(0, lr_bin_count - hf_start_bin)
        x_1_hf = x_1[:, :, slice_start:, :].float().clone()

        m_blend = max(0, int(crossover_blend_bins))
        if m_blend > 0 and m_blend < x_1_hf.shape[2]:
            edge_r = Y_lr[:, 0, splice_idx - 1, :].float()
            edge_i = Y_lr[:, 1, splice_idx - 1, :].float()
            edge_mag = torch.sqrt(edge_r**2 + edge_i**2 + 1e-12)

            for i in range(m_blend):
                u = float(i + 1) / float(m_blend + 1)
                w_gen = math.sin(u * (math.pi / 2.0)) ** 2
                w_edge = 1.0 - w_gen

                gen_r = x_1_hf[:, 0, i, :]
                gen_i = x_1_hf[:, 1, i, :]
                gen_mag = torch.sqrt(gen_r**2 + gen_i**2 + 1e-12)
                gen_phase = torch.atan2(gen_i, gen_r)

                tapered_mag = w_edge * edge_mag + w_gen * gen_mag
                x_1_hf[:, 0, i, :] = tapered_mag * torch.cos(gen_phase)
                x_1_hf[:, 1, i, :] = tapered_mag * torch.sin(gen_phase)

        full_spec = torch.cat([Y_lr.float(), x_1_hf], dim=2)

        return inverse_stft(
            spec=full_spec,
            n_fft=self.n_fft,
            hop_length=self.hop_length,
            alpha=self.alpha,
            beta=self.beta,
            orig_length=orig_len,
        )