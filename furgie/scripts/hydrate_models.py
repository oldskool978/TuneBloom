import argparse
import json
import math
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import torch
import torch.nn.functional as F
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from safetensors.torch import load_file as load_safetensors, save_file as save_safetensors

try:
    from huggingface_hub import snapshot_download
except ImportError as e:
    raise ImportError("huggingface_hub is required. Install via: pip install huggingface_hub") from e

console = Console()
PROJECT_ROOT = Path(__file__).parent.parent.resolve()
WEIGHTS_DIR = PROJECT_ROOT / "weights"
MANIFEST_PATH = PROJECT_ROOT / "scripts" / "hydrated_models_manifest.json"

MODEL_REGISTRY = {
    "OLDSKOOL978/universr-audio": {
        "alias": "audio_48k_general",
        "type": "general",
        "description": "Vocoder-Free General Broadband Audio Super-Resolution",
        "local_dir": WEIGHTS_DIR / "universr-audio",
        "required_files": ["model.safetensors", "config.yaml"],
        "is_default": True,
    }
}


class GorillaJackWeightRefinery:
    PI_BY_2 = math.pi / 2.0

    def __init__(self, device: torch.device):
        self.device = device
        self._bayer_cache = None

    def _get_bayer_block(self, shape: Tuple[int, ...]) -> torch.Tensor:
        if self._bayer_cache is None:
            bayer_8x8 = (
                torch.tensor(
                    [
                        [0, 48, 12, 60, 3, 51, 15, 63],
                        [32, 16, 44, 28, 35, 19, 47, 31],
                        [8, 56, 4, 52, 11, 59, 7, 55],
                        [40, 24, 36, 20, 43, 27, 39, 23],
                        [2, 50, 14, 62, 1, 49, 13, 61],
                        [34, 18, 46, 30, 33, 17, 45, 29],
                        [10, 58, 6, 54, 9, 57, 5, 53],
                        [42, 26, 38, 22, 41, 25, 37, 21],
                    ],
                    dtype=torch.float32,
                    device=self.device,
                )
                / 64.0
                - 0.5
            )
            self._bayer_cache = bayer_8x8
        C, num_blocks, block_size = shape
        total_len = C * num_blocks * block_size
        flat = self._bayer_cache.view(-1).repeat((total_len // 64) + 1)[:total_len]
        return flat.reshape(C, num_blocks, block_size)

    @torch.inference_mode()
    def quantize_fp16(self, tensor_fp32: torch.Tensor, block_size: int = 16) -> torch.Tensor:
        orig_shape = tensor_fp32.shape
        orig_device = tensor_fp32.device
        t_work = tensor_fp32.to(self.device).float()
        if t_work.numel() < block_size:
            return t_work.to(torch.float16).to(orig_device)
        if t_work.ndim >= 2:
            C = t_work.shape[0]
            flat_channels = t_work.reshape(C, -1)
        else:
            C = 1
            flat_channels = t_work.reshape(1, -1)

        N_elements = flat_channels.shape[1]
        means = flat_channels.mean(dim=1, keepdim=True)
        t_centered = flat_channels - means

        pad = (block_size - (N_elements % block_size)) % block_size
        if pad > 0:
            t_centered = F.pad(t_centered, (0, pad), mode="constant", value=0.0)

        num_blocks = t_centered.shape[1] // block_size
        t_blocked = t_centered.reshape(C, num_blocks, block_size)
        bayer = self._get_bayer_block((C, num_blocks, block_size))

        error_state = torch.zeros((C, num_blocks), device=self.device, dtype=torch.float32)
        out_blocked = torch.empty_like(t_blocked)

        t_inf = torch.tensor(float("inf"), device=self.device, dtype=torch.float16)
        t_neg_inf = torch.tensor(-float("inf"), device=self.device, dtype=torch.float16)

        for i in range(block_size):
            y = t_blocked[:, :, i]
            z = y + error_state
            z_q = z.to(torch.float16)
            z_near = z_q.float()
            z_low = torch.nextafter(z_q, t_neg_inf).float()
            z_high = torch.nextafter(z_q, t_inf).float()
            is_above = y > z_near
            s_low = torch.where(is_above, z_near, z_low)
            s_high = torch.where(is_above, z_high, z_near)
            step = torch.clamp(s_high - s_low, min=1e-12)
            max_err = step * 0.5
            curr_err = (y - z_near).abs()
            err_ratio = torch.clamp(curr_err / max_err, 0.0, 1.0)
            grace = 0.5 * (err_ratio.pow(2.0) + (1.0 - torch.cos(err_ratio * self.PI_BY_2)))
            nudge = bayer[:, :, i] * max_err * grace
            z_final = z + nudge
            q = torch.clamp(z_final, s_low, s_high).to(torch.float16).float()
            out_blocked[:, :, i] = q
            error_state = torch.clamp(z_final - q, -1.0, 1.0)

        out_flat = out_blocked.reshape(C, -1)[:, :N_elements]
        restored = (out_flat + means).reshape(orig_shape).to(torch.float16)
        return restored.to(orig_device)


def refine_safetensors_fp16(target_dir: Path) -> bool:
    sf_path = target_dir / "model.safetensors"
    if not sf_path.exists():
        return False
    try:
        console.print("   [cyan]Refining weights via Gorilla-Jack Dithered Quantization (FP16)...[/cyan]")
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        refinery = GorillaJackWeightRefinery(device=device)
        sd = load_safetensors(str(sf_path), device="cpu")
        clean_sd = {}
        for k, v in sd.items():
            if isinstance(v, torch.Tensor) and v.is_floating_point():
                clean_sd[k] = refinery.quantize_fp16(v).contiguous()
            else:
                clean_sd[k] = v.contiguous()
        save_safetensors(clean_sd, str(sf_path))
        return True
    except Exception as e:
        console.print(f"   [bold red]Quantization failure: {e}[/bold red]")
        return False


def verify_model_integrity(target_dir: Path, required_files: list) -> bool:
    if not target_dir.exists():
        return False
    for filename in required_files:
        file_path = target_dir / filename
        if not file_path.exists() or file_path.stat().st_size == 0:
            return False
    return True


def hydrate_model(repo_id: str, meta: Dict[str, Any], precision: str = "fp32", force: bool = False) -> Dict[str, Any]:
    target_dir = meta["local_dir"]
    target_dir.mkdir(parents=True, exist_ok=True)
    console.print(f"\nHydrating Target Repository: [cyan]{repo_id}[/cyan]")

    if not force and verify_model_integrity(target_dir, meta["required_files"]):
        console.print("[bold green]Local SafeTensors weights verified intact. Skipping acquisition.[/bold green]")
        return {
            "status": "READY",
            "repo_id": repo_id,
            "alias": meta["alias"],
            "type": meta["type"],
            "precision": precision.lower(),
            "local_path": str(target_dir.relative_to(PROJECT_ROOT)),
            "description": meta["description"],
            "is_default": meta["is_default"],
        }

    try:
        snapshot_download(
            repo_id=repo_id,
            local_dir=target_dir,
            local_dir_use_symlinks=False,
            resume_download=True,
        )
        if precision.lower() in ("fp16", "half"):
            refine_safetensors_fp16(target_dir)

        if verify_model_integrity(target_dir, meta["required_files"]):
            console.print("[bold green]Download and SafeTensors verification complete.[/bold green]")
            return {
                "status": "READY",
                "repo_id": repo_id,
                "alias": meta["alias"],
                "type": meta["type"],
                "precision": precision.lower(),
                "local_path": str(target_dir.relative_to(PROJECT_ROOT)),
                "description": meta["description"],
                "is_default": meta["is_default"],
            }
        console.print("[bold red]Model validation failed post-download.[/bold red]")
        return {"status": "FAILED", "repo_id": repo_id, "error": "Validation failed"}
    except Exception as e:
        console.print(f"[bold red]Hydration failed: {e}[/bold red]")
        return {"status": "ERROR", "repo_id": repo_id, "error": str(e)}


def main() -> None:
    parser = argparse.ArgumentParser(description="Furgie SafeTensors Model Hydrator")
    parser.add_argument(
        "--precision",
        type=str,
        choices=["fp32", "native", "full", "fp16", "half"],
        default=None,
        help="Target serialization precision: 'fp32'/'native' [Default] or 'fp16'/'half' (Gorilla-Jack Refined)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force re-download and verification of model weights",
    )
    args = parser.parse_args()

    panel = Panel(
        "[bold cyan]Furgie Pure SafeTensors Hydrator[/bold cyan]\n"
        "[bold gold1]Native Precision Serialization Engine :: universr-audio[/bold gold1]",
        expand=False,
    )
    console.print(panel)

    precision_choice = args.precision
    if precision_choice is None:
        console.print("\n[bold cyan]Select Model Hydration Precision Target:[/bold cyan]")
        console.print("  [1] [bold yellow]Native FP32 (Full Precision / Bit-Exact Master)[/bold yellow] [bold green][Default][/bold green] - [dim]Maximum fidelity, ~8.5 GB VRAM[/dim]")
        console.print("  [2] [bold green]FP16 (Gorilla-Jack Stateful Dithered Quantization)[/bold green]        - [dim]Fastest inference, ~4.2 GB VRAM[/dim]")
        user_in = console.input("\nChoose target precision [1/2] (1): ").strip()
        precision_choice = "fp16" if user_in == "2" else "fp32"
    elif precision_choice.lower() in ("native", "full"):
        precision_choice = "fp32"
    elif precision_choice.lower() == "half":
        precision_choice = "fp16"

    WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

    manifest_data: Dict[str, Any] = {}
    for repo_id, meta in MODEL_REGISTRY.items():
        result = hydrate_model(repo_id, meta, precision=precision_choice, force=args.force)
        manifest_data[repo_id] = result

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    console.print(f"\nHydration Manifest written to: [yellow]{MANIFEST_PATH}[/yellow]")

    table = Table(title="Model Hydration Status", expand=True)
    table.add_column("Repository ID", style="cyan")
    table.add_column("Type", style="magenta", justify="center")
    table.add_column("Precision", style="yellow", justify="center")
    table.add_column("Status", style="green", justify="center")
    table.add_column("Local Path", style="dim")

    for repo_id, info in manifest_data.items():
        table.add_row(
            repo_id,
            info.get("type", "unknown").upper(),
            info.get("precision", "N/A").upper(),
            info.get("status", "UNKNOWN"),
            info.get("local_path", "N/A"),
        )
    console.print(table)


if __name__ == "__main__":
    main()