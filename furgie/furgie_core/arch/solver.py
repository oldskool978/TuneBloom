from typing import Callable
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