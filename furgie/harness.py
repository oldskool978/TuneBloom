import os
import sys
import warnings
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

import argparse
import traceback
from typing import Optional, List
import torch
from rich.console import Console
from rich.progress import (
    Progress,
    SpinnerColumn,
    TextColumn,
    BarColumn,
    TaskProgressColumn,
    TimeRemainingColumn,
)

from furgie_core.schema import (
    FurgieRequest,
    FurgieTelemetry,
    SUPPORTED_SOLVERS,
    SUPPORTED_TARGET_RATES,
    SUPPORTED_HEADROOM_MODES,
)
from furgie_core.engine import FurgieEngine

console = Console()


def print_telemetry(resp: FurgieTelemetry) -> None:
    print("\n" + "=" * 84)
    print("                        ACOUSTIC TELEMETRY REPORT")
    print("=" * 84)
    print(f"Input Source File:       {resp.input_path}")
    print(f"Master Destination:      {resp.output_path}")
    if resp.output_44k1_path:
        print(f"Polyphase 44.1k Dest:    {resp.output_44k1_path}")
    print(f"Sampling Resolution:     {resp.sample_rate} Hz (32-bit Float PCM)")
    print(f"Audio Duration:          {resp.duration_seconds:.2f}s ({resp.total_samples:,} samples)")
    print(f"Inference Latency:       {resp.generation_time_seconds:.2f}s (RTF: {resp.real_time_factor:.3f}x)")
    print(f"Peak VRAM Footprint:     {resp.peak_vram_gb:.2f} GB")
    print(f"Flow ODE Integrator:     {resp.solver_used.upper()} ({resp.ode_steps} steps, CFG w={resp.guidance_scale:.2f})")
    print(f"Harmonic Splicing:       {resp.input_sr_anchor // 1000} kHz Anchor (Neural Upper-Band: {resp.input_sr_anchor // 2000} - 24.0 kHz)")
    print(f"Target Delivery Mode:    {resp.target_rate.upper()}")
    print(f"Headroom Strategy:       {resp.headroom_mode.upper()}")
    print(" --- [INPUT SOURCE DYNAMICS] ---")
    print(f"Input Sample Peak:       {resp.input_peak_linear:.6f} ({resp.input_peak_dbfs:.2f} dBFS)")
    print(f"Input True Peak (4x):    {resp.input_true_peak_linear:.6f} ({resp.input_true_peak_dbtp:.2f} dBTP)")
    print(" --- [PRIMARY RESTORATION DYNAMICS] ---")
    print(f"Signal Dynamics (Peak):  {resp.peak_linear:.6f} ({resp.peak_dbfs:.2f} dBFS)")
    print(f"True Peak (4x Sinc):     {resp.true_peak_linear:.6f} ({resp.true_peak_dbtp:.2f} dBTP)")
    print(f"Signal Dynamics (RMS):   {resp.rms_dbfs:.2f} dBFS")
    print(f"Acoustic Crest Factor:   {resp.crest_factor_db:.2f} dB")
    gain_db = 20.0 * torch.log10(torch.tensor(max(resp.master_gain_scalar, 1e-9))).item()
    print(f"Linear Gain Scalar:      {resp.master_gain_scalar:.6f} ({gain_db:.2f} dB)")

    if resp.output_44k1_path and resp.peak_linear_44k1 is not None:
        print(" --- [44.1 kHz POLYPHASE RESTORATION DYNAMICS] ---")
        print(f"Signal Dynamics (Peak):  {resp.peak_linear_44k1:.6f} ({resp.peak_dbfs_44k1:.2f} dBFS)")
        print(f"True Peak (4x Sinc):     {resp.true_peak_linear_44k1:.6f} ({resp.true_peak_dbtp_44k1:.2f} dBTP)")
        print(f"Signal Dynamics (RMS):   {resp.rms_dbfs_44k1:.2f} dBFS")
        print(f"Acoustic Crest Factor:   {resp.crest_factor_db_44k1:.2f} dB")
        gain_db_44 = 20.0 * torch.log10(torch.tensor(max(resp.master_gain_scalar_44k1, 1e-9))).item()
        print(f"Linear Gain Scalar:      {resp.master_gain_scalar_44k1:.6f} ({gain_db_44:.2f} dB)")
    print("=" * 84 + "\n")


