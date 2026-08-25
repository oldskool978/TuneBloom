export default function triggerNeonPulse(container) {
  const pulse = document.createElement("div");
  pulse.className = "easter-neon-pulse";
  container.appendChild(pulse);
  setTimeout(() => pulse.remove(), 1200);
}