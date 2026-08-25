import gc
import gzip
import json
import os
import platform
import re
import shutil
import stat
import subprocess
import sys
import tarfile
import time
import urllib.request
import zipfile
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
TOOLCHAIN_DIR = ROOT_DIR / "toolchain"
LIBRARY_DIR = ROOT_DIR / "library"
CACHE_DIR = ROOT_DIR / ".forge_cache"
TMP_DIR = CACHE_DIR / "tmp"
WINSDK_DIR = TOOLCHAIN_DIR / "winsdk"
PYTHON_DIR = TOOLCHAIN_DIR / "python"

HOST_OS = sys.platform
HOST_ARCH = platform.machine().lower()
IS_WIN = HOST_OS == "win32"
IS_MAC = HOST_OS == "darwin"
IS_LINUX = HOST_OS.startswith("linux")

CLANG_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang.exe" if IS_WIN else "clang")
CLANG_CL_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("clang-cl.exe" if IS_WIN else "clang-cl")
LLD_LINK_EXE = TOOLCHAIN_DIR / "llvm" / "bin" / ("lld-link.exe" if IS_WIN else "lld-link")
CMAKE_EXE = TOOLCHAIN_DIR / "cmake" / "bin" / ("cmake.exe" if IS_WIN else "cmake")
NINJA_EXE = TOOLCHAIN_DIR / "ninja" / ("ninja.exe" if IS_WIN else "ninja")
NASM_EXE = TOOLCHAIN_DIR / "nasm" / ("nasm.exe" if IS_WIN else "nasm")
GIT_CMD_EXE = TOOLCHAIN_DIR / "git" / "cmd" / ("git.exe" if IS_WIN else "git")
HERMETIC_PYTHON_EXE = PYTHON_DIR / ("python.exe" if IS_WIN else "bin/python")

VS_CHANNEL_ENDPOINTS = [
    "https://aka.ms/vs/17/release/channel",
    "https://aka.ms/vs/17/release/vs_buildtools.json",
]
NUGET_SDK_CPP_URL = "https://www.nuget.org/api/v2/package/Microsoft.Windows.SDK.CPP"
NUGET_SDK_CPP_X64_URL = "https://www.nuget.org/api/v2/package/Microsoft.Windows.SDK.CPP.x64"
NUGET_SDK_BUILDTOOLS_URL = "https://www.nuget.org/api/v2/package/Microsoft.Windows.SDK.BuildTools"

URL_OPUS = "https://gitlab.xiph.org/xiph/opus/-/archive/v1.5.2/opus-v1.5.2.zip"
URL_LIBOGG = "https://github.com/xiph/ogg/archive/refs/tags/v1.3.5.zip"
URL_WASI_LIBC = "https://github.com/WebAssembly/wasi-libc/archive/refs/heads/main.zip"

REQUIRED_WIN_ANCHORS = ["libcmt.lib", "oldnames.lib", "kernel32.lib", "user32.lib", "ucrt.lib", "libcpmt.lib"]


def sanitize_path(path_obj: Path) -> str:
    return str(path_obj.resolve()).replace("\\", "/")


def to_unc_path(path: Path) -> str:
    resolved = str(path.resolve())
    if IS_WIN and not resolved.startswith("\\\\?\\"):
        return "\\\\?\\" + resolved.replace("/", "\\")
    return resolved


def remove_readonly(func, path, _):
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception:
        pass


def safe_rmtree(dir_path: Path, max_retries: int = 12, initial_delay: float = 0.1) -> None:
    if not dir_path.exists():
        return
    delay = initial_delay
    for attempt in range(max_retries):
        try:
            if sys.version_info >= (3, 12):
                shutil.rmtree(dir_path, onexc=lambda func, path, _: remove_readonly(func, path, None))
            else:
                shutil.rmtree(dir_path, onerror=remove_readonly)
            return
        except (PermissionError, OSError):
            if attempt == max_retries - 1:
                raise
            gc.collect()
            time.sleep(delay)
            delay *= 1.5


