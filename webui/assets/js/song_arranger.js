(function (window) {
  const INSTRUMENTAL_THEME_SCHEMA = {
    intro: {
      bgVar: "--inst-intro-bg",
      borderVar: "--inst-intro-border",
      inkVar: "--inst-intro-ink",
      defaultBg: "#c7d2fe",
      defaultBorder: "#a5b4fc",
      defaultInk: "#1e1b4b"
    },
    verse: {
      bgVar: "--inst-verse-bg",
      borderVar: "--inst-verse-border",
      inkVar: "--inst-verse-ink",
      defaultBg: "#a7f3d0",
      defaultBorder: "#6ee7b7",
      defaultInk: "#064e3b"
    },
    "pre-chorus": {
      bgVar: "--inst-prechorus-bg",
      borderVar: "--inst-prechorus-border",
      inkVar: "--inst-prechorus-ink",
      defaultBg: "#e9d5ff",
      defaultBorder: "#d8b4fe",
      defaultInk: "#581c87"
    },
    chorus: {
      bgVar: "--inst-chorus-bg",
      borderVar: "--inst-chorus-border",
      inkVar: "--inst-chorus-ink",
      defaultBg: "#fde68a",
      defaultBorder: "#fcd34d",
      defaultInk: "#713f12"
    },
    hook: {
      bgVar: "--inst-chorus-bg",
      borderVar: "--inst-chorus-border",
      inkVar: "--inst-chorus-ink",
      defaultBg: "#fde68a",
      defaultBorder: "#fcd34d",
      defaultInk: "#713f12"
    },
    bridge: {
      bgVar: "--inst-bridge-bg",
      borderVar: "--inst-bridge-border",
      inkVar: "--inst-bridge-ink",
      defaultBg: "#d9f99d",
      defaultBorder: "#bef264",
      defaultInk: "#365314"
    },
    breakdown: {
      bgVar: "--inst-breakdown-bg",
      borderVar: "--inst-breakdown-border",
      inkVar: "--inst-breakdown-ink",
      defaultBg: "#fecdd3",
      defaultBorder: "#fda4af",
      defaultInk: "#881337"
    },
    solo: {
      bgVar: "--inst-solo-bg",
      borderVar: "--inst-solo-border",
      inkVar: "--inst-solo-ink",
      defaultBg: "#bae6fd",
      defaultBorder: "#7dd3fc",
      defaultInk: "#0c4a6e"
    },
    instrumental: {
      bgVar: "--inst-solo-bg",
      borderVar: "--inst-solo-border",
      inkVar: "--inst-solo-ink",
      defaultBg: "#bae6fd",
      defaultBorder: "#7dd3fc",
      defaultInk: "#0c4a6e"
    },
    outro: {
      bgVar: "--inst-intro-bg",
      borderVar: "--inst-intro-border",
      inkVar: "--inst-intro-ink",
      defaultBg: "#c7d2fe",
      defaultBorder: "#a5b4fc",
      defaultInk: "#1e1b4b"
    },
    default: {
      bgVar: "--inst-default-bg",
      borderVar: "--inst-default-border",
      inkVar: "--inst-default-ink",
      defaultBg: "#e2e8f0",
      defaultBorder: "#cbd5e1",
      defaultInk: "#0f172a"
    }
  };

  function resolveInstrumentalStyles(canonicalTag) {
    const s = INSTRUMENTAL_THEME_SCHEMA[canonicalTag] || INSTRUMENTAL_THEME_SCHEMA.default;
    const bg = `var(${s.bgVar}, ${s.defaultBg})`;
    const border = `var(${s.borderVar}, ${s.defaultBorder})`;
    const ink = `var(${s.inkVar}, ${s.defaultInk})`;

    return {
      card: `background-color: ${bg}; border-color: ${border}; color: ${ink};`,
      tag: `background-color: color-mix(in srgb, ${ink} 14%, transparent); border-color: color-mix(in srgb, ${ink} 22%, transparent); color: ${ink};`,
      textarea: `color: ${ink};`,
      controls: `background-color: color-mix(in srgb, ${ink} 10%, transparent); border-color: color-mix(in srgb, ${ink} 18%, transparent); color: ${ink};`,
      button: `background-color: ${bg}; border-color: ${border}; color: ${ink};`
    };
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
    el.style.height = "auto";
    const lines = (el.value || "").split("\n").length;
    const minComputedHeight = Math.max(28, lines * 20 + 4);
    const scrollH = el.scrollHeight;
    const finalH = scrollH > 0 ? Math.max(scrollH, minComputedHeight) : minComputedHeight;
    el.style.height = `${finalH}px`;
  }

  function resizeAllTextareas() {
    requestAnimationFrame(() => {
      document.querySelectorAll(".lyric-textarea").forEach(autoResizeTextarea);
    });
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
    if (clean.includes("chorus") || clean.includes("hook") || clean.includes("drop") || clean.includes("refrain")) return "chorus";
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
    const stripped = clean.replace(/^\(+|\)+$/g, "").trim();
    return `(${stripped})`;
  }

  function compileBlocksToLyrics(blocks = null) {
    const targetBlocks = blocks || (window.AppState ? window.AppState.songBlocks : []);
    if (!Array.isArray(targetBlocks)) return "";
    return targetBlocks
      .map((b) => {
        const rawLabel = sanitizeTagString(b.label || b.type || "verse");
        const cleanText = (b.text || "").replace(/\r\n/g, "\n").trim();
        const lowerLabel = rawLabel.toLowerCase();
        if (!cleanText && (lowerLabel.includes("solo") || lowerLabel.includes("instrumental") || lowerLabel.includes("intro") || lowerLabel.includes("outro"))) {
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
    const normalized = lyricsStr.replace(/\r\n/g, "\n");
    const lines = normalized.split("\n");
    const blocks = [];
    let currentBlock = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      const tagMatch = trimmed.match(/^\[(.*?)\]$/);
      if (tagMatch) {
        if (currentBlock) {
          currentBlock.text = currentBlock.text.trim();
          blocks.push(currentBlock);
        }
        const rawTag = sanitizeTagString(tagMatch[1]);
        const canonicalTag = mapToCanonicalTag(rawTag);
        currentBlock = {
          id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: canonicalTag,
          label: rawTag.charAt(0).toUpperCase() + rawTag.slice(1),
          text: ""
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
        { id: `ib_${Date.now()}_1`, type: "intro", label: "Intro", text: "(Filtered Rhodes chords and subtle vinyl crackle establish the atmospheric motif)" },
        { id: `ib_${Date.now()}_2`, type: "verse", label: "Verse 1", text: "(Deep sliding 808 sub-bass enters alongside crisp syncopated rimshots and muted guitar plucks)" },
        { id: `ib_${Date.now()}_3`, type: "pre-chorus", label: "Pre-Chorus", text: "(Rising analog synth pad swells building dynamic tension with filtered white noise sweeps)" },
        { id: `ib_${Date.now()}_4`, type: "chorus", label: "Chorus", text: "(Full driving kick drops in, melodic lead synthesizer takes center stage with wide stereo chorus)" },
        { id: `ib_${Date.now()}_5`, type: "solo", label: "Solo", text: "(Virtuosic expressive electric guitar solo with dynamic slides and warm tube overdrive)" },
        { id: `ib_${Date.now()}_6`, type: "breakdown", label: "Breakdown", text: "(Half-time rhythmic breakdown with filtered Rhodes chords and resonant sub drops)" },
        { id: `ib_${Date.now()}_7`, type: "outro", label: "Outro", text: "(Drums fade gradually, leaving solitary Rhodes chords and decaying reverb tails to silence)" }
      ];
    }

    const defaultDirectives = {
      intro: "Filtered harmonic chords and vinyl textures establish the thematic motif",
      verse: "Deep bass anchors a restrained rhythm while clean plucks weave counterpoint",
      "pre-chorus": "Dynamic tension accelerates with rising synth swells and rolling percussion",
      chorus: "Full punchy groove drops in, primary lead takes foreground with wide stereo spread",
      hook: "Hypnotic melodic hook repeats over driving sub-bass and syncopated percussion",
      bridge: "Subtractive breakdown strips rhythm back to expressive harmonic changes",
      breakdown: "Half-time atmospheric breakdown with filtered resonance and deep sub drops",
      solo: "Expressive virtuosic solo takes the lead with dynamic slides and legato phrasing",
      instrumental: "Dynamic arrangement evolution driven by interlocking rhythm and melodic countermelodies",
      outro: "Rhythm section recedes into decaying spatial reverb tails and low-end fade"
    };

    return vocalBlocks.map((b) => {
      const cType = mapToCanonicalTag(b.type || b.label);
      const cue = defaultDirectives[cType] || "Dynamic acoustic performance with expressive instrumentation";
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
      const sSolo = resolveInstrumentalStyles("solo");
      const sBreak = resolveInstrumentalStyles("breakdown");
      const sBridge = resolveInstrumentalStyles("bridge");
      const sOutro = resolveInstrumentalStyles("outro");
      const sDef = resolveInstrumentalStyles("default");

      bar.innerHTML = `
        <button type="button" onclick="addSongBlock('intro', 'Intro')" style="${sIntro.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Intro</button>
        <button type="button" onclick="addSongBlock('verse', 'Verse')" style="${sVerse.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Verse</button>
        <button type="button" onclick="addSongBlock('pre-chorus', 'Pre-Chorus')" style="${sPre.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Pre-Chorus</button>
        <button type="button" onclick="addSongBlock('chorus', 'Chorus')" style="${sChorus.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Chorus</button>
        <button type="button" onclick="addSongBlock('solo', 'Solo')" style="${sSolo.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Solo</button>
        <button type="button" onclick="addSongBlock('breakdown', 'Breakdown')" style="${sBreak.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Breakdown</button>
        <button type="button" onclick="addSongBlock('instrumental', 'Theme')" style="${sBridge.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Theme</button>
        <button type="button" onclick="addSongBlock('outro', 'Outro')" style="${sOutro.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Outro</button>
        <button type="button" onclick="addCustomSongBlock()" style="${sDef.button}" class="px-2.5 py-1 rounded-lg border text-[9px] font-mono font-black uppercase hover:scale-105 active:scale-95 transition shadow-sm">+ Custom Vector</button>
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
    window.AppState.isInstrumental = Boolean(isInstrumental);
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
      const sChorus = resolveInstrumentalStyles("chorus");
      toggleBtn.className = "px-3.5 py-1.5 rounded-full border font-black flex items-center gap-2 text-xs shadow-lg transition transform active:scale-95";
      toggleBtn.style.cssText = sChorus.button;
      if (toggleIcon) {
        toggleIcon.className = "fa-solid fa-guitar text-[11px]";
        toggleIcon.style.color = "inherit";
      }
      if (toggleLabel) toggleLabel.textContent = "Instrumental Mode";
      if (vocalsContainer) {
        vocalsContainer.classList.remove("opacity-40", "opacity-50", "pointer-events-none");
      }
      if (vocalsLabel) {
        vocalsLabel.textContent = "Lead Voice / Acoustic Character (Optional)";
      }
      if (vocalsTextarea) {
        vocalsTextarea.placeholder = "(Optional) Define foreground lead instrument, playing dynamics, or acoustic character (e.g., virtuosic soprano saxophone, legato electric guitar slides, talkbox funk)...";
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
        sectionRow.className = "w-full rounded-2xl p-3 sm:p-3.5 my-1.5 border shadow-lg transition-all flex flex-col gap-2 box-border";
        sectionRow.style.cssText = styles.card;
        sectionRow.dataset.index = index;

        const tagHtml = isEditingTag
          ? `
            <input type="text" id="tag-input-${index}" value="${cleanLabel}"
                   onblur="saveCustomTag(${index}, this.value)"
                   onkeydown="handleTagKeydown(event, ${index}, this.value)"
                   class="px-2.5 py-1 rounded-lg font-mono font-black uppercase text-[11px] bg-black text-white border border-white/60 focus:outline-none w-36 shadow-inner">
          `
          : `
            <button type="button" onclick="startTagEdit(${index})" style="${styles.tag}"
                    class="px-2.5 py-1 rounded-lg font-mono font-black tracking-wider uppercase text-[11px] border shadow-sm flex items-center gap-1.5 transition" title="Click to rename tag">
              <span>[${cleanLabel}]</span>
              <i class="fa-solid fa-pen text-[8px] opacity-70"></i>
            </button>
          `;

        sectionRow.innerHTML = `
          <div class="flex items-center justify-between border-b border-current/15 pb-2 select-none">
            <div class="flex items-center gap-2.5 min-w-0">
              ${tagHtml}
              <span class="text-[9px] font-mono font-black tracking-widest uppercase opacity-75">Acoustic Vector Directive</span>
            </div>
            <div class="flex items-center gap-1 rounded-lg px-2 py-1 border" style="${styles.controls}">
              <button type="button" onclick="moveSongBlock(${index}, -1)" ${index === 0 ? "disabled" : ""}
                      class="w-4 h-4 flex items-center justify-center text-[10px] disabled:opacity-0 transition" title="Move Up">
                <i class="fa-solid fa-chevron-up"></i>
              </button>
              <button type="button" onclick="moveSongBlock(${index}, 1)" ${index === total - 1 ? "disabled" : ""}
                      class="w-4 h-4 flex items-center justify-center text-[10px] disabled:opacity-0 transition" title="Move Down">
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <button type="button" onclick="duplicateSongBlock(${index})"
                      class="w-4 h-4 flex items-center justify-center text-[10px] transition" title="Duplicate Vector">
                <i class="fa-solid fa-copy"></i>
              </button>
              <button type="button" onclick="removeSongBlock(${index})"
                      class="w-4 h-4 flex items-center justify-center text-[10px] hover:opacity-100 opacity-60 transition" title="Remove Directive">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="w-full pt-1">
            <textarea oninput="handleBlockTextInput(${index}, this)"
                      onblur="handleBlockTextBlur(${index}, this)"
                      placeholder="(Describe instrumentation, lead motif, playing dynamics, e.g. legato guitar slides...)"
                      class="lyric-textarea w-full bg-transparent px-1 py-0.5 focus:outline-none text-xs font-mono font-bold leading-relaxed resize-none overflow-hidden block"
                      style="${styles.textarea} min-height: 28px;">${block.text || ""}</textarea>
          </div>
        `;
        container.appendChild(sectionRow);
      } else {
        const sectionRow = document.createElement("div");
        sectionRow.className = "w-full flex items-stretch gap-2 sm:gap-3 py-1.5 px-2 rounded-xl group transition-colors hover:bg-white/5 box-border";
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
                    class="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-sky-300 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap" title="Click to rename tag">
              <span>[${cleanLabel}]</span>
              <i class="fa-solid fa-pen text-[7px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></i>
            </button>
          `;

        sectionRow.innerHTML = `
          <div class="flex-shrink-0 w-[124px] sm:w-[172px] self-stretch flex items-center justify-between select-none pr-2.5 border-r border-white/10">
            <div class="flex items-center min-w-0">
              ${tagHtml}
            </div>
            <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-black/50 border border-white/10 px-1 py-0.5 rounded-md flex-shrink-0 ml-1.5">
              <button type="button" onclick="moveSongBlock(${index}, -1)" ${index === 0 ? "disabled" : ""}
                      class="w-3.5 h-3.5 flex items-center justify-center text-[8px] text-white/60 hover:text-white disabled:opacity-0 transition" title="Move Up">
                <i class="fa-solid fa-chevron-up"></i>
              </button>
              <button type="button" onclick="moveSongBlock(${index}, 1)" ${index === total - 1 ? "disabled" : ""}
                      class="w-3.5 h-3.5 flex items-center justify-center text-[8px] text-white/60 hover:text-white disabled:opacity-0 transition" title="Move Down">
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <button type="button" onclick="duplicateSongBlock(${index})"
                      class="w-3.5 h-3.5 flex items-center justify-center text-[8px] text-white/60 hover:text-white transition" title="Duplicate">
                <i class="fa-solid fa-copy"></i>
              </button>
              <button type="button" onclick="removeSongBlock(${index})"
                      class="w-3.5 h-3.5 flex items-center justify-center text-[8px] text-white/60 hover:text-rose-400 transition" title="Delete">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="flex-1 min-w-0 pl-2.5 flex items-center">
            <textarea oninput="handleBlockTextInput(${index}, this)" placeholder="Write lyrics or vocal direction..."
                      class="lyric-textarea w-full bg-transparent px-0 py-0.5 focus:outline-none text-xs font-mono text-white/90 leading-relaxed resize-none overflow-hidden placeholder-white/20 transition-colors block" style="min-height: 24px;">${block.text || ""}</textarea>
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

  function handleBlockTextInput(index, textareaEl) {
    const blocks = getActiveBlocksArray();
    if (blocks[index]) {
      blocks[index].text = textareaEl.value;
      autoResizeTextarea(textareaEl);
      if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
      if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
    }
  }

  function handleBlockTextBlur(index, textareaEl) {
    if (!window.AppState || !window.AppState.isInstrumental) return;
    const blocks = getActiveBlocksArray();
    if (blocks[index] && blocks[index].text.trim().length > 0) {
      const formatted = formatParentheticVector(blocks[index].text);
      if (formatted !== blocks[index].text) {
        blocks[index].text = formatted;
        textareaEl.value = formatted;
        autoResizeTextarea(textareaEl);
        if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
        if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
      }
    }
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
    setField("field-vocals", bp.vocals || "");
    setField("field-arrangement", bp.arrangement || "");

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
})(window);