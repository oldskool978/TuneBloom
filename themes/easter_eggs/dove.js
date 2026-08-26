export default function triggerDove(container) {
  const wrapper = document.createElement("div");
  wrapper.className = "fixed inset-0 pointer-events-none z-30 overflow-hidden";
  wrapper.innerHTML = `
    <div class="easter-dove absolute">
      <svg width="68" height="68" viewBox="0 0 24 24" fill="#f0f9ff" class="drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]">
        <path d="M21.9 2.1c-.2-.1-.4-.1-.6 0l-5.3 2.1c-.6.2-1.2.6-1.6 1.1L8.7 10.9c-.3.3-.6.5-1 .5H5.4c-.6 0-1.1.2-1.5.6L2.3 13.6c-.4.4-.4 1 0 1.4.2.2.5.3.7.3h2.6c.4 0 .8.2 1.1.5l3 3c.3.3.5.7.5 1.1v2.6c0 .6.4 1 1 1 .3 0 .5-.1.7-.3l1.6-1.6c.4-.4.6-.9.6-1.5v-2.3c0-.4.2-.8.5-1l5.6-5.6c.5-.5.9-1.1 1.1-1.6l2.1-5.3c.1-.2 0-.4-.2-.6z"/>
      </svg>
    </div>
  `;
  container.appendChild(wrapper);
  setTimeout(() => wrapper.remove(), 11000);
}