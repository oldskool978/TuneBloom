const AppModal = {
  backdrop: null,
  box: null,
  titleEl: null,
  messageEl: null,
  iconEl: null,
  actionsEl: null,
  inputContainer: null,
  inputEl: null,
  activeResolve: null,
  lastFocusedElement: null,
  keyListener: null,

  init() {
    this.backdrop = document.getElementById("app-modal-backdrop");
    this.box = document.getElementById("app-modal-box");
    this.titleEl = document.getElementById("app-modal-title");
    this.messageEl = document.getElementById("app-modal-message");
    this.iconEl = document.getElementById("app-modal-icon");
    this.actionsEl = document.getElementById("app-modal-actions");
    this.inputContainer = document.getElementById("app-modal-input-container");
    this.inputEl = document.getElementById("app-modal-input");

    if (this.backdrop) {
      this.backdrop.onclick = (e) => {
        if (e.target === this.backdrop) {
          this.closeWith(null);
        }
      };
    }
  },

  _trapFocus(e) {
    if (!this.box) return;
    const focusables = this.box.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  },

  show(title, message, iconClass = "fa-circle-info") {
    this.init();
    this.lastFocusedElement = document.activeElement;
    if (this.titleEl) this.titleEl.textContent = title;
    if (this.messageEl) this.messageEl.textContent = message;
    if (this.iconEl) this.iconEl.className = `fa-solid ${iconClass}`;
    if (this.inputContainer) this.inputContainer.classList.add("hidden");
    if (this.actionsEl) this.actionsEl.innerHTML = "";

    if (this.backdrop) {
      this.backdrop.classList.remove("hidden");
      requestAnimationFrame(() => {
        this.backdrop.classList.remove("opacity-0");
        if (this.box) {
          this.box.classList.remove("scale-95", "opacity-0");
          this.box.classList.add("scale-100", "opacity-100");
        }
      });
    }

    if (this.keyListener) window.removeEventListener("keydown", this.keyListener);
    this.keyListener = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.closeWith(null);
      } else {
        this._trapFocus(e);
      }
    };
    window.addEventListener("keydown", this.keyListener);
  },

  closeWith(value) {
    if (this.keyListener) {
      window.removeEventListener("keydown", this.keyListener);
      this.keyListener = null;
    }
    if (this.backdrop) {
      if (this.box) {
        this.box.classList.remove("scale-100", "opacity-100");
        this.box.classList.add("scale-95", "opacity-0");
      }
      this.backdrop.classList.add("opacity-0");
      setTimeout(() => {
        this.backdrop.classList.add("hidden");
      }, 200);
    }
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
    if (this.activeResolve) {
      const r = this.activeResolve;
      this.activeResolve = null;
      r(value);
    }
  },

  alert(title, message, iconClass = "fa-circle-info", confirmText = "Acknowledge") {
    return new Promise((resolve) => {
      this.activeResolve = resolve;
      this.show(title, message, iconClass);
      if (this.actionsEl) {
        this.actionsEl.innerHTML = `
          <button type="button" id="app-modal-ack-btn" class="px-6 py-2 rounded-xl theme-btn-primary font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition shadow-lg">
            ${confirmText}
          </button>
        `;
        const ackBtn = document.getElementById("app-modal-ack-btn");
        if (ackBtn) {
          ackBtn.onclick = () => this.closeWith(true);
          setTimeout(() => ackBtn.focus(), 50);
        }
      }
    });
  },

  confirm(title, message, confirmText = "Confirm", cancelText = "Cancel", iconClass = "fa-triangle-exclamation") {
    return new Promise((resolve) => {
      this.activeResolve = resolve;
      this.show(title, message, iconClass);
      if (this.actionsEl) {
        this.actionsEl.innerHTML = `
          <button type="button" id="app-modal-cancel-btn" class="px-4 py-2 rounded-xl theme-btn-secondary font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition shadow-md">
            ${cancelText}
          </button>
          <button type="button" id="app-modal-confirm-btn" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition shadow-lg">
            ${confirmText}
          </button>
        `;
        const cancelBtn = document.getElementById("app-modal-cancel-btn");
        const confirmBtn = document.getElementById("app-modal-confirm-btn");
        if (cancelBtn) {
          cancelBtn.onclick = () => this.closeWith(false);
        }
        if (confirmBtn) {
          confirmBtn.onclick = () => this.closeWith(true);
          setTimeout(() => confirmBtn.focus(), 50);
        }
      }
    });
  },

  prompt(title, message, defaultValue = "", iconClass = "fa-pen-to-square", confirmText = "Create Track", cancelText = "Cancel") {
    return new Promise((resolve) => {
      this.activeResolve = resolve;
      this.show(title, message, iconClass);
      if (this.inputContainer) {
        this.inputContainer.classList.remove("hidden");
      }
      if (this.inputEl) {
        this.inputEl.value = defaultValue;
        this.inputEl.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const val = this.inputEl.value.trim();
            this.closeWith(val || null);
          } else if (e.key === "Escape") {
            e.preventDefault();
            this.closeWith(null);
          }
        };
      }
      if (this.actionsEl) {
        this.actionsEl.innerHTML = `
          <button type="button" id="app-modal-cancel-btn" class="px-4 py-2 rounded-xl theme-btn-secondary font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition shadow-md">
            ${cancelText}
          </button>
          <button type="button" id="app-modal-submit-btn" class="px-5 py-2 rounded-xl theme-btn-primary font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition shadow-lg flex items-center gap-1.5">
            <i class="fa-solid fa-plus text-[10px]"></i>
            <span>${confirmText}</span>
          </button>
        `;
        const cancelBtn = document.getElementById("app-modal-cancel-btn");
        const submitBtn = document.getElementById("app-modal-submit-btn");
        if (cancelBtn) {
          cancelBtn.onclick = () => this.closeWith(null);
        }
        if (submitBtn) {
          submitBtn.onclick = () => {
            const val = this.inputEl ? this.inputEl.value.trim() : "";
            this.closeWith(val || null);
          };
        }
      }
      setTimeout(() => {
        if (this.inputEl) {
          this.inputEl.focus();
          this.inputEl.select();
        }
      }, 50);
    });
  }
};

const AppState = {
  user: null,
  token: null,
  tracks: [],
  activeTrackId: null,
  activeEventSource: null,
  pollIntervalId: null,
  formFocusTimestamp: 0,
  editingTagIndex: null,
  activeTrackCleanRecipe: null,
  songBlocks: [],
  isDispatching: false
};

let syncTimeout = null;

function slugify(name) {
  const clean = String(name || "").trim().toLowerCase().replace(/[^\w\s-]/g, "");
  return clean.replace(/[\s_-]+/g, "_").replace(/^_+|_+$/g, "");
}

function getTodayUtcString() {
  return new Date().toISOString().slice(0, 10);
}

function resolveAssetUrl(relativePath) {
  return window.RouterDiscovery ? window.RouterDiscovery.resolveAppUrl(relativePath) : relativePath;
}

