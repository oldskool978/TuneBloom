(function (window) {
  const INSTRUMENTAL_THEME_SCHEMA = {
    intro: {
      bgVar: "--inst-intro-bg",
      borderVar: "--inst-intro-border",
      inkVar: "--inst-intro-ink",
      defaultBg: "rgba(49, 46, 129, 0.35)",
      defaultBorder: "#818cf8",
      defaultInk: "#f8fafc",
      glow: "rgba(129, 140, 248, 0.45)"
    },
    verse: {
      bgVar: "--inst-verse-bg",
      borderVar: "--inst-verse-border",
      inkVar: "--inst-verse-ink",
      defaultBg: "rgba(6, 78, 59, 0.35)",
      defaultBorder: "#34d399",
      defaultInk: "#f8fafc",
      glow: "rgba(52, 211, 153, 0.45)"
    },
    "pre-chorus": {
      bgVar: "--inst-prechorus-bg",
      borderVar: "--inst-prechorus-border",
      inkVar: "--inst-prechorus-ink",
      defaultBg: "rgba(88, 28, 135, 0.35)",
      defaultBorder: "#c084fc",
      defaultInk: "#f8fafc",
      glow: "rgba(192, 132, 252, 0.45)"
    },
    chorus: {
      bgVar: "--inst-chorus-bg",
      borderVar: "--inst-chorus-border",
      inkVar: "--inst-chorus-ink",
      defaultBg: "rgba(180, 83, 9, 0.40)",
      defaultBorder: "#fbbf24",
      defaultInk: "#ffffff",
      glow: "rgba(251, 191, 36, 0.50)"
    },
    hook: {
      bgVar: "--inst-hook-bg",
      borderVar: "--inst-hook-border",
      inkVar: "--inst-hook-ink",
      defaultBg: "rgba(194, 65, 12, 0.40)",
      defaultBorder: "#f97316",
      defaultInk: "#ffffff",
      glow: "rgba(249, 115, 22, 0.50)"
    },
    "post-chorus": {
      bgVar: "--inst-postchorus-bg",
      borderVar: "--inst-postchorus-border",
      inkVar: "--inst-postchorus-ink",
      defaultBg: "rgba(217, 119, 6, 0.35)",
      defaultBorder: "#f59e0b",
      defaultInk: "#ffffff",
      glow: "rgba(245, 158, 11, 0.45)"
    },
    bridge: {
      bgVar: "--inst-bridge-bg",
      borderVar: "--inst-bridge-border",
      inkVar: "--inst-bridge-ink",
      defaultBg: "rgba(54, 83, 20, 0.35)",
      defaultBorder: "#a3e635",
      defaultInk: "#f8fafc",
      glow: "rgba(163, 230, 53, 0.45)"
    },
    breakdown: {
      bgVar: "--inst-breakdown-bg",
      borderVar: "--inst-breakdown-border",
      inkVar: "--inst-breakdown-ink",
      defaultBg: "rgba(136, 19, 55, 0.35)",
      defaultBorder: "#fb7185",
      defaultInk: "#f8fafc",
      glow: "rgba(251, 113, 133, 0.45)"
    },
    solo: {
      bgVar: "--inst-solo-bg",
      borderVar: "--inst-solo-border",
      inkVar: "--inst-solo-ink",
      defaultBg: "rgba(14, 116, 144, 0.35)",
      defaultBorder: "#38bdf8",
      defaultInk: "#ffffff",
      glow: "rgba(56, 189, 248, 0.50)"
    },
    instrumental: {
      bgVar: "--inst-solo-bg",
      borderVar: "--inst-solo-border",
      inkVar: "--inst-solo-ink",
      defaultBg: "rgba(13, 148, 136, 0.35)",
      defaultBorder: "#2dd4bf",
      defaultInk: "#ffffff",
      glow: "rgba(45, 212, 191, 0.50)"
    },
    outro: {
      bgVar: "--inst-intro-bg",
      borderVar: "--inst-intro-border",
      inkVar: "--inst-intro-ink",
      defaultBg: "rgba(30, 41, 59, 0.50)",
      defaultBorder: "#94a3b8",
      defaultInk: "#f8fafc",
      glow: "rgba(148, 163, 184, 0.45)"
    },
    default: {
      bgVar: "--inst-default-bg",
      borderVar: "--inst-default-border",
      inkVar: "--inst-default-ink",
      defaultBg: "rgba(15, 23, 42, 0.50)",
      defaultBorder: "#64748b",
      defaultInk: "#f8fafc",
      glow: "rgba(100, 116, 139, 0.45)"
    }
  };

  function resolveInstrumentalStyles(canonicalTag) {
    const s = INSTRUMENTAL_THEME_SCHEMA[canonicalTag] || INSTRUMENTAL_THEME_SCHEMA.default;
    const bg = `var(${s.bgVar}, ${s.defaultBg})`;
    const border = `var(${s.borderVar}, ${s.defaultBorder})`;
    const glow = s.glow || "rgba(56, 189, 248, 0.4)";
    return {
      accent: border,
      glow: glow,
      card: `background: linear-gradient(135deg, color-mix(in srgb, ${bg} 85%, #020617) 0%, rgba(2, 6, 23, 0.95) 100%); border: 1px solid rgba(255, 255, 255, 0.10); border-left: 3.5px solid ${border}; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.65), -2px 0 14px -3px ${glow}; color: #f8fafc;`,
      tag: `background-color: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.16); color: #f8fafc;`,
      textarea: `background-color: rgba(0, 0, 0, 0.55); border: 1px solid rgba(255, 255, 255, 0.12); border-left: 2.5px solid ${border}; color: #f8fafc;`,
      controls: `background-color: rgba(0, 0, 0, 0.50); border-color: rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.75);`,
      button: `background: linear-gradient(180deg, rgba(30, 41, 59, 0.70) 0%, rgba(15, 23, 42, 0.90) 100%); border: 1px solid rgba(255, 255, 255, 0.14); border-bottom: 2px solid ${border}; color: #f8fafc;`
    };
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function calculateQuantizedDuration(bpm) {
    const cleanBpm = Math.max(30, Math.min(300, Number(bpm) || 96));
    const secPer8Bars = 1920.0 / cleanBpm;
    const maxPhrases = Math.max(1, Math.floor(300.0 / secPer8Bars));
    const rawDuration = maxPhrases * secPer8Bars;
    const exactDuration = Math.min(300.0, Math.max(30.0, Math.round(rawDuration * 100) / 100));
    return {
      bpm: cleanBpm,
      phrases: maxPhrases,
      bars: maxPhrases * 8,
      durationSeconds: exactDuration
    };
  }

  function autoResizeTextarea(el) {
    if (!el) return;
    const isInst = Boolean(window.AppState && window.AppState.isInstrumental);
    const minHeight = isInst ? 58 : 24;
    el.style.height = "auto";
    const scrollH = el.scrollHeight;
    const targetH = Math.max(scrollH, minHeight);
    el.style.height = `${targetH}px`;
  }

  function resizeAllTextareas() {
    requestAnimationFrame(() => {
      document.querySelectorAll(".lyric-textarea").forEach(autoResizeTextarea);
    });
    setTimeout(() => {
      document.querySelectorAll(".lyric-textarea").forEach(autoResizeTextarea);
    }, 50);
  }

  function sanitizeTagString(tag) {
    return String(tag || "")
      .replace(/[\[\]]/g, "")
      .replace(/[\r\n\t]/g, " ")
      .trim();
  }

  function mapToCanonicalTag(tagOrLabel) {
    const clean = sanitizeTagString(tagOrLabel).toLowerCase();
    if (!clean) return "verse";
    if (clean.includes("intro") || clean === "start") return "intro";
    if (clean.includes("pre-chorus") || clean.includes("prechorus") || clean.includes("build")) return "pre-chorus";
    if (clean.includes("post-chorus") || clean.includes("postchorus")) return "post-chorus";
    if (clean.includes("hook")) return "hook";
    if (clean.includes("chorus") || clean.includes("drop") || clean.includes("refrain")) return "chorus";
    if (clean.includes("bridge") || clean.includes("transition")) return "bridge";
    if (clean.includes("breakdown") || clean.includes("beat drop") || clean.includes("interlude")) return "breakdown";
    if (clean.includes("solo")) return "solo";
    if (clean.includes("instrumental") || clean.includes("theme")) return "instrumental";
    if (clean.includes("outro") || clean.includes("fade") || clean.includes("ending")) return "outro";
    if (clean.includes("verse")) return "verse";
    return clean.replace(/[^a-z0-9_-]/g, "") || "verse";
  }

  function getActiveBlocksArray() {
    if (!window.AppState) return [];
    if (window.AppState.isInstrumental) {
      if (!Array.isArray(window.AppState.instrumentalBlocks)) {
        window.AppState.instrumentalBlocks = [];
      }
      return window.AppState.instrumentalBlocks;
    }
    if (!Array.isArray(window.AppState.songBlocks)) {
      window.AppState.songBlocks = [];
    }
    return window.AppState.songBlocks;
  }

  function formatParentheticVector(rawText) {
    const clean = String(rawText || "").replace(/\r\n/g, "\n").trim();
    if (!clean) return "";
    return clean
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        const stripped = trimmed.replace(/^\(+|\)+$/g, "").trim();
        return stripped ? `(${stripped})` : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  function compileBlocksToLyrics(blocks = null) {
    const targetBlocks = blocks || (window.AppState ? window.AppState.songBlocks : []);
    if (!Array.isArray(targetBlocks)) return "";
    return targetBlocks
      .map((b) => {
        const rawLabel = sanitizeTagString(b.label || b.type || "verse");
        const cleanText = (b.text || "").replace(/\r\n/g, "\n").trim();
        const lowerLabel = rawLabel.toLowerCase();
        if (!cleanText) {
          return `[${lowerLabel}]`;
        }
        return `[${lowerLabel}]\n${cleanText}`;
      })
      .filter((str) => str.trim().length > 0)
      .join("\n\n")
      .slice(0, 4000);
  }

  function compileBlocksToCues(blocks = null) {
    const targetBlocks = blocks || (window.AppState ? window.AppState.instrumentalBlocks : []);
    if (!Array.isArray(targetBlocks)) return "";
    return targetBlocks
      .map((b) => {
        const rawLabel = sanitizeTagString(b.label || b.type || "verse");
        const cleanText = (b.text || "").replace(/\r\n/g, "\n").trim();
        const lowerLabel = rawLabel.toLowerCase();
        if (!cleanText) {
          return `[${lowerLabel}]`;
        }
        return `[${lowerLabel}]\n${formatParentheticVector(cleanText)}`;
      })
      .filter((str) => str.trim().length > 0)
      .join("\n\n")
      .slice(0, 4000);
  }

  function parseLyricsIntoBlocks(lyricsStr) {
    if (typeof lyricsStr !== "string" || !lyricsStr.trim()) {
      return [];
    }
    const normalized = lyricsStr
      .replace(/\r\n/g, "\n")
      .replace(/\][ \t]*\[/g, "]\n[");
    const lines = normalized.split("\n");
    const blocks = [];
    let currentBlock = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      const tagMatch = trimmed.match(/^\[([^\]]+)\]\s*(.*)$/);
      if (tagMatch) {
        if (currentBlock) {
          currentBlock.text = currentBlock.text.trim();
          blocks.push(currentBlock);
        }
        const rawTag = sanitizeTagString(tagMatch[1]);
        const inlineText = tagMatch[2].trim();
        const canonicalTag = mapToCanonicalTag(rawTag);
        currentBlock = {
          id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: canonicalTag,
          label: rawTag.charAt(0).toUpperCase() + rawTag.slice(1),
          text: inlineText
        };
      } else if (currentBlock) {
        currentBlock.text += (currentBlock.text ? "\n" : "") + line;
      } else if (trimmed) {
        currentBlock = {
          id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: "verse",
          label: "Verse",
          text: line
        };
      }
    });

    if (currentBlock) {
      currentBlock.text = currentBlock.text.trim();
      blocks.push(currentBlock);
    }
    return blocks;
  }

  function deriveDefaultCuesFromVocalBlocks(vocalBlocks) {
    if (!Array.isArray(vocalBlocks) || vocalBlocks.length === 0) {
      return [
        { id: `ib_${Date.now()}_1`, type: "intro", label: "Intro", text: "(Filtered Rhodes chords, vinyl crackle, subtle tape delay)" },
        { id: `ib_${Date.now()}_2`, type: "verse", label: "Verse 1", text: "(Deep 808 sub-bass, pitch glides, syncopated rimshot, muted guitar plucks)" },
        { id: `ib_${Date.now()}_3`, type: "pre-chorus", label: "Pre-Chorus", text: "(Rising analog synth pad swells, 32nd-note hi-hat rolls, building snare crescendo)" },
        { id: `ib_${Date.now()}_4`, type: "chorus", label: "Chorus", text: "(Punchy four-on-the-floor kick, detuned lead synthesizer, wide stereo chorus, dynamic claps)" },
        { id: `ib_${Date.now()}_5`, type: "solo", label: "Solo", text: "(Overdriven electric guitar solo, dynamic pitch slides, expressive legato phrasing)" },
        { id: `ib_${Date.now()}_6`, type: "breakdown", label: "Breakdown", text: "(Half-time rhythmic beat, resonant sub drops, filtered Rhodes chords)" },
        { id: `ib_${Date.now()}_7`, type: "outro", label: "Outro", text: "(Decaying spatial reverb tails, solitary Rhodes chords, low-end filter fade)" }
      ];
    }
    const defaultDirectives = {
      intro: "Filtered Rhodes chords, vinyl crackle, subtle tape delay",
      verse: "Deep 808 sub-bass, pitch glides, syncopated rimshot, muted guitar plucks",
      "pre-chorus": "Rising analog synth pad swells, 32nd-note hi-hat rolls, building snare crescendo",
      chorus: "Punchy four-on-the-floor kick, detuned lead synthesizer, wide stereo chorus, dynamic claps",
      hook: "Hypnotic synthesizer hook, driving sub-bass, syncopated percussion",
      "post-chorus": "Rhythmic groove momentum, infectious melodic synth echoes, filtered fills",
      bridge: "Subtractive breakdown, solitary Rhodes chords, filtered bass sweep",
      breakdown: "Half-time rhythmic beat, resonant sub drops, atmospheric pads",
      solo: "Overdriven electric guitar solo, dynamic pitch slides, expressive legato phrasing",
      instrumental: "Interlocking rhythm section, melodic counter-lines, full stereo groove",
      outro: "Decaying spatial reverb tails, solitary Rhodes chords, low-end filter fade"
    };

    return vocalBlocks.map((b) => {
      const cType = mapToCanonicalTag(b.type || b.label);
      const cue = defaultDirectives[cType] || "Acoustic performance, dynamic instrumentation, expressive phrasing";
      return {
        id: `ib_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: cType,
        label: b.label || cType.charAt(0).toUpperCase() + cType.slice(1),
        text: `(${cue})`
      };
    });
  }

  function updateTagButtonBar() {
    const bar = document.getElementById("tag-button-bar");
    const label = document.getElementById("sheet-mode-label");
    if (!bar) return;

    const isInst = Boolean(window.AppState && window.AppState.isInstrumental);
    if (label) {
      label.textContent = isInst ? "Arrangement Cues & Vector Flow" : "Lyrics & Section Flow";
    }

    if (isInst) {
      const sIntro = resolveInstrumentalStyles("intro");
      const sVerse = resolveInstrumentalStyles("verse");
      const sPre = resolveInstrumentalStyles("pre-chorus");
      const sChorus = resolveInstrumentalStyles("chorus");
      const sHook = resolveInstrumentalStyles("hook");
      const sSolo = resolveInstrumentalStyles("solo");
      const sBridge = resolveInstrumentalStyles("bridge");
      const sBreak = resolveInstrumentalStyles("breakdown");
      const sOutro = resolveInstrumentalStyles("outro");
      const sDef = resolveInstrumentalStyles("default");

      bar.innerHTML = `
        <button type="button" onclick="addSongBlock('intro', 'Intro')" style="${sIntro.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sIntro.accent}; box-shadow: 0 0 6px ${sIntro.accent};"></span>
          <span>+ Intro</span>
        </button>
        <button type="button" onclick="addSongBlock('verse', 'Verse')" style="${sVerse.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sVerse.accent}; box-shadow: 0 0 6px ${sVerse.accent};"></span>
          <span>+ Verse</span>
        </button>
        <button type="button" onclick="addSongBlock('pre-chorus', 'Pre-Chorus')" style="${sPre.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sPre.accent}; box-shadow: 0 0 6px ${sPre.accent};"></span>
          <span>+ Pre-Chorus</span>
        </button>
        <button type="button" onclick="addSongBlock('chorus', 'Chorus')" style="${sChorus.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sChorus.accent}; box-shadow: 0 0 6px ${sChorus.accent};"></span>
          <span>+ Chorus</span>
        </button>
        <button type="button" onclick="addSongBlock('hook', 'Hook')" style="${sHook.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sHook.accent}; box-shadow: 0 0 6px ${sHook.accent};"></span>
          <span>+ Hook</span>
        </button>
        <button type="button" onclick="addSongBlock('solo', 'Solo')" style="${sSolo.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sSolo.accent}; box-shadow: 0 0 6px ${sSolo.accent};"></span>
          <span>+ Solo</span>
        </button>
        <button type="button" onclick="addSongBlock('bridge', 'Bridge')" style="${sBridge.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sBridge.accent}; box-shadow: 0 0 6px ${sBridge.accent};"></span>
          <span>+ Bridge</span>
        </button>
        <button type="button" onclick="addSongBlock('breakdown', 'Breakdown')" style="${sBreak.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sBreak.accent}; box-shadow: 0 0 6px ${sBreak.accent};"></span>
          <span>+ Breakdown</span>
        </button>
        <button type="button" onclick="addSongBlock('instrumental', 'Theme')" style="${sDef.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sDef.accent}; box-shadow: 0 0 6px ${sDef.accent};"></span>
          <span>+ Theme</span>
        </button>
        <button type="button" onclick="addSongBlock('outro', 'Outro')" style="${sOutro.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sOutro.accent}; box-shadow: 0 0 6px ${sOutro.accent};"></span>
          <span>+ Outro</span>
        </button>
        <button type="button" onclick="addCustomSongBlock()" style="${sDef.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sDef.accent}; box-shadow: 0 0 6px ${sDef.accent};"></span>
          <span>+ Custom Vector</span>
        </button>
      `;
    } else {
      bar.innerHTML = `
        <button type="button" onclick="addSongBlock('intro', 'Intro')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Intro</button>
        <button type="button" onclick="addSongBlock('verse', 'Verse')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Verse</button>
        <button type="button" onclick="addSongBlock('pre-chorus', 'Pre-Chorus')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Pre-Chorus</button>
        <button type="button" onclick="addSongBlock('chorus', 'Chorus')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Chorus</button>
        <button type="button" onclick="addSongBlock('hook', 'Hook')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Hook</button>
        <button type="button" onclick="addSongBlock('bridge', 'Bridge')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Bridge</button>
        <button type="button" onclick="addSongBlock('breakdown', 'Breakdown')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Breakdown</button>
        <button type="button" onclick="addSongBlock('solo', 'Solo')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Solo</button>
        <button type="button" onclick="addSongBlock('outro', 'Outro')" class="px-2 py-0.5 rounded theme-btn-secondary text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Outro</button>
        <button type="button" onclick="addCustomSongBlock()" class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 border border-sky-400/30 text-[9px] font-mono font-bold hover:scale-105 active:scale-95 transition">+ Custom</button>
      `;
    }
  }

  function setModality(isInstrumental) {
    if (!window.AppState) return;
    const prevInst = Boolean(window.AppState.isInstrumental);
    const nextInst = Boolean(isInstrumental);
    if (prevInst === nextInst) return;

    const vocalsEl = document.getElementById("field-vocals");
    if (vocalsEl) {
      if (prevInst) {
        window.AppState.instrumentalLeadDraft = vocalsEl.value;
        vocalsEl.value = window.AppState.vocalLeadDraft || "";
      } else {
        window.AppState.vocalLeadDraft = vocalsEl.value;
        vocalsEl.value = window.AppState.instrumentalLeadDraft || "";
      }
    }

    window.AppState.isInstrumental = nextInst;
    if (window.AppState.isInstrumental) {
      if (!Array.isArray(window.AppState.instrumentalBlocks) || window.AppState.instrumentalBlocks.length === 0) {
        window.AppState.instrumentalBlocks = deriveDefaultCuesFromVocalBlocks(window.AppState.songBlocks);
      }
    }
    updateModalityToggleUI();
    updateTagButtonBar();
    renderSongBlocks();
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
  }

  function toggleModality() {
    const nextState = !(window.AppState && window.AppState.isInstrumental);
    setModality(nextState);
  }

  function updateModalityToggleUI() {
    const toggleBtn = document.getElementById("modality-toggle-btn");
    const toggleIcon = document.getElementById("modality-toggle-icon");
    const toggleLabel = document.getElementById("modality-toggle-label");
    const vocalsContainer = document.getElementById("field-vocals-container");
    const vocalsLabel = vocalsContainer ? vocalsContainer.querySelector("label") : null;
    const vocalsTextarea = document.getElementById("field-vocals");
    if (!toggleBtn) return;

    const isInst = Boolean(window.AppState && window.AppState.isInstrumental);
    if (isInst) {
      toggleBtn.className = "px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-black/60 to-amber-500/10 text-amber-200 font-bold flex items-center gap-2 text-xs shadow-[0_0_15px_rgba(245,158,11,0.25)] transition transform active:scale-95 hover:border-amber-400/60";
      toggleBtn.style.cssText = "";
      if (toggleIcon) {
        toggleIcon.className = "fa-solid fa-sliders text-[11px] text-amber-300";
        toggleIcon.style.color = "";
      }
      if (toggleLabel) toggleLabel.textContent = "Instrumental Master Mode";
      if (vocalsContainer) {
        vocalsContainer.classList.remove("opacity-40", "opacity-50", "pointer-events-none");
      }
      if (vocalsLabel) {
        vocalsLabel.textContent = "Lead Voice / Vocal Texture (Optional)";
      }
      if (vocalsTextarea) {
        vocalsTextarea.placeholder = "(Optional) Leave empty for pure instrumental. Or define telegraphic acoustic/vocal textures (e.g. pitched female vocal chops, ping-pong delay, no lyrics)...";
      }
    } else {
      toggleBtn.className = "px-3.5 py-1.5 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 text-white font-bold flex items-center gap-2 text-xs shadow-md transition transform active:scale-95";
      toggleBtn.style.cssText = "";
      if (toggleIcon) {
        toggleIcon.className = "fa-solid fa-microphone text-[11px] text-sky-400";
        toggleIcon.style.color = "";
      }
      if (toggleLabel) toggleLabel.textContent = "Vocal Song Mode";
      if (vocalsContainer) {
        vocalsContainer.classList.remove("opacity-40", "opacity-50", "pointer-events-none");
      }
      if (vocalsLabel) {
        vocalsLabel.textContent = "Vocal Profile & Character";
      }
      if (vocalsTextarea) {
        vocalsTextarea.placeholder = "Describe voice type, timbre, vocal delivery, chest/falsetto transitions, and harmonies...";
      }
    }
  }

  function renderSongBlocks() {
    const container = document.getElementById("song-blocks-container");
    if (!container || !window.AppState) return;
    container.innerHTML = "";

    const isInst = Boolean(window.AppState.isInstrumental);
    const blocks = getActiveBlocksArray();
    const total = blocks.length;
    const badge = document.getElementById("block-count-badge");
    if (badge) badge.textContent = `${total} Section${total === 1 ? "" : "s"}`;

    blocks.forEach((block, index) => {
      const cleanLabel = sanitizeTagString(block.label || block.type || "Section");
      const canonicalTag = mapToCanonicalTag(cleanLabel);
      const isEditingTag = window.AppState.editingTagIndex === index;

      if (isInst) {
        const styles = resolveInstrumentalStyles(canonicalTag);
        const sectionRow = document.createElement("div");
        sectionRow.className = "w-full rounded-2xl p-3 sm:p-3.5 my-2 border shadow-xl transition-all flex flex-col gap-2.5 box-border backdrop-blur-md relative group";
        sectionRow.style.cssText = styles.card;
        sectionRow.dataset.index = index;

        const tagHtml = isEditingTag
          ? `
            <input type="text" id="tag-input-${index}" value="${cleanLabel}"
                   onblur="saveCustomTag(${index}, this.value)"
                   onkeydown="handleTagKeydown(event, ${index}, this.value)"
                   class="px-2.5 py-1 rounded-lg font-mono font-bold uppercase text-[11px] bg-black/90 text-white border border-white/50 focus:outline-none focus:border-sky-400 w-36 shadow-inner">
          `
          : `
            <button type="button" onclick="startTagEdit(${index})" style="${styles.tag}"
                    class="px-2.5 py-1 rounded-lg font-mono font-bold tracking-wider uppercase text-[10px] sm:text-[11px] border shadow-sm flex items-center gap-2 transition active:scale-95 hover:border-white/30" title="Click to rename sector">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${styles.accent}; box-shadow: 0 0 8px ${styles.accent};"></span>
              <span>[${cleanLabel}]</span>
              <i class="fa-solid fa-pen text-[8px] opacity-40 group-hover:opacity-80 transition-opacity"></i>
            </button>
          `;

        sectionRow.innerHTML = `
          <div class="flex items-center justify-between border-b border-white/10 pb-2 select-none">
            <div class="flex items-center gap-2.5 min-w-0">
              ${tagHtml}
              <span class="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 flex items-center gap-1.5">
                <span class="opacity-40">::</span>
                <span>Acoustic Vector Directive</span>
              </span>
            </div>
            <div class="flex items-center gap-1 rounded-lg px-2 py-1 border" style="${styles.controls}">
              <button type="button" onclick="moveSongBlock(${index}, -1)" ${index === 0 ? "disabled" : ""} class="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition text-[10px]" title="Move Earlier">
                <i class="fa-solid fa-chevron-up"></i>
              </button>
              <button type="button" onclick="moveSongBlock(${index}, 1)" ${index === total - 1 ? "disabled" : ""} class="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition text-[10px]" title="Move Later">
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <button type="button" onclick="duplicateSongBlock(${index})" class="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-sky-300 hover:bg-white/10 transition text-[10px]" title="Duplicate Vector">
                <i class="fa-solid fa-copy"></i>
              </button>
              <button type="button" onclick="removeSongBlock(${index})" class="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-rose-400 hover:bg-rose-500/20 transition text-[10px]" title="Remove Vector">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="w-full">
            <textarea id="block-text-${index}"
                      oninput="handleBlockTextInput(${index}, this)"
                      onblur="handleBlockTextBlur(${index}, this)"
                      placeholder="(Telegraphic acoustic cues, e.g. clean electric guitar, legato slides, warm plate reverb...)"
                      class="lyric-textarea w-full rounded-xl px-3 py-2 focus:outline-none text-xs font-mono leading-relaxed resize-none overflow-y-auto overflow-x-hidden transition-all block shadow-inner"
                      style="${styles.textarea} min-height: 58px;">${escapeHtml(block.text || "")}</textarea>
          </div>
        `;
        container.appendChild(sectionRow);
      } else {
        const sectionRow = document.createElement("div");
        sectionRow.className = "w-full flex items-stretch gap-2 sm:gap-3 py-2 px-2.5 rounded-xl group transition-colors hover:bg-white/5 box-border border-b border-white/5";
        sectionRow.dataset.index = index;

        const tagHtml = isEditingTag
          ? `
            <input type="text" id="tag-input-${index}" value="${cleanLabel}"
                   onblur="saveCustomTag(${index}, this.value)"
                   onkeydown="handleTagKeydown(event, ${index}, this.value)"
                   class="px-1.5 py-0.5 rounded bg-black/90 border border-sky-400 text-[10px] sm:text-[11px] font-mono font-bold uppercase text-white focus:outline-none w-full">
          `
          : `
            <button type="button" onclick="startTagEdit(${index})"
                    class="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-sky-300 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap" title="Click to rename section">
              <span>[${cleanLabel}]</span>
              <i class="fa-solid fa-pen text-[7px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></i>
            </button>
          `;

        sectionRow.innerHTML = `
          <div class="flex-shrink-0 w-[124px] sm:w-[172px] self-stretch flex items-center justify-between select-none pr-2.5 border-r border-white/10">
            <div class="flex items-center min-w-0">
              ${tagHtml}
            </div>
            <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-black/60 border border-white/15 px-1 py-0.5 rounded-lg flex-shrink-0 ml-1.5 shadow-md">
              <button type="button" onclick="moveSongBlock(${index}, -1)" ${index === 0 ? "disabled" : ""}
                      class="w-4 h-4 flex items-center justify-center text-[9px] text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition" title="Move Earlier">
                <i class="fa-solid fa-chevron-up"></i>
              </button>
              <button type="button" onclick="moveSongBlock(${index}, 1)" ${index === total - 1 ? "disabled" : ""}
                      class="w-4 h-4 flex items-center justify-center text-[9px] text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition" title="Move Later">
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <button type="button" onclick="duplicateSongBlock(${index})"
                      class="w-4 h-4 flex items-center justify-center text-[9px] text-white/60 hover:text-sky-300 transition" title="Duplicate Section">
                <i class="fa-solid fa-copy"></i>
              </button>
              <button type="button" onclick="removeSongBlock(${index})"
                      class="w-4 h-4 flex items-center justify-center text-[9px] text-white/60 hover:text-rose-400 transition" title="Delete Section">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="flex-1 min-w-0 pl-2.5 flex items-center">
            <textarea id="block-text-${index}"
                      oninput="handleBlockTextInput(${index}, this)"
                      placeholder="Write lyrics or vocal direction..."
                      class="lyric-textarea w-full bg-transparent px-0 py-0.5 focus:outline-none text-xs font-mono text-white/90 leading-relaxed resize-none overflow-hidden placeholder-white/20 transition-colors block"
                      style="min-height: 24px;">${escapeHtml(block.text || "")}</textarea>
          </div>
        `;
        container.appendChild(sectionRow);
      }

      if (isEditingTag) {
        setTimeout(() => {
          const input = document.getElementById(`tag-input-${index}`);
          if (input) {
            input.focus();
            input.select();
          }
        }, 20);
      }
    });

    resizeAllTextareas();
    updateTagButtonBar();
    updateModalityToggleUI();
  }

  function startTagEdit(index) {
    if (!window.AppState) return;
    window.AppState.editingTagIndex = index;
    renderSongBlocks();
  }

  function saveCustomTag(index, newLabel) {
    const blocks = getActiveBlocksArray();
    if (blocks[index]) {
      const cleanLabel = sanitizeTagString(newLabel);
      if (cleanLabel) {
        blocks[index].label = cleanLabel;
        blocks[index].type = mapToCanonicalTag(cleanLabel);
      }
    }
    if (window.AppState) window.AppState.editingTagIndex = null;
    renderSongBlocks();
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
  }

  function handleTagKeydown(e, index, val) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCustomTag(index, val);
    } else if (e.key === "Escape") {
      if (window.AppState) window.AppState.editingTagIndex = null;
      renderSongBlocks();
    }
  }

  function addSongBlock(type, label, text = "") {
    if (!window.AppState) return;
    const cleanLabel = sanitizeTagString(label);
    const cleanType = mapToCanonicalTag(type || label);
    const isInst = Boolean(window.AppState.isInstrumental);
    const defaultText = isInst && !text ? "" : text;
    const newBlock = {
      id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: cleanType,
      label: cleanLabel,
      text: defaultText
    };
    const blocks = getActiveBlocksArray();
    blocks.push(newBlock);
    renderSongBlocks();
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
    const container = document.getElementById("song-blocks-container");
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }

  async function addCustomSongBlock() {
    const isInst = Boolean(window.AppState && window.AppState.isInstrumental);
    const promptTitle = isInst ? "New Acoustic Directive Tag" : "New Section Tag";
    const promptMessage = isInst
      ? "Enter custom section tag for arrangement cue (e.g. Solo 2, Interlude, Theme B):"
      : "Enter custom section label (e.g. Outro Solo, Breakdown, Hook 2):";
    let label = null;
    if (window.AppModal && typeof window.AppModal.prompt === "function") {
      label = await window.AppModal.prompt(promptTitle, promptMessage, isInst ? "Theme" : "Custom Section", "fa-tag");
    } else {
      label = prompt(promptMessage, isInst ? "Theme" : "Custom Section");
    }
    if (!label || !label.trim()) return;
    const cleanLabel = sanitizeTagString(label);
    if (!cleanLabel) return;
    addSongBlock(mapToCanonicalTag(cleanLabel), cleanLabel, "");
  }

  function duplicateSongBlock(index) {
    const blocks = getActiveBlocksArray();
    if (index < 0 || index >= blocks.length) return;
    const source = blocks[index];
    const cloned = {
      id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: source.type,
      label: source.label,
      text: source.text
    };
    blocks.splice(index + 1, 0, cloned);
    renderSongBlocks();
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
  }

  function moveSongBlock(index, direction) {
    const blocks = getActiveBlocksArray();
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const temp = blocks[index];
    blocks[index] = blocks[targetIndex];
    blocks[targetIndex] = temp;
    renderSongBlocks();
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
  }

  function removeSongBlock(index) {
    const blocks = getActiveBlocksArray();
    if (index < 0 || index >= blocks.length) return;
    blocks.splice(index, 1);
    renderSongBlocks();
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
  }

  function handleBlockTextInput(index, target) {
    const blocks = getActiveBlocksArray();
    if (!blocks[index]) return;
    const val = (target && typeof target === "object" && "value" in target) ? target.value : String(target || "");
    blocks[index].text = val;
    if (target && typeof target === "object" && "style" in target) {
      autoResizeTextarea(target);
    }
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
  }

  function handleBlockTextBlur(index, target) {
    if (!window.AppState || !window.AppState.isInstrumental) return;
    const blocks = getActiveBlocksArray();
    if (!blocks[index]) return;
    const el = (target && typeof target === "object" && "value" in target) ? target : document.getElementById(`block-text-${index}`);
    const currentVal = blocks[index].text || (el ? el.value : "");
    if (currentVal && currentVal.trim().length > 0) {
      const formatted = formatParentheticVector(currentVal);
      if (formatted !== blocks[index].text) {
        blocks[index].text = formatted;
        if (el) {
          el.value = formatted;
          autoResizeTextarea(el);
        }
        if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
        if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
      }
    }
  }

  function bindLeadInputsRealtime() {
    const vocalsEl = document.getElementById("field-vocals");
    if (!vocalsEl || vocalsEl.dataset.leadSyncBound === "true") return;
    vocalsEl.addEventListener("input", (e) => {
      if (!window.AppState) return;
      if (window.AppState.isInstrumental) {
        window.AppState.instrumentalLeadDraft = e.target.value;
      } else {
        window.AppState.vocalLeadDraft = e.target.value;
      }
    });
    vocalsEl.dataset.leadSyncBound = "true";
  }

  function loadSongBlueprint(blueprintOrId = null) {
    let bp = null;
    if (typeof blueprintOrId === "string" && window.TuneBloomBlueprints) {
      bp = window.TuneBloomBlueprints.getById(blueprintOrId);
    } else if (blueprintOrId && typeof blueprintOrId === "object") {
      bp = blueprintOrId;
    } else if (window.TuneBloomBlueprints) {
      bp = window.TuneBloomBlueprints.getRandom();
    }
    if (!bp || !window.AppState) return;

    const setField = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };

    setField("field-title", bp.title || "Untitled Master");
    setField("field-genre", bp.genre || "Contemporary R&B");
    setField("field-subgenre", bp.subgenre || "2000s Pop R&B / Slow Jam Bounce");
    setField("field-bpm", bp.bpm || 96);
    setField("field-key", bp.key || "F minor");
    setField("field-mood", bp.mood || "Sensual, passionate, smooth, driving.");
    setField("field-arrangement", bp.arrangement || "");

    const isCurrentInst = Boolean(window.AppState.isInstrumental);
    window.AppState.vocalLeadDraft = bp.vocals || "";
    window.AppState.instrumentalLeadDraft = bp.instrumental_lead || "";

    if (isCurrentInst) {
      setField("field-vocals", window.AppState.instrumentalLeadDraft);
    } else {
      setField("field-vocals", window.AppState.vocalLeadDraft);
    }

    window.AppState.songBlocks = (bp.blocks || []).map((b) => ({
      id: b.id || `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: mapToCanonicalTag(b.type || b.label || "verse"),
      label: sanitizeTagString(b.label || b.type || "Verse"),
      text: b.text || ""
    }));

    if (Array.isArray(bp.instrumental_blocks) && bp.instrumental_blocks.length > 0) {
      window.AppState.instrumentalBlocks = bp.instrumental_blocks.map((b) => ({
        id: b.id || `ib_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: mapToCanonicalTag(b.type || b.label || "verse"),
        label: sanitizeTagString(b.label || b.type || "Verse"),
        text: formatParentheticVector(b.text || "")
      }));
    } else {
      window.AppState.instrumentalBlocks = deriveDefaultCuesFromVocalBlocks(window.AppState.songBlocks);
    }

    renderSongBlocks();
    setTimeout(() => resizeAllTextareas(), 30);
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
  }

  document.addEventListener("DOMContentLoaded", bindLeadInputsRealtime);
  if (document.readyState === "complete" || document.readyState === "interactive") {
    bindLeadInputsRealtime();
  }

  window.calculateQuantizedDuration = calculateQuantizedDuration;
  window.autoResizeTextarea = autoResizeTextarea;
  window.resizeAllTextareas = resizeAllTextareas;
  window.sanitizeTagString = sanitizeTagString;
  window.mapToCanonicalTag = mapToCanonicalTag;
  window.compileBlocksToLyrics = compileBlocksToLyrics;
  window.compileBlocksToCues = compileBlocksToCues;
  window.parseLyricsIntoBlocks = parseLyricsIntoBlocks;
  window.formatParentheticVector = formatParentheticVector;
  window.renderSongBlocks = renderSongBlocks;
  window.startTagEdit = startTagEdit;
  window.saveCustomTag = saveCustomTag;
  window.handleTagKeydown = handleTagKeydown;
  window.addSongBlock = addSongBlock;
  window.addCustomSongBlock = addCustomSongBlock;
  window.duplicateSongBlock = duplicateSongBlock;
  window.moveSongBlock = moveSongBlock;
  window.removeSongBlock = removeSongBlock;
  window.handleBlockTextInput = handleBlockTextInput;
  window.handleBlockTextBlur = handleBlockTextBlur;
  window.loadSongBlueprint = loadSongBlueprint;
  window.setModality = setModality;
  window.toggleModality = toggleModality;
  window.updateModalityToggleUI = updateModalityToggleUI;
  window.deriveDefaultCuesFromVocalBlocks = deriveDefaultCuesFromVocalBlocks;
  window.bindLeadInputsRealtime = bindLeadInputsRealtime;
})(window);