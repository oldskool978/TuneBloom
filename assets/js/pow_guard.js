function sha256Pure(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i, j;
  let result = "";
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += "\x80";
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? "0" : "") + byte.toString(16);
    }
  }
  return result;
}

class RouterDiscovery {
  static getBaseMountPath() {
    const rawPath = window.location.pathname || "/";
    const dir = rawPath.substring(0, rawPath.lastIndexOf("/") + 1) || "/";
    return dir.endsWith("/") ? dir : `${dir}/`;
  }

  static getCandidates() {
    const origin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "";
    const isLocalOrigin = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    const mount = this.getBaseMountPath();
    const mountClean = mount.replace(/\/$/, "");

    const candidates = [];
    if (origin) {
      if (mountClean.toLowerCase().includes("tunebloom")) {
        candidates.push(`${origin}${mountClean}/api/v1`);
      } else {
        candidates.push(`${origin}/TuneBloom/api/v1`);
        candidates.push(`${origin}/tunebloom/api/v1`);
        candidates.push(`${origin}/api/v1`);
        candidates.push(`${origin}/v1`);
      }
    }

    if (isLocalOrigin || !origin) {
      candidates.push("http://127.0.0.1:8765/api/v1");
      candidates.push("http://127.0.0.1:8765/v1");
      candidates.push("http://localhost:8765/api/v1");
      candidates.push("http://localhost:8765/v1");
    }

    return [...new Set(candidates.filter(Boolean))];
  }

  static activeBase = "";
  static isOnline = false;

  static async resolve() {
    const candidates = this.getCandidates();
    for (const base of candidates) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(`${base}/health`, {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });
        clearTimeout(timeout);
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const data = await res.json();
            if (data && (data.status === "online" || data.status === "healthy")) {
              this.activeBase = base;
              this.isOnline = true;
              return { active: true, base };
            }
          }
        }
      } catch {}
    }
    const origin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "";
    const mountClean = this.getBaseMountPath().replace(/\/$/, "");
    this.activeBase = origin ? `${origin}${mountClean}/api/v1` : "/api/v1";
    this.isOnline = false;
    return { active: false, base: this.activeBase };
  }

  static resolveAppUrl(relativePath) {
    if (!relativePath) return "";
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://") || relativePath.startsWith("data:") || relativePath.startsWith("blob:")) {
      return relativePath;
    }
    const clean = relativePath.replace(/^\/+/, "");
    const mount = this.getBaseMountPath();
    const baseOrigin = window.location.origin && window.location.origin !== "null" ? window.location.origin : window.location.href;
    try {
      return new URL(`${mount}${clean}`, baseOrigin).href;
    } catch {
      return `${mount}${clean}`;
    }
  }
}

async function acquireChallenge() {
  await RouterDiscovery.resolve();
  const res = await fetch(`${RouterDiscovery.activeBase}/auth/challenge`);
  if (!res.ok) {
    throw new Error("Could not acquire verification challenge from host.");
  }
  return await res.json();
}

async function solveClientProofOfWork(challengeData) {
  const { challenge, difficulty } = challengeData;
  const targetPrefix = "0".repeat(difficulty);
  const hasSubtle = typeof crypto !== "undefined" && crypto.subtle && typeof crypto.subtle.digest === "function";
  const textEncoder = new TextEncoder();
  let nonceNum = 0;

  while (true) {
    const candidateNonce = nonceNum.toString(16);
    let hashHex = "";
    if (hasSubtle) {
      const payload = textEncoder.encode(`${challenge}:${candidateNonce}`);
      const hashBuffer = await crypto.subtle.digest("SHA-256", payload);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } else {
      hashHex = sha256Pure(`${challenge}:${candidateNonce}`);
    }

    if (hashHex.startsWith(targetPrefix)) {
      return candidateNonce;
    }
    nonceNum++;
    if (nonceNum % 1500 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }
}

window.sha256Pure = sha256Pure;
window.RouterDiscovery = RouterDiscovery;
window.acquireChallenge = acquireChallenge;
window.solveClientProofOfWork = solveClientProofOfWork;