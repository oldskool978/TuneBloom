import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
TOOLCHAIN_DIR = ROOT_DIR / "toolchain"
LIBRARY_DIR = ROOT_DIR / "library"
CACHE_DIR = ROOT_DIR / ".forge_cache"
DIST_DIR = ROOT_DIR / "dist"
SRC_DIR = ROOT_DIR / "src"

NATIVE_SYSROOT = TOOLCHAIN_DIR / "native-sysroot"
WASI_SYSROOT = TOOLCHAIN_DIR / "wasi-sysroot"
WINSDK_DIR = TOOLCHAIN_DIR / "winsdk"
OPUS_SRC = LIBRARY_DIR / "opus"

IS_WIN = sys.platform == "win32"

CLANG_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang.exe" if IS_WIN else "clang")
CLANG_CL_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang-cl.exe" if IS_WIN else "clang-cl")
LLD_LINK_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("lld-link.exe" if IS_WIN else "lld-link")
NINJA_EXE = TOOLCHAIN_DIR / "ninja" / ("ninja.exe" if IS_WIN else "ninja")

GLOBAL_EXCLUDES = {
    "opus_compare.c", "opus_demo.c", "opus_custom_demo.c",
    "repacketizer_demo.c", "qext_compare.c"
}

WASM_ENCODER_EXCLUDES = {
    "celt_encoder.c", "entenc.c", "init_encoder.c", "NSQ.c", "NSQ_del_dec.c",
    "opus_encoder.c", "opus_multistream_encoder.c", "opus_projection_encoder.c",
    "analysis.c", "mlp.c", "mlp_data.c", "enc_API.c", "control_SNR.c",
    "control_audio_bandwidth.c", "control_codec.c", "check_control_input.c",
    "VAD.c", "VQ_WMat_EC.c", "gain_quant.c", "NLSF_del_dec_quant.c",
    "NLSF_encode.c", "NLSF_VQ_weights_laroia.c", "quant_LTP_gains.c",
    "shell_coder.c", "stereo_encode_pred.c", "stereo_find_predictor.c",
    "stereo_quant_pred.c", "stereo_LR_to_MS.c", "HP_variable_cutoff.c"
}

HARDWARE_ARCHS = {"arm", "x86", "mips", "xtensa", "tests", "dnn"}

def sanitize_path(path_obj: Path) -> str:
    return str(path_obj.resolve()).replace("\\", "/")

def preflight_check() -> None:
    if not (NATIVE_SYSROOT / "lib" / ("opus.lib" if IS_WIN else "libopus.a")).exists():
        print("[!] Native sysroot missing. Please run 'python tools/build_native.py' first.")
        sys.exit(1)
    wasi_lib_candidates = [
        WASI_SYSROOT / "lib" / "wasm32-wasip1" / "libc.a",
        WASI_SYSROOT / "lib" / "libc.a",
        WASI_SYSROOT / "lib" / "wasm32-wasi" / "libc.a"
    ]
    if not any(cand.exists() for cand in wasi_lib_candidates):
        print("[!] WASI sysroot missing. Please run 'python tools/build_wasi.py' first.")
        sys.exit(1)
    try:
        res_dir_str = subprocess.check_output([str(CLANG_EXE), "-print-resource-dir"], text=True).strip()
        res_dir = Path(res_dir_str)
    except Exception:
        res_dirs = list((TOOLCHAIN_DIR / "llvm" / "lib" / "clang").glob("*"))
        res_dir = res_dirs[0] if res_dirs else TOOLCHAIN_DIR / "llvm" / "lib" / "clang" / "22"
    builtins_target = res_dir / "lib" / "wasm32-unknown-wasip1" / "libclang_rt.builtins.a"
    if not builtins_target.exists():
        wasi_build = CACHE_DIR / "wasi-build"
        found = list(wasi_build.rglob("*clang_rt*.a")) + list(wasi_build.rglob("*builtins*.a"))
        if found:
            for triple in ["wasm32-unknown-wasip1", "wasm32-wasip1", "wasm32-unknown-wasi", "wasi"]:
                td = res_dir / "lib" / triple
                td.mkdir(parents=True, exist_ok=True)
                shutil.copy2(found[0], td / "libclang_rt.builtins.a")
                shutil.copy2(found[0], td / "libclang_rt.builtins-wasm32.a")
            print("[+] Auto-staged missing compiler-rt builtins to LLVM resource path.")