def copy_tree_contents(src_dir: Path, dest_dir: Path) -> int:
    copied_count = 0
    for item in src_dir.rglob("*"):
        if item.is_file():
            rel_path = item.relative_to(src_dir)
            target_file = dest_dir / rel_path
            target_str = to_unc_path(target_file)
            os.makedirs(os.path.dirname(target_str), exist_ok=True)
            shutil.copy2(to_unc_path(item), target_str)
            copied_count += 1
    return copied_count


def promote_directory(src_dir: Path, dest_dir: Path) -> None:
    if not src_dir.exists():
        return
    safe_rmtree(dest_dir)
    dest_dir.parent.mkdir(parents=True, exist_ok=True)
    try:
        os.rename(to_unc_path(src_dir), to_unc_path(dest_dir))
        return
    except (PermissionError, OSError):
        pass
    dest_dir.mkdir(parents=True, exist_ok=True)
    copy_tree_contents(src_dir, dest_dir)
    gc.collect()
    safe_rmtree(src_dir)


def parse_semver(ver_str: str) -> tuple[int, ...]:
    clean = re.sub(r"[^\d.]", "", ver_str)
    parts = [int(p) for p in clean.split(".") if p.isdigit()]
    return tuple(parts)


def probe_url(url: str) -> bool:
    clean_url = url.replace(" ", "%20")
    req = urllib.request.Request(clean_url, headers={"User-Agent": "tunebloom-hydrator/3.0"}, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=4) as resp:
            return resp.status == 200
    except Exception:
        return False


def fetch_http_text(url: str) -> str:
    clean_url = url.replace(" ", "%20")
    req = urllib.request.Request(
        clean_url,
        headers={"User-Agent": "tunebloom-hydrator/3.0", "Accept-Encoding": "gzip, deflate"}
    )
    with urllib.request.urlopen(req, timeout=15) as response:
        data = response.read()
        content_encoding = response.headers.get("Content-Encoding", "")
        if content_encoding == "gzip" or data.startswith(b"\x1f\x8b"):
            data = gzip.decompress(data)
        return data.decode("utf-8", errors="ignore")


def fetch_json(url: str) -> dict:
    text = fetch_http_text(url)
    stripped = text.lstrip()
    if stripped.startswith("<"):
        raise ValueError(f"Endpoint returned HTML content: {url}")
    return json.loads(text)


def fetch_github_latest_release(repo: str) -> dict:
    url = f"https://api.github.com/repos/{repo}/releases/latest"
    try:
        return fetch_json(url)
    except Exception:
        return {}


def fetch_payload(url: str, destination: Path) -> None:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    clean_url = url.replace(" ", "%20")
    print(f"[*] Downloading: {clean_url}")
    req = urllib.request.Request(clean_url, headers={"User-Agent": "tunebloom-hydrator/3.0"})
    with urllib.request.urlopen(req) as response, open(to_unc_path(destination), "wb") as out_file:
        shutil.copyfileobj(response, out_file)


def unpack_archive(archive_path: Path, extract_dir: Path, flatten_single_dir: bool = False) -> None:
    safe_rmtree(extract_dir)
    extract_dir.mkdir(parents=True, exist_ok=True)
    archive_str = str(archive_path)

    if archive_str.endswith((".zip", ".vsix", ".nupkg")):
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            for member in zip_ref.infolist():
                rel_path = member.filename.replace('/', os.sep)
                target_str = to_unc_path(extract_dir / rel_path)
                if member.is_dir():
                    os.makedirs(target_str, exist_ok=True)
                else:
                    os.makedirs(os.path.dirname(target_str), exist_ok=True)
                    with zip_ref.open(member) as src, open(target_str, "wb") as dst:
                        shutil.copyfileobj(src, dst)
    elif archive_str.endswith((".tar.xz", ".tar.gz", ".tgz")):
        with tarfile.open(archive_path, 'r:*') as tar_ref:
            for member in tar_ref.getmembers():
                rel_path = member.name.replace('/', os.sep)
                target_str = to_unc_path(extract_dir / rel_path)
                if member.isdir():
                    os.makedirs(target_str, exist_ok=True)
                elif member.isfile():
                    os.makedirs(os.path.dirname(target_str), exist_ok=True)
                    f_src = tar_ref.extractfile(member)
                    if f_src is not None:
                        with f_src, open(target_str, "wb") as f_dst:
                            shutil.copyfileobj(f_src, f_dst)

    if flatten_single_dir:
        entries = list(extract_dir.iterdir())
        if len(entries) == 1 and entries[0].is_dir():
            single_dir = entries[0]
            temp_dir = extract_dir.parent / f"_tmp_{extract_dir.name}"
            promote_directory(single_dir, temp_dir)
            promote_directory(temp_dir, extract_dir)


