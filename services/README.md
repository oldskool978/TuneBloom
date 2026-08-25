# TuneBloom Unified Services & Compute Daemon Routing Layer

The **TuneBloom Service Router** (`services/router.py`) orchestrates the single-consumer synthesis pipeline, cryptographic proof-of-work bot defense, session management, and dual-mode deployment architectures (Caddy reverse proxy and hermetic standalone desktop environments).

---

## Architecture & Topology

```text
+-----------------------------------------------------------------------------+
|                            Client Ingress Layer                             |
|  [Caddy Gateway: fiducialpoint.com]  OR  [Native Standalone: PyWebView]      |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                        TuneBloom FastApi Daemon                             |
|                                                                             |
|  1. Security Middleware   : COOP (same-origin), COEP (require-corp)         |
|  2. PoW Guard Engine      : SHA-256 Nonce Verification & Replay Protection  |
|  3. Multi-Prefix Router   : Resolves /v1, /api/v1, /TuneBloom/api/v1        |
|  4. Async Compute Queue   : Strict Serial Single-Job Worker Synchronization |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                   Hermetic 3-Stage Accelerator Pipeline                     |
|                                                                             |
|  [Stage 1: Harmonic Composition]   -->  Intelligen Engine (32 kHz WAV)      |
|  [Stage 2: Bandwidth Extension]    -->  Furgie ODE Solver (48 kHz WAV)      |
|  [Stage 3: Psychoacoustic Limiter] -->  SICKOMODE Limiter (48 kHz Ogg Opus) |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                            Persistence Engine                               |
|  - User Vault Storage : storage/users/{slug}/tracks/{job_id}_master.opus  |
|  - Discography State  : storage/users/{slug}/history.json                 |
|  - Ephemeral Artifacts: artifacts/{job_id}.opus (TTL Auto-Prune)           |
+-----------------------------------------------------------------------------+
```

---

## Core System Invariants

* **Single-Consumer Queue Isolation**: GPU memory operations across PyTorch generative pipelines are strictly serialized through an asynchronous worker queue (`ComputeQueue`), preventing out-of-memory faults and resource thrashing while providing live queue telemetry.
* **Hermetic Hardware Memory Reclamation**: Automatic invocation of `gc.collect()`, `torch.cuda.empty_cache()`, and `torch.cuda.ipc_collect()` between sequential inference stages ensures deterministic VRAM ceilings.
* **Dual Gateway Route Parity**: Uniform API binding across root, relative, and reverse-proxy prefixes guarantees execution parity between remote production servers and isolated local webviews.
* **Proof-of-Work Bot Mitigation**: Cryptographically signed SHA-256 challenges with non-reusable sliding-window replay caching validate client CPU proof before admitting requests into the queue.
* **Isolated Default Starter Asset**: Excludes reserved artwork (`default.jpg`) from dynamic hash roulette assignment pools to ensure the permanent showcase track remains anchored.

---

## Endpoints Specification

| Method | Route | Description |
| :--- | :--- | :--- |
| **GET** | `/auth/challenge` | Issues dynamic PoW challenge with difficulty target and HMAC signature |
| **POST** | `/auth/login` | Authenticates user handle, seeds quota, returns token and track history |
| **GET** | `/themes/registry` | Serves registered theme palettes, ambient animations, and easter eggs |
| **GET** | `/health` | Provides engine availability and active compute device status |
| **POST** | `/synthesize` | Validates PoW solution, admits job to compute queue, returns job status |
| **GET** | `/jobs/{job_id}` | Polls real-time progress percentage, stage description, and queue position |
| **GET** | `/audio/{job_id}` | Direct download stream for temporary artifact bitstreams |
| **GET** | `/audio/stream/{user_slug}/{filename}` | Serves persisted master audio streams from user discography vault |

---

## Execution Modes

### 1. Standalone Desktop Mode
Launches the native desktop interface with an embedded hardware-accelerated WebView:
```bash
python services/router.py --standalone
```

### 2. Headless Daemon Mode (Proxy Backend)
Runs the unified ASGI daemon bound to localhost for Caddy or Nginx reverse-proxy ingress:
```bash
python services/router.py --host 127.0.0.1 --port 8765 --headless
```
