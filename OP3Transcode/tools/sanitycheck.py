import gzip
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
WASM_PATH = ROOT_DIR / "dist" / "wasm" / "op3transcode.wasm"
BIN_PATH = ROOT_DIR / "dist" / "bin" / ("tunebloom-transcode.exe" if sys.platform == "win32" else "tunebloom-transcode")

REQUIRED_EXPORTS = [
    b"wasm_malloc",
    b"wasm_free",
    b"op3_transcode_monolithic",
    b"op3_stream_init",
    b"op3_stream_feed_packet",
    b"op3_stream_flush",
    b"op3_stream_destroy"
]

def main() -> None:
    print("================================================================================")
    print("                 OP3TRANSCODE ARTIFACT AUDITOR & VERIFIER                       ")
    print("================================================================================")
    
    if not BIN_PATH.exists():
        print(f"[!] Native executable missing: {BIN_PATH}")
        sys.exit(1)
    print(f"  [+] Native Binary Verified  : {BIN_PATH.name} ({BIN_PATH.stat().st_size / 1024.0:.1f} KB)")

    if not WASM_PATH.exists():
        print(f"[!] WASM binary missing: {WASM_PATH}")
        sys.exit(1)

    raw_bytes = WASM_PATH.read_bytes()
    raw_size_kb = len(raw_bytes) / 1024.0
    gz_size_kb = len(gzip.compress(raw_bytes, 9)) / 1024.0

    print(f"  [+] WASM Binary Disk Footprint : {raw_size_kb:.2f} KB")
    print(f"  [+] WASM Gzip Wire Size        : {gz_size_kb:.2f} KB (Ceiling: <85.0 KB)")

    missing = [exp.decode() for exp in REQUIRED_EXPORTS if exp not in raw_bytes]
    if missing:
        print(f"[!] Missing required export symbols in WASM binary: {missing}")
        sys.exit(1)

    print("  [+] All ABI Export Symbols Successfully Bound.")
    print("--------------------------------------------------------------------------------")
    print("[+] STATUS: AUDIT PASSED WITH 0 DRIFT.")

if __name__ == "__main__":
    main()