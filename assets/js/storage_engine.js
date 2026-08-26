const SVG_FALLBACK_COVER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <circle cx="200" cy="200" r="140" fill="none" stroke="url(#neon)" stroke-width="3" opacity="0.6"/>
  <circle cx="200" cy="200" r="100" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.4" stroke-dasharray="4,6"/>
  <circle cx="200" cy="200" r="45" fill="#020617" stroke="url(#neon)" stroke-width="2"/>
  <circle cx="200" cy="200" r="15" fill="#ffffff"/>
  <text x="200" y="365" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="3">TUNEBLOOM 48K</text>
</svg>`);

class TuneBloomStorage {
  constructor() {
    this.dbName = "TuneBloomDB";
    this.dbVersion = 5;
    this.db = null;
    this.initPromise = null;
    this.memoryFallback = false;
    this.memStore = {
      user_meta: new Map(),
      discography: new Map(),
      audio_blobs: new Map()
    };
  }

  _sanitize(data) {
    if (data === null || typeof data !== "object") return data;
    try {
      return JSON.parse(JSON.stringify(data));
    } catch {
      return data;
    }
  }

  async init() {
    if (this.db && !this.memoryFallback) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        this.memoryFallback = true;
        resolve(null);
        return;
      }

      let req;
      try {
        req = indexedDB.open(this.dbName, this.dbVersion);
      } catch {
        this.memoryFallback = true;
        resolve(null);
        return;
      }

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        const txn = e.target.transaction;

        if (!db.objectStoreNames.contains("user_meta")) {
          db.createObjectStore("user_meta", { keyPath: "slug" });
        }

        let discoStore;
        if (!db.objectStoreNames.contains("discography")) {
          discoStore = db.createObjectStore("discography", { keyPath: "track_id" });
        } else {
          discoStore = txn.objectStore("discography");
        }

        if (discoStore) {
          if (!discoStore.indexNames.contains("user_slug")) {
            discoStore.createIndex("user_slug", "user_slug", { unique: false });
          }
          if (!discoStore.indexNames.contains("order_index")) {
            discoStore.createIndex("order_index", "order_index", { unique: false });
          }
          if (!discoStore.indexNames.contains("user_order")) {
            discoStore.createIndex("user_order", ["user_slug", "order_index"], { unique: false });
          }
        }

        if (!db.objectStoreNames.contains("audio_blobs")) {
          db.createObjectStore("audio_blobs", { keyPath: "track_id" });
        }
      };

      req.onsuccess = (e) => {
        this.db = e.target.result;
        this.db.onversionchange = () => {
          this.db.close();
          this.db = null;
          this.initPromise = null;
        };
        this.db.onclose = () => {
          this.db = null;
          this.initPromise = null;
        };
        resolve(this.db);
      };

      req.onblocked = () => {};
      req.onerror = () => {
        this.memoryFallback = true;
        resolve(null);
      };
    });

    return this.initPromise;
  }

  async _execute(storeName, mode, operation) {
    await this.init();
    if (this.memoryFallback || !this.db) {
      return this._executeMemory(storeName, mode, operation);
    }

    return new Promise((resolve, reject) => {
      let txn;
      try {
        txn = this.db.transaction(storeName, mode);
      } catch (err) {
        if (err.name === "InvalidStateError" || err.name === "TransactionInactiveError") {
          this.db = null;
          this.initPromise = null;
          return this.init().then(() => this._execute(storeName, mode, operation)).then(resolve).catch(reject);
        }
        this.memoryFallback = true;
        return resolve(this._executeMemory(storeName, mode, operation));
      }

      const store = txn.objectStore(storeName);
      let request;
      try {
        request = operation(store, txn);
      } catch (opErr) {
        return reject(opErr);
      }

      if (request && "onsuccess" in request) {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => {
          e.stopPropagation();
          reject(request.error || e.target.error);
        };
      }

      txn.oncomplete = () => {
        if (!request || !("onsuccess" in request)) {
          resolve(true);
        }
      };

      txn.onerror = (e) => {
        e.stopPropagation();
        reject(txn.error || e.target.error);
      };

      txn.onabort = () => {
        reject(new Error(`Transaction aborted on store: ${storeName}`));
      };
    });
  }

  _executeMemory(storeName, mode, operation) {
    const memMap = this.memStore[storeName] || new Map();
    const fakeStore = {
      get: (key) => ({ result: storeName === "audio_blobs" ? (memMap.get(key) || null) : this._sanitize(memMap.get(key) || null) }),
      put: (val) => {
        const key = storeName === "user_meta" ? val.slug : val.track_id;
        const storedVal = storeName === "audio_blobs" ? val : this._sanitize(val);
        memMap.set(key, storedVal);
        return { result: key };
      },
      delete: (key) => {
        memMap.delete(key);
        return { result: true };
      },
      getAll: () => ({ result: Array.from(memMap.values()).map(v => storeName === "audio_blobs" ? v : this._sanitize(v)) }),
      index: () => ({
        getAll: () => ({ result: Array.from(memMap.values()).map(v => storeName === "audio_blobs" ? v : this._sanitize(v)) })
      })
    };
    const res = operation(fakeStore, null);
    return res && res.result !== undefined ? res.result : true;
  }

  async getUser(slug) {
    if (!slug) return null;
    const cleanSlug = String(slug).trim().toLowerCase();
    try {
      const user = await this._execute("user_meta", "readonly", (store) => store.get(cleanSlug));
      return this._sanitize(user) || null;
    } catch {
      return null;
    }
  }

  async saveUser(userObj) {
    if (!userObj || !userObj.slug) return false;
    const cleanPayload = this._sanitize(userObj);
    try {
      await this._execute("user_meta", "readwrite", (store) => store.put(cleanPayload));
      return true;
    } catch {
      return false;
    }
  }

  async getTracksForUser(slug) {
    if (!slug) return [];
    const cleanSlug = String(slug).trim().toLowerCase();
    try {
      const results = await this._execute("discography", "readonly", (store) => {
        if (store.indexNames && store.indexNames.contains("user_slug")) {
          return store.index("user_slug").getAll(IDBKeyRange.only(cleanSlug));
        }
        return store.getAll();
      });
      const records = Array.isArray(results) ? results : [];
      const userTracks = records
        .map(t => this._sanitize(t))
        .filter(t => t && String(t.user_slug).trim().toLowerCase() === cleanSlug);

      userTracks.sort((a, b) => {
        const orderA = typeof a.order_index === "number" ? a.order_index : 0;
        const orderB = typeof b.order_index === "number" ? b.order_index : 0;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      });
      return userTracks;
    } catch {
      return [];
    }
  }

  async saveTrack(trackObj) {
    if (!trackObj || !trackObj.track_id) return false;
    const cleanPayload = this._sanitize(trackObj);
    try {
      await this._execute("discography", "readwrite", (store) => store.put(cleanPayload));
      return true;
    } catch {
      return false;
    }
  }

  async deleteTrack(trackId) {
    if (!trackId) return false;
    try {
      await this._execute("discography", "readwrite", (store) => store.delete(trackId));
      await this._execute("audio_blobs", "readwrite", (store) => store.delete(trackId));
      return true;
    } catch {
      return false;
    }
  }

  async saveTrackAudioBlob(trackId, arrayBuffer) {
    if (!trackId || !arrayBuffer) return false;
    try {
      const blob = new Blob([arrayBuffer], { type: "audio/ogg" });
      await this._execute("audio_blobs", "readwrite", (store) => store.put({ track_id: trackId, blob }));
      return true;
    } catch {
      return false;
    }
  }

  async getTrackAudioBlob(trackId) {
    if (!trackId) return null;
    try {
      const record = await this._execute("audio_blobs", "readonly", (store) => store.get(trackId));
      return record?.blob || null;
    } catch {
      return null;
    }
  }
}

class ClientJewelResolver {
  static manifestCache = null;
  static FALLBACK_COVERS = ["space.jpg", "default.jpg"];

  static async getManifest() {
    if (this.manifestCache) return this.manifestCache;
    try {
      const cached = localStorage.getItem("tb_jewelcase_manifest");
      if (cached) {
        this.manifestCache = JSON.parse(cached);
      }
    } catch {}

    try {
      const manifestUrl = window.RouterDiscovery ? window.RouterDiscovery.resolveAppUrl("public/jewelcases/manifest.json") : "public/jewelcases/manifest.json";
      const resp = await fetch(manifestUrl, { cache: "no-cache" });
      if (resp.ok) {
        const liveManifest = await resp.json();
        if (Array.isArray(liveManifest.covers) && liveManifest.covers.length > 0) {
          this.manifestCache = liveManifest.covers;
          localStorage.setItem("tb_jewelcase_manifest", JSON.stringify(liveManifest.covers));
        }
      }
    } catch {}

    if (!this.manifestCache || this.manifestCache.length === 0) {
      this.manifestCache = this.FALLBACK_COVERS;
    }
    return this.manifestCache;
  }

  static async resolve(slug, trackId, seed) {
    const covers = await this.getManifest();
    const key = `${slug}:${trackId}:${seed}`;
    let hex = "";
    if (typeof crypto !== "undefined" && crypto.subtle && typeof crypto.subtle.digest === "function") {
      try {
        const enc = new TextEncoder();
        const hashBuf = await crypto.subtle.digest("SHA-256", enc.encode(key));
        const hashArray = Array.from(new Uint8Array(hashBuf));
        hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      } catch {
        hex = window.sha256Pure ? window.sha256Pure(key) : "42";
      }
    } else if (window.sha256Pure) {
      hex = window.sha256Pure(key);
    } else {
      hex = "42";
    }
    const index = parseInt(hex.slice(0, 8), 16) % covers.length;
    return covers[index] || "space.jpg";
  }

  static getCoverUrl(filename) {
    if (!filename) return SVG_FALLBACK_COVER;
    if (filename.startsWith("data:") || filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename;
    }
    return window.RouterDiscovery ? window.RouterDiscovery.resolveAppUrl(`public/jewelcases/${filename}`) : `public/jewelcases/${filename}`;
  }
}

window.SVG_FALLBACK_COVER = SVG_FALLBACK_COVER;
window.TuneBloomStorage = TuneBloomStorage;
window.ClientJewelResolver = ClientJewelResolver;
window.clientStorage = new TuneBloomStorage();