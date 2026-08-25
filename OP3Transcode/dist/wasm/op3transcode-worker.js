let wasmInstance = null;

async function initEngine(wasmBytes) {
  const wasiShim = new Proxy({}, { get: () => () => 0 });
  const importObj = {
    env: wasiShim,
    wasi_snapshot_preview1: wasiShim,
    wasi_unstable: wasiShim
  };
  const { instance } = await WebAssembly.instantiate(wasmBytes, importObj);
  wasmInstance = instance;
}

function writeStringToMemory(str) {
  if (!str) return 0;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str + "\0");
  const ptr = wasmInstance.exports.wasm_malloc(bytes.length);
  const view = new Uint8Array(wasmInstance.exports.memory.buffer, ptr, bytes.length);
  view.set(bytes);
  return ptr;
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "INIT") {
    await initEngine(msg.wasmBytes);
    self.postMessage({ type: "READY" });
  } else if (msg.type === "TRANSCODE") {
    const { oggOpusBytes, metadata, vbrQuality } = msg;
    
    const opusLen = oggOpusBytes.length;
    const inPtr = wasmInstance.exports.wasm_malloc(opusLen);
    new Uint8Array(wasmInstance.exports.memory.buffer, inPtr, opusLen).set(oggOpusBytes);

    const outPtrPtr = wasmInstance.exports.wasm_malloc(4);
    const outLenPtr = wasmInstance.exports.wasm_malloc(4);

    const titlePtr = writeStringToMemory(metadata.title || "Master Output");
    const artistPtr = writeStringToMemory(metadata.artist || "TuneBloom");
    const albumPtr = writeStringToMemory(metadata.album || "Mastering V0");
    const genrePtr = writeStringToMemory(metadata.genre || "Master");
    const commentPtr = writeStringToMemory(metadata.comment || "Generated via TuneBloom OP3Transcode");

    const tStart = performance.now();
    const res = wasmInstance.exports.op3_transcode_monolithic(
      inPtr,
      opusLen,
      outPtrPtr,
      outLenPtr,
      vbrQuality !== undefined ? vbrQuality : 0,
      titlePtr,
      artistPtr,
      albumPtr,
      genrePtr,
      commentPtr
    );
    const elapsedMs = performance.now() - tStart;

    if (titlePtr) wasmInstance.exports.wasm_free(titlePtr);
    if (artistPtr) wasmInstance.exports.wasm_free(artistPtr);
    if (albumPtr) wasmInstance.exports.wasm_free(albumPtr);
    if (genrePtr) wasmInstance.exports.wasm_free(genrePtr);
    if (commentPtr) wasmInstance.exports.wasm_free(commentPtr);
    wasmInstance.exports.wasm_free(inPtr);

    if (res !== 0) {
      wasmInstance.exports.wasm_free(outPtrPtr);
      wasmInstance.exports.wasm_free(outLenPtr);
      self.postMessage({ type: "ERROR", error: `Transcoding failure code ${res}` });
      return;
    }

    const currentMem = wasmInstance.exports.memory.buffer;
    const mp3Ptr = new Uint32Array(currentMem, outPtrPtr, 1)[0];
    const mp3Len = new Uint32Array(currentMem, outLenPtr, 1)[0];

    wasmInstance.exports.wasm_free(outPtrPtr);
    wasmInstance.exports.wasm_free(outLenPtr);

    const mp3Bytes = new Uint8Array(currentMem, mp3Ptr, mp3Len).slice();
    wasmInstance.exports.wasm_free(mp3Ptr);

    self.postMessage({
      type: "TRANSCODE_COMPLETE",
      mp3Bytes,
      elapsedMs,
      compressionRatio: (oggOpusBytes.length / mp3Bytes.length).toFixed(2)
    }, [mp3Bytes.buffer]);
  }
};