function normalizeAudioStreamUrl(rawUrl, slug) {
  if (!rawUrl) return resolveAssetUrl("public/default.opus");
  if (
    rawUrl.startsWith("http://") ||
    rawUrl.startsWith("https://") ||
    rawUrl.startsWith("blob:") ||
    rawUrl.startsWith("data:")
  ) {
    return rawUrl;
  }
  const router = window.RouterDiscovery;
  if (router && router.isOnline) {
    const cleanRelative = rawUrl
      .replace(/^\/?(?:TuneBloom\/|tunebloom\/)?(?:api\/)?(?:v1\/)?/, "")
      .replace(/^audio\/stream\//, "audio/stream/");
    return `${router.activeBase}/${cleanRelative.startsWith("audio/") ? cleanRelative : `audio/stream/${slug}/${cleanRelative}`}`;
  }
  return resolveAssetUrl(rawUrl);
}

function formatValidationErrors(detail) {
  if (Array.isArray(detail)) {
    return detail
      .map((err) => {
        const field = Array.isArray(err.loc) ? err.loc.slice(1).join(".") : "field";
        return `${field}: ${err.msg}`;
      })
      .join("\n");
  }
  if (typeof detail === "string") return detail;
  return "Invalid composition payload structure.";
}

function computeCanonicalRecipe(title, data) {
  if (!data) return "";
  const sanitize = (val) => String(val || "").replace(/\r\n/g, "\n").trim();
  const bpm = parseInt(data.bpm, 10);
  const cleanBpm = Math.max(30, Math.min(300, isNaN(bpm) ? 96 : bpm));
  let lyricsStr = "";
  if (typeof data.lyrics === "string" && data.lyrics.trim().length > 0) {
    lyricsStr = sanitize(data.lyrics);
  } else if (Array.isArray(data.blocks) && window.compileBlocksToLyrics) {
    lyricsStr = sanitize(window.compileBlocksToLyrics(data.blocks));
  }
  const canonical = {
    title: sanitize(title || data.title),
    genre: sanitize(data.genre),
    subgenre: sanitize(data.subgenre),
    bpm: cleanBpm,
    key: sanitize(data.key),
    mood: sanitize(data.mood),
    vocals: sanitize(data.vocals),
    arrangement: sanitize(data.arrangement),
    lyrics: lyricsStr
  };
  return JSON.stringify(canonical);
}

function getCurrentFormPayload() {
  const bpmVal = parseInt(document.getElementById("field-bpm")?.value, 10);
  const cleanBpm = Math.max(30, Math.min(300, isNaN(bpmVal) ? 96 : bpmVal));
  const cadence = window.calculateQuantizedDuration ? window.calculateQuantizedDuration(cleanBpm) : { durationSeconds: 240.0 };

  const sanitizeStr = (id, fallback, maxLen) => {
    const val = document.getElementById(id)?.value || "";
    const clean = val.trim();
    return (clean || fallback).slice(0, maxLen);
  };

  const compiledLyrics = window.compileBlocksToLyrics
    ? window.compileBlocksToLyrics(AppState.songBlocks)
    : "";

  return {
    title: sanitizeStr("field-title", "Untitled Master", 80),
    genre: sanitizeStr("field-genre", "Contemporary R&B", 60),
    subgenre: sanitizeStr("field-subgenre", "2000s Pop R&B / Slow Jam Bounce", 60),
    bpm: cleanBpm,
    key: sanitizeStr("field-key", "F minor", 30),
    mood: sanitizeStr("field-mood", "Sensual, passionate, smooth, confident, driving.", 200),
    vocals: sanitizeStr("field-vocals", "Silky male tenor lead vocal, dynamic chest-to-falsetto transitions, intricate melismatic ad-libs, stacked 4-part harmonies.", 300),
    arrangement: sanitizeStr("field-arrangement", "Deep 808 sub-bass, crisp acoustic-electronic hybrid snare on 2 and 4, syncopated hi-hat rolls, warm Fender Rhodes chords.", 300),
    lyrics: compiledLyrics.slice(0, 4000),
    audio_duration: Math.min(600.0, Math.max(30.0, Number(cadence.durationSeconds.toFixed(2)))),
    blocks: JSON.parse(JSON.stringify(AppState.songBlocks))
  };
}

function sortTracks(tracks) {
  return tracks.slice().sort((a, b) => {
    const aDefault = a.is_default || String(a.track_id).startsWith("default_");
    const bDefault = b.is_default || String(b.track_id).startsWith("default_");
    if (aDefault && !bDefault) return -1;
    if (!aDefault && bDefault) return 1;
    const orderA = typeof a.order_index === "number" ? a.order_index : 0;
    const orderB = typeof b.order_index === "number" ? b.order_index : 0;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
  });
}

async function ensureShowcaseTrack(slug, storage) {
  let existingTracks = [];
  if (storage) {
    existingTracks = await storage.getTracksForUser(slug);
  } else {
    existingTracks = Array.isArray(AppState.tracks) ? AppState.tracks : [];
  }

  let defaultTrack = existingTracks.find(
    (t) => t && (t.is_default || t.track_id === `default_${slug}` || String(t.track_id).startsWith("default_"))
  );

  if (!defaultTrack) {
    const initialBp = window.TuneBloomBlueprints
      ? window.TuneBloomBlueprints.getById("rnb_midnight_frequency")
      : {
          title: "Midnight Frequency",
          genre: "Contemporary R&B",
          subgenre: "2000s Pop R&B / Slow Jam Bounce",
          bpm: 96,
          key: "F minor",
          mood: "Sensual, passionate, smooth, confident, driving.",
          vocals: "Silky male tenor lead vocal, dynamic chest-to-falsetto transitions, intricate melismatic ad-libs, stacked 4-part harmonies.",
          arrangement: "Deep 808 sub-bass, crisp acoustic-electronic hybrid snare on 2 and 4, Fender Rhodes chords.",
          blocks: []
        };

    const router = window.RouterDiscovery;
    const defaultAudioUrl = router && router.isOnline
      ? `${router.activeBase}/audio/stream/${slug}/default.opus`
      : resolveAssetUrl("public/default.opus");

    defaultTrack = {
      track_id: `default_${slug}`,
      user_slug: slug,
      order_index: 0,
      is_default: true,
      status: "COMPLETED",
      created_at: "2020-01-01T00:00:00.000Z",
      updated_at: new Date().toISOString(),
      title: initialBp.title || "Midnight Frequency",
      artist: "TuneBloom Master",
      audio_url: defaultAudioUrl,
      assigned_jewelcase: "default.jpg",
      duration_seconds: 240.0,
      recipe: {
        genre: initialBp.genre || "Contemporary R&B",
        subgenre: initialBp.subgenre || "2000s Pop R&B / Slow Jam Bounce",
        bpm: initialBp.bpm || 96,
        key: initialBp.key || "F minor",
        mood: initialBp.mood || "Sensual, passionate, smooth, confident, driving.",
        vocals: initialBp.vocals || "Silky male tenor lead vocal, dynamic chest-to-falsetto transitions, intricate melismatic ad-libs, stacked 4-part harmonies.",
        arrangement: initialBp.arrangement || "Deep 808 sub-bass, crisp acoustic-electronic hybrid snare on 2 and 4, syncopated hi-hat rolls, warm Fender Rhodes chords.",
        lyrics: window.compileBlocksToLyrics ? window.compileBlocksToLyrics(initialBp.blocks) : "",
        stage1_profile: "Studio Master Acoustic Arrangement",
        stage2_profile: "Spatial Air & Harmonic Balancing",
        stage3_profile: "Dynamic Envelope Optimization",
        stage4_profile: "Ultra-Fidelity Master Stream Delivery",
        telemetry: {
          seed: 42,
          duration_seconds: 240.0,
          sample_rate: 48000,
          true_peak_dbtp: -0.30,
          integrated_loudness_db: -14.15,
          dynamic_punch_db: 13.85,
          master_format: "48.0 kHz Master Audio Bitstream"
        }
      },
      working_draft: {
        ...JSON.parse(JSON.stringify(initialBp))
      }
    };
  } else {
    defaultTrack.order_index = 0;
    defaultTrack.is_default = true;
    defaultTrack.created_at = "2020-01-01T00:00:00.000Z";
  }

  const otherTracks = existingTracks
    .filter((t) => t && t.track_id !== defaultTrack.track_id)
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));

  otherTracks.forEach((t, i) => {
    t.order_index = i + 1;
  });

  const normalizedTracks = [defaultTrack, ...otherTracks];
  if (storage) {
    for (const track of normalizedTracks) {
      await storage.saveTrack(track);
    }
  }
  AppState.tracks = normalizedTracks;
}