def resolve_python_runtime() -> tuple[str, str]:
    fallback_ver = "3.12.8"
    fallback_url = (
        f"https://www.python.org/ftp/python/{fallback_ver}/python-{fallback_ver}-embed-amd64.zip"
        if IS_WIN
        else f"https://github.com/astral-sh/python-build-standalone/releases/download/20260728/cpython-{fallback_ver}+20260728-x86_64-unknown-linux-gnu-install_only.tar.gz"
    )

    if IS_WIN:
        try:
            html = fetch_http_text("https://www.python.org/ftp/python/")
            matches = re.findall(r'href="(\d+\.\d+\.\d+)/"', html)
            sorted_vers = sorted(set(matches), key=parse_semver, reverse=True)
            for ver in sorted_vers:
                candidate_url = f"https://www.python.org/ftp/python/{ver}/python-{ver}-embed-amd64.zip"
                if probe_url(candidate_url):
                    return ver, candidate_url
        except Exception:
            pass
        return fallback_ver, fallback_url
    else:
        arch = "x86_64" if sys.maxsize > 2**32 else "i686"
        triple = f"{arch}-unknown-linux-gnu" if IS_LINUX else f"{arch}-apple-darwin"
        try:
            release = fetch_github_latest_release("astral-sh/python-build-standalone")
            tag = release.get("tag_name", "20260728")
            for asset in release.get("assets", []):
                name = asset.get("name", "")
                if triple in name and "install_only" in name and name.endswith(".tar.gz"):
                    download_url = asset.get("browser_download_url")
                    if probe_url(download_url):
                        return tag, download_url
        except Exception:
            pass
        return fallback_ver, fallback_url


def resolve_git_url() -> str:
    fallback_url = "https://github.com/git-for-windows/git/releases/download/v2.48.1.windows.1/MinGit-2.48.1-64-bit.zip"
    if not IS_WIN:
        return ""

    try:
        release = fetch_github_latest_release("git-for-windows/git")
        for asset in release.get("assets", []):
            name = asset.get("name", "")
            if name.startswith("MinGit-") and name.endswith("-64-bit.zip"):
                download_url = asset.get("browser_download_url")
                if probe_url(download_url):
                    return download_url
    except Exception:
        pass
    return fallback_url


def resolve_nasm_url() -> str:
    fallback_ver = "2.16.03"
    fallback_url = (
        f"https://www.nasm.us/pub/nasm/releasebuilds/{fallback_ver}/win64/nasm-{fallback_ver}-win64.zip"
        if IS_WIN
        else (
            f"https://www.nasm.us/pub/nasm/releasebuilds/{fallback_ver}/macosx/nasm-{fallback_ver}-macosx.zip"
            if IS_MAC
            else f"https://www.nasm.us/pub/nasm/releasebuilds/{fallback_ver}/linux/nasm-{fallback_ver}-linux.tar.xz"
        )
    )

    try:
        html = fetch_http_text("https://www.nasm.us/pub/nasm/releasebuilds/")
        matches = re.findall(r'href="(\d+\.\d+(?:\.\d+)?)/"', html)
        sorted_vers = sorted(set(matches), key=parse_semver, reverse=True)
        for ver in sorted_vers:
            if IS_WIN:
                candidate_url = f"https://www.nasm.us/pub/nasm/releasebuilds/{ver}/win64/nasm-{ver}-win64.zip"
            elif IS_MAC:
                candidate_url = f"https://www.nasm.us/pub/nasm/releasebuilds/{ver}/macosx/nasm-{ver}-macosx.zip"
            else:
                candidate_url = f"https://www.nasm.us/pub/nasm/releasebuilds/{ver}/linux/nasm-{ver}-linux.tar.xz"

            if probe_url(candidate_url):
                return candidate_url
    except Exception:
        pass
    return fallback_url


