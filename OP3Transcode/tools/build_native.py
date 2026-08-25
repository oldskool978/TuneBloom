import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
TOOLCHAIN_DIR = ROOT_DIR / "toolchain"
LIBRARY_DIR = ROOT_DIR / "library"
CACHE_DIR = ROOT_DIR / ".forge_cache"
NATIVE_SYSROOT = TOOLCHAIN_DIR / "native-sysroot"
WINSDK_DIR = TOOLCHAIN_DIR / "winsdk"

IS_WIN = sys.platform == "win32"
NINJA_EXE = TOOLCHAIN_DIR / "ninja" / ("ninja.exe" if IS_WIN else "ninja")
CLANG_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang.exe" if IS_WIN else "clang")
CLANG_CL_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang-cl.exe" if IS_WIN else "clang-cl")
LLVM_LIB_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("llvm-lib.exe" if IS_WIN else "llvm-lib")
LLVM_AR_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("llvm-ar.exe" if IS_WIN else "llvm-ar")

OPUS_SRC = LIBRARY_DIR / "opus"
LIBOGG_SRC = LIBRARY_DIR / "libogg"
LAME_SRC = LIBRARY_DIR / "lame" / "libmp3lame"
LAME_INC = LIBRARY_DIR / "lame" / "include"

LAME_C_FILES = [
    "bitstream.c", "encoder.c", "fft.c", "gain_analysis.c", "id3tag.c",
    "lame.c", "newmdct.c", "presets.c", "psymodel.c", "quantize.c",
    "quantize_pvt.c", "reservoir.c", "set_get.c", "tables.c", "takehiro.c",
    "util.c", "vbrquantize.c", "VbrTag.c", "version.c"
]

GLOBAL_EXCLUDES = {
    "opus_compare.c", "opus_demo.c", "opus_custom_demo.c",
    "repacketizer_demo.c", "qext_compare.c"
}

HARDWARE_ARCHS = {"arm", "x86", "mips", "xtensa", "tests", "dnn"}

def sanitize_path(path_obj: Path) -> str:
    return str(path_obj.resolve()).replace("\\", "/")

def copy_tree_contents(src_dir: Path, dest_dir: Path) -> int:
    copied_count = 0
    for item in src_dir.rglob("*"):
        if item.is_file():
            rel_path = item.relative_to(src_dir)
            target = dest_dir / rel_path
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)
            copied_count += 1
    return copied_count