function unlockWorkspaceUI() {
  const authModal = document.getElementById("auth-modal");
  const workspace = document.getElementById("app-workspace");
  if (authModal) authModal.classList.add("hidden");
  if (workspace) {
    workspace.classList.remove("hidden");
    workspace.classList.add("flex");
  }
  if (typeof window.resizeAllTextareas === "function") {
    requestAnimationFrame(() => window.resizeAllTextareas());
  }
}

function lockWorkspaceUI() {
  const authModal = document.getElementById("auth-modal");
  const workspace = document.getElementById("app-workspace");
  if (workspace) {
    workspace.classList.remove("flex");
    workspace.classList.add("hidden");
  }
  if (authModal) authModal.classList.remove("hidden");
}

async function handleAuthSubmit(event) {
  if (event) event.preventDefault();
  const usernameInput = document.getElementById("auth-username");
  const rawName = (usernameInput?.value || "").trim();
  if (!rawName) return;

  const btn = document.getElementById("auth-submit-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Entering Studio...";
  }

  if (window.RouterDiscovery) {
    await window.RouterDiscovery.resolve();
  }

  const slug = slugify(rawName);
  const todayUtc = getTodayUtcString();
  const storage = window.clientStorage;

  try {
    let authData = null;
    const router = window.RouterDiscovery;
    if (router && router.isOnline) {
      try {
        const loginResp = await fetch(`${router.activeBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: rawName })
        });
        if (loginResp.ok) {
          authData = await loginResp.json();
          AppState.token = authData.token;
          localStorage.setItem("tb_session_token", authData.token);
        } else if (loginResp.status === 401) {
          await AppModal.alert(
            "Access Denied",
            "Creator handle not recognized. Please provide a registered creator handle.",
            "fa-lock"
          );
          if (usernameInput) {
            usernameInput.focus();
            usernameInput.select();
          }
          return;
        }
      } catch {}
    }

    let userRecord = storage ? await storage.getUser(slug) : null;
    if (authData) {
      const dailyQuota = authData.user?.daily_quota || 2;
      const tokensRemaining = authData.user?.tokens_remaining !== undefined ? authData.user.tokens_remaining : dailyQuota;
      const tokensUsed = Math.max(0, dailyQuota - tokensRemaining);

      if (!userRecord) {
        userRecord = {
          slug: slug,
          display_name: authData.user?.display_name || rawName,
          daily_quota: dailyQuota,
          tokens_used_today: tokensUsed,
          last_quota_utc_date: todayUtc,
          assigned_theme: authData.user?.assigned_theme || "sky_peace"
        };
      } else {
        userRecord.display_name = authData.user?.display_name || userRecord.display_name;
        userRecord.daily_quota = dailyQuota;
        userRecord.tokens_used_today = tokensUsed;
        userRecord.last_quota_utc_date = todayUtc;
        userRecord.assigned_theme = authData.user?.assigned_theme || userRecord.assigned_theme;
      }

      if (Array.isArray(authData.tracks) && storage) {
        for (let i = 0; i < authData.tracks.length; i++) {
          const remoteTrack = authData.tracks[i];
          const resolvedAudioUrl = normalizeAudioStreamUrl(remoteTrack.audio_url, slug);
          await storage.saveTrack({
            ...remoteTrack,
            audio_url: resolvedAudioUrl,
            user_slug: slug,
            order_index: i + 1
          });
        }
      }
    } else if (userRecord) {
      if (userRecord.last_quota_utc_date !== todayUtc) {
        userRecord.tokens_used_today = 0;
        userRecord.last_quota_utc_date = todayUtc;
      }
    } else {
      let offlineMatch = null;
      try {
        const configResp = await fetch(resolveAssetUrl("config/users.json"));
        if (configResp.ok) {
          const cfgData = await configResp.json();
          const usersMap = cfgData.users || cfgData;
          if (usersMap && typeof usersMap === "object") {
            for (const [handleKey, meta] of Object.entries(usersMap)) {
              if (slugify(handleKey) === slug || slugify(meta.display_name || "") === slug) {
                offlineMatch = {
                  slug: slug,
                  display_name: meta.display_name || rawName,
                  daily_quota: meta.daily_quota || 2,
                  tokens_used_today: 0,
                  last_quota_utc_date: todayUtc,
                  assigned_theme: meta.assigned_theme || "sky_peace"
                };
                break;
              }
            }
          }
        }
      } catch {}

      if (offlineMatch) {
        userRecord = offlineMatch;
      } else {
        await AppModal.alert(
          "Access Denied",
          "Unknown creator handle. Please provide a valid handle configured for this studio workspace.",
          "fa-lock"
        );
        if (usernameInput) {
          usernameInput.focus();
          usernameInput.select();
        }
        return;
      }
    }

    if (storage && userRecord) {
      await storage.saveUser(userRecord);
    }

    await ensureShowcaseTrack(slug, storage);
    AppState.user = userRecord;
    localStorage.setItem("tb_active_user_slug", slug);

    unlockWorkspaceUI();
    const userGreeting = document.getElementById("user-greeting-tag");
    if (userGreeting) userGreeting.textContent = `${userRecord.display_name} Studio`;
    updateQuotaDisplay();

    if (window.themeEngine && userRecord.assigned_theme) {
      await window.themeEngine.applyTheme(userRecord.assigned_theme);
    }

    renderDiscography();

    const savedTrackId = localStorage.getItem(`tb_active_track_${slug}`);
    const trackExists = AppState.tracks.some((t) => t.track_id === savedTrackId);
    if (savedTrackId && trackExists) {
      selectTrackById(savedTrackId);
    } else if (AppState.tracks.length > 0) {
      selectTrackById(AppState.tracks[0].track_id);
    }

    const pendingJobJson = localStorage.getItem(`tb_active_job_${slug}`);
    if (pendingJobJson) {
      try {
        const { jobId, compositionPayload, isFork, originTrackId, assignedCover } = JSON.parse(pendingJobJson);
        const btnEl = document.getElementById("gen-submit-btn");
        const hudEl = document.getElementById("queue-status-hud");
        if (btnEl) btnEl.classList.add("hidden");
        if (hudEl) hudEl.classList.remove("hidden");
        startTrackingJob(jobId, compositionPayload, isFork, originTrackId, assignedCover);
      } catch {
        localStorage.removeItem(`tb_active_job_${slug}`);
      }
    }
  } catch (err) {
    await AppModal.alert("Authentication Error", `Could not initialize session: ${err.message}`, "fa-triangle-exclamation");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Initialize Studio";
    }
  }
}

function updateQuotaDisplay() {
  if (!AppState.user) return;
  const remaining = Math.max(0, AppState.user.daily_quota - AppState.user.tokens_used_today);
  const quotaEl = document.getElementById("quota-display");
  if (quotaEl) quotaEl.textContent = `Tokens: ${remaining} / ${AppState.user.daily_quota}`;
}

function handleLogout() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  AppState.user = null;
  AppState.token = null;
  AppState.tracks = [];
  AppState.activeTrackId = null;
  AppState.activeTrackCleanRecipe = null;
  AppState.isDispatching = false;

  if (AppState.activeEventSource) {
    AppState.activeEventSource.close();
    AppState.activeEventSource = null;
  }
  if (AppState.pollIntervalId) {
    clearInterval(AppState.pollIntervalId);
    AppState.pollIntervalId = null;
  }

  localStorage.removeItem("tb_session_token");
  localStorage.removeItem("tb_active_user_slug");

  const usernameInput = document.getElementById("auth-username");
  const btn = document.getElementById("auth-submit-btn");
  if (usernameInput) usernameInput.value = "";
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Initialize Studio";
  }

  lockWorkspaceUI();
  if (window.playerEngine) {
    window.playerEngine.setPlaybackState(false);
  }
}

async function handleNewSongTrigger() {
  await handleAddNewTrackCardClick();
}

function renderDiscography() {
  const container = document.getElementById("discography-carousel");
  const counter = document.getElementById("discography-counter");
  if (!container) return;

  container.innerHTML = "";
  AppState.tracks = sortTracks(AppState.tracks);
  const total = AppState.tracks.length;
  if (counter) counter.textContent = `${total} Track${total === 1 ? "" : "s"} In Vault`;

  const resolver = window.ClientJewelResolver;
  AppState.tracks.forEach((track) => {
    const isDefault = track.is_default || track.track_id.startsWith("default_");
    const isSelected = track.track_id === AppState.activeTrackId;
    const isDraft = track.status === "DRAFT";
    const isProcessing = track.status === "PROCESSING";
    const coverUrl = resolver ? resolver.getCoverUrl(track.assigned_jewelcase) : resolveAssetUrl("public/jewelcases/default.jpg");

    const item = document.createElement("div");
    item.className = `group relative flex-shrink-0 w-32 p-2 rounded-2xl border backdrop-blur-md cursor-pointer transition transform active:scale-95 select-none ${
      isSelected ? "border-white bg-white/25 shadow-xl scale-102 ring-1 ring-white/50" : "border-white/10 bg-black/30 hover:border-white/30"
    }`;
    item.onclick = () => selectTrackById(track.track_id);

    let badgeText = "Master";
    let badgeColor = "text-emerald-300";
    if (isDefault) {
      badgeText = "Master";
      badgeColor = "text-amber-300";
    } else if (isProcessing) {
      badgeText = "Studio";
      badgeColor = "text-sky-400 animate-pulse";
    } else if (isDraft) {
      badgeText = "Draft";
      badgeColor = "text-sky-300";
    }

    const badgeOrDeleteHtml = isDefault
      ? `
      <div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-[8px] font-mono font-bold uppercase ${badgeColor} pointer-events-none">
        ${badgeText}
      </div>
    `
      : `
      <div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-[8px] font-mono font-bold uppercase ${badgeColor} pointer-events-none">
        ${badgeText}
      </div>
      <button type="button" onclick="handleTrackDelete('${track.track_id}', event)"
              class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white/80 hover:text-white border border-white/20 flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition shadow-md z-10"
              title="Delete Track">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;

    item.innerHTML = `
      ${badgeOrDeleteHtml}
      <div class="w-full h-24 rounded-xl overflow-hidden relative mb-2 bg-black/40 border border-white/10 flex items-center justify-center">
        <img src="${coverUrl}"
             onerror="this.onerror=null; this.src='${resolveAssetUrl("public/jewelcases/default.jpg")}';"
             alt="Cover Art"
             class="w-full h-full object-cover">
      </div>
      <div class="text-[11px] font-black truncate text-white leading-tight">${track.working_draft?.title || track.title}</div>
      <div class="text-[9px] text-white/70 font-mono mt-0.5">${track.working_draft?.genre || track.recipe?.genre || "R&B"}</div>
    `;
    container.appendChild(item);
  });

  const addCard = document.createElement("div");
  addCard.className = "flex-shrink-0 w-32 p-2 rounded-2xl border border-dashed border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 hover:border-sky-300 cursor-pointer transition transform active:scale-95 flex flex-col items-center justify-center text-center space-y-2 h-[142px] select-none";
  addCard.onclick = handleAddNewTrackCardClick;
  addCard.innerHTML = `
    <div class="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-300 shadow-inner">
      <i class="fa-solid fa-plus text-sm"></i>
    </div>
    <div>
      <div class="text-[11px] font-black text-white uppercase tracking-wider">New Track</div>
      <div class="text-[8px] font-mono text-sky-200">Blueprint Engine</div>
    </div>
  `;
  container.appendChild(addCard);
}

function selectTrackById(trackId) {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  const track = AppState.tracks.find((t) => t.track_id === trackId);
  if (!track) return;

  AppState.activeTrackId = trackId;
  if (AppState.user) {
    localStorage.setItem(`tb_active_track_${AppState.user.slug}`, trackId);
  }

  if (window.playerEngine) {
    window.playerEngine.loadTrack(track);
  }

  const isDefault = Boolean(track.is_default || String(track.track_id).startsWith("default_"));
  if (track.working_draft) {
    loadDraftIntoForm(track.working_draft, isDefault);
  } else if (track.recipe) {
    const parsedBlocks = Array.isArray(track.recipe.blocks) && track.recipe.blocks.length > 0
      ? track.recipe.blocks
      : (window.parseLyricsIntoBlocks ? window.parseLyricsIntoBlocks(track.recipe.lyrics || "") : []);
    const draftFromRecipe = {
      title: track.title,
      genre: track.recipe.genre || "",
      subgenre: track.recipe.subgenre || "",
      bpm: track.recipe.bpm || 96,
      key: track.recipe.key || "",
      mood: track.recipe.mood || "",
      vocals: track.recipe.vocals || "",
      arrangement: track.recipe.arrangement || "",
      lyrics: track.recipe.lyrics || "",
      blocks: parsedBlocks
    };
    track.working_draft = draftFromRecipe;
    loadDraftIntoForm(draftFromRecipe, isDefault);
  } else {
    loadDraftIntoForm({ title: track.title }, isDefault);
  }

  if (track.status === "COMPLETED" && Boolean(track.audio_url)) {
    const canonicalSource = track.recipe || track.working_draft;
    AppState.activeTrackCleanRecipe = computeCanonicalRecipe(track.title, canonicalSource);
  } else {
    AppState.activeTrackCleanRecipe = null;
  }

  renderDiscography();
  checkRecipeDirtyState();
}

function loadDraftIntoForm(draft, isDefaultTrack = false) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal("field-title", draft.title || "");
  setVal("field-genre", draft.genre || "");
  setVal("field-subgenre", draft.subgenre || "");
  setVal("field-bpm", draft.bpm || 96);
  setVal("field-key", draft.key || "");
  setVal("field-mood", draft.mood || "");
  setVal("field-vocals", draft.vocals || "");
  setVal("field-arrangement", draft.arrangement || "");

  if (Array.isArray(draft.blocks) && draft.blocks.length > 0) {
    AppState.songBlocks = JSON.parse(JSON.stringify(draft.blocks));
  } else if (typeof draft.lyrics === "string" && draft.lyrics.trim().length > 0) {
    AppState.songBlocks = window.parseLyricsIntoBlocks
      ? window.parseLyricsIntoBlocks(draft.lyrics)
      : [];
  } else if (isDefaultTrack) {
    const fallback = window.TuneBloomBlueprints
      ? window.TuneBloomBlueprints.getById("rnb_midnight_frequency")?.blocks || []
      : [];
    AppState.songBlocks = JSON.parse(JSON.stringify(fallback));
  } else {
    AppState.songBlocks = [];
  }

  if (window.renderSongBlocks) window.renderSongBlocks();
}

function checkRecipeDirtyState() {
  const btn = document.getElementById("gen-submit-btn");
  if (!btn || AppState.isDispatching) return;

  const currentTrack = AppState.tracks.find((t) => t.track_id === AppState.activeTrackId);
  if (!currentTrack) return;

  const currentPayload = getCurrentFormPayload();
  const currentSerialized = computeCanonicalRecipe(currentPayload.title, currentPayload);
  const isCompleted = currentTrack.status === "COMPLETED" && Boolean(currentTrack.audio_url);
  const isPristine = isCompleted && AppState.activeTrackCleanRecipe !== null && currentSerialized === AppState.activeTrackCleanRecipe;

  if (isCompleted && isPristine) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 mr-1.5"></i> Master Synthesized (Ready)`;
    btn.className = "w-full py-3.5 rounded-2xl font-black tracking-widest text-xs uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default flex items-center justify-center gap-2 opacity-90 select-none";
  } else if (isCompleted && !isPristine) {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-code-branch text-amber-300 mr-1.5"></i> Synthesize Forked Variation (1 Token)`;
    btn.className = "w-full py-3.5 rounded-2xl font-black tracking-widest text-xs uppercase theme-btn-primary hover:opacity-95 active:scale-98 transition shadow-xl flex items-center justify-center gap-2 cursor-pointer";
  } else {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-bolt mr-1.5"></i> Synthesize Studio Master (1 Token)`;
    btn.className = "w-full py-3.5 rounded-2xl font-black tracking-widest text-xs uppercase theme-btn-primary hover:opacity-95 active:scale-98 transition shadow-xl flex items-center justify-center gap-2 cursor-pointer";
  }
}

