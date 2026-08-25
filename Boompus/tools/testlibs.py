import os
import urllib.request
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.resolve()
CACHE_DIR = ROOT_DIR / ".forge_cache"
LIBS_DIR = CACHE_DIR / "test_libs"

def hydrate_test_libs() -> None:
    print("[*] Hydrating local UI dependencies for COOP/COEP isolation compatibility...")
    LIBS_DIR.mkdir(parents=True, exist_ok=True)
    
    tailwind_url = "https://cdn.tailwindcss.com"
    tailwind_dest = LIBS_DIR / "tailwind.js"
    
    if not tailwind_dest.exists():
        print(f"  -> Downloading Tailwind CSS runtime from {tailwind_url} ...")
        req = urllib.request.Request(tailwind_url, headers={"User-Agent": "tunebloom-hydrator/3.0"})
        with urllib.request.urlopen(req) as resp, open(tailwind_dest, "wb") as f:
            f.write(resp.read())
        print("  [+] Tailwind CSS hydrated locally.")
    else:
        print("  [+] Tailwind CSS already hydrated.")

if __name__ == "__main__":
    hydrate_test_libs()