import urllib.request
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
VENDOR_DIR = ROOT_DIR / "assets" / "vendor"
FA_CSS_DIR = VENDOR_DIR / "fontawesome" / "css"
FA_FONTS_DIR = VENDOR_DIR / "fontawesome" / "webfonts"
WASM_DIR = ROOT_DIR / "wasm"

PAYLOADS = [
    (
        "https://cdn.tailwindcss.com",
        VENDOR_DIR / "tailwind.js"
    ),
    (
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
        FA_CSS_DIR / "all.min.css"
    ),
    (
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2",
        FA_FONTS_DIR / "fa-solid-900.woff2"
    ),
    (
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.ttf",
        FA_FONTS_DIR / "fa-solid-900.ttf"
    ),
    (
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2",
        FA_FONTS_DIR / "fa-brands-400.woff2"
    ),
    (
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2",
        FA_FONTS_DIR / "fa-regular-400.woff2"
    )
]

def hydrate_cdn_assets() -> None:
    VENDOR_DIR.mkdir(parents=True, exist_ok=True)
    FA_CSS_DIR.mkdir(parents=True, exist_ok=True)
    FA_FONTS_DIR.mkdir(parents=True, exist_ok=True)
    WASM_DIR.mkdir(parents=True, exist_ok=True)

    headers = {"User-Agent": "TuneBloom-Hermetic-Hydrator/2.0"}

    for url, dest_path in PAYLOADS:
        print(f"[*] Fetching: {url} -> {dest_path.relative_to(ROOT_DIR)}")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp, open(dest_path, "wb") as f:
            shutil.copyfileobj(resp, f)

    op3_src_wasm = ROOT_DIR.parent / "OP3Transcode" / "dist" / "wasm" / "op3transcode.wasm"
    op3_src_worker = ROOT_DIR.parent / "OP3Transcode" / "dist" / "wasm" / "op3transcode-worker.js"

    if op3_src_wasm.exists():
        shutil.copy2(op3_src_wasm, WASM_DIR / "op3transcode.wasm")
        print(f"[+] Staged: {op3_src_wasm.name} -> wasm/")
    if op3_src_worker.exists():
        shutil.copy2(op3_src_worker, WASM_DIR / "op3transcode-worker.js")
        print(f"[+] Staged: {op3_src_worker.name} -> wasm/")

    print("[+] Hermetic asset hydration complete. Zero CDN dependencies remain.")

if __name__ == "__main__":
    hydrate_cdn_assets()