def resolve_upstream_tool_urls() -> tuple[str, str, str, str, str]:
    cmake_release = fetch_github_latest_release("Kitware/CMake")
    cmake_url = ""
    if cmake_release:
        for asset in cmake_release.get("assets", []):
            name = asset.get("name", "").lower()
            if IS_WIN and "windows-x86_64.zip" in name:
                cmake_url = asset.get("browser_download_url")
                break
            elif IS_MAC and "macos-universal" in name:
                cmake_url = asset.get("browser_download_url")
                break
            elif IS_LINUX and "linux-x86_64.tar.gz" in name:
                cmake_url = asset.get("browser_download_url")
                break
    if not cmake_url:
        cmake_url = "https://github.com/Kitware/CMake/releases/download/v3.31.5/cmake-3.31.5-windows-x86_64.zip"

    ninja_release = fetch_github_latest_release("ninja-build/ninja")
    ninja_url = ""
    if ninja_release:
        for asset in ninja_release.get("assets", []):
            name = asset.get("name", "").lower()
            if IS_WIN and "ninja-win.zip" in name:
                ninja_url = asset.get("browser_download_url")
                break
            elif IS_MAC and "ninja-mac.zip" in name:
                ninja_url = asset.get("browser_download_url")
                break
            elif IS_LINUX and "ninja-linux.zip" in name:
                ninja_url = asset.get("browser_download_url")
                break
    if not ninja_url:
        ninja_url = "https://github.com/ninja-build/ninja/releases/download/v1.12.1/ninja-win.zip"

    llvm_release = fetch_github_latest_release("llvm/llvm-project")
    llvm_url = ""
    if llvm_release:
        for asset in llvm_release.get("assets", []):
            name = asset.get("name", "").lower()
            if IS_WIN and "x86_64-pc-windows-msvc" in name and name.endswith(".tar.xz"):
                llvm_url = asset.get("browser_download_url")
                break
            elif IS_MAC and ("arm64-apple-darwin" in name or "x86_64-apple-darwin" in name) and name.endswith(".tar.xz"):
                if ("arm" in HOST_ARCH) == ("arm64" in name):
                    llvm_url = asset.get("browser_download_url")
                    break
            elif IS_LINUX and "x86_64-linux-gnu" in name and name.endswith(".tar.xz"):
                llvm_url = asset.get("browser_download_url")
                break
    if not llvm_url:
        llvm_url = "https://github.com/llvm/llvm-project/releases/download/llvmorg-18.1.8/clang+llvm-18.1.8-x86_64-pc-windows-msvc.tar.xz"

    nasm_url = resolve_nasm_url()
    git_url = resolve_git_url()

    return cmake_url, ninja_url, llvm_url, nasm_url, git_url


