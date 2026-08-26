export default class EmbersLeavesAmbient {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.animId = null;
    this.embers = [];
    this.maxEmbers = 45;
    this._handleResize = this.resize.bind(this);
  }

  mount() {
    this.canvas.className = "absolute inset-0 pointer-events-none z-0";
    this.container.appendChild(this.canvas);
    this.resize();
    window.addEventListener("resize", this._handleResize);

    for (let i = 0; i < this.maxEmbers; i++) {
      this.embers.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.2 + 1.0,
        speedY: Math.random() * 0.9 + 0.4,
        speedX: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        hue: Math.random() * 25 + 30
      });
    }

    const draw = () => {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < this.embers.length; i++) {
        const e = this.embers[i];
        this.ctx.beginPath();
        this.ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${e.hue}, 95%, 55%, ${e.alpha})`;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = "#f59e0b";
        this.ctx.fill();

        e.y -= e.speedY;
        e.x += e.speedX + Math.sin(e.y * 0.02) * 0.3;

        if (e.y < -10) {
          e.y = window.innerHeight + 10;
          e.x = Math.random() * window.innerWidth;
        }
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
  }

  unmount() {
    window.removeEventListener("resize", this._handleResize);
    if (this.animId) cancelAnimationFrame(this.animId);
    this.container.innerHTML = "";
  }
}