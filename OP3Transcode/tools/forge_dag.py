import os
import sys
from pathlib import Path
import subprocess

ROOT_DIR = Path(__file__).parent.parent.resolve()
TOOLCHAIN_DIR = ROOT_DIR / "toolchain"
LIBRARY_DIR = ROOT_DIR / "library"
CACHE_DIR = ROOT_DIR / ".forge_cache"
DIST_DIR = ROOT_DIR / "dist"
SRC_DIR = ROOT_DIR / "src"
NATIVE_SYSROOT = TOOLCHAIN_DIR / "native-sysroot"
WASI_SYSROOT = TOOLCHAIN_DIR / "wasi-sysroot"
WINSDK_DIR = TOOLCHAIN_DIR / "winsdk"

IS_WIN = sys.platform == "win32"
CLANG_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang.exe" if IS_WIN else "clang")
CLANG_CL_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang-cl.exe" if IS_WIN else "clang-cl")
LLD_LINK_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("lld-link.exe" if IS_WIN else "lld-link")
NINJA_EXE = TOOLCHAIN_DIR / "ninja" / ("ninja.exe" if IS_WIN else "ninja")

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

def is_wasm_decoder_source(c_file: Path) -> bool:
    name = c_file.name
    if name in WASM_ENCODER_EXCLUDES or name in GLOBAL_EXCLUDES:
        return False
    if name.startswith("encode_"):
        return False
    if "_FLP" in name:
        return False
    if c_file.parent.name == "float":
        return False
    return True

def sanitize_path(path_obj: Path) -> str:
    return str(path_obj.resolve()).replace("\\", "/")