def hydrate_python() -> None:
    if HERMETIC_PYTHON_EXE.exists():
        return
    print("[*] Hydrating hermetic Python runtime...")
    PYTHON_DIR.mkdir(parents=True, exist_ok=True)
    _, py_url = resolve_python_runtime()

    if IS_WIN:
        archive_path = TMP_DIR / "python_embed.zip"
        fetch_payload(py_url, archive_path)
        unpack_archive(archive_path, PYTHON_DIR, flatten_single_dir=False)
        archive_path.unlink(missing_ok=True)
        for pth_file in PYTHON_DIR.glob("*._pth"):
            orig_lines = pth_file.read_text(encoding="utf-8").splitlines()
            core_zips = [line.strip() for line in orig_lines if line.strip().endswith(".zip")]
            payload_paths = core_zips + [".", "Lib/site-packages", "import site"]
            pth_file.write_text("\n".join(payload_paths) + "\n", encoding="utf-8")
    else:
        archive_path = TMP_DIR / "python_embed.tar.gz"
        fetch_payload(py_url, archive_path)
        temp_ext = TMP_DIR / "python_ext"
        unpack_archive(archive_path, temp_ext, flatten_single_dir=False)
        source_extracted = temp_ext / "python"
        if source_extracted.exists():
            for item in source_extracted.iterdir():
                shutil.move(str(item), str(PYTHON_DIR / item.name))
        safe_rmtree(temp_ext)
        archive_path.unlink(missing_ok=True)
        os.chmod(HERMETIC_PYTHON_EXE, 0o755)

    pip_bootstrapper = PYTHON_DIR / "get-pip.py"
    fetch_payload("https://bootstrap.pypa.io/get-pip.py", pip_bootstrapper)
    subprocess.run([str(HERMETIC_PYTHON_EXE), "-I", str(pip_bootstrapper), "--no-warn-script-location"], check=True)
    pip_bootstrapper.unlink(missing_ok=True)


def hydrate_toolchains() -> None:
    print("[*] Resolving and hydrating upstream host tools...")
    cmake_url, ninja_url, llvm_url, nasm_url, git_url = resolve_upstream_tool_urls()

    if IS_WIN and not GIT_CMD_EXE.exists() and git_url:
        archive = TMP_DIR / "mingit.zip"
        fetch_payload(git_url, archive)
        unpack_archive(archive, TOOLCHAIN_DIR / "git", flatten_single_dir=False)
        archive.unlink(missing_ok=True)

    if not CMAKE_EXE.exists():
        archive = TMP_DIR / ("cmake.zip" if cmake_url.endswith(".zip") else "cmake.tar.gz")
        fetch_payload(cmake_url, archive)
        temp_ext = TMP_DIR / "cmake_ext"
        unpack_archive(archive, temp_ext, flatten_single_dir=False)
        inner = next(temp_ext.iterdir())
        if IS_MAC and (inner / "CMake.app").exists():
            inner = inner / "CMake.app" / "Contents"
        promote_directory(inner, TOOLCHAIN_DIR / "cmake")
        safe_rmtree(temp_ext)
        archive.unlink(missing_ok=True)

    if not NINJA_EXE.exists():
        archive = TMP_DIR / "ninja.zip"
        fetch_payload(ninja_url, archive)
        unpack_archive(archive, TOOLCHAIN_DIR / "ninja", flatten_single_dir=False)
        archive.unlink(missing_ok=True)
        if not IS_WIN:
            os.chmod(NINJA_EXE, 0o755)

    if not (CLANG_CL_EXE if IS_WIN else CLANG_EXE).exists():
        archive = TMP_DIR / "llvm.tar.xz"
        fetch_payload(llvm_url, archive)
        temp_ext = TMP_DIR / "llvm_ext"
        unpack_archive(archive, temp_ext, flatten_single_dir=False)
        inner = next(temp_ext.iterdir())
        promote_directory(inner, TOOLCHAIN_DIR / "llvm")
        safe_rmtree(temp_ext)
        archive.unlink(missing_ok=True)
        if not IS_WIN:
            os.chmod(CLANG_EXE, 0o755)
            if LLD_LINK_EXE.exists():
                os.chmod(LLD_LINK_EXE, 0o755)

    if IS_WIN and not NASM_EXE.exists() and nasm_url:
        archive = TMP_DIR / "nasm.zip"
        fetch_payload(nasm_url, archive)
        temp_ext = TMP_DIR / "nasm_ext"
        unpack_archive(archive, temp_ext, flatten_single_dir=True)
        nasm_dest = TOOLCHAIN_DIR / "nasm"
        nasm_dest.mkdir(parents=True, exist_ok=True)
        for item in temp_ext.rglob("*"):
            if item.is_file() and item.name.lower() in ["nasm.exe", "ndisasm.exe"]:
                shutil.copy2(to_unc_path(item), to_unc_path(nasm_dest / item.name))
        safe_rmtree(temp_ext)
        archive.unlink(missing_ok=True)


