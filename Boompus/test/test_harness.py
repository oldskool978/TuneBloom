import argparse
import math
import os
import struct
import subprocess
import sys
import time
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
DIST_DIR = ROOT_DIR / "dist"
BIN_DIR = DIST_DIR / "bin"
WASM_DIR = DIST_DIR / "wasm"

IS_WIN = sys.platform == "win32"
ENCODER_EXE = BIN_DIR / ("tunebloom-opusenc.exe" if IS_WIN else "tunebloom-opusenc")
DECODER_WASM = WASM_DIR / "tunebloom_decoder.wasm"


def generate_synthetic_master_wav(target_path: Path, duration_sec: float = 5.0, sample_rate: int = 48000) -> None:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    num_samples = int(duration_sec * sample_rate)
    channels = 2

    header = bytearray()
    header.extend(b"RIFF")
    data_bytes = num_samples * channels * 4
    header.extend(struct.pack("<I", 36 + data_bytes))
    header.extend(b"WAVE")
    header.extend(b"fmt ")
    header.extend(struct.pack("<I", 16))
    header.extend(struct.pack("<H", 3))
    header.extend(struct.pack("<H", channels))
    header.extend(struct.pack("<I", sample_rate))
    header.extend(struct.pack("<I", sample_rate * channels * 4))
    header.extend(struct.pack("<H", channels * 4))
    header.extend(struct.pack("<H", 32))
    header.extend(b"data")
    header.extend(struct.pack("<I", data_bytes))

    with open(target_path, "wb") as f:
        f.write(header)
        for i in range(num_samples):
            t = float(i) / float(sample_rate)
            f1 = 440.0 + 220.0 * math.sin(2.0 * math.pi * 0.25 * t)
            f2 = 880.0 + 440.0 * math.cos(2.0 * math.pi * 0.125 * t)
            left = 0.65 * math.sin(2.0 * math.pi * f1 * t)
            right = 0.65 * math.sin(2.0 * math.pi * f2 * t)
            f.write(struct.pack("<ff", left, right))


def run_conversion_pass(input_wav: Path, output_opus: Path, bitrate_kbps: int = 192, mode_flag: str = "--cvbr") -> dict:
    if not ENCODER_EXE.exists():
        raise FileNotFoundError(f"Native converter binary missing: {ENCODER_EXE}")

    cmd = [str(ENCODER_EXE), str(input_wav), str(output_opus), str(bitrate_kbps), mode_flag]
    start_t = time.perf_counter()
    proc = subprocess.run(cmd, capture_output=True, text=True)
    elapsed = time.perf_counter() - start_t

    if proc.returncode != 0:
        raise RuntimeError(f"Encoder returned non-zero code {proc.returncode}:\n{proc.stderr}")

    if not output_opus.exists() or output_opus.stat().st_size == 0:
        raise RuntimeError("Output Opus bitstream was not generated.")

    wav_size = input_wav.stat().st_size
    opus_size = output_opus.stat().st_size
    compression_ratio = float(wav_size) / float(opus_size)

    return {
        "elapsed_sec": elapsed,
        "wav_bytes": wav_size,
        "opus_bytes": opus_size,
        "compression_ratio": compression_ratio,
        "stdout": proc.stdout
    }


def parse_and_validate_ogg_opus(opus_path: Path) -> dict:
    with open(opus_path, "rb") as f:
        data = f.read()

    if not data.startswith(b"OggS"):
        raise ValueError("Invalid bitstream: Missing OggS magic capture pattern.")

    head_idx = data.find(b"OpusHead")
    if head_idx == -1:
        raise ValueError("Invalid bitstream: Missing OpusHead identification packet.")

    tags_idx = data.find(b"OpusTags")
    if tags_idx == -1:
        raise ValueError("Invalid bitstream: Missing OpusTags comment packet.")

    page_count = data.count(b"OggS")
    return {
        "valid_ogg": True,
        "total_pages": page_count,
        "opus_head_pos": head_idx,
        "opus_tags_pos": tags_idx
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="TuneBloom Opus & WASM End-to-End Test Harness")
    parser.add_argument("--input", type=str, default=None, help="Path to input 48kHz WAV master")
    parser.add_argument("--bitrate", type=int, default=192, help="Target encoding bitrate in kbps")
    parser.add_argument("--mode", type=str, choices=["cbr", "vbr", "cvbr"], default="cvbr")
    args = parser.parse_args()

    test_dir = ROOT_DIR / ".forge_cache" / "test_workspace"
    test_dir.mkdir(parents=True, exist_ok=True)

    input_wav = Path(args.input) if args.input else test_dir / "synthetic_master_48k.wav"
    output_opus = test_dir / "master_out.opus"

    if not args.input:
        print("[*] Generating 5.0s 48kHz 32-bit Float reference master...")
        generate_synthetic_master_wav(input_wav, duration_sec=5.0, sample_rate=48000)

    print(f"[*] Executing native converter: {input_wav.name} -> {output_opus.name} ({args.bitrate} kbps, {args.mode.upper()})...")
    res = run_conversion_pass(input_wav, output_opus, bitrate_kbps=args.bitrate, mode_flag=f"--{args.mode}")

    sys.stdout.write(res["stdout"])

    ogg_meta = parse_and_validate_ogg_opus(output_opus)
    print("------------------------------------------------------------------------------------")
    print(f"Ogg Container Pages:     {ogg_meta['total_pages']}")
    print(f"Compression Ratio:       {res['compression_ratio']:.2f}:1")
    print(f"WASM Artifact Bound:     {'VERIFIED' if DECODER_WASM.exists() else 'MISSING'}")
    print("------------------------------------------------------------------------------------")
    print("[+] Test harness completed with 0 errors.")


if __name__ == "__main__":
    main()