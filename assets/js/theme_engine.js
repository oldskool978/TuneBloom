class ThemeEngine {
  constructor() {
    this.currentThemeId = null;
    this.currentAmbientInstance = null;
    this.currentEasterEggFn = null;
    this.registry = null;
    this.ambientContainer = document.getElementById("ambient-container");
    this.stripWrapper = null;
    this.stripContainer = null;
    this.isStripOpen = false;
    this.paletteCache = new Map();
  }

  getApiBase() {
    return window.RouterDiscovery ? window.RouterDiscovery.activeBase : new URL("api/v1", document.baseURI).href.replace(/\/$/, "");
  }

  resolveUrl(relativePath) {
    if (!relativePath) return "";
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://") || relativePath.startsWith("data:")) {
      return relativePath;
    }
    const cleanPath = relativePath.replace(/^\/+/, "");
    return new URL(cleanPath, document.baseURI).href;
  }

  async init() {
    this.ambientContainer = document.getElementById("ambient-container");
    this.stripWrapper = document.getElementById("theme-strip-wrapper");
    this.stripContainer = document.getElementById("theme-strip-container");
    this.bindWheelScrolling();
    await this.loadRegistry();
    const savedTheme = localStorage.getItem("tunebloom_active_theme") || "sky_peace";
    await this.applyTheme(savedTheme);
  }

  bindWheelScrolling() {
    if (!this.stripContainer) return;
    this.stripContainer.addEventListener(
      "wheel",
      (e) => {
        if (this.stripContainer.scrollWidth > this.stripContainer.clientWidth) {
          e.preventDefault();
          this.stripContainer.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );
  }

  togglePicker(forceState) {
    if (!this.stripWrapper) return;
    this.isStripOpen = forceState !== undefined ? forceState : !this.isStripOpen;
    const chevron = document.getElementById("theme-toggle-chevron");

    if (this.isStripOpen) {
      this.stripWrapper.classList.remove("hidden");
      if (chevron) chevron.style.transform = "rotate(180deg)";
      requestAnimationFrame(() => {
        this.stripWrapper.style.maxHeight = "80px";
        this.stripWrapper.classList.remove("opacity-0");
        this.stripWrapper.classList.add("opacity-100");
      });
    } else {
      if (chevron) chevron.style.transform = "rotate(0deg)";
      this.stripWrapper.style.maxHeight = "0px";
      this.stripWrapper.classList.remove("opacity-100");
      this.stripWrapper.classList.add("opacity-0");
      setTimeout(() => {
        if (!this.isStripOpen) {
          this.stripWrapper.classList.add("hidden");
        }
      }, 300);
    }
  }

  async loadRegistry() {
    if (window.RouterDiscovery) {
      await window.RouterDiscovery.resolve();
    }

    try {
      const resp = await fetch(`${this.getApiBase()}/themes/registry`);
      if (resp.ok) {
        this.registry = await resp.json();
      } else {
        throw new Error();
      }
    } catch {
      try {
        const fallbackUrl = this.resolveUrl("themes/registry.json");
        const fallbackResp = await fetch(fallbackUrl);
        this.registry = await fallbackResp.json();
      } catch {
        this.registry = { revolving_pool: [], themes: {} };
      }
    }

    await this.preloadPalettes();
    this.renderThemeStrip();
  }

  async preloadPalettes() {
    if (!this.registry || !this.registry.themes) return;
    const entries = Object.entries(this.registry.themes);
    await Promise.all(
      entries.map(async ([themeId, meta]) => {
        if (this.paletteCache.has(themeId)) return;
        try {
          const palUrl = this.resolveUrl(meta.palette);
          const res = await fetch(palUrl);
          if (res.ok) {
            const data = await res.json();
            this.paletteCache.set(themeId, data);
          }
        } catch {}
      })
    );
  }

  renderThemeStrip() {
    if (!this.stripContainer || !this.registry || !this.registry.themes) return;
    const themes = this.registry.themes;
    const pills = [];

    for (const [themeId, meta] of Object.entries(themes)) {
      const pal = this.paletteCache.get(themeId) || {};
      const accentColor = pal["--accent-color"] || "#38bdf8";
      const isCurrent = themeId === this.currentThemeId;

      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border select-none ${
        isCurrent
          ? "bg-white/20 text-white border-white/50 shadow-md ring-1 ring-white/30"
          : "bg-black/30 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
      }`;
      pill.onclick = () => this.applyTheme(themeId);
      pill.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background: ${accentColor}; box-shadow: 0 0 6px ${accentColor};"></span>
        <span class="whitespace-nowrap font-medium text-[11px]">${meta.name}</span>
      `;
      pills.push(pill);
    }

    this.stripContainer.replaceChildren(...pills);
  }

  async applyTheme(themeId) {
    if (!this.registry || !this.registry.themes || !this.registry.themes[themeId]) {
      return;
    }

    const themeMeta = this.registry.themes[themeId];
    this.currentThemeId = themeId;
    localStorage.setItem("tunebloom_active_theme", themeId);

    let palette = this.paletteCache.get(themeId);
    if (!palette) {
      try {
        const palUrl = this.resolveUrl(themeMeta.palette);
        const paletteResp = await fetch(palUrl);
        if (paletteResp.ok) {
          palette = await paletteResp.json();
          this.paletteCache.set(themeId, palette);
        }
      } catch {}
    }

    if (palette) {
      const rootStyle = document.documentElement.style;
      for (const [key, value] of Object.entries(palette)) {
        rootStyle.setProperty(key, value);
      }
      const easterIcon = palette["--easter-icon"] || "fa-dove";
      const easterBtnIcon = document.getElementById("easter-action-icon");
      if (easterBtnIcon) {
        easterBtnIcon.className = `fa-solid ${easterIcon}`;
      }
    }

    if (this.currentAmbientInstance && typeof this.currentAmbientInstance.unmount === "function") {
      this.currentAmbientInstance.unmount();
      this.currentAmbientInstance = null;
    }

    if (themeMeta.ambient && this.ambientContainer) {
      try {
        const ambientModuleUrl = this.resolveUrl(themeMeta.ambient);
        const ambientModule = await import(ambientModuleUrl);
        const AmbientClass = ambientModule.default;
        this.currentAmbientInstance = new AmbientClass(this.ambientContainer);
        this.currentAmbientInstance.mount();
      } catch {
        this.ambientContainer.innerHTML = "";
      }
    }

    if (themeMeta.easter_egg) {
      try {
        const eggModuleUrl = this.resolveUrl(themeMeta.easter_egg);
        const eggModule = await import(eggModuleUrl);
        this.currentEasterEggFn = eggModule.default;
      } catch {
        this.currentEasterEggFn = null;
      }
    } else {
      this.currentEasterEggFn = null;
    }

    const triggerLabel = document.getElementById("theme-active-name");
    if (triggerLabel) {
      triggerLabel.textContent = themeMeta.name;
    }

    this.renderThemeStrip();
  }

  triggerEasterEgg() {
    if (typeof this.currentEasterEggFn === "function") {
      this.currentEasterEggFn(document.body);
    }
  }
}

window.ThemeEngine = ThemeEngine;
window.themeEngine = new ThemeEngine();

document.addEventListener("DOMContentLoaded", () => {
  window.themeEngine.init();
});