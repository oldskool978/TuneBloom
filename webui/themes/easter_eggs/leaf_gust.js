export default function triggerLeafGust(container) {
  const wrapper = document.createElement("div");
  wrapper.className = "fixed inset-0 pointer-events-none z-30 overflow-hidden";
  container.appendChild(wrapper);

  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const leaf = document.createElement("div");
      leaf.className = "ambient-leaf absolute";
      const size = Math.random() * 16 + 10;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.left = `${Math.random() * 100}vw`;
      leaf.style.animationDuration = `${Math.random() * 3.5 + 2.5}s`;
      wrapper.appendChild(leaf);
      setTimeout(() => leaf.remove(), 6000);
    }, i * 40);
  }

  setTimeout(() => wrapper.remove(), 8000);
}