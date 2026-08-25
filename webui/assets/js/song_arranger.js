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
  const minComputedHeight = Math.max(24, lines * 19 + 4);
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

function compileBlocksToLyrics(blocks = (window.AppState ? window.AppState.songBlocks : [])) {
  return blocks
    .map((b) => {
      const cleanType = sanitizeTagString(b.type || b.label || "section");
      const cleanText = (b.text || "").trim();
      return `[${cleanType}]\n${cleanText}`;
    })
    .filter((str) => str.length > 0)
    .join("\n\n")
    .slice(0, 4000);
}

function parseLyricsIntoBlocks(lyricsStr) {
  const fallback = window.TuneBloomBlueprints
    ? window.TuneBloomBlueprints.getById("rnb_midnight_frequency").blocks
    : [];
  if (!lyricsStr) return JSON.parse(JSON.stringify(fallback));

  const lines = lyricsStr.split("\n");
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
      const rawTag = tagMatch[1];
      const cleanTag = sanitizeTagString(rawTag);
      currentBlock = {
        id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: cleanTag.toLowerCase(),
        label: cleanTag,
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

  return blocks.length > 0 ? blocks : JSON.parse(JSON.stringify(fallback));
}

function serializeRecipe(title, r) {
  if (!r) return "";
  return JSON.stringify({
    title: (title || "").trim().slice(0, 80),
    genre: (r.genre || "").trim().slice(0, 60),
    subgenre: (r.subgenre || "").trim().slice(0, 60),
    bpm: Math.max(30, Math.min(300, parseInt(r.bpm || 96, 10))),
    key: (r.key || "").trim().slice(0, 30),
    mood: (r.mood || "").trim().slice(0, 200),
    vocals: (r.vocals || "").trim().slice(0, 300),
    arrangement: (r.arrangement || "").trim().slice(0, 300),
    lyrics: (r.lyrics || "").trim().slice(0, 4000)
  });
}

function renderSongBlocks() {
  const container = document.getElementById("song-blocks-container");
  if (!container || !window.AppState) return;
  container.innerHTML = "";

  const total = window.AppState.songBlocks.length;
  const badge = document.getElementById("block-count-badge");
  if (badge) badge.textContent = `${total} Section${total === 1 ? "" : "s"}`;

  window.AppState.songBlocks.forEach((block, index) => {
    const sectionRow = document.createElement("div");
    sectionRow.className = "flex items-start gap-3 py-1.5 px-2 rounded-lg group transition-colors hover:bg-white/5";
    sectionRow.dataset.index = index;

    const isEditingTag = window.AppState.editingTagIndex === index;
    const cleanLabel = sanitizeTagString(block.label);

    const tagHtml = isEditingTag
      ? `
      <input type="text" id="tag-input-${index}" value="${cleanLabel}"
             onblur="saveCustomTag(${index}, this.value)" 
             onkeydown="handleTagKeydown(event, ${index}, this.value)"
             class="px-1.5 py-0.5 rounded bg-black/80 border border-sky-400 text-[10px] font-mono font-bold uppercase text-white focus:outline-none w-24">
    `
      : `
      <button type="button" onclick="startTagEdit(${index})" 
              class="text-[10px] font-mono font-bold tracking-wider uppercase text-sky-300 hover:text-white transition-colors flex items-center gap-1 group/btn" title="Click to rename tag">
        <span>[${cleanLabel}]</span>
        <i class="fa-solid fa-pen text-[7px] opacity-0 group-hover/btn:opacity-100 transition-opacity"></i>
      </button>
    `;

    sectionRow.innerHTML = `
      <div class="flex-shrink-0 w-28 pt-1 flex items-center justify-between select-none">
        ${tagHtml}
        <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onclick="moveSongBlock(${index}, -1)" ${index === 0 ? "disabled" : ""} 
                  class="w-4 h-4 flex items-center justify-center text-[8px] text-white/40 hover:text-white disabled:opacity-0 transition" title="Move Up">
            <i class="fa-solid fa-chevron-up"></i>
          </button>
          <button type="button" onclick="moveSongBlock(${index}, 1)" ${index === total - 1 ? "disabled" : ""} 
                  class="w-4 h-4 flex items-center justify-center text-[8px] text-white/40 hover:text-white disabled:opacity-0 transition" title="Move Down">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <button type="button" onclick="duplicateSongBlock(${index})" 
                  class="w-4 h-4 flex items-center justify-center text-[8px] text-white/40 hover:text-white transition" title="Duplicate">
            <i class="fa-solid fa-copy"></i>
          </button>
          <button type="button" onclick="removeSongBlock(${index})" 
                  class="w-4 h-4 flex items-center justify-center text-[8px] text-white/40 hover:text-rose-400 transition" title="Delete">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div class="flex-grow">
        <textarea oninput="handleBlockTextInput(${index}, this)" placeholder="Write lyrics or musical direction..."
                  class="lyric-textarea w-full bg-transparent px-0 py-0.5 focus:outline-none text-xs font-mono text-white/90 leading-relaxed resize-none overflow-hidden placeholder-white/20 transition-colors" style="min-height: 24px;">${block.text || ""}</textarea>
      </div>
    `;

    container.appendChild(sectionRow);

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
  if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
  if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
}

function startTagEdit(index) {
  if (!window.AppState) return;
  window.AppState.editingTagIndex = index;
  renderSongBlocks();
}

function saveCustomTag(index, newLabel) {
  if (window.AppState && window.AppState.songBlocks[index]) {
    const cleanLabel = sanitizeTagString(newLabel);
    if (cleanLabel) {
      window.AppState.songBlocks[index].label = cleanLabel;
      window.AppState.songBlocks[index].type = cleanLabel.toLowerCase();
    }
  }
  if (window.AppState) window.AppState.editingTagIndex = null;
  renderSongBlocks();
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
  const cleanType = sanitizeTagString(type).toLowerCase();
  const newBlock = {
    id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: cleanType,
    label: cleanLabel,
    text: text
  };
  window.AppState.songBlocks.push(newBlock);
  renderSongBlocks();
}

async function addCustomSongBlock() {
  let label = null;
  if (window.AppModal && typeof window.AppModal.prompt === "function") {
    label = await window.AppModal.prompt(
      "New Section Tag",
      "Enter custom section label (e.g. Outro Solo, Breakdown, Hook 2):",
      "Custom Section",
      "fa-tag"
    );
  } else {
    label = prompt("Enter custom section label:", "Custom Section");
  }
  if (!label || !label.trim()) return;
  const cleanLabel = sanitizeTagString(label);
  if (!cleanLabel) return;
  addSongBlock(cleanLabel.toLowerCase(), cleanLabel, "");
}

function duplicateSongBlock(index) {
  if (!window.AppState || index < 0 || index >= window.AppState.songBlocks.length) return;
  const source = window.AppState.songBlocks[index];
  const cloned = {
    id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: source.type,
    label: source.label,
    text: source.text
  };
  window.AppState.songBlocks.splice(index + 1, 0, cloned);
  renderSongBlocks();
}

function moveSongBlock(index, direction) {
  if (!window.AppState) return;
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= window.AppState.songBlocks.length) return;
  const temp = window.AppState.songBlocks[index];
  window.AppState.songBlocks[index] = window.AppState.songBlocks[targetIndex];
  window.AppState.songBlocks[targetIndex] = temp;
  renderSongBlocks();
}

function removeSongBlock(index) {
  if (!window.AppState) return;
  window.AppState.songBlocks.splice(index, 1);
  renderSongBlocks();
}

function handleBlockTextInput(index, textareaEl) {
  if (window.AppState && window.AppState.songBlocks[index]) {
    window.AppState.songBlocks[index].text = textareaEl.value;
    autoResizeTextarea(textareaEl);
    if (typeof window.checkRecipeDirtyState === "function") window.checkRecipeDirtyState();
    if (typeof window.syncActiveTrackDraftDebounced === "function") window.syncActiveTrackDraftDebounced();
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
    type: sanitizeTagString(b.type || b.label || "verse").toLowerCase(),
    label: sanitizeTagString(b.label || b.type || "Verse"),
    text: b.text || ""
  }));

  renderSongBlocks();
  setTimeout(() => resizeAllTextareas(), 30);
}

window.calculateQuantizedDuration = calculateQuantizedDuration;
window.autoResizeTextarea = autoResizeTextarea;
window.resizeAllTextareas = resizeAllTextareas;
window.sanitizeTagString = sanitizeTagString;
window.compileBlocksToLyrics = compileBlocksToLyrics;
window.parseLyricsIntoBlocks = parseLyricsIntoBlocks;
window.serializeRecipe = serializeRecipe;
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
window.loadSongBlueprint = loadSongBlueprint;