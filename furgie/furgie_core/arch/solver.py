import math
from typing import Callable
import torch


class FlowMatchingODESolver:
    @staticmethod
    def generate_time_grid(
        num_steps: int,
        scheduler_type: str = "uniform",
        gamma: float = 1.0,
        device: torch.device = torch.device("cpu"),
        dtype: torch.dtype = torch.float32,
    ) -> torch.Tensor:
        s = torch.linspace(0.0, 1.0, num_steps + 1, device=device, dtype=dtype)
        if scheduler_type == "polynomial":
            gamma_val = max(0.1, float(gamma))
            t = 1.0 - torch.pow(1.0 - s, gamma_val)
        elif scheduler_type == "cosine":
            t = 1.0 - torch.cos(s * (math.pi / 2.0))
        else:
            t = s
        t[0] = 0.0
        t[-1] = 1.0
        return t

    @classmethod
    @torch.inference_mode()
    def solve_euler(
        cls,
        model_fn: Callable[[torch.Tensor, torch.Tensor], torch.Tensor],
        x_0: torch.Tensor,
        num_steps: int = 16,
        scheduler_type: str = "uniform",
        gamma: float = 1.0,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        x_t = x_0
        time_grid = cls.generate_time_grid(
            num_steps=num_steps,
            scheduler_type=scheduler_type,
            gamma=gamma,
            device=device,
            dtype=dtype,
        )
        for i in range(num_steps):
            t_curr = time_grid[i]
            t_next = time_grid[i + 1]
            h = t_next - t_curr
            t_tensor = torch.full((b_sz,), float(t_curr.item()), device=device, dtype=dtype)
            v = model_fn(x_t, t_tensor)
            x_t = x_t + h * v
        return x_t

    @classmethod
    @torch.inference_mode()
    def solve_midpoint(
        cls,
        model_fn: Callable[[torch.Tensor, torch.Tensor], torch.Tensor],
        x_0: torch.Tensor,
        num_steps: int = 16,
        scheduler_type: str = "uniform",
        gamma: float = 1.0,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        x_t = x_0
        time_grid = cls.generate_time_grid(
            num_steps=num_steps,
            scheduler_type=scheduler_type,
            gamma=gamma,
            device=device,
            dtype=dtype,
        )
        for i in range(num_steps):
            t_curr = time_grid[i]
            t_next = time_grid[i + 1]
            h = t_next - t_curr
            t_mid = t_curr + 0.5 * h
            t_curr_tensor = torch.full((b_sz,), float(t_curr.item()), device=device, dtype=dtype)
            t_mid_tensor = torch.full((b_sz,), float(t_mid.item()), device=device, dtype=dtype)
            v_curr = model_fn(x_t, t_curr_tensor)
            x_mid = x_t + (0.5 * h) * v_curr
            v_mid = model_fn(x_mid, t_mid_tensor)
            x_t = x_t + h * v_mid
        return x_t

    @classmethod
    @torch.inference_mode()
    def solve_heun(
        cls,
        model_fn: Callable[[torch.Tensor, torch.Tensor], torch.Tensor],
        x_0: torch.Tensor,
        num_steps: int = 16,
        scheduler_type: str = "uniform",
        gamma: float = 1.0,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        x_t = x_0
        time_grid = cls.generate_time_grid(
            num_steps=num_steps,
            scheduler_type=scheduler_type,
            gamma=gamma,
            device=device,
            dtype=dtype,
        )
        for i in range(num_steps):
            t_curr = time_grid[i]
            t_next = time_grid[i + 1]
            h = t_next - t_curr
            t_curr_tensor = torch.full((b_sz,), float(t_curr.item()), device=device, dtype=dtype)
            t_next_tensor = torch.full((b_sz,), float(t_next.item()), device=device, dtype=dtype)
            v_curr = model_fn(x_t, t_curr_tensor)
            x_pred = x_t + h * v_curr
            v_next = model_fn(x_pred, t_next_tensor)
            x_t = x_t + (0.5 * h) * (v_curr + v_next)
        return x_t

    @classmethod
    @torch.inference_mode()
    def solve_rk4(
        cls,
        model_fn: Callable[[torch.Tensor, torch.Tensor], torch.Tensor],
        x_0: torch.Tensor,
        num_steps: int = 16,
        scheduler_type: str = "uniform",
        gamma: float = 1.0,
    ) -> torch.Tensor:
        b_sz = x_0.shape[0]
        device = x_0.device
        dtype = x_0.dtype
        x_t = x_0
        time_grid = cls.generate_time_grid(
            num_steps=num_steps,
            scheduler_type=scheduler_type,
            gamma=gamma,
            device=device,
            dtype=dtype,
        )
        for i in range(num_steps):
            t_curr = time_grid[i]
            t_next = time_grid[i + 1]
            h = t_next - t_curr
            t_mid = t_curr + 0.5 * h
            t_curr_t = torch.full((b_sz,), float(t_curr.item()), device=device, dtype=dtype)
            t_mid_t = torch.full((b_sz,), float(t_mid.item()), device=device, dtype=dtype)
            t_next_t = torch.full((b_sz,), float(t_next.item()), device=device, dtype=dtype)
            k1 = model_fn(x_t, t_curr_t)
            k2 = model_fn(x_t + (0.5 * h) * k1, t_mid_t)
            k3 = model_fn(x_t + (0.5 * h) * k2, t_mid_t)
            k4 = model_fn(x_t + h * k3, t_next_t)
            x_t = x_t + (h / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4)
        return x_t