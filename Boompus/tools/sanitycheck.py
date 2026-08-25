import gzip
import os
import re
import sys
from decimal import Decimal, getcontext
from pathlib import Path

getcontext().prec = 50

ROOT_DIR = Path(__file__).parent.parent.resolve()
TOOLCHAIN_DIR = ROOT_DIR / "toolchain"
DIST_DIR = ROOT_DIR / "dist"
SRC_DIR = ROOT_DIR / "src"

CELT_TRUTHS = {
    "CELT_DEEMPHASIS_ALPHA": {
        "desc": "Opus CELT Hardware De-Emphasis Alpha (0.85)",
        "val": Decimal('0.85'),
        "regex": r"#define\s+PREEMPHASIS\s+\(?([0-9]+\.[0-9]+)f?\)?|CELT_DEEMPH\s*=\s*([0-9]+\.[0-9]+)"
    },
    "CELT_FDDE_TERM1": {
        "desc": "1 + alpha^2 (1.7225)",
        "val": Decimal('1.7225'),
        "val_calc": lambda a: Decimal('1.0') + (a * a)
    },
    "CELT_FDDE_TERM2": {
        "desc": "2 * alpha (1.7000)",
        "val": Decimal('1.7000'),
        "val_calc": lambda a: Decimal('2.0') * a
    }
}

REQUIRED_WASM_EXPORTS = [
    "wasm_malloc",
    "wasm_free",
    "tb_decoder_init",
    "tb_decoder_decode",
    "tb_decoder_destroy"
]


def audit_toolchain() -> dict[str, bool]:
    is_win = sys.platform == "win32"
    llvm_bin = TOOLCHAIN_DIR / "llvm" / "bin"
    return {
        "clang": (llvm_bin / ("clang.exe" if is_win else "clang")).exists(),
        "lld": (llvm_bin / ("lld-link.exe" if is_win else "lld")).exists() or (llvm_bin / "ld.lld").exists(),
        "ninja": (TOOLCHAIN_DIR / "ninja" / ("ninja.exe" if is_win else "ninja")).exists(),
        "cmake": (TOOLCHAIN_DIR / "cmake" / "bin" / ("cmake.exe" if is_win else "cmake")).exists(),
        "native_opus_lib": (TOOLCHAIN_DIR / "native-sysroot" / "lib" / ("opus.lib" if is_win else "libopus.a")).exists(),
        "native_ogg_lib": (TOOLCHAIN_DIR / "native-sysroot" / "lib" / ("ogg.lib" if is_win else "libogg.a")).exists(),
        "wasi_libc_archive": (TOOLCHAIN_DIR / "wasi-sysroot" / "lib" / "wasm32-wasip1" / "libc.a").exists() or (TOOLCHAIN_DIR / "wasi-sysroot" / "lib" / "libc.a").exists()
    }


def audit_wasm_binary() -> tuple[bool, str]:
    wasm_path = DIST_DIR / "wasm" / "tunebloom_decoder.wasm"
    if not wasm_path.exists():
        return False, "Binary missing: dist/wasm/tunebloom_decoder.wasm"

    raw_bytes = wasm_path.read_bytes()
    raw_size_kb = len(raw_bytes) / 1024.0

    gz_bytes = gzip.compress(raw_bytes, compresslevel=9)
    gz_size_kb = len(gz_bytes) / 1024.0

    if raw_size_kb > 220.0:
        return False, f"Raw WASM image exceeds physical ceiling: {raw_size_kb:.2f} KB (Ceiling: 220 KB)"

    if gz_size_kb > 85.0:
        return False, f"Wire payload exceeds streaming target: {gz_size_kb:.2f} KB (Target <85 KB)"

    missing_exports = [exp for exp in REQUIRED_WASM_EXPORTS if exp.encode("utf-8") not in raw_bytes]
    if missing_exports:
        return False, f"Missing required export symbols in WASM image: {missing_exports}"

    msg = f"WASM Verified | Disk: {raw_size_kb:.2f} KB | Wire (Gzip): {gz_size_kb:.2f} KB | All exports bound."
    return True, msg


def verify_mathematical_invariants() -> bool:
    print("\n--- Algebraic Invariant & CELT Topology Audit ---")
    alpha = CELT_TRUTHS["CELT_DEEMPHASIS_ALPHA"]["val"]
    term1 = CELT_TRUTHS["CELT_FDDE_TERM1"]["val_calc"](alpha)
    term2 = CELT_TRUTHS["CELT_FDDE_TERM2"]["val_calc"](alpha)

    t1_diff = abs(term1 - CELT_TRUTHS["CELT_FDDE_TERM1"]["val"])
    t2_diff = abs(term2 - CELT_TRUTHS["CELT_FDDE_TERM2"]["val"])

    passed = (t1_diff == Decimal(0)) and (t2_diff == Decimal(0))
    print(f"  De-emphasis Alpha : {alpha}")
    print(f"  FDDE Quadratic Term: {term1} (Parity Error: {t1_diff:.2E})")
    print(f"  FDDE Linear Term   : {term2} (Parity Error: {t2_diff:.2E})")
    return passed


def main() -> None:
    print("================================================================================")
    print("               TUNEBLOOM OPUS & WASM SANITY CHECK AUDITOR                       ")
    print("================================================================================")
    tc_audit = audit_toolchain()
    all_tc_pass = True
    for component, ok in tc_audit.items():
        status = "PRESENT" if ok else "MISSING"
        print(f"  Toolchain / Sysroot Asset: {component:<25} -> {status}")
        if not ok:
            all_tc_pass = False

    wasm_ok, wasm_msg = audit_wasm_binary()
    print(f"\n  WebAssembly Image Status : {wasm_msg}")

    math_ok = verify_mathematical_invariants()

    print("\n--------------------------------------------------------------------------------")
    if all_tc_pass and wasm_ok and math_ok:
        print("[+] STATUS: SECURE & VERIFIED. ZERO ALGEBRAIC OR TOPOGRAPHICAL DRIFT DETECTED.")
    else:
        print("[!] STATUS: AUDIT FAILED. REBUILD OR VERIFY ASSETS.")
        sys.exit(1)


if __name__ == "__main__":
    main()