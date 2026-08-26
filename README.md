# TuneBloom
### *Music generation for the rest of us.*

TuneBloom is a local music generator. It runs on your own hardware.

---

## How It Works

To the user, it's a clean creation canvas: write your lyrics, tweak the tempo and genre vibe, and hit synthesize. Behind the scenes, it runs a 4-stage production pipeline:

1. **Stage 1 (`Intelligen`)**: Takes your prompt, genre setup, and lyric sections, then synthesizes the core song at 32.0 kHz.
2. **Stage 2 (`furgie`)**: Automatically cleans up high-frequency air and upscales the acoustic space to 48.0 kHz 32-bit float PCM.
3. **Stage 3 (`SICKOMODE`)**: Runs a psychoacoustic limiter locking the true peak ceiling at -0.30 dBTP maximizing silk behavior in downwind encoder.
4. **Stage 4 (`Boompus` & `OP3Transcode`)**: Encodes the final master to 192k CVBR Opus via native binary and transcodes to MP3 in-browser using WebAssembly.

Prompt in, music out.

---

## Footprint & Hardware Reality

* **Repo Size:** The Git repo is around **9 MB**—just the code, web UI, blueprints, and build scripts.
* **Full Setup:** Once you pull down the model checkpoints, weights, and upscalers, it takes up around **70 GB** on disk.
* **VRAM:** **32 GB VRAM** is recommended to run full generations without memory bottlenecks.
* **Running on Lower VRAM:** There are already hooks in the backend modules for CPU offloading and tiling (`cpu_offload=True`, tile progress loops). They aren't wired up to the main UI toggles yet, but the code is there if you want to tweak it for smaller cards.

---

## Architecture & Roadmap

Right now, TuneBloom is wired up to **MiniMax Music 3** for composition, but the backend is decoupled from the inference model:

```text
[ Web UI / Standalone App ]
            │
    (FastAPI / SSE)
            │
   [ services/router.py ]
            │
  ┌─────────┼─────────┬─────────┐
  ▼         ▼         ▼         ▼
Stage 1   Stage 2   Stage 3   Stage 4
Harmonics Upscale   Limiter   Transcode
```

The frontend, state engine, and prompt blueprints are completely separate from the core generative models. Expect the UI to grow, and you can plug in other open-weights models down the road as new ones drop.

---

## Setup & Tool Staging

TuneBloom isn't a single-package pip install. Running the full studio pipeline requires staging and configuring multiple separate tools and model checkpoints:

* **Inference Weights:** MiniMax Music checkpoints (~70 GB staged).
* **Sub-Engines:** `Intelligen`, `furgie`, `SICKOMODE`, `Boompus`, and `OP3Transcode`.
* **Native Binaries & Environments:** Platform-specific audio encoders and PyTorch/CUDA dependencies.

Dedicated, step-by-step installation guides for every individual subsystem are currently being written.

In the meantime, if you know your way around PyTorch environments and build setups, feel free to clone the repo, explore the modules, and stage the dependencies independently.

---

## Runtime Modes & CLI Flags

`services/router.py` handles both standalone desktop mode and headless server daemon routing.

### 1. Desktop Standalone Mode
Launches a native desktop window (via pywebview):
```bash
python services/router.py --standalone --port 8765
```

### 2. Headless Server Mode
Runs strictly as an ASGI backend for local network access:
```bash
python services/router.py --headless --host 0.0.0.0 --port 8765
```

### 3. Custom Site Roots & Reverse Proxies
If you're running TuneBloom behind a reverse proxy (like Caddy or Nginx) or serving a custom webroot and user config file, you can explicitly point the router to your assets and authoritative user registry:

```bash
python services/router.py --headless \
  --host 127.0.0.1 \
  --port 8765 \
  --site-root /path/to/webui \
  --config /path/to/users.json
```

* `--site-root`: Explicit path to the directory containing `index.html`, `assets/`, and themes.
* `--config`: Explicit path to the authoritative `users.json` containing creator handles, token quotas, and permissions.

---

## Fork & Tinker

If you want to build custom prompt blueprints, add new jewel case themes, mess with the limiter curves, or wire up different model weights, dive in. Check out `webui/assets/js/blueprints.js` and `services/router.py`.

---

## License

MIT. Do as you see fit.
