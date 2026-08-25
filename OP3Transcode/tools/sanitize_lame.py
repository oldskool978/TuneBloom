import os
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
LAME_DIR = ROOT_DIR / "library" / "lame"
LIBMP3LAME_DIR = LAME_DIR / "libmp3lame"

CONFIG_H_CONTENT = """#ifndef LAME_CONFIG_H
#define LAME_CONFIG_H

#define HAVE_CONFIG_H 1
#define STDC_HEADERS 1
#define HAVE_STDLIB_H 1
#define HAVE_STRING_H 1
#define HAVE_MATH_H 1
#define HAVE_LIMITS_H 1
#define HAVE_STDINT_H 1
#define HAVE_INTTYPES_H 1
#define HAVE_MEMCPY 1
#define HAVE_STRCHR 1

#define LAME_BUFFER_SIZE 1152

#include <stdint.h>
#include <float.h>

typedef float ieee754_float32_t;
typedef double ieee754_float64_t;

#define TAKEHIRO_IEEE754_HACK 1
#define USE_FAST_LOG 1

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

#ifndef M_LN10
#define M_LN10 2.30258509299404568402
#endif

#ifndef M_SQRT2
#define M_SQRT2 1.41421356237309504880
#endif

#endif
"""

def sanitize_lame() -> None:
    if not LAME_DIR.exists():
        raise FileNotFoundError(f"LAME directory not found at {LAME_DIR}")

    print("[*] Sanitizing LAME source tree for pure ANSI C compilation...")
    
    (LAME_DIR / "config.h").write_text(CONFIG_H_CONTENT, encoding="utf-8")
    (LIBMP3LAME_DIR / "config.h").write_text(CONFIG_H_CONTENT, encoding="utf-8")

    purge_dirs = [
        "ACM", "Dll", "dshow", "frontend", "mpglib", "mac", 
        "macosx", "vc_solution", "debian", "doc"
    ]
    for d in purge_dirs:
        target = LAME_DIR / d
        if target.exists() and target.is_dir():
            shutil.rmtree(target)

    i386_dir = LIBMP3LAME_DIR / "i386"
    if i386_dir.exists():
        shutil.rmtree(i386_dir)

    vector_dir = LIBMP3LAME_DIR / "vector"
    if vector_dir.exists():
        for item in vector_dir.iterdir():
            if item.is_file() and item.name != "lame_intrin.h":
                item.unlink()

    print("[+] LAME source tree conditioned with IEEE 754 bindings and intrinsic headers.")

if __name__ == "__main__":
    sanitize_lame()