function syncActiveTrackDraftDebounced() {
  if (syncTimeout) clearTimeout(syncTimeout);
  const targetTrackId = AppState.activeTrackId;

  syncTimeout = setTimeout(async () => {
    if (!AppState.user || !targetTrackId || targetTrackId !== AppState.activeTrackId) return;
    const track = AppState.tracks.find((t) => t.track_id === targetTrackId);
    if (track) {
      const payload = getCurrentFormPayload();
      track.working_draft = payload;
      track.title = payload.title || track.title;
      track.updated_at = new Date().toISOString();
      const storage = window.clientStorage;
      if (storage) await storage.saveTrack(track);
      if (track.track_id === AppState.activeTrackId) {
        const titleEl = document.getElementById("player-track-title");
        if (titleEl) titleEl.textContent = track.title;
      }
    }
  }, 350);
}

async function handleAddNewTrackCardClick() {
  const blueprint = window.TuneBloomBlueprints
    ? window.TuneBloomBlueprints.getRandom()
    : {
        title: "New Composition",
        genre: "Contemporary R&B",
        subgenre: "2000s Pop R&B / Slow Jam Bounce",
        bpm: 96,
        key: "F minor",
        mood: "Sensual, passionate, smooth, driving.",
        vocals: "Silky tenor lead",
        arrangement: "808, hybrid snare, Fender Rhodes",
        blocks: []
      };

  const enteredTitle = await AppModal.prompt("Create New Composition", "Enter a title for this new draft:", blueprint.title);
  if (!enteredTitle) return;

  const trackId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const seed = Math.floor(Math.random() * 90000000);
  const resolver = window.ClientJewelResolver;
  const usedCovers = AppState.tracks.map((t) => t.assigned_jewelcase);
  const assignedCover = resolver ? await resolver.resolve(AppState.user.slug, trackId, seed, usedCovers) : "default.jpg";
  const newOrderIndex = AppState.tracks.length;

  const clonedBlocks = Array.isArray(blueprint.blocks)
    ? JSON.parse(JSON.stringify(blueprint.blocks))
    : [];
  const compiledLyrics = window.compileBlocksToLyrics
    ? window.compileBlocksToLyrics(clonedBlocks)
    : "";

  const newDraftTrack = {
    track_id: trackId,
    user_slug: AppState.user.slug,
    order_index: newOrderIndex,
    is_default: false,
    status: "DRAFT",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: enteredTitle.slice(0, 80),
    artist: AppState.user.display_name,
    audio_url: null,
    assigned_jewelcase: assignedCover,
    duration_seconds: 240.0,
    recipe: null,
    working_draft: {
      ...JSON.parse(JSON.stringify(blueprint)),
      title: enteredTitle.slice(0, 80),
      lyrics: compiledLyrics,
      blocks: clonedBlocks
    }
  };

  const storage = window.clientStorage;
  if (storage) await storage.saveTrack(newDraftTrack);
  AppState.tracks.push(newDraftTrack);
  renderDiscography();
  selectTrackById(trackId);

  const carousel = document.getElementById("discography-carousel");
  if (carousel) {
    carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
  }
  const dock = document.getElementById("studio-generation-dock");
  if (dock) dock.scrollIntoView({ behavior: "smooth" });
}

