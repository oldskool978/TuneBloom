from typing import Callable, Optional, Tuple, Union
import torch

class FlowMatchingODESolver:
    @staticmethod
    @torch.inference_mode()
    def solve_heun(
        model_fn: Callable[[torch.Tensor, torch.Tensor], torch.Tensor],
        x_0: torch.Tensor,
        num_steps: int = 16,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        x_t = x_0
        dt = 1.0 / float(num_steps)
        for step in range(num_steps):
            t_curr = float(step) * dt
            t_next = float(step + 1) * dt
            t_curr_tensor = torch.full((b_sz,), t_curr, device=device, dtype=dtype)
            t_next_tensor = torch.full((b_sz,), t_next, device=device, dtype=dtype)
            v_curr = model_fn(x_t, t_curr_tensor)
            x_pred = x_t + dt * v_curr
            v_next = model_fn(x_pred, t_next_tensor)
            x_t = x_t + (0.5 * dt) * (v_curr + v_next)
        return x_t

    @staticmethod
    @torch.inference_mode()
    def solve_midpoint(
        model_fn: Callable[[torch.Tensor, torch.Tensor], torch.Tensor],
        x_0: torch.Tensor,
        num_steps: int = 16,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        x_t = x_0
        dt = 1.0 / float(num_steps)
        for step in range(num_steps):
            t_curr = float(step) * dt
            t_mid = t_curr + 0.5 * dt
            t_tensor = torch.full((b_sz,), t_curr, device=device, dtype=dtype)
            t_mid_tensor = torch.full((b_sz,), t_mid, device=device, dtype=dtype)
            v_curr = model_fn(x_t, t_tensor)
            x_mid = x_t + (0.5 * dt) * v_curr
            v_mid = model_fn(x_mid, t_mid_tensor)
            x_t = x_t + dt * v_mid
        return x_t

    @staticmethod
    @torch.inference_mode()
    def solve_euler(
        model_fn: Callable[[torch.Tensor, torch.Tensor], torch.Tensor],
        x_0: torch.Tensor,
        num_steps: int = 16,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        x_t = x_0
        dt = 1.0 / float(num_steps)
        for step in range(num_steps):
            t_curr = float(step) * dt
            t_tensor = torch.full((b_sz,), t_curr, device=device, dtype=dtype)
            v_curr = model_fn(x_t, t_tensor)
            x_t = x_t + dt * v_curr
        return x_t

    @staticmethod
    @torch.inference_mode()
    def solve_res_multistep(
        model_fn: Callable[[torch.Tensor, torch.Tensor], Union[torch.Tensor, Tuple[torch.Tensor, Optional[torch.Tensor]]]],
        x_0: torch.Tensor,
        num_steps: int = 16,
        cfg_pp: bool = False,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        dt = 1.0 / float(num_steps)

        if num_steps <= 1:
            t_0_tensor = torch.full((b_sz,), 0.0, device=device, dtype=dtype)
            out_0 = model_fn(x_0, t_0_tensor)
            v_0 = out_0[0] if isinstance(out_0, tuple) else out_0
            return x_0 + dt * v_0

        t_0_tensor = torch.full((b_sz,), 0.0, device=device, dtype=dtype)
        out_0 = model_fn(x_0, t_0_tensor)
        if isinstance(out_0, tuple):
            v0_cfg, v0_uncond = out_0
            if v0_uncond is None:
                v0_uncond = v0_cfg
        else:
            v0_cfg = out_0
            v0_uncond = out_0

        t_1 = dt
        t_1_tensor = torch.full((b_sz,), t_1, device=device, dtype=dtype)
        x_pred_1 = x_0 + dt * v0_cfg
        out_1 = model_fn(x_pred_1, t_1_tensor)
        if isinstance(out_1, tuple):
            v1_cfg, v1_uncond = out_1
            if v1_uncond is None:
                v1_uncond = v1_cfg
        else:
            v1_cfg = out_1
            v1_uncond = out_1

        if cfg_pp and (v0_uncond is not v0_cfg):
            x_curr = x_0 + dt * v0_cfg + (0.5 * dt) * (v1_uncond - v0_uncond)
        else:
            x_curr = x_0 + (0.5 * dt) * (v0_cfg + v1_cfg)

        v_prev_cfg = v0_cfg
        v_prev_uncond = v0_uncond
        v_curr_cfg = v1_cfg
        v_curr_uncond = v1_uncond

        for step in range(1, num_steps - 1):
            t_curr = float(step) * dt
            t_next = float(step + 1) * dt
            h = t_next - t_curr

            if cfg_pp and (v_curr_uncond is not v_curr_cfg):
                x_next = x_curr + h * v_curr_cfg + (0.5 * h) * (v_curr_uncond - v_prev_uncond)
            else:
                x_next = x_curr + h * (1.5 * v_curr_cfg - 0.5 * v_prev_cfg)

            t_next_tensor = torch.full((b_sz,), t_next, device=device, dtype=dtype)
            out_next = model_fn(x_next, t_next_tensor)
            if isinstance(out_next, tuple):
                vn_cfg, vn_uncond = out_next
                if vn_uncond is None:
                    vn_uncond = vn_cfg
            else:
                vn_cfg = out_next
                vn_uncond = out_next

            x_curr = x_next
            v_prev_cfg = v_curr_cfg
            v_prev_uncond = v_curr_uncond
            v_curr_cfg = vn_cfg
            v_curr_uncond = vn_uncond

        h_term = 1.0 - float(num_steps - 1) * dt
        t_term_tensor = torch.full((b_sz,), 1.0, device=device, dtype=dtype)

        if cfg_pp and (v_curr_uncond is not v_curr_cfg):
            x_pred_term = x_curr + h_term * v_curr_cfg + (0.5 * h_term) * (v_curr_uncond - v_prev_uncond)
        else:
            x_pred_term = x_curr + h_term * (1.5 * v_curr_cfg - 0.5 * v_prev_cfg)

        out_term = model_fn(x_pred_term, t_term_tensor)
        if isinstance(out_term, tuple):
            v_term_cfg, v_term_uncond = out_term
            if v_term_uncond is None:
                v_term_uncond = v_term_cfg
        else:
            v_term_cfg = out_term
            v_term_uncond = out_term

        if cfg_pp and (v_curr_uncond is not v_curr_cfg):
            x_final = x_curr + h_term * v_curr_cfg + (0.5 * h_term) * (v_term_uncond - v_curr_uncond)
        else:
            x_final = x_curr + (0.5 * h_term) * (v_curr_cfg + v_term_cfg)

        return x_final