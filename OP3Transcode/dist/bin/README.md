# `tunebloom-transcode` Native CLI

**High-Performance Opus to VBR V0 MP3 Converter**

`tunebloom-transcode` is a standalone C executable that decompresses RFC 7845 Ogg Opus bitstreams and re-encodes them into 48.0 kHz VBR V0 MP3 bitstreams with Xing seek tables and ID3v2.4 tags.

## Syntax & Invocation

```bash
tunebloom-transcode <input.opus> <output.mp3> [vbr_quality: 0-9]
```

### Positional Arguments

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `<input.opus>` | File Path | *Required* | Input RFC 7845 Ogg Opus bitstream (48.0 kHz, 1 or 2 channels). |
| `<output.mp3>` | File Path | *Required* | Destination path for the generated MP3 bitstream. |
| `[vbr_quality]` | Integer | `0` | Target VBR Quality (`0` = V0 Highest Quality, `9` = Lowest Quality). |

## Core Technical Operations

* **Ogg Demuxing**: Parses chained and multiplexed Ogg pages, extracting `OpusHead` metadata and individual audio frames.
* **Pre-Skip Handling**: Automatically extracts and discards the 312 lookahead samples specified in `OpusHead.pre_skip`.
* **Direct Float Ingestion**: Streams decoded 32-bit floats directly into LAME without integer conversions.
* **Xing VBR Header**: Rewrites Frame 0 post-encoding with the complete 100-point seek table, stream length, and LAME tag padding metadata.
* **ID3v2.4 Serialization**: Prepends standard UTF-8 ID3v2.4 metadata frames.