def list_workspace_files(workspace_dir: Path) -> List[Path]:
    audio_extensions = {".wav", ".flac", ".mp3", ".ogg", ".m4a", ".aiff", ".alac"}
    files = []
    if not workspace_dir.exists():
        workspace_dir.mkdir(parents=True, exist_ok=True)
        return files
    for item in workspace_dir.rglob("*"):
        if item.is_file() and item.suffix.lower() in audio_extensions:
            parts_lower = [p.lower() for p in item.parts]
            if "output" not in parts_lower and not any(p.startswith(".") for p in item.parts):
                files.append(item)
    return sorted(files, key=lambda x: str(x.relative_to(workspace_dir)))


def display_menu(req: FurgieRequest) -> None:
    headroom_labels = {
        "bypass": "BYPASS (Passband Bit-Exact Unity 1.0x)",
        "peak_resistant": f"PEAK RESISTANCE  (max({req.target_peak_dbfs:.1f} dBTP, TP_in) Ceiling)",
        "strict_ceiling": f"STRICT CEILING ({req.target_peak_dbfs:.1f} dBTP Absolute Cap)",
    }
    target_labels = {
        "48k": "48.0 kHz Master Only",
        "44.1k": "44.1 kHz Master Only (Polyphase Decimated)",
        "both": "Dual Master (48.0 kHz + 44.1 kHz Independent Scalers)",
    }

    print("\n" + "=" * 84)
    print("      FURGIE V2 OPTIMAL TRANSPORT AUDIO SUPER-RESOLUTION HARNESS")
    print("=" * 84)
    print(" --- [I/O & TARGET SAMPLING RESOLUTION] ---")
    print(f" [1]  Input Audio Path:          {req.input_path if req.input_path else '<Select from workspace/ or enter path>'}")
    print(f" [2]  Output WAV Destination:    {req.output_path}")
    print(f" [3]  Target Delivery Mode:      {target_labels.get(req.target_rate, req.target_rate)}")
    print(" --- [STAGE 1: DETERMINISTIC CONTINUOUS FLOW ODE] ---")
    print(f" [4]  Flow ODE Solver:           {req.solver.upper()} ({'2nd-Order Midpoint RK2' if req.solver == 'midpoint' else '1st-Order Euler'})")
    print(f" [5]  Trajectory Steps / CFG:    Steps: {req.ode_steps} | Guidance Scale w: {req.guidance_scale:.2f}")
    print(f" [6]  Conditioning Anchor:       {req.input_sr_anchor // 1000} kHz Anchor (Harmonic Inpainting: {req.input_sr_anchor // 2000} - 24.0 kHz)")
    print(" --- [STAGE 2: ITU-R BS.1770 TRUE-PEAK LOSSLESS GAIN STAGING] ---")
    print(f" [7]  Headroom Strategy:         {headroom_labels.get(req.headroom_mode, req.headroom_mode)}")
    print(" --- [STAGE 3: COMPUTE HARDWARE] ---")
    print(f" [8]  Target Device:             {req.device.upper()}")
    print("-" * 84)
    print(" [L] Load Preset (JSON)   [S] Save Preset (JSON)")
    print(" [G] Generate Audio       [Q] Quit")
    print("=" * 84)