def fetch_msvc_manifest_catalog() -> dict:
    for endpoint in VS_CHANNEL_ENDPOINTS:
        try:
            print(f"[*] Querying Visual Studio Manifest: {endpoint}")
            payload = fetch_json(endpoint)
            if "packages" in payload:
                return payload
            for item in payload.get("channelItems", []):
                item_type = item.get("type", "").lower()
                item_id = item.get("id", "").lower()
                if item_type == "manifest" or "manifest" in item_id:
                    for manifest_payload in item.get("payloads", []):
                        url = manifest_payload.get("url", "")
                        if url.endswith((".json", ".vsman")):
                            try:
                                cat = fetch_json(url)
                                if "packages" in cat:
                                    return cat
                            except Exception:
                                continue
        except Exception:
            continue
    raise RuntimeError("Failed to resolve Visual Studio Catalog Manifest.")


def extract_and_stage_vs_payload(pkg: dict, kind: str, dest_dir: Path) -> None:
    payloads = pkg.get("payloads", [])
    vsix_payloads = [p for p in payloads if not p.get("fileName", "").lower().endswith((".msi", ".cab"))]
    for payload in vsix_payloads:
        url = payload.get("url")
        if not url:
            continue
        file_name = payload.get("fileName", "payload.vsix")
        payload_file = TMP_DIR / file_name
        fetch_payload(url, payload_file)
        ext_dir = TMP_DIR / f"ext_{payload_file.stem}"
        try:
            unpack_archive(payload_file, ext_dir, flatten_single_dir=False)
            if kind == "crt_headers":
                matches = [p.parent for p in ext_dir.rglob("vcruntime.h")] or [p.parent for p in ext_dir.rglob("stdio.h")]
                copy_tree_contents(matches[0] if matches else ext_dir, dest_dir)
            elif kind == "crt_libs":
                for lib in ext_dir.rglob("*.lib"):
                    dest_lib = dest_dir / lib.name
                    shutil.copy2(to_unc_path(lib), to_unc_path(dest_lib))
        finally:
            safe_rmtree(ext_dir)
            payload_file.unlink(missing_ok=True)


