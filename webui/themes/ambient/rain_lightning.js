export default class RainLightningAmbient {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.animId = null;
    this.drops = [];
    this.maxDrops = 140;
    this._handleResize = this.resize.bind(this);
    this.lightningTimer = null;
  }

  mount() {
    this.canvas.className = "absolute inset-0 pointer-events-none z-0";
    this.container.appendChild(this.canvas);
    this.resize();
    window.addEventListener("resize", this._handleResize);

    for (let i = 0; i < this.maxDrops; i++) {
      this.drops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        len: Math.random() * 24 + 16,
        speed: Math.random() * 12 + 18,
        opacity: Math.random() * 0.4 + 0.2
      });
    }

    const draw = () => {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      this.ctx.lineWidth = 1.2;

      for (let i = 0; i < this.drops.length; i++) {
        const d = this.drops[i];
        this.ctx.beginPath();
        this.ctx.moveTo(d.x, d.y);
        this.ctx.lineTo(d.x - 2, d.y + d.len);
        this.ctx.stroke();

        d.y += d.speed;
        d.x -= 1.5;

        if (d.y > window.innerHeight) {
          d.y = -d.len;
          d.x = Math.random() * (window.innerWidth + 100);
        }
      }
      this.animId = requestAnimationFrame(draw);
    };

    draw();

    this.lightningTimer = setInterval(() => {
      if (Math.random() > 0.65) this.flashLightning();
    }, 5500);
  }

  flashLightning() {
    const flash = document.getElementById("lightning-layer");
    if (!flash) return;
    flash.style.opacity = "0.85";
    setTimeout(() => { flash.style.opacity = "0"; }, 60);
    setTimeout(() => {
      flash.style.opacity = "0.55";
      setTimeout(() => { flash.style.opacity = "0"; }, 40);
    }, 110);
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
    if (this.lightningTimer) clearInterval(this.lightningTimer);
    this.container.innerHTML = "";
  }
}