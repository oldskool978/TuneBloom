/**
 * Sky Peace Organic Volumetric Clouds & Aerodynamic Feathers
 * Features multi-tiered cumulus puff clustering, dual-tone atmospheric lighting,
 * and 3-plane depth parallax.
 */
export default class CloudsFeathersAmbient {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.animId = null;
    this.clouds = [];
    this.feathers = [];
    this.maxFeathers = 16;
    this._handleResize = this.resize.bind(this);
  }

  mount() {
    this.canvas.className = "absolute inset-0 pointer-events-none z-0";
    this.container.appendChild(this.canvas);
    this.resize();
    window.addEventListener("resize", this._handleResize);

    this.initClouds();
    this.initFeathers();

    const draw = () => {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Draw Background Parallax Clouds
      for (let i = 0; i < this.clouds.length; i++) {
        const c = this.clouds[i];
        this.drawCumulusCloud(c);

        c.x += c.speed;
        if (c.x - c.boundsWidth * 0.5 > window.innerWidth) {
          c.x = -c.boundsWidth * 0.6;
          c.y = Math.random() * (window.innerHeight * 0.40);
        }
      }

      // 2. Draw Aerodynamic Falling Feathers
      for (let i = 0; i < this.feathers.length; i++) {
        const f = this.feathers[i];
        this.drawFeather(f);

        f.y += f.speedY;
        f.x += f.speedX + Math.sin(f.sway) * 0.75;
        f.sway += f.swaySpeed;
        f.rotation = Math.sin(f.sway) * 0.4 + 0.15;

        if (f.y > window.innerHeight + 30) {
          f.y = -30;
          f.x = Math.random() * window.innerWidth;
        }
        if (f.x > window.innerWidth + 30) {
          f.x = -30;
        }
      }

      this.animId = requestAnimationFrame(draw);
    };

    draw();
  }

  initClouds() {
    this.clouds = [];
    const layers = [
      { count: 2, scale: 0.65, speed: 0.12, alpha: 0.28, yRange: 0.25 }, // Deep background
      { count: 3, scale: 1.00, speed: 0.22, alpha: 0.42, yRange: 0.35 }, // Midground main
      { count: 2, scale: 1.35, speed: 0.35, alpha: 0.22, yRange: 0.45 }  // Foreground soft
    ];

    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const scale = layer.scale * (Math.random() * 0.3 + 0.85);
        const cloud = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * (window.innerHeight * layer.yRange) + 10,
          speed: layer.speed * (Math.random() * 0.4 + 0.8),
          alpha: layer.alpha,
          scale: scale,
          boundsWidth: 380 * scale,
          puffs: []
        };

        // Construct 20 overlapping cloud lobes with flat base & billowing crest
        const puffCount = Math.floor(Math.random() * 6) + 18;
        for (let p = 0; p < puffCount; p++) {
          const u = (p / (puffCount - 1)) * 2 - 1; // -1 to 1 across cloud width
          const widthSpan = 140 * scale;
          const px = u * widthSpan + (Math.random() * 24 - 12) * scale;
          
          // Parabolic dome formula for billowing cloud crown
          const domeHeight = Math.sqrt(Math.max(0, 1 - (u * 0.9) ** 2)) * 48 * scale;
          const py = -domeHeight + (Math.random() * 20 - 10) * scale + 15 * scale;
          const radius = (Math.random() * 28 + 36) * scale * (1 - Math.abs(u) * 0.35);

          // Classify as base shadow, core body, or top sunlit highlight
          const isUnderside = py > 8 * scale;
          const isCrown = py < -22 * scale;

          cloud.puffs.push({
            x: px,
            y: py,
            r: radius,
            isUnderside,
            isCrown
          });
        }

        // Sort bottom-to-top for clean natural atmospheric accumulation
        cloud.puffs.sort((a, b) => b.y - a.y);
        this.clouds.push(cloud);
      }
    });
  }

  initFeathers() {
    this.feathers = [];
    for (let i = 0; i < this.maxFeathers; i++) {
      this.feathers.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: Math.random() * 16 + 12,
        width: Math.random() * 5 + 3,
        speedY: Math.random() * 0.45 + 0.30,
        speedX: Math.random() * 0.35 + 0.15,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.025 + 0.015,
        rotation: 0,
        alpha: Math.random() * 0.35 + 0.20
      });
    }
  }

  drawCumulusCloud(c) {
    this.ctx.save();
    this.ctx.translate(c.x, c.y);

    for (let i = 0; i < c.puffs.length; i++) {
      const p = c.puffs[i];
      const grad = this.ctx.createRadialGradient(
        p.x,
        p.y - p.r * 0.25,
        p.r * 0.05,
        p.x,
        p.y,
        p.r
      );

      if (p.isUnderside) {
        // Soft ambient sky shadow undertone
        grad.addColorStop(0.0, `rgba(215, 235, 250, ${c.alpha * 0.85})`);
        grad.addColorStop(0.5, `rgba(180, 215, 245, ${c.alpha * 0.55})`);
        grad.addColorStop(1.0, "rgba(180, 215, 245, 0)");
      } else if (p.isCrown) {
        // Crisp sunlit highlight
        grad.addColorStop(0.0, `rgba(255, 255, 255, ${c.alpha * 1.0})`);
        grad.addColorStop(0.55, `rgba(245, 250, 255, ${c.alpha * 0.75})`);
        grad.addColorStop(1.0, "rgba(240, 248, 255, 0)");
      } else {
        // Dense core body
        grad.addColorStop(0.0, `rgba(255, 255, 255, ${c.alpha * 0.95})`);
        grad.addColorStop(0.6, `rgba(235, 245, 255, ${c.alpha * 0.65})`);
        grad.addColorStop(1.0, "rgba(224, 242, 254, 0)");
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawFeather(f) {
    this.ctx.save();
    this.ctx.translate(f.x, f.y);
    this.ctx.rotate(f.rotation);

    // Soft plume vane
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, f.width, f.length * 0.5, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(245, 250, 255, ${f.alpha})`;
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = "rgba(56, 189, 248, 0.35)";
    this.ctx.fill();

    // Central quill line
    this.ctx.beginPath();
    this.ctx.moveTo(0, -f.length * 0.5);
    this.ctx.quadraticCurveTo(0.6, 0, 0, f.length * 0.55);
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${f.alpha * 1.2})`;
    this.ctx.lineWidth = 0.75;
    this.ctx.stroke();

    this.ctx.restore();
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