def main() -> None:
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

    lame_dir = LIBRARY_DIR / "lame" / "libmp3lame"
    lame_inc = LIBRARY_DIR / "lame" / "include"
    opus_inc = LIBRARY_DIR / "opus" / "include"
    ogg_inc = LIBRARY_DIR / "libogg" / "include"

    opus_dirs = [LIBRARY_DIR / "opus" / "src", LIBRARY_DIR / "opus" / "celt", LIBRARY_DIR / "opus" / "silk"]
    wasm_opus_c_files = []
    for d in opus_dirs:
        if not d.exists():
            continue
        for root, _, files in os.walk(d):
            parts = Path(root).parts
            if "fixed" in parts or any(arch in parts for arch in HARDWARE_ARCHS):
                continue
            for file in files:
                if file.endswith('.c'):
                    candidate = Path(root) / file
                    if is_wasm_decoder_source(candidate):
                        wasm_opus_c_files.append(candidate)

    native_sources = [
        SRC_DIR / "native" / "main.c",
        SRC_DIR / "bridge" / "op3transcode_bridge.c",
        SRC_DIR / "common" / "ogg_demux.c",
        SRC_DIR / "common" / "id3_tagger.c",
        SRC_DIR / "encoder" / "lame_v0_core.c"
    ]

    with open(ninja_file, "w", encoding="utf-8") as f:
        f.write(f"clang = {to_posix(CLANG_EXE)}\n")
        if IS_WIN:
            f.write(f"clang_cl = {to_posix(CLANG_CL_EXE)}\n")
            f.write(f"lld_link = {to_posix(LLD_LINK_EXE)}\n")
            winsysroot_arg = sanitize_path(WINSDK_DIR)
            unified_lib = WINSDK_DIR / "lib"
            unified_lib_arg = sanitize_path(unified_lib)
            native_lib_arg = sanitize_path(NATIVE_SYSROOT / "lib")

            cflags_native = (
                f"/MT /O2 /Gw -winsysroot {winsysroot_arg} /DNOMINMAX /DWIN32_LEAN_AND_MEAN "
                "-DOPUS_BUILD -DVAR_ARRAYS -DFLOATING_POINT -DFLOAT_APPROX "
                "-DHAVE_LRINT -DHAVE_LRINTF -DHAVE_CONFIG_H "
                "-Wno-unknown-argument -Wno-macro-redefined -Wno-absolute-value "
                "-Wno-shift-negative-value -Wno-tautological-pointer-compare -Qunused-arguments "
                f"/I{native_inc} "
                f"/I{native_inc}/lame "
                f"/I{native_inc}/opus "
                f"/I{native_inc}/ogg "
                f"/I{to_posix(SRC_DIR)}"
            )
            ldflags_native = (
                f"/machine:x64 /libpath:{native_lib_arg} /libpath:{unified_lib_arg} "
                "mp3lame.lib opus.lib ogg.lib libcpmt.lib kernel32.lib user32.lib"
            )
            f.write(f"rule cc_native\n  command = $clang_cl {cflags_native} /c $in /Fo:$out\n")
            f.write(f"rule link_native\n  command = $lld_link {ldflags_native} $in /out:$out\n\n")
        else:
            cflags_native = (
                "-O3 -flto -DOPUS_BUILD -DVAR_ARRAYS -DFLOATING_POINT -DFLOAT_APPROX "
                "-DHAVE_LRINT -DHAVE_LRINTF -DHAVE_CONFIG_H -ffast-math "
                "-Wno-macro-redefined -Wno-absolute-value -Wno-shift-negative-value -Wno-tautological-pointer-compare "
                f"-I{native_inc} "
                f"-I{native_inc}/lame "
                f"-I{native_inc}/opus "
                f"-I{native_inc}/ogg "
                f"-I{to_posix(SRC_DIR)}"
            )
            ldflags_native = f"-O3 -flto -L{native_lib} -lmp3lame -lopus -logg -lm -lpthread"
            f.write(f"rule cc_native\n  command = $clang {cflags_native} -c $in -o $out\n")
            f.write(f"rule link_native\n  command = $clang $in {ldflags_native} -o $out\n\n")

        cflags_wasm = (
            f"-target wasm32-wasip1 --sysroot={wasi_sysroot_posix} "
            f"-isystem {wasi_sysroot_posix}/include -isystem {wasi_sysroot_posix}/include/wasm32-wasip1 "
            f"-I{to_posix(NATIVE_SYSROOT / 'include')} "
            f"-I{to_posix(NATIVE_SYSROOT / 'include' / 'lame')} "
            f"-I{to_posix(lame_inc)} "
            f"-I{to_posix(LIBRARY_DIR / 'lame')} "
            f"-I{to_posix(lame_dir)} "
            f"-I{to_posix(opus_inc)} "
            f"-I{to_posix(LIBRARY_DIR / 'opus' / 'celt')} "
            f"-I{to_posix(LIBRARY_DIR / 'opus' / 'silk')} "
            f"-I{to_posix(LIBRARY_DIR / 'opus' / 'src')} "
            f"-I{to_posix(ogg_inc)} "
            f"-I{to_posix(SRC_DIR)} "
            "-O3 -flto -msimd128 -mbulk-memory -DNDEBUG -fvisibility=hidden -fno-exceptions -fno-rtti "
            "-DHAVE_CONFIG_H -DOPUS_BUILD -DVAR_ARRAYS -DFLOATING_POINT -DFLOAT_APPROX -DHAVE_LRINT -DHAVE_LRINTF -ffast-math -fno-math-errno "
            "-Wno-macro-redefined -Wno-absolute-value -Wno-shift-negative-value -Wno-tautological-pointer-compare"
        )
        ldflags_wasm = (
            f"-target wasm32-wasip1 --sysroot={wasi_sysroot_posix} "
            f"-L{wasi_sysroot_posix}/lib/wasm32-wasip1 -L{wasi_sysroot_posix}/lib "
            "-O3 -flto -msimd128 -mbulk-memory -nostartfiles -Wl,--no-entry -Wl,--allow-undefined "
            "-Wl,--gc-sections -Wl,--strip-all -Wl,--lto-O3 "
            "-Wl,-z,stack-size=1048576 -Wl,--initial-memory=16777216 -Wl,--max-memory=67108864 "
            "-Wl,--export=wasm_malloc -Wl,--export=wasm_free "
            "-Wl,--export=op3_transcode_monolithic -Wl,--export=op3_stream_init "
            "-Wl,--export=op3_stream_feed_packet -Wl,--export=op3_stream_flush -Wl,--export=op3_stream_destroy "
            "-lc -lm"
        )
        f.write(f"rule cc_wasm\n  command = $clang {cflags_wasm} -c $in -o $out\n")
        f.write(f"rule link_wasm\n  command = $clang {ldflags_wasm} $in -o $out\n\n")

        native_objs = []
        for src in native_sources:
            obj_n = f"native_{src.stem}.{'obj' if IS_WIN else 'o'}"
            f.write(f"build {obj_n}: cc_native {to_posix(src)}\n")
            native_objs.append(obj_n)

        out_bin = to_posix(DIST_DIR / "bin" / ("tunebloom-transcode.exe" if IS_WIN else "tunebloom-transcode"))
        f.write(f"build {out_bin}: link_native {' '.join(native_objs)}\n\n")

        wasm_sources = [
            SRC_DIR / "common" / "ogg_demux.c",
            SRC_DIR / "common" / "id3_tagger.c",
            SRC_DIR / "encoder" / "lame_v0_core.c",
            SRC_DIR / "bridge" / "op3transcode_bridge.c"
        ]
        wasm_sources += [lame_dir / f for f in LAME_C_FILES if (lame_dir / f).exists()]
        wasm_sources += wasm_opus_c_files

        wasm_objs = []
        for src in wasm_sources:
            obj_w = f"w_{src.stem}_{abs(hash(str(src))) % 100000}.o"
            f.write(f"build {obj_w}: cc_wasm {to_posix(src)}\n")
            wasm_objs.append(obj_w)

        out_wasm = to_posix(DIST_DIR / "wasm" / "op3transcode.wasm")
        f.write(f"build {out_wasm}: link_wasm {' '.join(wasm_objs)}\n")

    print("[*] Compiling native CLI and bare WebAssembly binary with Ninja...")
    subprocess.run([str(NINJA_EXE)], cwd=dag_dir, check=True)
    print(f"[+] Deliverables generated at: {DIST_DIR / 'bin'} and {DIST_DIR / 'wasm'}")

if __name__ == "__main__":
    main()