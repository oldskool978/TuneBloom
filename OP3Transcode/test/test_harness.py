import os
import sys
import time
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
BIN_EXE = ROOT_DIR / "dist" / "bin" / ("tunebloom-transcode.exe" if sys.platform == "win32" else "tunebloom-transcode")

def main() -> None:
    test_ws = ROOT_DIR / ".forge_cache" / "test_workspace"
    test_ws.mkdir(parents=True, exist_ok=True)
    
    input_opus = test_ws / "master_out.opus"
    output_mp3 = test_ws / "transcoded_master.mp3"

    if not input_opus.exists():
        boompus_opus = ROOT_DIR.parent / "Boompus" / ".forge_cache" / "test_workspace" / "master_out.opus"
        if boompus_opus.exists():
            import shutil
            shutil.copy2(boompus_opus, input_opus)
            print(f"[*] Imported Boompus master test bitstream: {input_opus.name}")
        else:
            print(f"[*] Input test file {input_opus} not found. Please supply an RFC 7845 Opus stream.")
            return

    print(f"[*] Executing test transcode: {input_opus.name} -> {output_mp3.name}...")
    start_t = time.perf_counter()
    res = subprocess.run([str(BIN_EXE), str(input_opus), str(output_mp3), "0"], capture_output=True, text=True)
    elapsed = time.perf_counter() - start_t

    if res.returncode != 0:
        print(f"[!] Test harness failure:\n{res.stderr}")
        sys.exit(1)

    print(res.stdout)
    print(f"[+] Output MP3 Size: {output_mp3.stat().st_size / 1024.0:.2f} KB | Verified in {elapsed:.3f}s")

if __name__ == "__main__":
    main()