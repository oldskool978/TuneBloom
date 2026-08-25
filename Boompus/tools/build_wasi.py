import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
TOOLCHAIN_DIR = ROOT_DIR / "toolchain"
LIBRARY_DIR = ROOT_DIR / "library"
CACHE_DIR = ROOT_DIR / ".forge_cache"
WASI_SYSROOT = TOOLCHAIN_DIR / "wasi-sysroot"
WASI_LIBC_SRC = LIBRARY_DIR / "wasi-libc"

IS_WIN = sys.platform == "win32"
CMAKE_EXE = TOOLCHAIN_DIR / "cmake" / "bin" / ("cmake.exe" if IS_WIN else "cmake")
NINJA_EXE = TOOLCHAIN_DIR / "ninja" / ("ninja.exe" if IS_WIN else "ninja")
CLANG_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang.exe" if IS_WIN else "clang")
LLVM_AR_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("llvm-ar.exe" if IS_WIN else "llvm-ar")
LLVM_RANLIB_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("llvm-ranlib.exe" if IS_WIN else "llvm-ranlib")


def stage_builtins(wasi_build: Path) -> None:
    try:
        res_dir_str = subprocess.check_output([str(CLANG_EXE), "-print-resource-dir"], text=True).strip()
        res_dir = Path(res_dir_str)
    except Exception:
        res_dirs = list((TOOLCHAIN_DIR / "llvm" / "lib" / "clang").glob("*"))
        res_dir = res_dirs[0] if res_dirs else TOOLCHAIN_DIR / "llvm" / "lib" / "clang" / "22"

    builtins = list(wasi_build.rglob("*clang_rt*.a")) + list(wasi_build.rglob("*builtins*.a"))
    if builtins:
        for b in builtins:
            for triple in ["wasm32-unknown-wasip1", "wasm32-wasip1", "wasm32-unknown-wasi", "wasi"]:
                target_dir = res_dir / "lib" / triple
                target_dir.mkdir(parents=True, exist_ok=True)
                shutil.copy2(b, target_dir / "libclang_rt.builtins.a")
                shutil.copy2(b, target_dir / "libclang_rt.builtins-wasm32.a")

            for target_lib_dir in [WASI_SYSROOT / "lib", WASI_SYSROOT / "lib" / "wasm32-wasip1"]:
                target_lib_dir.mkdir(parents=True, exist_ok=True)
                shutil.copy2(b, target_lib_dir / "libclang_rt.builtins.a")
                shutil.copy2(b, target_lib_dir / "libclang_rt.builtins-wasm32.a")
        print(f"[+] Staged compiler-rt builtins ({builtins[0].name}) into LLVM resource directory.")


def main() -> None:
    print("[*] Forging WebAssembly (wasi-libc) sysroot...")
    wasi_build = CACHE_DIR / "wasi-build"
    wasi_build.mkdir(parents=True, exist_ok=True)
    WASI_SYSROOT.mkdir(parents=True, exist_ok=True)

    c_flags = "-O3 -msimd128 -mbulk-memory -fstrict-aliasing -DNDEBUG"
    cmake_cmd = [
        str(CMAKE_EXE), "-G", "Ninja",
        "-S", str(WASI_LIBC_SRC),
        "-B", str(wasi_build),
        "-DCMAKE_POLICY_VERSION_MINIMUM=3.5",
        f"-DCMAKE_MAKE_PROGRAM={NINJA_EXE}",
        f"-DCMAKE_C_COMPILER={CLANG_EXE}",
        f"-DCMAKE_ASM_COMPILER={CLANG_EXE}",
        f"-DCMAKE_AR={LLVM_AR_EXE}",
        f"-DCMAKE_RANLIB={LLVM_RANLIB_EXE}",
        "-DCMAKE_SYSTEM_NAME=WASI",
        "-DCMAKE_SYSTEM_PROCESSOR=wasm32",
        "-DCMAKE_C_COMPILER_TARGET=wasm32-wasip1",
        "-DCMAKE_ASM_COMPILER_TARGET=wasm32-wasip1",
        "-DCMAKE_TRY_COMPILE_TARGET_TYPE=STATIC_LIBRARY",
        "-DCMAKE_C_COMPILER_WORKS=ON",
        f"-DCMAKE_C_FLAGS={c_flags}",
        "-DBUILD_SHARED_LIBS=OFF",
        "-DWASM_HALT_ON_OOM=ON",
        "-DMALLOC_IMPL=dlmalloc",
        f"-DCMAKE_INSTALL_PREFIX={WASI_SYSROOT}"
    ]
    subprocess.run(cmake_cmd, check=True)
    subprocess.run([str(NINJA_EXE), "-C", str(wasi_build), "install"], check=True)

    stage_builtins(wasi_build)
    print("[+] WASI sysroot forged successfully at toolchain/wasi-sysroot.")


if __name__ == "__main__":
    main()