async function handleTrackDelete(trackId, e) {
  if (e) e.stopPropagation();
  const track = AppState.tracks.find((t) => t.track_id === trackId);
  if (!track) return;

  if (track.is_default || track.track_id.startsWith("default_")) {
    await AppModal.alert("Action Disallowed", "The showcase reference track is permanently preserved and cannot be removed.", "fa-lock");
    return;
  }

  const confirmed = await AppModal.confirm(
    "Delete Track",
    `Are you sure you want to permanently delete "${track.working_draft?.title || track.title}" from your discography vault?`,
    "Delete",
    "Keep"
  );
  if (!confirmed) return;

  const storage = window.clientStorage;
  if (storage) await storage.deleteTrack(trackId);
  AppState.tracks = AppState.tracks.filter((t) => t.track_id !== trackId);

  if (AppState.activeTrackId === trackId) {
    const fallbackTrack = AppState.tracks[0];
    if (fallbackTrack) {
      selectTrackById(fallbackTrack.track_id);
    }
  } else {
    renderDiscography();
  }
}

function handleJewelCaseClick(e) {
  if (e.target.closest(".cd-slide-tray")) {
    if (window.playerEngine) window.playerEngine.togglePlay();
    return;
  }
  if (window.playerEngine) window.playerEngine.flipCard();
}

function flipJewelCase(e) {
  if (e && typeof e.stopPropagation === "function") e.stopPropagation();
  if (window.playerEngine) window.playerEngine.flipCard();
}

function toggleMasterPlayback() {
  if (window.playerEngine) window.playerEngine.togglePlay();
}

function toggleAudioMute() {
  if (window.playerEngine) window.playerEngine.toggleMute();
}

function handleAudioSeek(val) {
  if (window.playerEngine) window.playerEngine.seek(val);
}

function handleVolumeChange(val) {
  if (window.playerEngine) window.playerEngine.setVolume(val);
}

function handleEasterEggTrigger() {
  if (window.themeEngine) window.themeEngine.triggerEasterEgg();
}

