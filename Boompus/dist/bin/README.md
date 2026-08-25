# `tunebloom-opusenc` Native Mastering CLI
**High-Fidelity IEEE 754 32-Bit Float Opus Converter**

`tunebloom-opusenc` is a high-performance, standalone C executable designed to encode master audio into production-grade Opus streams encapsulated within RFC 7845 compliant Ogg bitstreams.

---

## Syntax & Command-Line Invocation

```bash
tunebloom-opusenc <input.wav> <output.opus> [bitrate_kbps] [--cvbr|--vbr|--cbr]
```

### Positional Arguments & Options

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `<input.wav>` | File Path | *Required* | 48.0 kHz 32-bit Float PCM RIFF WAV file (SICKOMODE / Furgie master output). |
| `<output.opus>` | File Path | *Required* | Destination path for the generated Ogg Opus bitstream. |
| `[bitrate_kbps]` | Integer | `192` | Target bitrate in kilobits per second (Valid range: `32` to `512` kbps). |
| `--cvbr` | Flag | **Default** | **Constrained Variable Bitrate**: Enforces bounded bit allocation for streaming delivery. |
| `--vbr` | Flag | Optional | **Unconstrained Variable Bitrate**: Maximizes fidelity during complex transient passages. |
| `--cbr` | Flag | Optional | **Constant Bitrate**: Hard-locks bit output per frame for rigid transport links. |

---

## Acoustic & Algorithmic Parameters

* **Float-Direct Processing**: Uses `opus_encode_float()` directly on 32-bit floating-point samples to prevent integer quantization errors or clipping.
* **Algorithmic Complexity**: Hardcoded to `10` (maximum psychoacoustic lookahead and dynamic bit allocation).
* **Audio Bandwidth**: `OPUS_BANDWIDTH_FULLBAND` (hard 20.0 kHz audio cutoff, covering all 21 CELT subbands).
* **Frame Duration**: 20.0 ms (960 samples @ 48 kHz), aligning with the CELT transient synthesis geometry.
* **Lookahead Accounting**: Queries the encoder lookahead pre-skip directly and embeds it into the `OpusHead` packet header.

---

## Example Invocations

```powershell
# Web Delivery Master (160 kbps CVBR)
.\tunebloom-opusenc.exe master_48k.wav web_release.opus 160 --cvbr

# Reference Studio Master (256 kbps Unconstrained VBR)
.\tunebloom-opusenc.exe master_48k.wav reference_master.opus 256 --vbr

# Archival Quality Master (320 kbps CVBR)
.\tunebloom-opusenc.exe master_48k.wav archive_320k.opus 320 --cvbr
```
