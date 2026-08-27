import os
import sys
import json
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
    SUPPORTED_SCHEDULERS,
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
    print(f"Time-Grid Warping:       {resp.scheduler_type.upper()} (gamma={resp.time_warp_gamma:.2f})")
    print(f"Spectral Normalization:  Gain Matching={'ON' if resp.cross_band_gain_match else 'OFF'} | Blend Width={resp.crossover_blend_bins} bins")
    print(f"Harmonic Splicing:       {resp.input_sr_anchor // 1000} kHz Anchor (Neural Upper-Band: {resp.input_sr_anchor // 2000} - 24.0 kHz)")
    print(f"Target Delivery Mode:    {resp.target_rate.upper()}")
    print(f"Headroom Strategy:       {resp.headroom_mode.upper()}")
    print(" --- [SPECTRAL INTEGRATION DIAGNOSTICS] ---")
    print(f"Crossover Step Disc.:    {resp.crossover_magnitude_step_db:6.3f} dB  (Ideal: < 1.0 dB)")
    print(f"Boundary Phase Curv.:    {resp.crossover_phase_delta_rad:6.4f} rad (Ideal: < 0.25 rad)")
    print(f"Top-Octave Flatness SFM: {resp.top_octave_sfm:6.4f}     (Natural Acoustic Decay: 0.05 - 0.40)")
    print(f"Spectral Tilt Slope:     {resp.spectral_tilt_slope:6.3f} dB/oct")
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
    print(" --- [STAGE 1: ADVANCED ODE TRAJECTORY & PRECISION CONTROL] ---")
    print(f" [4]  Flow ODE Solver:           {req.solver.upper()}")
    print(f" [5]  Trajectory Steps / CFG:    Steps: {req.ode_steps} | Guidance Scale w: {req.guidance_scale:.2f}")
    print(f" [6]  Time-Grid Warping (gamma): {req.scheduler_type.upper()} (gamma={req.time_warp_gamma:.2f})")
    print(f" [7]  Deterministic Seed:        {req.seed if req.seed is not None else 'RANDOM'}")
    print(" --- [STAGE 2: MANIFOLD CROSSOVER NORMALIZATION] ---")
    print(f" [8]  Cross-Band Gain Matching:  {'ENABLED' if req.cross_band_gain_match else 'DISABLED (Raw Overlap)'}")
    print(f" [9]  One-Sided Crossover Blend: {req.crossover_blend_bins} Bins (Tapered in Upper Band Only)")
    print(f" [10] Conditioning Anchor:       {req.input_sr_anchor // 1000} kHz Anchor")
    print(" --- [STAGE 3: ITU-R BS.1770 TRUE-PEAK LOSSLESS GAIN STAGING] ---")
    print(f" [11] Headroom Strategy:         {headroom_labels.get(req.headroom_mode, req.headroom_mode)}")
    print(" --- [STAGE 4: COMPUTE HARDWARE] ---")
    print(f" [12] Target Device:             {req.device.upper()}")
    print("-" * 84)
    print(" [L] Load Preset (JSON)   [S] Save Preset (JSON)")
    print(" [G] Generate Audio       [P] Permutation Benchmark Sweep (Sweep 4.0)    [Q] Quit")
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
                p_in = input("Enter audio file path: ").strip().strip('"').strip("'")
                if p_in and Path(p_in).exists():
                    req.input_path = str(Path(p_in).resolve())
        elif choice == "2":
            o = input(f"Enter Output WAV Destination [{req.output_path}]: ").strip().strip('"').strip("'")
            if o:
                req.output_path = o
        elif choice == "3":
            cycle = {"48k": "44.1k", "44.1k": "both", "both": "48k"}
            req.target_rate = cycle.get(req.target_rate, "48k")
        elif choice == "4":
            print("\n[1] MIDPOINT (2nd-Order RK2) [2] HEUN (2nd-Order Predictor-Corrector) [3] RK4 (4th-Order) [4] EULER")
            s_sel = input(f"Select Solver [{req.solver}]: ").strip()
            s_map = {"1": "midpoint", "2": "heun", "3": "rk4", "4": "euler"}
            req.solver = s_map.get(s_sel, req.solver)
        elif choice == "5":
            s_val = input(f"Enter ODE Integration Steps [{req.ode_steps}]: ").strip()
            if s_val.isdigit() and int(s_val) >= 1:
                req.ode_steps = int(s_val)
            c_val = input(f"Enter CFG Guidance Scale [{req.guidance_scale:.2f}]: ").strip()
            if c_val:
                req.guidance_scale = float(c_val)
        elif choice == "6":
            print("\n[1] UNIFORM (Linear Baseline) [2] POLYNOMIAL (Warped high-curvature focus) [3] COSINE")
            sc_sel = input(f"Select Scheduler [{req.scheduler_type}]: ").strip()
            sc_map = {"1": "uniform", "2": "polynomial", "3": "cosine"}
            req.scheduler_type = sc_map.get(sc_sel, req.scheduler_type)
            if req.scheduler_type == "polynomial":
                g_val = input(f"Enter Gamma Warp Factor [{req.time_warp_gamma:.2f}]: ").strip()
                if g_val:
                    req.time_warp_gamma = float(g_val)
        elif choice == "7":
            sd_val = input(f"Enter Deterministic Seed (or 'none') [{req.seed}]: ").strip()
            if sd_val.lower() == "none":
                req.seed = None
            elif sd_val.isdigit():
                req.seed = int(sd_val)
        elif choice == "8":
            req.cross_band_gain_match = not req.cross_band_gain_match
        elif choice == "9":
            b_val = input(f"Enter One-Sided Crossover Blend Bins (0 to 32) [{req.crossover_blend_bins}]: ").strip()
            if b_val.isdigit():
                req.crossover_blend_bins = int(b_val)
        elif choice == "10":
            print("\n[1] 24 kHz  [2] 16 kHz  [3] 12 kHz  [4] 8 kHz")
            a_sel = input("Select Anchor [1]: ").strip()
            a_map = {"1": 24000, "2": 16000, "3": 12000, "4": 8000}
            req.input_sr_anchor = a_map.get(a_sel, req.input_sr_anchor)
        elif choice == "11":
            print("\n[1] BYPASS  [2] PEAK RESISTANCE  [3] STRICT CEILING")
            h_sel = input(f"Select Headroom Mode [{req.headroom_mode}]: ").strip()
            if h_sel in ["1", "bypass"]:
                req.headroom_mode = "bypass"
            elif h_sel in ["2", "peak_resistant"]:
                req.headroom_mode = "peak_resistant"
            elif h_sel in ["3", "strict_ceiling"]:
                req.headroom_mode = "strict_ceiling"
        elif choice == "12":
            req.device = "cpu" if req.device == "cuda" else ("cuda" if torch.cuda.is_available() else "cpu")
        elif choice == "L":
            p_path = input("Enter JSON preset path: ").strip().strip('"').strip("'")
            try:
                req = FurgieRequest.load_preset(Path(p_path))
            except Exception as e:
                print(f"Preset load error: {e}")
        elif choice == "S":
            p_path = input("Enter destination preset path: ").strip().strip('"').strip("'")
            try:
                req.save_preset(Path(p_path))
            except Exception as e:
                print(f"Preset save error: {e}")
        elif choice == "P":
            if not req.input_path or not Path(req.input_path).exists():
                print("\n[ERROR] Valid input file required for sweep.")
                continue
            if engine is None:
                engine = FurgieEngine(device=req.device, model_repo_id=req.repo_id)
            run_benchmark_sweep(engine, req)
        elif choice == "G":
            if not req.input_path or not Path(req.input_path).exists():
                print("\n[ERROR] Valid input file required.")
                continue
            if engine is None:
                engine = FurgieEngine(device=req.device, model_repo_id=req.repo_id)
            try:
                with Progress(
                    SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    BarColumn(),
                    TaskProgressColumn(),
                    TimeRemainingColumn(),
                    console=console,
                ) as progress:
                    task = progress.add_task("[cyan]Complex STFT Flow Inpainting...", total=100)

                    def update_progress(cur: int, tot: int) -> None:
                        progress.update(task, completed=int((cur / tot) * 100))

                    telemetry = engine.synthesize_request(req, tile_progress_callback=update_progress)
                print_telemetry(telemetry)
            except Exception as e:
                print(f"Synthesis failed: {e}", file=sys.stderr)
                traceback.print_exc()
        elif choice == "Q":
            sys.exit(0)