async function handleGenerateSubmit(e) {
  e.preventDefault();
  if (AppState.isDispatching) return;
  if (!AppState.user) return;

  const honeypot = document.getElementById("field-honeypot");
  if (honeypot && honeypot.value.length > 0) return;
  if (Date.now() - AppState.formFocusTimestamp < 600) return;

  const currentTrack = AppState.tracks.find((t) => t.track_id === AppState.activeTrackId);
  const isCompleted = currentTrack && currentTrack.status === "COMPLETED" && Boolean(currentTrack.audio_url);
  const formPayload = getCurrentFormPayload();
  const currentSerialized = computeCanonicalRecipe(formPayload.title, formPayload);
  const isPristine = isCompleted && AppState.activeTrackCleanRecipe !== null && currentSerialized === AppState.activeTrackCleanRecipe;

  if (isCompleted && isPristine) {
    await AppModal.alert(
      "Master Already Synthesized",
      "This composition master is already synthesized. Modify any arrangement parameter or lyrics to synthesize a new forked variation.",
      "fa-circle-check"
    );
    return;
  }

  const remaining = AppState.user.daily_quota - AppState.user.tokens_used_today;
  if (remaining <= 0) {
    await AppModal.alert("Quota Exhausted", "Daily generation token quota reached. Quotas reset at 00:00 UTC.", "fa-battery-empty");
    return;
  }

  const router = window.RouterDiscovery;
  if (router) await router.resolve();
  if (!router || !router.isOnline) {
    await AppModal.alert("Studio Offline", "The compute pipeline is currently disconnected. Your draft and arrangement have been saved locally in your vault.", "fa-cloud-arrow-down");
    return;
  }

  AppState.isDispatching = true;
  const isFork = Boolean(isCompleted);
  const originTrackId = currentTrack ? currentTrack.track_id : null;
  const btn = document.getElementById("gen-submit-btn");
  const hud = document.getElementById("queue-status-hud");
  const statusLabel = document.getElementById("queue-hud-status");

  if (btn) {
    btn.disabled = true;
    btn.classList.add("hidden");
  }
  if (hud) hud.classList.remove("hidden");

  const seed = Math.floor(Math.random() * 90000000) + 100000;
  const resolver = window.ClientJewelResolver;
  const usedCovers = AppState.tracks.map((t) => t.assigned_jewelcase);
  const stagedId = `staged_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const assignedCover = resolver ? await resolver.resolve(AppState.user.slug, stagedId, seed, usedCovers) : "default.jpg";

  let workingTrackTarget = null;
  if (isFork) {
    workingTrackTarget = {
      track_id: stagedId,
      user_slug: AppState.user.slug,
      order_index: AppState.tracks.length,
      is_default: false,
      status: "PROCESSING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: formPayload.title,
      artist: AppState.user.display_name,
      audio_url: null,
      assigned_jewelcase: assignedCover,
      duration_seconds: formPayload.audio_duration,
      recipe: null,
      working_draft: JSON.parse(JSON.stringify(formPayload))
    };
    AppState.tracks.push(workingTrackTarget);
    selectTrackById(stagedId);
  } else if (currentTrack) {
    currentTrack.title = formPayload.title;
    currentTrack.assigned_jewelcase = assignedCover;
    currentTrack.status = "PROCESSING";
    currentTrack.working_draft = JSON.parse(JSON.stringify(formPayload));
    selectTrackById(currentTrack.track_id);
  }
  renderDiscography();

  try {
    if (statusLabel) statusLabel.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>Securing Studio Challenge...';
    const challengeData = window.acquireChallenge ? await window.acquireChallenge() : null;
    if (!challengeData) throw new Error("Unable to establish handshake with inference engine.");

    if (statusLabel) statusLabel.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>Solving Verification Hash...';
    const solutionNonce = window.solveClientProofOfWork ? await window.solveClientProofOfWork(challengeData) : "0";

    if (statusLabel) statusLabel.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>Dispatching Master Job...';
    const payload = {
      title: formPayload.title,
      genre: formPayload.genre,
      subgenre: formPayload.subgenre,
      bpm: formPayload.bpm,
      key: formPayload.key,
      mood: formPayload.mood,
      vocals: formPayload.vocals,
      arrangement: formPayload.arrangement,
      lyrics: formPayload.lyrics,
      audio_duration: formPayload.audio_duration,
      seed: seed,
      assigned_jewelcase: assignedCover,
      blocks: formPayload.blocks,
      pow: {
        challenge: challengeData.challenge,
        signature: challengeData.signature,
        solution_nonce: solutionNonce
      }
    };

    const token = AppState.token || localStorage.getItem("tb_session_token");
    const resp = await fetch(`${router.activeBase}/synthesize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      let errorDetail = `Compute Daemon rejected request (HTTP ${resp.status})`;
      try {
        const errJson = await resp.json();
        if (errJson.detail) {
          errorDetail = formatValidationErrors(errJson.detail);
        }
      } catch {}
      throw new Error(errorDetail);
    }

    const jobData = await resp.json();
    AppState.user.tokens_used_today += 1;
    const storage = window.clientStorage;
    if (storage) await storage.saveUser(AppState.user);
    updateQuotaDisplay();

    if (isFork && workingTrackTarget) {
      workingTrackTarget.track_id = jobData.job_id;
      AppState.activeTrackId = jobData.job_id;
    } else if (currentTrack) {
      currentTrack.track_id = jobData.job_id;
      AppState.activeTrackId = jobData.job_id;
    }
    renderDiscography();

    localStorage.setItem(`tb_active_job_${AppState.user.slug}`, JSON.stringify({
      jobId: jobData.job_id,
      compositionPayload: formPayload,
      isFork,
      originTrackId,
      assignedCover
    }));

    startTrackingJob(jobData.job_id, formPayload, isFork, originTrackId, assignedCover);
  } catch (err) {
    if (isFork) {
      AppState.tracks = AppState.tracks.filter((t) => t.track_id !== stagedId);
      if (originTrackId) selectTrackById(originTrackId);
    } else if (currentTrack) {
      currentTrack.status = "DRAFT";
      renderDiscography();
    }
    AppState.isDispatching = false;
    await AppModal.alert("Dispatch Error", `Synthesis submission failed:\n${err.message}`, "fa-triangle-exclamation");
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("hidden");
    }
    if (hud) hud.classList.add("hidden");
    checkRecipeDirtyState();
  }
}

