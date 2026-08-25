import os
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
OPUS_DIR = ROOT_DIR / "library" / "opus"

NUKE_TARGETS = [
    ".github", "cmake", "dnn", "doc", "m4", "meson",
    "scripts", "tests", "training", "training_tf2",
    "celt/arm", "celt/dump_modes", "celt/mips", "celt/tests", "celt/x86",
    "silk/arm", "silk/mips", "silk/tests", "silk/x86", "silk/xtensa",
    "silk/fixed/arm", "silk/fixed/mips", "silk/fixed/x86",
    "silk/float/arm", "silk/float/mips", "silk/float/x86"
]

VALID_ROOT_FILES = {
    "COPYING", "README", "README.draft", "LICENSE", "LICENSE_PLEASE_READ.txt",
    "CMakeLists.txt", "opus_sources.mk", "Makefile.am", "configure.ac"
}


def sanitize_opus() -> None:
    if not OPUS_DIR.exists():
        raise FileNotFoundError(f"Opus repository not found at {OPUS_DIR}")

    print("[*] Surgically purging architecture assembly and non-deterministic bloat...")
    for target in NUKE_TARGETS:
        target_path = OPUS_DIR / target
        if target_path.exists() and target_path.is_dir():
            shutil.rmtree(target_path)
            print(f"  [-] Purged: {target}")

    for item in OPUS_DIR.iterdir():
        if item.is_file() and item.name not in VALID_ROOT_FILES:
            item.unlink()

    print("[+] Opus source tree sanitized for deterministic pure-C compilation.")


if __name__ == "__main__":
    sanitize_opus()