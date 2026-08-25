import json
from pathlib import Path

PUBLIC_JEWELCASES_DIR = Path(__file__).resolve().parent.parent / "public" / "jewelcases"
VALID_EXTS = {".png", ".webp", ".jpg", ".jpeg", ".avif"}
RESERVED_DEFAULT_COVERS = {"default.jpg", "default.png", "midnight.jpg", "case_default.png"}

def build_manifest() -> None:
    PUBLIC_JEWELCASES_DIR.mkdir(parents=True, exist_ok=True)
    covers = []

    for file_path in PUBLIC_JEWELCASES_DIR.rglob("*"):
        if file_path.is_file() and file_path.suffix.lower() in VALID_EXTS:
            if file_path.name in RESERVED_DEFAULT_COVERS:
                continue
            rel_path = file_path.relative_to(PUBLIC_JEWELCASES_DIR).as_posix()
            covers.append(rel_path)

    covers.sort()
    manifest_payload = {
        "version": 1,
        "default": "default.jpg",
        "total": len(covers),
        "covers": covers
    }

    manifest_path = PUBLIC_JEWELCASES_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest_payload, indent=2), encoding="utf-8")
    print(f"[+] Indexed {len(covers)} jewel cases into {manifest_path}")

if __name__ == "__main__":
    build_manifest()