def main() -> None:
    print("[*] Constructing native static libraries via Ninja...")
    NATIVE_SYSROOT.mkdir(parents=True, exist_ok=True)
    (NATIVE_SYSROOT / "include").mkdir(parents=True, exist_ok=True)
    (NATIVE_SYSROOT / "include" / "lame").mkdir(parents=True, exist_ok=True)
    (NATIVE_SYSROOT / "include" / "opus").mkdir(parents=True, exist_ok=True)
    (NATIVE_SYSROOT / "include" / "ogg").mkdir(parents=True, exist_ok=True)
    (NATIVE_SYSROOT / "lib").mkdir(parents=True, exist_ok=True)

    build_dir = CACHE_DIR / "native-build"
    build_dir.mkdir(parents=True, exist_ok=True)
    ninja_file = build_dir / "build.ninja"

    def to_posix(p: Path) -> str:
        return os.path.relpath(p, build_dir).replace('\\', '/')

    ogg_c_files = [
        LIBOGG_SRC / "src" / "bitwise.c",
        LIBOGG_SRC / "src" / "framing.c"
    ]

    opus_dirs = [OPUS_SRC / "src", OPUS_SRC / "celt", OPUS_SRC / "silk"]
    opus_c_files = []
    for d in opus_dirs:
        if not d.exists():
            continue
        for root, _, files in os.walk(d):
            parts = Path(root).parts
            if "fixed" in parts or any(arch in parts for arch in HARDWARE_ARCHS):
                continue
            for file in files:
                if file.endswith('.c') and file not in GLOBAL_EXCLUDES:
                    opus_c_files.append(Path(root) / file)

    lame_sources = [LAME_SRC / f for f in LAME_C_FILES if (LAME_SRC / f).exists()]

    with open(ninja_file, "w", encoding="utf-8") as f:
        f.write(f"clang = {to_posix(CLANG_EXE)}\n")
        if IS_WIN:
            f.write(f"clang_cl = {to_posix(CLANG_CL_EXE)}\n")
            f.write(f"llvm_lib = {to_posix(LLVM_LIB_EXE)}\n")
            winsysroot_arg = sanitize_path(WINSDK_DIR)
            cflags_common = (
                f"/MT /O2 /Gw -winsysroot {winsysroot_arg} /DNOMINMAX /DWIN32_LEAN_AND_MEAN "
                "-DOPUS_BUILD -DVAR_ARRAYS -DFLOATING_POINT -DFLOAT_APPROX "
                "-DHAVE_LRINT -DHAVE_LRINTF -DHAVE_CONFIG_H "
                "-Wno-unknown-argument -Wno-macro-redefined -Wno-absolute-value "
                "-Wno-shift-negative-value -Wno-tautological-pointer-compare -Qunused-arguments "
                f"/I{to_posix(LIBOGG_SRC / 'include')} "
                f"/I{to_posix(OPUS_SRC / 'include')} "
                f"/I{to_posix(OPUS_SRC / 'celt')} "
                f"/I{to_posix(OPUS_SRC / 'silk')} "
                f"/I{to_posix(OPUS_SRC / 'silk' / 'float')} "
                f"/I{to_posix(OPUS_SRC / 'src')} "
                f"/I{to_posix(LAME_INC)} "
                f"/I{to_posix(LIBRARY_DIR / 'lame')} "
                f"/I{to_posix(LAME_SRC)}"
            )
            f.write(f"cflags = {cflags_common}\n\n")
            f.write("rule cc\n")
            f.write("  command = $clang_cl $cflags /c $in /Fo:$out\n")
            f.write("rule lib\n")
            f.write("  command = $llvm_lib /nologo /OUT:$out $in\n\n")
        else:
            f.write(f"llvm_ar = {to_posix(LLVM_AR_EXE)}\n")
            cflags_common = (
                "-O3 -flto -fPIC -DOPUS_BUILD -DVAR_ARRAYS -DFLOATING_POINT -DFLOAT_APPROX "
                "-DHAVE_LRINT -DHAVE_LRINTF -DHAVE_CONFIG_H -ffast-math "
                "-Wno-macro-redefined -Wno-absolute-value -Wno-shift-negative-value -Wno-tautological-pointer-compare "
                f"-I{to_posix(LIBOGG_SRC / 'include')} "
                f"-I{to_posix(OPUS_SRC / 'include')} "
                f"/I{to_posix(OPUS_SRC / 'celt')} "
                f"/I{to_posix(OPUS_SRC / 'silk')} "
                f"/I{to_posix(OPUS_SRC / 'silk' / 'float')} "
                f"/I{to_posix(OPUS_SRC / 'src')} "
                f"-I{to_posix(LAME_INC)} "
                f"-I{to_posix(LIBRARY_DIR / 'lame')} "
                f"-I{to_posix(LAME_SRC)}"
            )
            f.write(f"cflags = {cflags_common}\n\n")
            f.write("rule cc\n")
            f.write("  command = $clang $cflags -c $in -o $out\n")
            f.write("rule lib\n")
            f.write("  command = $llvm_ar rcs $out $in\n\n")

        ogg_objs = []
        for src_f in ogg_c_files:
            obj = f"ogg_{src_f.stem}.obj" if IS_WIN else f"ogg_{src_f.stem}.o"
            f.write(f"build {obj}: cc {to_posix(src_f)}\n")
            ogg_objs.append(obj)

        opus_objs = []
        for src_f in opus_c_files:
            obj = f"opus_{src_f.stem}_{src_f.parent.name}.obj" if IS_WIN else f"opus_{src_f.stem}_{src_f.parent.name}.o"
            f.write(f"build {obj}: cc {to_posix(src_f)}\n")
            opus_objs.append(obj)

        lame_objs = []
        for src_f in lame_sources:
            obj = f"lame_{src_f.stem}.obj" if IS_WIN else f"lame_{src_f.stem}.o"
            f.write(f"build {obj}: cc {to_posix(src_f)}\n")
            lame_objs.append(obj)

        out_ogg_lib = to_posix(NATIVE_SYSROOT / "lib" / ("ogg.lib" if IS_WIN else "libogg.a"))
        out_opus_lib = to_posix(NATIVE_SYSROOT / "lib" / ("opus.lib" if IS_WIN else "libopus.a"))
        out_lame_lib = to_posix(NATIVE_SYSROOT / "lib" / ("mp3lame.lib" if IS_WIN else "libmp3lame.a"))

        f.write(f"build {out_ogg_lib}: lib {' '.join(ogg_objs)}\n")
        f.write(f"build {out_opus_lib}: lib {' '.join(opus_objs)}\n")
        f.write(f"build {out_lame_lib}: lib {' '.join(lame_objs)}\n")

    subprocess.run([str(NINJA_EXE)], cwd=build_dir, check=True)

    copy_tree_contents(LIBOGG_SRC / "include" / "ogg", NATIVE_SYSROOT / "include" / "ogg")
    copy_tree_contents(LIBOGG_SRC / "include" / "ogg", NATIVE_SYSROOT / "include")
    copy_tree_contents(OPUS_SRC / "include", NATIVE_SYSROOT / "include" / "opus")
    copy_tree_contents(OPUS_SRC / "include", NATIVE_SYSROOT / "include")
    copy_tree_contents(LAME_INC, NATIVE_SYSROOT / "include" / "lame")
    copy_tree_contents(LAME_INC, NATIVE_SYSROOT / "include")

    print("[+] Native static libraries staged successfully in toolchain/native-sysroot.")

if __name__ == "__main__":
    main()