function startTrackingJob(jobId, compositionPayload, isFork, originTrackId, assignedCover) {
  if (AppState.activeEventSource) {
    AppState.activeEventSource.close();
    AppState.activeEventSource = null;
  }
  if (AppState.pollIntervalId) {
    clearInterval(AppState.pollIntervalId);
    AppState.pollIntervalId = null;
  }

  const statusLabel = document.getElementById("queue-hud-status");
  const queuePosLabel = document.getElementById("queue-hud-pos");
  const progressBar = document.getElementById("queue-hud-bar");
  const token = AppState.token || localStorage.getItem("tb_session_token");
  const router = window.RouterDiscovery;

  const handleJobLost = async () => {
    if (AppState.pollIntervalId) {
      clearInterval(AppState.pollIntervalId);
      AppState.pollIntervalId = null;
    }
    if (AppState.activeEventSource) {
      AppState.activeEventSource.close();
      AppState.activeEventSource = null;
    }
    if (AppState.user) {
      localStorage.removeItem(`tb_active_job_${AppState.user.slug}`);
      if (AppState.user.tokens_used_today > 0) {
        AppState.user.tokens_used_today -= 1;
        const storage = window.clientStorage;
        if (storage) await storage.saveUser(AppState.user);
        updateQuotaDisplay();
      }
    }

    AppState.isDispatching = false;
    const btnEl = document.getElementById("gen-submit-btn");
    const hudEl = document.getElementById("queue-status-hud");
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.classList.remove("hidden");
    }
    if (hudEl) hudEl.classList.add("hidden");

    if (isFork) {
      AppState.tracks = AppState.tracks.filter((t) => t.track_id !== jobId);
      if (originTrackId) selectTrackById(originTrackId);
    } else {
      const active = AppState.tracks.find((t) => t.track_id === jobId || t.track_id === originTrackId);
      if (active) active.status = "DRAFT";
      renderDiscography();
    }
    checkRecipeDirtyState();

    await AppModal.alert(
      "Session Reset",
      "The compute studio was restarted and the pending job was cleared. Your lyrics, arrangement draft, and generation token remain intact.",
      "fa-rotate-right"
    );
  };

  const onJobUpdate = async (data) => {
    if (!data) return;

    if (data.status === "QUEUED") {
      if (statusLabel) statusLabel.textContent = `Queued in Studio (Est. ${data.estimated_wait_seconds}s)`;
      if (queuePosLabel) queuePosLabel.textContent = `Ahead in Queue: ${data.users_ahead}`;
      if (progressBar) progressBar.style.width = "10%";
    } else if (data.status === "PROCESSING") {
      if (statusLabel) statusLabel.textContent = data.stage || `Processing (${data.progress_pct}%)`;
      if (queuePosLabel) queuePosLabel.textContent = "Active in Studio";
      if (progressBar) progressBar.style.width = `${Math.max(15, data.progress_pct)}%`;
    } else if (data.status === "COMPLETED") {
      if (AppState.activeEventSource) {
        AppState.activeEventSource.close();
        AppState.activeEventSource = null;
      }
      if (AppState.pollIntervalId) {
        clearInterval(AppState.pollIntervalId);
        AppState.pollIntervalId = null;
      }
      if (AppState.user) localStorage.removeItem(`tb_active_job_${AppState.user.slug}`);

      if (statusLabel) statusLabel.textContent = "Master Complete!";
      if (progressBar) progressBar.style.width = "100%";

      const seed = data.telemetry?.seed || Math.floor(Math.random() * 90000000);
      const realizedDuration = (data.telemetry && data.telemetry.duration_seconds)
        ? Number(data.telemetry.duration_seconds)
        : compositionPayload.audio_duration;

      const targetTrackId = jobId;
      const finalCover = assignedCover || (window.ClientJewelResolver ? await window.ClientJewelResolver.resolve(AppState.user.slug, jobId, seed, AppState.tracks.map(t => t.assigned_jewelcase)) : "default.jpg");
      const audioUrl = `${router.activeBase}/audio/stream/${AppState.user.slug}/${jobId}_master.opus`;

      const completedTrack = {
        track_id: targetTrackId,
        user_slug: AppState.user.slug,
        order_index: isFork
          ? AppState.tracks.length
          : (AppState.tracks.find((t) => t.track_id === originTrackId || t.track_id === targetTrackId)?.order_index ?? AppState.tracks.length),
        is_default: false,
        status: "COMPLETED",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: compositionPayload.title,
        artist: `${AppState.user.display_name}`,
        audio_url: audioUrl,
        duration_seconds: realizedDuration,
        assigned_jewelcase: finalCover,
        recipe: {
          genre: compositionPayload.genre,
          subgenre: compositionPayload.subgenre,
          bpm: compositionPayload.bpm,
          key: compositionPayload.key,
          mood: compositionPayload.mood,
          vocals: compositionPayload.vocals,
          arrangement: compositionPayload.arrangement,
          lyrics: compositionPayload.lyrics,
          audio_duration: realizedDuration,
          blocks: compositionPayload.blocks,
          stage1_profile: "Studio Master Acoustic Arrangement",
          stage2_profile: "Spatial Air & Harmonic Balancing",
          stage3_profile: "Dynamic Envelope Optimization",
          stage4_profile: "Ultra-Fidelity Master Stream Delivery",
          telemetry: data.telemetry || {
            seed: seed,
            duration_seconds: realizedDuration,
            sample_rate: 48000,
            true_peak_dbtp: -0.30,
            integrated_loudness_db: -14.15,
            dynamic_punch_db: 13.85,
            master_format: "48.0 kHz Master Audio Bitstream"
          }
        },
        working_draft: {
          title: compositionPayload.title,
          genre: compositionPayload.genre,
          subgenre: compositionPayload.subgenre,
          bpm: compositionPayload.bpm,
          key: compositionPayload.key,
          mood: compositionPayload.mood,
          vocals: compositionPayload.vocals,
          arrangement: compositionPayload.arrangement,
          lyrics: compositionPayload.lyrics,
          blocks: compositionPayload.blocks || (window.parseLyricsIntoBlocks ? window.parseLyricsIntoBlocks(compositionPayload.lyrics) : [])
        }
      };

      const storage = window.clientStorage;
      if (storage) {
        if (!isFork && originTrackId && originTrackId !== targetTrackId) {
          await storage.deleteTrack(originTrackId);
        }
        await storage.saveTrack(completedTrack);
        fetch(audioUrl)
          .then((res) => (res.ok ? res.arrayBuffer() : null))
          .then((buffer) => {
            if (buffer) storage.saveTrackAudioBlob(targetTrackId, buffer);
          })
          .catch(() => {});
      }

      const existingIdx = AppState.tracks.findIndex((t) => t.track_id === originTrackId || t.track_id === targetTrackId);
      if (existingIdx !== -1) {
        AppState.tracks[existingIdx] = completedTrack;
      } else {
        AppState.tracks.push(completedTrack);
      }

      AppState.isDispatching = false;
      renderDiscography();
      selectTrackById(targetTrackId);

      setTimeout(() => {
        const btnEl = document.getElementById("gen-submit-btn");
        const hudEl = document.getElementById("queue-status-hud");
        if (btnEl) btnEl.classList.remove("hidden");
        if (hudEl) hudEl.classList.add("hidden");
        checkRecipeDirtyState();
      }, 1200);
    } else if (data.status === "FAILED") {
      if (AppState.activeEventSource) {
        AppState.activeEventSource.close();
        AppState.activeEventSource = null;
      }
      if (AppState.pollIntervalId) {
        clearInterval(AppState.pollIntervalId);
        AppState.pollIntervalId = null;
      }
      if (AppState.user) {
        localStorage.removeItem(`tb_active_job_${AppState.user.slug}`);
        if (AppState.user.tokens_used_today > 0) {
          AppState.user.tokens_used_today -= 1;
          const storage = window.clientStorage;
          if (storage) await storage.saveUser(AppState.user);
          updateQuotaDisplay();
        }
      }

      AppState.isDispatching = false;
      await AppModal.alert("Synthesis Failed", data.error || "Audio mastering process interrupted.", "fa-circle-xmark");
      const btnEl = document.getElementById("gen-submit-btn");
      const hudEl = document.getElementById("queue-status-hud");
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.classList.remove("hidden");
      }
      if (hudEl) hudEl.classList.add("hidden");
      checkRecipeDirtyState();
    }
  };

  const startFallbackPolling = () => {
    if (AppState.pollIntervalId) return;
    let lastEtag = null;
    let currentInterval = 2000;

    const pollStep = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        if (lastEtag) headers["If-None-Match"] = lastEtag;
        const resp = await fetch(`${router.activeBase}/jobs/${jobId}`, { headers });
        if (resp.status === 304) return;
        if (resp.status === 404 || resp.status === 410) {
          await handleJobLost();
          return;
        }
        if (!resp.ok) return;

        const etag = resp.headers.get("ETag");
        if (etag) lastEtag = etag;
        const data = await resp.json();
        await onJobUpdate(data);

        if (data.status === "PROCESSING" && data.progress_pct > 70) {
          currentInterval = 1000;
        }
      } catch {}
    };

    AppState.pollIntervalId = setInterval(pollStep, currentInterval);
    pollStep();
  };

  if (window.EventSource && router && router.isOnline) {
    try {
      const sseUrl = `${router.activeBase}/jobs/${jobId}/stream?token=${encodeURIComponent(token || "")}`;
      const es = new EventSource(sseUrl);
      AppState.activeEventSource = es;

      es.onmessage = async (e) => {
        try {
          const data = JSON.parse(e.data);
          await onJobUpdate(data);
        } catch {}
      };

      es.onerror = async () => {
        if (AppState.activeEventSource) {
          AppState.activeEventSource.close();
          AppState.activeEventSource = null;
        }
        startFallbackPolling();
      };
    } catch {
      startFallbackPolling();
    }
  } else {
    startFallbackPolling();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  AppModal.init();

  if (window.RouterDiscovery) {
    await window.RouterDiscovery.resolve();
  }

  const savedSlug = localStorage.getItem("tb_active_user_slug");
  if (savedSlug && window.clientStorage) {
    try {
      const userRecord = await window.clientStorage.getUser(savedSlug);
      if (userRecord) {
        AppState.user = userRecord;
        AppState.token = localStorage.getItem("tb_session_token");
        await ensureShowcaseTrack(savedSlug, window.clientStorage);
        unlockWorkspaceUI();

        const userGreeting = document.getElementById("user-greeting-tag");
        if (userGreeting) userGreeting.textContent = `${userRecord.display_name} Studio`;
        updateQuotaDisplay();

        if (window.themeEngine && userRecord.assigned_theme) {
          await window.themeEngine.applyTheme(userRecord.assigned_theme);
        }

        renderDiscography();

        const savedTrackId = localStorage.getItem(`tb_active_track_${savedSlug}`);
        const trackExists = AppState.tracks.some((t) => t.track_id === savedTrackId);
        if (savedTrackId && trackExists) {
          selectTrackById(savedTrackId);
        } else if (AppState.tracks.length > 0) {
          selectTrackById(AppState.tracks[0].track_id);
        }

        if (window.RouterDiscovery && window.RouterDiscovery.isOnline) {
          fetch(`${window.RouterDiscovery.activeBase}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: userRecord.display_name || userRecord.slug })
          })
            .then((res) => (res.ok ? res.json() : null))
            .then(async (data) => {
              if (data) {
                if (data.token) {
                  AppState.token = data.token;
                  localStorage.setItem("tb_session_token", data.token);
                }
                if (data.user) {
                  userRecord.daily_quota = data.user.daily_quota ?? userRecord.daily_quota;
                  const remaining = data.user.tokens_remaining !== undefined ? data.user.tokens_remaining : userRecord.daily_quota;
                  userRecord.tokens_used_today = Math.max(0, userRecord.daily_quota - remaining);
                  userRecord.last_quota_utc_date = getTodayUtcString();
                  AppState.user = userRecord;
                  await window.clientStorage.saveUser(userRecord);
                  updateQuotaDisplay();
                }
                if (Array.isArray(data.tracks)) {
                  let changed = false;
                  for (let i = 0; i < data.tracks.length; i++) {
                    const remoteTrack = data.tracks[i];
                    const existingIdx = AppState.tracks.findIndex((t) => t.track_id === remoteTrack.track_id);
                    const resolvedAudioUrl = normalizeAudioStreamUrl(remoteTrack.audio_url, savedSlug);
                    const trackObj = {
                      ...remoteTrack,
                      audio_url: resolvedAudioUrl,
                      user_slug: savedSlug,
                      order_index: existingIdx !== -1 ? AppState.tracks[existingIdx].order_index : (i + 1)
                    };

                    if (existingIdx === -1) {
                      await window.clientStorage.saveTrack(trackObj);
                      AppState.tracks.push(trackObj);
                      changed = true;
                    } else if (AppState.tracks[existingIdx].status !== "COMPLETED" && trackObj.status === "COMPLETED") {
                      AppState.tracks[existingIdx] = trackObj;
                      await window.clientStorage.saveTrack(trackObj);
                      changed = true;
                    }
                  }
                  if (changed) {
                    await ensureShowcaseTrack(savedSlug, window.clientStorage);
                    renderDiscography();
                    if (AppState.activeTrackId) {
                      checkRecipeDirtyState();
                    }
                  }
                }
              }
            })
            .catch(() => {});
        }

        const pendingJobJson = localStorage.getItem(`tb_active_job_${savedSlug}`);
        if (pendingJobJson) {
          try {
            const { jobId, compositionPayload, isFork, originTrackId, assignedCover } = JSON.parse(pendingJobJson);
            const btnEl = document.getElementById("gen-submit-btn");
            const hudEl = document.getElementById("queue-status-hud");
            if (btnEl) btnEl.classList.add("hidden");
            if (hudEl) hudEl.classList.remove("hidden");
            startTrackingJob(jobId, compositionPayload, isFork, originTrackId, assignedCover);
          } catch {
            localStorage.removeItem(`tb_active_job_${savedSlug}`);
          }
        }
      } else {
        lockWorkspaceUI();
      }
    } catch {
      lockWorkspaceUI();
    }
  } else {
    lockWorkspaceUI();
  }

  const inputs = document.querySelectorAll("#studio-generation-dock input, #studio-generation-dock textarea");
  inputs.forEach((el) => {
    el.addEventListener("focus", () => {
      if (!AppState.formFocusTimestamp) AppState.formFocusTimestamp = Date.now();
    });
    el.addEventListener("input", () => {
      checkRecipeDirtyState();
      syncActiveTrackDraftDebounced();
    });
  });

  const carousel = document.getElementById("discography-carousel");
  if (carousel) {
    carousel.addEventListener(
      "wheel",
      (e) => {
        const hasHorizontalOverflow = carousel.scrollWidth > carousel.clientWidth;
        if (!hasHorizontalOverflow) return;
        const isAtLeft = carousel.scrollLeft <= 0;
        const isAtRight = Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth;
        if ((e.deltaY > 0 && !isAtRight) || (e.deltaY < 0 && !isAtLeft)) {
          e.preventDefault();
          carousel.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );
  }

  window.addEventListener("resize", () => {
    if (typeof window.resizeAllTextareas === "function") window.resizeAllTextareas();
  });
});

window.AppState = AppState;
window.AppModal = AppModal;
window.sortTracks = sortTracks;
window.computeCanonicalRecipe = computeCanonicalRecipe;
window.ensureShowcaseTrack = ensureShowcaseTrack;
window.handleAuthSubmit = handleAuthSubmit;
window.handleLogout = handleLogout;
window.handleNewSongTrigger = handleNewSongTrigger;
window.renderDiscography = renderDiscography;
window.selectTrackById = selectTrackById;
window.loadDraftIntoForm = loadDraftIntoForm;
window.checkRecipeDirtyState = checkRecipeDirtyState;
window.getCurrentFormPayload = getCurrentFormPayload;
window.syncActiveTrackDraftDebounced = syncActiveTrackDraftDebounced;
window.handleAddNewTrackCardClick = handleAddNewTrackCardClick;
window.handleTrackDelete = handleTrackDelete;
window.handleJewelCaseClick = handleJewelCaseClick;
window.flipJewelCase = flipJewelCase;
window.toggleMasterPlayback = toggleMasterPlayback;
window.toggleAudioMute = toggleAudioMute;
window.handleAudioSeek = handleAudioSeek;
window.handleVolumeChange = handleVolumeChange;
window.handleEasterEggTrigger = handleEasterEggTrigger;
window.handleGenerateSubmit = handleGenerateSubmit;