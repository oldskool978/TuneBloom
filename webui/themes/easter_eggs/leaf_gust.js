export default function triggerLeafGust(container = document.body) {
  const parent = document.getElementById("ambient-container") || container;
  const wrapper = document.createElement("div");
  wrapper.className = "fixed inset-0 pointer-events-none z-30 overflow-hidden";
  parent.appendChild(wrapper);

  const gust = document.createElement("div");
  gust.className = "easter-dusk-gust";
  wrapper.appendChild(gust);

  const flipper = document.getElementById("jewel-card-flipper");
  if (flipper) {
    flipper.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    flipper.style.transform = "perspective(1400px) rotateY(9deg) rotateX(-5deg) scale(1.025)";
    setTimeout(() => {
      flipper.style.transform = "perspective(1400px) rotateY(0deg) rotateX(0deg) scale(1)";
    }, 450);
  }

  const leafPalette = [
    { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.7)" },
    { color: "#fbbf24", glow: "rgba(251, 191, 36, 0.8)" },
    { color: "#ea580c", glow: "rgba(234, 88, 12, 0.7)" },
    { color: "#f97316", glow: "rgba(249, 115, 22, 0.75)" },
    { color: "#d97706", glow: "rgba(217, 119, 6, 0.7)" },
    { color: "#b45309", glow: "rgba(180, 83, 9, 0.6)" }
  ];

  const leafSvgPath = "M12 2C12 2 13.8 5.2 15.6 6.1C17.8 7.1 21.5 6.7 21.5 6.7C21.5 6.7 20 9.8 20 11.9C20 14 22.5 16.5 22.5 16.5C22.5 16.5 19 16.5 17.5 18C16 19.5 15.5 22.5 15.5 22.5C15.5 22.5 13.8 19.8 12.2 19.3C10.7 19.8 9 22.5 9 22.5C9 22.5 8.5 19.5 7 18C5.5 16.5 2 16.5 2 16.5C2 16.5 4.5 14 4.5 11.9C4.5 9.8 3 6.7 3 6.7C3 6.7 6.7 7.1 8.9 6.1C10.7 5.2 12 2 12 2Z";

  const totalLeaves = 35;
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;

  for (let i = 0; i < totalLeaves; i++) {
    setTimeout(() => {
      const leaf = document.createElement("div");
      leaf.className = "ambient-leaf absolute";

      const size = Math.random() * 18 + 14;
      const palette = leafPalette[Math.floor(Math.random() * leafPalette.length)];

      const startX = Math.random() * (viewW * 0.45) - 40;
      const startY = Math.random() * (viewH * 0.55) + (viewH * 0.35);

      const travelDist = viewW * (0.65 + Math.random() * 0.55);
      const angleRad = (30 + Math.random() * 15) * (Math.PI / 180);
      const travelX = travelDist * Math.cos(angleRad);
      const travelY = -travelDist * Math.sin(angleRad);
      const sway = (Math.random() - 0.5) * 120;
      const duration = (Math.random() * 1.5 + 2.0).toFixed(2);

      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.left = `${startX}px`;
      leaf.style.top = `${startY}px`;
      leaf.style.color = palette.color;
      leaf.style.filter = `drop-shadow(0 0 8px ${palette.glow})`;
      leaf.style.setProperty("--travel-x", `${travelX}px`);
      leaf.style.setProperty("--travel-y", `${travelY}px`);
      leaf.style.setProperty("--sway", `${sway}px`);
      leaf.style.animationDuration = `${duration}s`;

      leaf.innerHTML = `
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
          <path d="${leafSvgPath}"/>
        </svg>
      `;

      wrapper.appendChild(leaf);
      setTimeout(() => leaf.remove(), duration * 1000 + 100);
    }, i * 40);
  }

  setTimeout(() => wrapper.remove(), 6500);
}