def run_benchmark_sweep(engine: FurgieEngine, base_req: FurgieRequest) -> None:
    configurations = [
        ("P1: Midpoint Uniform Hard Cut (Sweep 3 Baseline)", "midpoint", "uniform", 1.0, 0),
        ("P2: Heun Uniform Hard Cut (Sweep 3 Runner-Up)", "heun", "uniform", 1.0, 0),
        ("P3: Midpoint + Micro One-Sided Taper (4 Bins)", "midpoint", "uniform", 1.0, 4),
        ("P4: Heun + Micro One-Sided Taper (4 Bins)", "heun", "uniform", 1.0, 4),
        ("P5: Midpoint + Micro-Curvature Warp (gamma=1.05)", "midpoint", "polynomial", 1.05, 0),
        ("P6: Heun + Micro-Curvature Warp (gamma=1.05)", "heun", "polynomial", 1.05, 0),
    ]
    out_dir = ROOT_DIR / "workspace" / "benchmark_sweep"
    out_dir.mkdir(parents=True, exist_ok=True)
    sweep_results = []
    print("\n" + "=" * 84)
    print("             EXECUTING N=16 PRECISION TOURNAMENT SWEEP (SWEEP 4.0)")
    print("=" * 84)
    for idx, (label, solver, sched, gamma, blend_val) in enumerate(configurations, 1):
        req = FurgieRequest(
            input_path=base_req.input_path,
            output_path=str(out_dir / f"sweep4_{idx}_{solver}_{sched}_b{blend_val}.wav"),
            input_sr_anchor=base_req.input_sr_anchor,
            target_sample_rate=48000,
            target_rate="48k",
            headroom_mode="bypass",
            ode_steps=16,
            solver=solver,
            guidance_scale=0.0,
            scheduler_type=sched,
            time_warp_gamma=gamma,
            seed=42,
            cross_band_gain_match=True,
            crossover_blend_bins=blend_val,
            device=base_req.device,
            repo_id=base_req.repo_id,
        )
        print(f"[{idx}/{len(configurations)}] Evaluating: {label}...")
        telem = engine.synthesize_request(req)
        print_telemetry(telem)
        sweep_results.append({"label": label, "telemetry": telem.__dict__})
    manifest = out_dir / "sweep_telemetry.json"
    manifest.write_text(json.dumps(sweep_results, indent=2), encoding="utf-8")
    print(f"[+] Sweep 4.0 telemetry exported to: {manifest}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Complex STFT Flow-Matching Audio Super-Resolution Harness")
    parser.add_argument("--batch", action="store_true")
    parser.add_argument("--sweep", action="store_true")
    parser.add_argument("--input", type=str, default=None)
    parser.add_argument("--output", type=str, default=None)
    parser.add_argument("--steps", dest="ode_steps", type=int, default=16)
    parser.add_argument("--solver", type=str, choices=SUPPORTED_SOLVERS, default="heun")
    parser.add_argument("--scheduler", dest="scheduler_type", type=str, choices=SUPPORTED_SCHEDULERS, default="uniform")
    parser.add_argument("--gamma", dest="time_warp_gamma", type=float, default=1.0)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--gain-match", action="store_true", default=True)
    parser.add_argument("--blend-bins", dest="crossover_blend_bins", type=int, default=0)
    parser.add_argument("--cfg", dest="guidance_scale", type=float, default=0.0)
    parser.add_argument("--anchor", dest="input_sr_anchor", type=int, default=24000)
    parser.add_argument("--headroom-mode", dest="headroom_mode", type=str, choices=SUPPORTED_HEADROOM_MODES, default="bypass")
    parser.add_argument("--target-peak", dest="target_peak_dbfs", type=float, default=0.0)
    parser.add_argument("--target-rate", type=str, choices=SUPPORTED_TARGET_RATES, default="48k")
    parser.add_argument("--device", type=str, default=None)
    args = parser.parse_args()

    req = FurgieRequest()
    if args.input:
        req.input_path = str(Path(args.input).resolve())
    if args.output:
        req.output_path = args.output
    if args.ode_steps is not None:
        req.ode_steps = args.ode_steps
    if args.solver is not None:
        req.solver = args.solver
    if args.scheduler_type is not None:
        req.scheduler_type = args.scheduler_type
    if args.time_warp_gamma is not None:
        req.time_warp_gamma = args.time_warp_gamma
    if args.seed is not None:
        req.seed = args.seed
    if args.gain_match is not None:
        req.cross_band_gain_match = args.gain_match
    if args.crossover_blend_bins is not None:
        req.crossover_blend_bins = args.crossover_blend_bins
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

    if args.sweep:
        if not req.input_path:
            print("[ERROR] --input is required for --sweep", file=sys.stderr)
            sys.exit(1)
        eng = FurgieEngine(device=req.device, model_repo_id=req.repo_id)
        run_benchmark_sweep(eng, req)
    elif args.batch:
        if not req.input_path:
            print("[ERROR] --input is required for --batch", file=sys.stderr)
            sys.exit(1)
        eng = FurgieEngine(device=req.device, model_repo_id=req.repo_id)
        telem = eng.synthesize_request(req)
        print_telemetry(telem)
    else:
        run_interactive_harness(engine=None, req=req)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.exit(1)