def run_interactive_harness(engine: Optional[FurgieEngine], req: FurgieRequest) -> None:
    workspace_dir = ROOT_DIR / "workspace"
    workspace_dir.mkdir(parents=True, exist_ok=True)

    while True:
        display_menu(req)
        choice = input("Select option to mutate: ").strip().upper()

        if choice == "1":
            files = list_workspace_files(workspace_dir)
            if files:
                print("\nWorkspace Audio Files:")
                for idx, f in enumerate(files, 1):
                    print(f"  [{idx}] {f.relative_to(workspace_dir)}")
                sel = input(f"Select index [1-{len(files)}] or enter manual file path: ").strip().strip('"').strip("'")
                if sel.isdigit() and 1 <= int(sel) <= len(files):
                    req.input_path = str(files[int(sel) - 1].resolve())
                elif sel:
                    p = Path(sel)
                    if p.exists():
                        req.input_path = str(p.resolve())
                    else:
                        print(f"[ERROR] File not found: {sel}")
            else:
                p_in = input("Enter audio file path: ").strip().strip('"').strip("'")
                if p_in:
                    p = Path(p_in)
                    if p.exists():
                        req.input_path = str(p.resolve())
                    else:
                        print(f"[ERROR] File not found: {p_in}")

        elif choice == "2":
            o = input(f"Enter Output WAV Destination [{req.output_path}]: ").strip().strip('"').strip("'")
            if o:
                req.output_path = o

        elif choice == "3":
            cycle = {"48k": "44.1k", "44.1k": "both", "both": "48k"}
            req.target_rate = cycle.get(req.target_rate, "48k")

        elif choice == "4":
            print("\n[1] MIDPOINT (2nd-Order Midpoint RK2)  [2] EULER (1st-Order Forward)")
            s_sel = input(f"Select Solver [{req.solver}]: ").strip()
            if s_sel in ["1", "midpoint"]:
                req.solver = "midpoint"
            elif s_sel in ["2", "euler"]:
                req.solver = "euler"

        elif choice == "5":
            s_val = input(f"Enter ODE Integration Steps [{req.ode_steps}]: ").strip()
            if s_val.isdigit() and int(s_val) >= 1:
                req.ode_steps = int(s_val)
            c_val = input(f"Enter CFG Guidance Scale [{req.guidance_scale:.2f}]: ").strip()
            if c_val:
                req.guidance_scale = float(c_val)

        elif choice == "6":
            print("\n[1] 24 kHz (Standard 12kHz Nyquist Anchor)  [2] 16 kHz  [3] 12 kHz  [4] 8 kHz")
            a_sel = input("Select Pretrained Anchor [1]: ").strip()
            a_map = {"1": 24000, "2": 16000, "3": 12000, "4": 8000}
            req.input_sr_anchor = a_map.get(a_sel, req.input_sr_anchor)

        elif choice == "7":
            print("\n[1] BYPASS (Exact 1.0x Passband Unity Master)")
            print("[2] PEAK RESISTANCE  (Input-Aware Relative Headroom)")
            print("[3] STRICT CEILING (Absolute True-Peak Ceiling)")
            h_sel = input(f"Select Headroom Mode [{req.headroom_mode}]: ").strip()
            if h_sel in ["1", "bypass"]:
                req.headroom_mode = "bypass"
            elif h_sel in ["2", "peak_resistant"]:
                req.headroom_mode = "peak_resistant"
                val = input(f"Enter Target Peak dBTP Floor (Default 0.0) [{req.target_peak_dbfs:.1f}]: ").strip()
                if val:
                    req.target_peak_dbfs = float(val)
            elif h_sel in ["3", "strict_ceiling"]:
                req.headroom_mode = "strict_ceiling"
                val = input(f"Enter Target Peak dBTP Ceiling [-1.0 to 0.0] [{req.target_peak_dbfs:.1f}]: ").strip()
                if val:
                    req.target_peak_dbfs = float(val)

        elif choice == "8":
            req.device = "cpu" if req.device == "cuda" else ("cuda" if torch.cuda.is_available() else "cpu")

        elif choice == "L":
            p_path = input("Enter JSON preset path to load: ").strip().strip('"').strip("'")
            try:
                req = FurgieRequest.load_preset(Path(p_path))
                print(f"Preset loaded successfully from {p_path}")
            except Exception as e:
                print(f"Preset load error: {e}")

        elif choice == "S":
            p_path = input("Enter destination JSON preset path: ").strip().strip('"').strip("'")
            try:
                req.save_preset(Path(p_path))
                print(f"Preset saved successfully to {p_path}")
            except Exception as e:
                print(f"Preset save error: {e}")

        elif choice == "G":
            if not req.input_path or not Path(req.input_path).exists():
                print("\n[bold red][ERROR] Please configure a valid input audio file first (Option [1]).[/bold red]")
                continue

            if engine is None:
                print(f"\nInitializing neural engine on {req.device.upper()}...")
                engine = FurgieEngine(device=req.device, model_repo_id=req.repo_id)

            print(f"\nExecuting Super-Resolution Pass ({Path(req.input_path).name} -> {Path(req.output_path).name})...")
            try:
                with Progress(
                    SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    BarColumn(),
                    TaskProgressColumn(),
                    TimeRemainingColumn(),
                    console=console,
                ) as progress:
                    task = progress.add_task("[cyan]Flow Matching Complex STFT Inpainting...", total=100)

                    def update_progress(current_tile: int, total_tiles: int) -> None:
                        pct = int((current_tile / total_tiles) * 100)
                        progress.update(
                            task,
                            completed=pct,
                            description=f"[cyan]Tile [{current_tile}/{total_tiles}] STFT Inpainting...",
                        )

                    telemetry = engine.synthesize_request(req, tile_progress_callback=update_progress)
                print_telemetry(telemetry)
            except Exception as e:
                print(f"Synthesis failed: {e}", file=sys.stderr)
                traceback.print_exc()

        elif choice == "Q":
            sys.exit(0)


