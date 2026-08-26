export default class DigitalRainAmbient {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.animId = null;
    this._handleResize = this.resize.bind(this);
    this.columns = 0;
    this.drops = [];
    this.fontSize = 14;
    this.chars = "0123456789ABCDEF01TuneBloomMaster48kHzHighFidelityAudioStream";
  }

  mount() {
    this.canvas.className = "absolute inset-0 pointer-events-none z-0 opacity-40";
    this.container.appendChild(this.canvas);
    this.resize();
    window.addEventListener("resize", this._handleResize);

    const draw = () => {
      this.ctx.fillStyle = "rgba(2, 6, 23, 0.08)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < this.drops.length; i++) {
        const text = this.chars[Math.floor(Math.random() * this.chars.length)];
        const x = i * this.fontSize;
        const y = this.drops[i] * this.fontSize;
        this.ctx.fillStyle = this.drops[i] % 4 === 0 ? "#a7f3d0" : "#10b981";
        this.ctx.fillText(text, x, y);

        if (y > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i]++;
      }
      this.animId = requestAnimationFrame(draw);
    };

    draw();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(dpr, dpr);
    this.columns = Math.floor(window.innerWidth / this.fontSize);
    this.drops = Array(this.columns).fill(1).map(() => Math.floor(Math.random() * -50));
  }

  unmount() {
    window.removeEventListener("resize", this._handleResize);
    if (this.animId) cancelAnimationFrame(this.animId);
    this.container.innerHTML = "";
  }
}