def is_wasm_decoder_source(c_file: Path) -> bool:
    name = c_file.name
    if name in WASM_ENCODER_EXCLUDES:
        return False
    if name.startswith("encode_"):
        return False
    if "_FLP" in name:
        return False
    if c_file.parent.name == "float":
        return False
    return True

def main() -> None:
    preflight_check()
    print("[*] Synthesizing Ninja DAG for Native Converter and WASM Player...")
    dag_dir = CACHE_DIR / "dag-build"
    dag_dir.mkdir(parents=True, exist_ok=True)
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    (DIST_DIR / "bin").mkdir(parents=True, exist_ok=True)
    (DIST_DIR / "wasm").mkdir(parents=True, exist_ok=True)

    ninja_file = dag_dir / "build.ninja"

    def to_posix(p: Path) -> str:
        return os.path.relpath(p, dag_dir).replace('\\', '/')

    native_inc = to_posix(NATIVE_SYSROOT / "include")
    native_lib = to_posix(NATIVE_SYSROOT / "lib")
    wasi_sysroot_posix = to_posix(WASI_SYSROOT)

    encoder_sources = [
        SRC_DIR / "encoder" / "wav_reader.c",
        SRC_DIR / "encoder" / "ogg_writer.c",
        SRC_DIR / "encoder" / "opus_encoder_core.c",
        SRC_DIR / "encoder" / "main.c"
    ]

    opus_dirs = [OPUS_SRC / "src", OPUS_SRC / "celt", OPUS_SRC / "silk"]
    wasm_opus_c_files = []
    for d in opus_dirs:
        if not d.exists():
            continue
        for root, _, files in os.walk(d):
            parts = Path(root).parts
            if "fixed" in parts or any(arch in parts for arch in HARDWARE_ARCHS):
                continue
            for file in files:
                if file.endswith('.c') and file not in GLOBAL_EXCLUDES:
                    src_path = Path(root) / file
                    if is_wasm_decoder_source(src_path):
                        wasm_opus_c_files.append(src_path)

    bridge_wasm = SRC_DIR / "wasm_player" / "opus_wasm_bridge.c"
    ring_buf_wasm = SRC_DIR / "wasm_player" / "ring_buffer.c"

    with open(ninja_file, "w", encoding="utf-8") as f:
        f.write(f"clang = {to_posix(CLANG_EXE)}\n")
        if IS_WIN:
            f.write(f"clang_cl = {to_posix(CLANG_CL_EXE)}\n")
            f.write(f"lld_link = {to_posix(LLD_LINK_EXE)}\n")
            unified_lib = WINSDK_DIR / "lib"
            winsysroot_arg = sanitize_path(WINSDK_DIR)
            unified_lib_arg = sanitize_path(unified_lib)
            cflags_native = f"/MT /O2 /Gw -winsysroot {winsysroot_arg} /I{native_inc} /I{native_inc}/opus /I{native_inc}/ogg /DNOMINMAX /DWIN32_LEAN_AND_MEAN -Qunused-arguments"
            ldflags_native = f"/machine:x64 /libpath:{native_lib} /libpath:{unified_lib_arg} opus.lib ogg.lib libcpmt.lib kernel32.lib user32.lib"
            f.write("rule cc_native\n")
            f.write(f"  command = $clang_cl {cflags_native} /c $in /Fo:$out\n")
            f.write("rule link_native\n")
            f.write(f"  command = $lld_link {ldflags_native} $in /out:$out\n\n")
        else:
            cflags_native = f"-O3 -flto -I{native_inc} -I{native_inc}/opus -I{native_inc}/ogg -DFLOATING_POINT -DOPUS_BUILD"
            ldflags_native = f"-O3 -flto -L{native_lib} -lopus -logg -lm -lpthread"
            f.write("rule cc_native\n")
            f.write(f"  command = $clang {cflags_native} -c $in -o $out\n")
            f.write("rule link_native\n")
            f.write(f"  command = $clang $in {ldflags_native} -o $out\n\n")

        cflags_wasm = (
            f"-target wasm32-wasip1 --sysroot={wasi_sysroot_posix} "
            f"-isystem {wasi_sysroot_posix}/include -isystem {wasi_sysroot_posix}/include/wasm32-wasip1 "
            "-O3 -flto -msimd128 -mbulk-memory -DNDEBUG -fvisibility=hidden -fno-exceptions -fno-rtti "
            "-fno-asynchronous-unwind-tables -fno-unwind-tables -fno-ident -fomit-frame-pointer "
            "-fdata-sections -ffunction-sections -fmerge-all-constants "
            "-DOPUS_BUILD -DVAR_ARRAYS -DFLOATING_POINT -DFLOAT_APPROX -DHAVE_LRINT -DHAVE_LRINTF "
            f"-I{to_posix(OPUS_SRC / 'include')} -I{to_posix(OPUS_SRC / 'celt')} -I{to_posix(OPUS_SRC / 'silk')} -I{to_posix(OPUS_SRC / 'silk' / 'float')} "
            f"-I{to_posix(SRC_DIR / 'wasm_player')}"
        )
        ldflags_wasm = (
            f"-target wasm32-wasip1 --sysroot={wasi_sysroot_posix} "
            f"-L{wasi_sysroot_posix}/lib/wasm32-wasip1 -L{wasi_sysroot_posix}/lib "
            "-O3 -flto -msimd128 -mbulk-memory -nostartfiles -Wl,--no-entry -Wl,--allow-undefined "
            "-Wl,--gc-sections -Wl,--strip-all -Wl,--lto-O3 "
            "-Wl,-z,stack-size=1048576 -Wl,--initial-memory=16777216 "
            "-Wl,--export=wasm_malloc -Wl,--export=wasm_free "
            "-Wl,--export=tb_decoder_init -Wl,--export=tb_decoder_decode -Wl,--export=tb_decoder_reset -Wl,--export=tb_decoder_destroy "
            "-Wl,--export=tb_decoder_decode_to_ring -Wl,--export=tb_decoder_ring_read -Wl,--export=tb_decoder_ring_avail -Wl,--export=tb_decoder_ring_reset "
            "-lc -lm"
        )
        f.write("rule cc_wasm\n")
        f.write(f"  command = $clang {cflags_wasm} -c $in -o $out\n")
        f.write("rule link_wasm\n")
        f.write(f"  command = $clang {ldflags_wasm} $in -o $out\n\n")

        native_objs = []
        for src_f in encoder_sources:
            if src_f.exists():
                obj = f"native_{src_f.stem}.obj" if IS_WIN else f"native_{src_f.stem}.o"
                f.write(f"build {obj}: cc_native {to_posix(src_f)}\n")
                native_objs.append(obj)
        out_enc_bin = to_posix(DIST_DIR / "bin" / ("tunebloom-opusenc.exe" if IS_WIN else "tunebloom-opusenc"))
        f.write(f"build {out_enc_bin}: link_native {' '.join(native_objs)}\n\n")

        wasm_objs = []
        for src_f in wasm_opus_c_files:
            obj = f"wasm_opus_{src_f.stem}_{src_f.parent.name}.o"
            f.write(f"build {obj}: cc_wasm {to_posix(src_f)}\n")
            wasm_objs.append(obj)
        if bridge_wasm.exists():
            f.write(f"build wasm_bridge.o: cc_wasm {to_posix(bridge_wasm)}\n")
            wasm_objs.append("wasm_bridge.o")
        if ring_buf_wasm.exists():
            f.write(f"build wasm_ring_buf.o: cc_wasm {to_posix(ring_buf_wasm)}\n")
            wasm_objs.append("wasm_ring_buf.o")

        out_wasm_bin = to_posix(DIST_DIR / "wasm" / "tunebloom_decoder.wasm")
        f.write(f"build {out_wasm_bin}: link_wasm {' '.join(wasm_objs)}\n")

    subprocess.run([str(NINJA_EXE)], cwd=dag_dir, check=True)
    print(f"[+] Compiled deliverables generated in dist/bin/ and dist/wasm/.")

if __name__ == "__main__":
    main()