def main() -> None:
    parser = argparse.ArgumentParser(description="Pure Neural Flow-Matching Super-Resolution Harness.")
    parser.add_argument("--batch", action="store_true", help="Run non-interactive generation pass.")
    parser.add_argument("--input", type=str, default=None, help="Input audio file path")
    parser.add_argument("--output", type=str, default=None, help="Output destination path")
    parser.add_argument("--steps", dest="ode_steps", type=int, default=None)
    parser.add_argument("--solver", type=str, choices=SUPPORTED_SOLVERS, default=None)
    parser.add_argument("--cfg", dest="guidance_scale", type=float, default=None)
    parser.add_argument("--anchor", dest="input_sr_anchor", type=int, default=None)
    parser.add_argument(
        "--headroom-mode",
        dest="headroom_mode",
        type=str,
        choices=SUPPORTED_HEADROOM_MODES,
        default="bypass",
        help="Lossless headroom scaling strategy ('bypass', 'peak_resistant', 'strict_ceiling')",
    )
    parser.add_argument("--target-peak", dest="target_peak_dbfs", type=float, default=0.0, help="Target ceiling in dBTP")
    parser.add_argument(
        "--target-rate",
        type=str,
        choices=SUPPORTED_TARGET_RATES,
        default="48k",
        help="Target delivery master rate ('48k', '44.1k', or 'both')",
    )
    parser.add_argument("--load-preset", type=str, default=None)
    parser.add_argument("--save-preset", type=str, default=None)
    parser.add_argument("--device", type=str, default=None)

    args = parser.parse_args()

    req = FurgieRequest.load_preset(Path(args.load_preset)) if args.load_preset else FurgieRequest()

    if args.input is not None:
        req.input_path = str(Path(args.input).resolve())
    if args.output is not None:
        req.output_path = args.output
    if args.ode_steps is not None:
        req.ode_steps = args.ode_steps
    if args.solver is not None:
        req.solver = args.solver
    if args.guidance_scale is not None:
        req.guidance_scale = args.guidance_scale
    if args.input_sr_anchor is not None:
        req.input_sr_anchor = args.input_sr_anchor
    if args.headroom_mode is not None:
        req.headroom_mode = args.headroom_mode
    if args.target_peak_dbfs is not None:
        req.target_peak_dbfs = args.target_peak_dbfs
    if args.target_rate is not None:
        req.target_rate = args.target_rate
    if args.device is not None:
        req.device = args.device

    if args.save_preset:
        req.save_preset(Path(args.save_preset))
        print(f"Preset exported to {args.save_preset}")
        sys.exit(0)

    if not args.batch:
        run_interactive_harness(engine=None, req=req)
    else:
        if not req.input_path:
            print("[ERROR] Input file is required for batch execution (--input).", file=sys.stderr)
            sys.exit(1)
        engine = FurgieEngine(device=req.device, model_repo_id=req.repo_id)
        telemetry = engine.synthesize_request(req)
        print_telemetry(telemetry)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.exit(1)