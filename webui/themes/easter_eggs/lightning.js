export default function triggerLightning(container) {
  const bolt = document.createElement("div");
  bolt.className = "easter-bolt fixed pointer-events-none z-30";
  bolt.style.left = `${Math.random() * 60 + 20}vw`;
  bolt.style.top = "2%";
  bolt.innerHTML = `
    <svg width="140" height="320" viewBox="0 0 100 250" fill="none">
      <path d="M50 0L15 110H55L8 250L92 95H45L82 0H50Z" fill="#38bdf8" class="drop-shadow-[0_0_24px_#38bdf8]"/>
    </svg>
  `;
  container.appendChild(bolt);

  const flash = document.getElementById("lightning-layer");
  if (flash) {
    flash.style.opacity = "1";
    setTimeout(() => { flash.style.opacity = "0"; }, 75);
    setTimeout(() => {
      flash.style.opacity = "0.75";
      setTimeout(() => { flash.style.opacity = "0"; }, 50);
    }, 120);
  }
  setTimeout(() => bolt.remove(), 450);
}