def hydrate_winsdk() -> None:
    if not IS_WIN:
        return
    msvc_version = "14.44.35220"
    sdk_version = "10.0.26100.0"
    msvc_inc_target = WINSDK_DIR / "VC" / "Tools" / "MSVC" / msvc_version / "include"
    msvc_lib_target = WINSDK_DIR / "VC" / "Tools" / "MSVC" / msvc_version / "lib" / "x64"
    sdk_inc_target = WINSDK_DIR / "Windows Kits" / "10" / "Include" / sdk_version
    sdk_lib_target = WINSDK_DIR / "Windows Kits" / "10" / "Lib" / sdk_version
    version_marker = msvc_lib_target / ".version_14.44"

    if (msvc_inc_target / "vcruntime.h").exists() and version_marker.exists():
        return

    print("[*] Hydrating Windows SDK & MSVC CRT fakeroot...")
    os.makedirs(to_unc_path(msvc_inc_target), exist_ok=True)
    os.makedirs(to_unc_path(msvc_lib_target), exist_ok=True)
    os.makedirs(to_unc_path(sdk_inc_target), exist_ok=True)
    os.makedirs(to_unc_path(sdk_lib_target), exist_ok=True)

    packages = [
        ("winsdk_cpp.nupkg", NUGET_SDK_CPP_URL),
        ("winsdk_cpp_x64.nupkg", NUGET_SDK_CPP_X64_URL),
        ("winsdk_buildtools.nupkg", NUGET_SDK_BUILDTOOLS_URL),
    ]
    header_buckets = ["ucrt", "um", "shared", "winrt", "cppwinrt"]

    for nupkg_name, url in packages:
        nupkg_path = TMP_DIR / nupkg_name
        ext_dir = TMP_DIR / f"ext_{nupkg_path.stem}"
        try:
            fetch_payload(url, nupkg_path)
            unpack_archive(nupkg_path, ext_dir, flatten_single_dir=False)
            for item in ext_dir.rglob("*"):
                if not item.is_file():
                    continue
                parts_lower = [p.lower() for p in item.parts]
                file_name_lower = item.name.lower()
                if file_name_lower.endswith(".lib") and ("x64" in parts_lower or "amd64" in parts_lower):
                    bucket = "ucrt" if "ucrt" in parts_lower else "um"
                    target = sdk_lib_target / bucket / "x64" / item.name
                    os.makedirs(to_unc_path(target.parent), exist_ok=True)
                    shutil.copy2(to_unc_path(item), to_unc_path(target))
                elif file_name_lower.endswith((".h", ".hpp", ".idl")):
                    found_bucket = next((p for p in parts_lower if p in header_buckets), None)
                    if found_bucket:
                        b_idx = parts_lower.index(found_bucket)
                        rel_sub = Path(*item.parts[b_idx + 1:])
                        target = sdk_inc_target / found_bucket / rel_sub
                    else:
                        target = sdk_inc_target / "um" / item.relative_to(ext_dir)
                    os.makedirs(to_unc_path(target.parent), exist_ok=True)
                    shutil.copy2(to_unc_path(item), to_unc_path(target))
        finally:
            safe_rmtree(ext_dir)
            nupkg_path.unlink(missing_ok=True)

    catalog = fetch_msvc_manifest_catalog()
    catalog_packages = catalog.get("packages", [])

    crt_headers_pkgs = []
    crt_libs_pkgs = []
    for pkg in catalog_packages:
        pkg_id = pkg.get("id", "").lower()
        if pkg_id.startswith("microsoft.vc.") and pkg_id.endswith(".crt.headers.base"):
            crt_headers_pkgs.append(pkg)
        elif pkg_id.startswith("microsoft.vc.") and ("crt.x64" in pkg_id or "crt.desktop" in pkg_id):
            crt_libs_pkgs.append(pkg)

    crt_headers_pkgs.sort(key=lambda p: parse_semver(p.get("version", "0")))
    crt_libs_pkgs.sort(key=lambda p: parse_semver(p.get("version", "0")))

    for pkg in crt_headers_pkgs:
        try:
            extract_and_stage_vs_payload(pkg, "crt_headers", msvc_inc_target)
        except Exception:
            pass

    for pkg in crt_libs_pkgs:
        try:
            extract_and_stage_vs_payload(pkg, "crt_libs", msvc_lib_target)
        except Exception:
            pass

    if not (msvc_inc_target / "vcruntime.h").exists():
        raise RuntimeError("Sysroot hydration failure: vcruntime.h could not be extracted.")

    version_marker.write_text("14.44.35220\n", encoding="utf-8")


def hydrate_libraries() -> None:
    print("[*] Hydrating upstream library repositories...")
    LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
    if not (LIBRARY_DIR / "opus" / "src" / "opus_decoder.c").exists():
        archive = TMP_DIR / "opus.zip"
        fetch_payload(URL_OPUS, archive)
        unpack_archive(archive, LIBRARY_DIR / "opus", flatten_single_dir=True)
        archive.unlink(missing_ok=True)

    if not (LIBRARY_DIR / "libogg" / "src" / "framing.c").exists():
        archive = TMP_DIR / "libogg.zip"
        fetch_payload(URL_LIBOGG, archive)
        unpack_archive(archive, LIBRARY_DIR / "libogg", flatten_single_dir=True)
        archive.unlink(missing_ok=True)

    if not (LIBRARY_DIR / "wasi-libc" / "Makefile").exists() and not (LIBRARY_DIR / "wasi-libc" / "CMakeLists.txt").exists():
        archive = TMP_DIR / "wasi_libc.zip"
        fetch_payload(URL_WASI_LIBC, archive)
        unpack_archive(archive, LIBRARY_DIR / "wasi-libc", flatten_single_dir=True)
        archive.unlink(missing_ok=True)


def main() -> None:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    hydrate_python()
    hydrate_toolchains()
    hydrate_winsdk()
    hydrate_libraries()
    print("[+] Complete hermetic toolchain and library hydration finished.")


if __name__ == "__main__":
    main()