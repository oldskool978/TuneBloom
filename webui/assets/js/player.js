class PlayerEngine {
  constructor() {
    this.audioCtx = null;
    this.workletNode = null;
    this.analyser = null;
    this.gainNode = null;
    this.decoderWasmBytes = null;
    this.wasmFetchPromise = null;
    this.transcodeInitPromise = null;
    this.freqData = null;
    this.activeTrack = null;
    this.cachedOpusArrayBuffer = null;
    this.audioPackets = [];
    this.preSkipSamples = 312;
    this.currentPacketIndex = 0;
    this.totalSamples = 0;
    this.totalDurationSec = 0;
    this.playbackPositionSec = 0;
    this.lastTime = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.isSeeking = false;
    this.previousVolume = 0.8;
    this.isFlipped = false;
    this.animFrameId = null;
    this.transcodeWorker = null;
    this.transcodeWorkerReady = false;

    this.initEngine();
    this.initAudioListeners();
    this.initTranscoderWorker();
    this.initParallaxInteractivity();
  }

  async initEngine() {
    if (this.decoderWasmBytes) return this.decoderWasmBytes;
    if (this.wasmFetchPromise) return this.wasmFetchPromise;
    this.wasmFetchPromise = (async () => {
      const candidates = [
        new URL("wasm/tunebloom_decoder.wasm", document.baseURI).href,
        new URL("wasm/boompus.wasm", document.baseURI).href,
        new URL("../dist/wasm/tunebloom_decoder.wasm", document.baseURI).href
      ];
      for (const url of candidates) {
        try {
          const resp = await fetch(url);
          if (resp.ok) {
            this.decoderWasmBytes = await resp.arrayBuffer();
            return this.decoderWasmBytes;
          }
        } catch {}
      }
      return null;
    })();
    return this.wasmFetchPromise;
  }

  initAudioListeners() {
    const seekSlider = document.getElementById("seek-slider");
    if (seekSlider) {
      seekSlider.addEventListener("pointerdown", () => {
        this.isSeeking = true;
      });
      seekSlider.addEventListener("input", (e) => {
        this.isSeeking = true;
        const pct = parseFloat(e.target.value);
        seekSlider.style.setProperty("--seek-pct", `${pct}%`);
        if (this.totalDurationSec > 0) {
          const targetSec = (pct / 100.0) * this.totalDurationSec;
          const timeCurrent = document.getElementById("time-current");
          if (timeCurrent) timeCurrent.textContent = this.formatTime(targetSec);
        }
      });
      seekSlider.addEventListener("change", (e) => {
        const pct = parseFloat(e.target.value);
        this.seek(pct);
        this.isSeeking = false;
      });
      seekSlider.addEventListener("pointerup", () => {
        this.isSeeking = false;
      });
    }
  }

  async initTranscoderWorker() {
    if (this.transcodeWorkerReady && this.transcodeWorker) return;
    if (this.transcodeInitPromise) return this.transcodeInitPromise;
    this.transcodeInitPromise = (async () => {
      try {
        const workerUrl = new URL("wasm/op3transcode-worker.js", document.baseURI).href;
        const wasmUrl = new URL("wasm/op3transcode.wasm", document.baseURI).href;
        this.transcodeWorker = new Worker(workerUrl);
        this.transcodeWorker.onmessage = (e) => {
          const msg = e.data;
          if (msg.type === "READY") {
            this.transcodeWorkerReady = true;
          } else if (msg.type === "TRANSCODE_COMPLETE") {
            this.handleTranscodeComplete(msg);
          } else if (msg.type === "ERROR") {
            this.handleTranscodeError(msg.error);
          }
        };
        const wasmResp = await fetch(wasmUrl);
        if (wasmResp.ok) {
          const wasmBytes = await wasmResp.arrayBuffer();
          this.transcodeWorker.postMessage({ type: "INIT", wasmBytes }, [wasmBytes]);
        }
      } catch {
        this.transcodeWorkerReady = false;
      }
    })();
    return this.transcodeInitPromise;
  }

  initParallaxInteractivity() {
    const stage = document.getElementById("jewel-card-flipper");
    if (!stage) return;
    stage.addEventListener("mousemove", (e) => {
      if (this.isFlipped) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      stage.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    stage.addEventListener("mouseleave", () => {
      stage.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
    });
  }

  isHeaderPacket(pkt) {
    if (!pkt || pkt.length < 8) return false;
    const head = [79, 112, 117, 115, 72, 101, 97, 100];
    const tags = [79, 112, 117, 115, 84, 97, 103, 115];
    let isHead = true;
    let isTags = true;
    for (let i = 0; i < 8; i++) {
      if (pkt[i] !== head[i]) isHead = false;
      if (pkt[i] !== tags[i]) isTags = false;
    }
    return isHead || isTags;
  }

  getOpusPacketSampleCount(pkt, sampleRate = 48000) {
    if (!pkt || pkt.length < 1) return 960;
    const toc = pkt[0];
    const config = (toc >> 3) & 0x1f;
    const code = toc & 0x03;
    let frameSamples = 960;
    if (config >= 0 && config <= 11) {
      const sub = config & 0x03;
      if (sub === 0) frameSamples = 480;
      else if (sub === 1) frameSamples = 960;
      else if (sub === 2) frameSamples = 1920;
      else if (sub === 3) frameSamples = 2880;
    } else if (config >= 12 && config <= 15) {
      const sub = config & 0x01;
      frameSamples = sub === 0 ? 480 : 960;
    } else if (config >= 16 && config <= 31) {
      const sub = config & 0x03;
      if (sub === 0) frameSamples = 120;
      else if (sub === 1) frameSamples = 240;
      else if (sub === 2) frameSamples = 480;
      else if (sub === 3) frameSamples = 960;
    }
    let frameCount = 1;
    if (code === 1 || code === 2) {
      frameCount = 2;
    } else if (code === 3) {
      if (pkt.length > 1) {
        frameCount = pkt[1] & 0x3f;
      }
    }
    const total = frameSamples * frameCount;
    return sampleRate === 48000 ? total : Math.floor((total * sampleRate) / 48000);
  }

  parseOggOpusStream(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const bytes = new Uint8Array(arrayBuffer);
    const packets = [];
    let offset = 0;
    let cumulativeSamples = 0;
    let extractedPreSkip = 312;
    let finalGranule = -1n;
    let pendingSegments = [];

    while (offset + 27 <= bytes.length) {
      if (
        bytes[offset] === 0x4f &&
        bytes[offset + 1] === 0x67 &&
        bytes[offset + 2] === 0x67 &&
        bytes[offset + 3] === 0x53
      ) {
        const headerType = bytes[offset + 5];
        const isContinued = (headerType & 0x01) !== 0;
        const isEos = (headerType & 0x04) !== 0;
        const pageGranule = view.getBigInt64(offset + 6, true);
        const numSegments = bytes[offset + 26];
        if (offset + 27 + numSegments > bytes.length) break;

        const segmentTable = bytes.subarray(offset + 27, offset + 27 + numSegments);
        let bodyOffset = offset + 27 + numSegments;

        if (isEos && pageGranule > 0n) {
          finalGranule = pageGranule;
        }

        if (!isContinued && pendingSegments.length > 0) {
          pendingSegments = [];
        }

        let segIdx = 0;
        while (segIdx < numSegments) {
          const segLen = segmentTable[segIdx++];
          const spansNext = segLen === 255;
          if (bodyOffset + segLen > bytes.length) break;

          const slice = bytes.subarray(bodyOffset, bodyOffset + segLen);
          bodyOffset += segLen;
          pendingSegments.push(slice);

          if (!spansNext) {
            let totalLen = 0;
            for (let i = 0; i < pendingSegments.length; i++) {
              totalLen += pendingSegments[i].length;
            }
            const pktData = new Uint8Array(totalLen);
            let writeOffset = 0;
            for (let i = 0; i < pendingSegments.length; i++) {
              pktData.set(pendingSegments[i], writeOffset);
              writeOffset += pendingSegments[i].length;
            }
            pendingSegments = [];

            if (
              pktData.length >= 19 &&
              pktData[0] === 79 &&
              pktData[1] === 112 &&
              pktData[2] === 117 &&
              pktData[3] === 115 &&
              pktData[4] === 72
            ) {
              extractedPreSkip = pktData[10] | (pktData[11] << 8);
            } else if (!this.isHeaderPacket(pktData)) {
              const samplesInPkt = this.getOpusPacketSampleCount(pktData, 48000);
              packets.push({
                data: pktData,
                sampleOffset: cumulativeSamples,
                timeSec: cumulativeSamples / 48000.0,
                samples: samplesInPkt
              });
              cumulativeSamples += samplesInPkt;
            }
          }
        }
        offset = bodyOffset;
      } else {
        offset++;
      }
    }

    let activeSamples = cumulativeSamples - extractedPreSkip;
    if (finalGranule > 0n) {
      const granInt = Number(finalGranule) - extractedPreSkip;
      if (granInt > 0 && Math.abs(granInt - activeSamples) < 5760) {
        activeSamples = granInt;
      }
    }
    activeSamples = Math.max(0, activeSamples);

    return {
      packets,
      preSkip: extractedPreSkip,
      totalSamples: activeSamples,
      durationSec: activeSamples / 48000.0
    };
  }

  async initAudioWorklet() {
    if (this.audioCtx && this.workletNode) return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      try {
        this.audioCtx = new AudioCtxClass({ sampleRate: 48000, latencyHint: "playback" });
      } catch {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (!this.analyser) {
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    if (!this.gainNode) {
      this.gainNode = this.audioCtx.createGain();
      const volumeSlider = document.getElementById("volume-slider");
      const initVol = volumeSlider ? parseFloat(volumeSlider.value) / 100 : 0.8;
      this.gainNode.gain.value = initVol;
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
    }

    const workletCode = `
      class TuneBloomWorkletProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
          this.wasmInstance = null;
          this.wasmMemory = null;
          this.decoderHandle = 0;
          this.inPtr = 0;
          this.scratchPtr = 0;
          this.isPlaying = false;
          this.isPulling = false;
          this.preSkipPending = 0;

          this.hostRate = sampleRate;
          this.srcRate = 48000;
          this.ratio = this.srcRate / this.hostRate;
          this.isIdentityRate = (this.hostRate === 48000);

          this.resampMu = 0.0;
          this.hL = new Float32Array(4);
          this.hR = new Float32Array(4);
          this.hFilled = false;

          this.stagingInterleaved = new Float32Array(2048);
          this.stagingReadIdx = 0;
          this.stagingAvailable = 0;

          this.samplePair = new Float32Array(2);

          this.port.onmessage = async (e) => {
            const msg = e.data;
            if (msg.type === "INIT") {
              const wasiShim = new Proxy({}, { get: () => () => 0 });
              const importObj = { env: wasiShim, wasi_snapshot_preview1: wasiShim, wasi_unstable: wasiShim };
              const { instance } = await WebAssembly.instantiate(msg.wasmBytes, importObj);
              this.wasmInstance = instance;
              this.wasmMemory = instance.exports.memory;
              this.decoderHandle = instance.exports.tb_decoder_init(48000, 2);
              this.inPtr = instance.exports.wasm_malloc(4096);
              this.scratchPtr = instance.exports.wasm_malloc(4096 * 4);
              this.isPulling = false;
              this.port.postMessage({ type: "READY" });
            } else if (msg.type === "FEED_PACKETS" && this.decoderHandle) {
              this.isPulling = false;
              const pkts = msg.packets;
              const wasmView = new Uint8Array(this.wasmMemory.buffer, this.inPtr, 4096);
              for (let i = 0; i < pkts.length; i++) {
                const pkt = pkts[i];
                wasmView.set(pkt);
                this.wasmInstance.exports.tb_decoder_decode_to_ring(
                  this.decoderHandle,
                  this.inPtr,
                  pkt.length
                );
              }
              this.drainPreSkip();
            } else if (msg.type === "SEEK_FLUSH") {
              if (this.wasmInstance && this.decoderHandle) {
                this.wasmInstance.exports.tb_decoder_reset(this.decoderHandle);
              }
              this.isPulling = false;
              this.preSkipPending = msg.isStart ? msg.preSkip : 0;
              this.stagingReadIdx = 0;
              this.stagingAvailable = 0;
              this.resampMu = 0.0;
              this.hFilled = false;
              this.hL.fill(0);
              this.hR.fill(0);
            } else if (msg.type === "SET_STATE") {
              this.isPlaying = msg.isPlaying;
            }
          };
        }

        drainPreSkip() {
          if (this.preSkipPending <= 0 || !this.decoderHandle) return;
          const availFloats = this.wasmInstance.exports.tb_decoder_ring_avail(this.decoderHandle);
          const availSamples = Math.floor(availFloats / 2);
          const toDrain = Math.min(availSamples, this.preSkipPending);
          if (toDrain > 0) {
            const floatsToDrain = toDrain * 2;
            let drained = 0;
            while (drained < floatsToDrain) {
              const chunk = Math.min(floatsToDrain - drained, 4096);
              this.wasmInstance.exports.tb_decoder_ring_read(this.decoderHandle, this.scratchPtr, chunk);
              drained += chunk;
            }
            this.preSkipPending -= toDrain;
          }
        }

        fetchSourceSample(pairOut) {
          if (this.stagingReadIdx >= this.stagingAvailable) {
            const availFloats = this.wasmInstance.exports.tb_decoder_ring_avail(this.decoderHandle);
            if (availFloats < 2) return false;
            const maxFloatsToRead = this.stagingInterleaved.length;
            const toReadFloats = Math.min(availFloats - (availFloats % 2), maxFloatsToRead);
            if (toReadFloats < 2) return false;
            const readCount = this.wasmInstance.exports.tb_decoder_ring_read(
              this.decoderHandle,
              this.scratchPtr,
              toReadFloats
            );
            if (readCount < 2) return false;
            const wasmFloatView = new Float32Array(this.wasmMemory.buffer, this.scratchPtr, readCount);
            this.stagingInterleaved.set(wasmFloatView);
            this.stagingAvailable = readCount;
            this.stagingReadIdx = 0;
          }
          pairOut[0] = this.stagingInterleaved[this.stagingReadIdx++];
          pairOut[1] = this.stagingInterleaved[this.stagingReadIdx++];
          return true;
        }

        interpolateHermite(x_m1, x_0, x_1, x_2, mu) {
          const c0 = x_0;
          const c1 = 0.5 * (x_1 - x_m1);
          const c2 = x_m1 - 2.5 * x_0 + 2.0 * x_1 - 0.5 * x_2;
          const c3 = 0.5 * (x_2 - x_m1) + 1.5 * (x_0 - x_1);
          return ((c3 * mu + c2) * mu + c1) * mu + c0;
        }

        process(inputs, outputs) {
          const out = outputs[0];
          const channelCount = out.length;
          const left = out[0];
          const right = channelCount > 1 ? out[1] : null;
          const quantum = left.length;

          if (!this.isPlaying || !this.decoderHandle) {
            for (let i = 0; i < quantum; i++) {
              left[i] = 0.0;
              if (right) right[i] = 0.0;
            }
            return true;
          }

          const pair = this.samplePair;

          if (this.isIdentityRate) {
            let written = 0;
            while (written < quantum) {
              if (!this.fetchSourceSample(pair)) break;
              const l = pair[0];
              const r = pair[1];
              if (right) {
                left[written] = Math.max(-1.0, Math.min(1.0, l));
                right[written] = Math.max(-1.0, Math.min(1.0, r));
              } else {
                left[written] = Math.max(-1.0, Math.min(1.0, 0.70710678 * (l + r)));
              }
              written++;
            }
            for (let i = written; i < quantum; i++) {
              left[i] = 0.0;
              if (right) right[i] = 0.0;
            }
          } else {
            if (!this.hFilled) {
              for (let k = 0; k < 4; k++) {
                if (this.fetchSourceSample(pair)) {
                  this.hL[k] = pair[0];
                  this.hR[k] = pair[1];
                } else {
                  this.hL[k] = 0.0;
                  this.hR[k] = 0.0;
                }
              }
              this.hFilled = true;
            }

            let written = 0;
            while (written < quantum) {
              while (this.resampMu >= 1.0) {
                this.hL[0] = this.hL[1];
                this.hL[1] = this.hL[2];
                this.hL[2] = this.hL[3];

                this.hR[0] = this.hR[1];
                this.hR[1] = this.hR[2];
                this.hR[2] = this.hR[3];

                if (this.fetchSourceSample(pair)) {
                  this.hL[3] = pair[0];
                  this.hR[3] = pair[1];
                } else {
                  this.hL[3] = 0.0;
                  this.hR[3] = 0.0;
                }
                this.resampMu -= 1.0;
              }

              const sL = this.interpolateHermite(this.hL[0], this.hL[1], this.hL[2], this.hL[3], this.resampMu);
              const sR = this.interpolateHermite(this.hR[0], this.hR[1], this.hR[2], this.hR[3], this.resampMu);

              if (right) {
                left[written] = Math.max(-1.0, Math.min(1.0, sL));
                right[written] = Math.max(-1.0, Math.min(1.0, sR));
              } else {
                left[written] = Math.max(-1.0, Math.min(1.0, 0.70710678 * (sL + sR)));
              }

              this.resampMu += this.ratio;
              written++;
            }
          }

          const avail = this.wasmInstance.exports.tb_decoder_ring_avail(this.decoderHandle);
          if (avail < 32768 && !this.isPulling) {
            this.isPulling = true;
            this.port.postMessage({ type: "PULL_REQUEST" });
          }

          return true;
        }
      }
      registerProcessor("tunebloom-worklet-processor", TuneBloomWorkletProcessor);
    `;

    const blob = new Blob([workletCode], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);
    await this.audioCtx.audioWorklet.addModule(blobUrl);
    URL.revokeObjectURL(blobUrl);

    this.workletNode = new AudioWorkletNode(this.audioCtx, "tunebloom-worklet-processor", {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    });

    this.workletNode.port.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "PULL_REQUEST") {
        this.feedNextChunk(24);
      }
    };

    this.workletNode.connect(this.analyser);

    const wasmBytes = await this.initEngine();
    if (wasmBytes) {
      this.workletNode.port.postMessage({ type: "INIT", wasmBytes: wasmBytes.slice(0) });
    }
  }

  feedNextChunk(batchCount = 24) {
    if (!this.audioPackets || this.currentPacketIndex >= this.audioPackets.length) return;
    const chunk = [];
    for (let i = 0; i < batchCount && this.currentPacketIndex < this.audioPackets.length; i++) {
      chunk.push(this.audioPackets[this.currentPacketIndex++].data);
    }
    if (chunk.length > 0 && this.workletNode) {
      this.workletNode.port.postMessage({ type: "FEED_PACKETS", packets: chunk });
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  async loadTrack(track, autoplay = false) {
    if (!track) return;
    this.activeTrack = track;
    this.cachedOpusArrayBuffer = null;
    this.audioPackets = [];
    this.currentPacketIndex = 0;
    this.playbackPositionSec = 0;

    const titleEl = document.getElementById("player-track-title");
    const artistEl = document.getElementById("player-artist-name");
    const jewelImg = document.getElementById("active-jewel-image");
    const quoteCard = document.getElementById("player-quote-card");
    const timeTotal = document.getElementById("time-total");
    const timeCurrent = document.getElementById("time-current");
    const seekSlider = document.getElementById("seek-slider");

    if (titleEl) titleEl.textContent = track.working_draft?.title || track.title || "Untitled Master";
    if (artistEl) artistEl.textContent = track.artist || "TuneBloom Master";

    const resolver = window.ClientJewelResolver;
    if (jewelImg) {
      jewelImg.src = resolver ? resolver.getCoverUrl(track.assigned_jewelcase) : "public/jewelcases/default.jpg";
    }

    if (timeCurrent) timeCurrent.textContent = "0:00";
    if (timeTotal) timeTotal.textContent = this.formatTime(track.duration_seconds || 240.0);
    if (seekSlider) {
      seekSlider.value = 0;
      seekSlider.style.setProperty("--seek-pct", "0%");
    }

    this.populateRecipeBackdrop(track);

    if (quoteCard) {
      quoteCard.textContent = '"Pristine Dynamic Headroom & Harmonic Air | Broadcast Master Quality"';
    }

    const storage = window.clientStorage;
    let cachedBlob = null;
    if (storage) {
      cachedBlob = await storage.getTrackAudioBlob(track.track_id);
    }

    let buffer = null;
    if (cachedBlob) {
      buffer = await cachedBlob.arrayBuffer();
    } else if (track.audio_url) {
      try {
        const resp = await fetch(track.audio_url);
        if (resp.ok) {
          buffer = await resp.arrayBuffer();
          if (storage) storage.saveTrackAudioBlob(track.track_id, buffer);
        }
      } catch {}
    }

    if (buffer) {
      this.cachedOpusArrayBuffer = buffer;
      const stream = this.parseOggOpusStream(buffer);
      this.audioPackets = stream.packets;
      this.preSkipSamples = stream.preSkip;
      this.totalSamples = stream.totalSamples;
      this.totalDurationSec = stream.durationSec || track.duration_seconds || 240.0;
      if (timeTotal) timeTotal.textContent = this.formatTime(this.totalDurationSec);

      await this.initAudioWorklet();
      if (this.workletNode) {
        this.workletNode.port.postMessage({
          type: "SEEK_FLUSH",
          isStart: true,
          preSkip: this.preSkipSamples
        });
      }
      if (autoplay) {
        this.play();
      } else {
        this.setPlaybackState(false);
      }
    } else {
      this.setPlaybackState(false);
    }
  }

  populateRecipeBackdrop(track) {
    const seedTag = document.getElementById("recipe-seed-tag");
    const genreEl = document.getElementById("recipe-genre");
    const bpmEl = document.getElementById("recipe-bpm");
    const keyEl = document.getElementById("recipe-key");
    const vocalsEl = document.getElementById("recipe-vocals");
    const stage1El = document.getElementById("recipe-stage1");
    const stage2El = document.getElementById("recipe-stage2");
    const lyricsPreview = document.getElementById("recipe-lyrics-preview");

    const r = track.recipe || {};
    const d = track.working_draft || {};

    if (seedTag) seedTag.textContent = "Broadcast Profile";
    if (genreEl) genreEl.textContent = d.genre || r.genre || "Contemporary R&B";
    if (bpmEl) bpmEl.textContent = `${d.bpm || r.bpm || 96} BPM`;
    if (keyEl) keyEl.textContent = d.key || r.key || "F minor";
    if (vocalsEl) vocalsEl.textContent = d.vocals || r.vocals || "Silky tenor lead, dynamic transitions.";
    if (stage1El) stage1El.textContent = d.arrangement || r.arrangement || "Warm Rhodes, Deep Bass, Crisp Percussion";
    if (stage2El) stage2El.textContent = "48.0 kHz High-Fidelity Master Stereo";

    if (lyricsPreview) {
      let previewText = "Instrumental Composition";
      if (d.blocks && d.blocks.length > 0) {
        const firstWithText = d.blocks.find((b) => b.text && b.text.trim().length > 0);
        if (firstWithText) previewText = `"${firstWithText.text.split("\n")[0]}..."`;
      } else if (r.lyrics) {
        previewText = `"${r.lyrics.split("\n")[0]}..."`;
      }
      lyricsPreview.textContent = previewText;
    }
  }

  async play() {
    if (!this.audioPackets || this.audioPackets.length === 0) return;
    await this.initAudioWorklet();
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }
    if (this.currentPacketIndex === 0) {
      this.workletNode.port.postMessage({
        type: "SEEK_FLUSH",
        isStart: true,
        preSkip: this.preSkipSamples
      });
      this.feedNextChunk(24);
    }
    this.isPlaying = true;
    if (this.workletNode) {
      this.workletNode.port.postMessage({ type: "SET_STATE", isPlaying: true });
    }
    this.updatePlaybackUI(true);
    this.startPipelineLoop();
  }

  pause() {
    this.isPlaying = false;
    if (this.workletNode) {
      this.workletNode.port.postMessage({ type: "SET_STATE", isPlaying: false });
    }
    this.updatePlaybackUI(false);
    this.stopPipelineLoop();
  }

  togglePlay() {
    if (!this.cachedOpusArrayBuffer && (!this.activeTrack || !this.activeTrack.audio_url)) {
      if (window.AppModal) {
        window.AppModal.show("No Audio Stream", "This composition does not have a rendered master audio stream yet.", "fa-circle-info");
      }
      return;
    }
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setPlaybackState(playing) {
    if (playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  updatePlaybackUI(playing) {
    const playIcon = document.getElementById("master-play-icon");
    const tray = document.getElementById("cd-slide-tray");
    if (playIcon) {
      playIcon.className = playing ? "fa-solid fa-pause text-lg" : "fa-solid fa-play text-lg ml-0.5";
    }
    if (tray) {
      if (playing) {
        tray.classList.add("cd-tray-active");
      } else {
        tray.classList.remove("cd-tray-active");
      }
    }
  }

  seek(percentage) {
    if (!this.totalDurationSec || this.totalDurationSec <= 0) return;
    const targetSec = (percentage / 100.0) * this.totalDurationSec;
    this.seekToTime(targetSec);
  }

  seekToTime(targetSec) {
    targetSec = Math.max(0, Math.min(this.totalDurationSec, targetSec));
    this.playbackPositionSec = targetSec;
    const targetSample = Math.floor(targetSec * 48000.0) + this.preSkipSamples;

    let targetIndex = 0;
    let low = 0;
    let high = this.audioPackets.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const pkt = this.audioPackets[mid];
      if (pkt.sampleOffset <= targetSample) {
        targetIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    this.currentPacketIndex = targetIndex;
    if (this.workletNode) {
      this.workletNode.port.postMessage({
        type: "SEEK_FLUSH",
        isStart: this.currentPacketIndex === 0,
        preSkip: this.preSkipSamples
      });
      this.feedNextChunk(24);
    }

    this.lastTime = performance.now();
    const timeCurrent = document.getElementById("time-current");
    const seekSlider = document.getElementById("seek-slider");
    if (timeCurrent) timeCurrent.textContent = this.formatTime(this.playbackPositionSec);
    if (seekSlider && this.totalDurationSec > 0) {
      const pct = (this.playbackPositionSec / this.totalDurationSec) * 100;
      seekSlider.value = pct;
      seekSlider.style.setProperty("--seek-pct", `${pct}%`);
    }
  }

  setVolume(val) {
    const vol = Math.max(0, Math.min(100, val)) / 100;
    if (this.gainNode) {
      this.gainNode.gain.value = vol;
    }
    if (vol > 0) this.isMuted = false;
    this.updateVolumeIcon(vol);
  }

  toggleMute() {
    const volumeSlider = document.getElementById("volume-slider");
    if (this.isMuted) {
      if (this.gainNode) this.gainNode.gain.value = this.previousVolume;
      this.isMuted = false;
      if (volumeSlider) volumeSlider.value = this.previousVolume * 100;
      this.updateVolumeIcon(this.previousVolume);
    } else {
      this.previousVolume = this.gainNode ? this.gainNode.gain.value : 0.8;
      if (this.gainNode) this.gainNode.gain.value = 0.0;
      this.isMuted = true;
      if (volumeSlider) volumeSlider.value = 0;
      this.updateVolumeIcon(0);
    }
  }

  updateVolumeIcon(vol) {
    const muteBtn = document.getElementById("mute-button");
    if (!muteBtn) return;
    const icon = muteBtn.querySelector("i");
    if (!icon) return;
    if (vol === 0 || this.isMuted) {
      icon.className = "fa-solid fa-volume-xmark";
    } else if (vol < 0.5) {
      icon.className = "fa-solid fa-volume-low";
    } else {
      icon.className = "fa-solid fa-volume-high";
    }
  }

  flipCard() {
    const inner = document.getElementById("jewel-flipper-inner");
    if (!inner) return;
    this.isFlipped = !this.isFlipped;
    inner.style.transform = this.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
  }

  startPipelineLoop() {
    this.stopPipelineLoop();
    const bars = document.querySelectorAll("#visualizer-container div");
    const indices = [1, 3, 6, 12, 20];
    const timeCurrent = document.getElementById("time-current");
    const seekSlider = document.getElementById("seek-slider");

    this.lastTime = performance.now();

    const loop = (now) => {
      if (!this.isPlaying) return;
      const dt = (now - this.lastTime) / 1000.0;
      this.lastTime = now;

      if (!this.isSeeking && this.totalDurationSec > 0) {
        this.playbackPositionSec = Math.min(this.totalDurationSec, this.playbackPositionSec + dt);
        if (timeCurrent) timeCurrent.textContent = this.formatTime(this.playbackPositionSec);
        if (seekSlider) {
          const progress = (this.playbackPositionSec / this.totalDurationSec) * 100;
          seekSlider.value = progress;
          seekSlider.style.setProperty("--seek-pct", `${progress}%`);
        }
        if (this.playbackPositionSec >= this.totalDurationSec) {
          this.pause();
          this.seekToTime(0);
          return;
        }
      }

      if (this.analyser && this.freqData) {
        this.analyser.getByteFrequencyData(this.freqData);
        bars.forEach((b, i) => {
          const sampleIdx = indices[i] || i * 4;
          const val = this.freqData[sampleIdx] || 0;
          const heightPct = Math.max(15, Math.min(100, (val / 255.0) * 100));
          b.style.height = `${heightPct}%`;
        });
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  stopPipelineLoop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    const bars = document.querySelectorAll("#visualizer-container div");
    const resting = [20, 40, 70, 30, 15];
    bars.forEach((b, idx) => {
      b.style.height = `${resting[idx % resting.length]}%`;
    });
  }

  async triggerDownloadMP3() {
    if (!this.activeTrack || (!this.activeTrack.audio_url && !this.cachedOpusArrayBuffer)) {
      if (window.AppModal) {
        window.AppModal.show("Download Unavailable", "Select a completed track from the discography vault to export.", "fa-circle-info");
      }
      return;
    }

    const downloadBtn = document.getElementById("download-mp3-btn");
    const origHtml = downloadBtn ? downloadBtn.innerHTML : "";
    if (downloadBtn) {
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin mr-1"></i> Exporting Master Audio...';
    }

    try {
      const storage = window.clientStorage;
      if (!this.cachedOpusArrayBuffer) {
        let cachedBlob = storage ? await storage.getTrackAudioBlob(this.activeTrack.track_id) : null;
        if (cachedBlob) {
          this.cachedOpusArrayBuffer = await cachedBlob.arrayBuffer();
        } else if (this.activeTrack.audio_url) {
          const resp = await fetch(this.activeTrack.audio_url);
          if (!resp.ok) throw new Error("Could not acquire master audio bitstream from server.");
          this.cachedOpusArrayBuffer = await resp.arrayBuffer();
          if (storage) await storage.saveTrackAudioBlob(this.activeTrack.track_id, this.cachedOpusArrayBuffer);
        } else {
          throw new Error("Master audio bitstream unavailable in local cache or network.");
        }
      }

      const oggOpusBytes = new Uint8Array(this.cachedOpusArrayBuffer.slice(0));
      const metadata = {
        title: this.activeTrack.working_draft?.title || this.activeTrack.title || "Master Track",
        artist: this.activeTrack.artist || "TuneBloom Master",
        album: "Studio Master Series",
        genre: this.activeTrack.recipe?.genre || "Contemporary R&B",
        comment: "Engineered via TuneBloom Studio Workspace"
      };

      await this.initTranscoderWorker();
      if (!this.transcodeWorker || !this.transcodeWorkerReady) {
        throw new Error("Audio exporter runtime is initializing.");
      }

      this.transcodeWorker.postMessage(
        {
          type: "TRANSCODE",
          oggOpusBytes: oggOpusBytes,
          metadata: metadata,
          vbrQuality: 0
        },
        [oggOpusBytes.buffer]
      );
    } catch (err) {
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = origHtml;
      }
      if (window.AppModal) {
        window.AppModal.show("Export Failure", err.message || "Failed to initialize audio export.", "fa-circle-xmark");
      }
    }
  }

  handleTranscodeComplete(data) {
    const downloadBtn = document.getElementById("download-mp3-btn");
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<i class="fa-solid fa-file-audio mr-1"></i> Download Master Audio (MP3)';
    }

    const blob = new Blob([data.mp3Bytes], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const rawTitle = this.activeTrack?.working_draft?.title || this.activeTrack?.title || "TuneBloom_Master";
    const safeTitle = rawTitle.replace(/[^a-zA-Z0-9_-]/g, "_");
    a.href = url;
    a.download = `${safeTitle}_Master.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 12000);
  }

  handleTranscodeError(errorMsg) {
    const downloadBtn = document.getElementById("download-mp3-btn");
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<i class="fa-solid fa-file-audio mr-1"></i> Download Master Audio (MP3)';
    }
    if (window.AppModal) {
      window.AppModal.show("Export Error", errorMsg || "Failed to render master audio file.", "fa-circle-xmark");
    }
  }
}

window.PlayerEngine = PlayerEngine;
window.playerEngine = new PlayerEngine();