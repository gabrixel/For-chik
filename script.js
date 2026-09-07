const screens = [...document.querySelectorAll(".screen")];

function show(id) {
  screens.forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
  burst(6);
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => show(btn.dataset.next));
});

const bar = document.getElementById("bar");
const loadingText = document.getElementById("loadingText");
const loadingLines = [
  "collecting courage...",
  "replaying little moments...",
  "trying not to overthink this...",
  "writing the scary part...",
  "okay... here we go.",
];
let progress = 0;
let li = 0;
const loader = setInterval(() => {
  progress += Math.floor(Math.random() * 10) + 5;
  if (progress > 100) progress = 100;
  bar.style.width = progress + "%";
  loadingText.textContent = loadingLines[Math.min(li, loadingLines.length - 1)];
  li++;
  if (progress >= 100) {
    clearInterval(loader);
    setTimeout(() => show("welcome"), 500);
  }
}, 350);

// Original, browser-generated ambient music â€” no external song file required.
let audioCtx = null,
  master = null,
  musicOn = false,
  musicTimer = null;
function startMusic() {
  if (musicOn) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.045;
    master.connect(audioCtx.destination);
    musicOn = true;
    document.getElementById("music").textContent = "â™«";
    playNote();
  } catch (e) {}
}
function playNote() {
  if (!musicOn) return;
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
  const freq = notes[Math.floor(Math.random() * notes.length)];
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.7);
  osc.connect(gain);
  gain.connect(master);
  osc.start();
  osc.stop(audioCtx.currentTime + 2.8);
  musicTimer = setTimeout(playNote, 900);
}
document.getElementById("music").addEventListener("click", () => {
  if (!audioCtx) startMusic();
  else {
    musicOn = !musicOn;
    master.gain.value = musicOn ? 0.045 : 0;
    if (musicOn) playNote();
  }
});

document
  .getElementById("reveal")
  .addEventListener("click", () => show("hidden"));
document.getElementById("yesBtn").addEventListener("click", () => {
  document.getElementById("response").textContent =
    "Then let's not rush anything. I'd just be happy to keep getting to know you. â™¡";
  burst(15);
});
document.getElementById("timeBtn").addEventListener("click", () => {
  document.getElementById("response").textContent =
    "Take all the time you need. Seriously. There is no deadline on this. ðŸ«¶";
});
document
  .getElementById("restart")
  .addEventListener("click", () => show("welcome"));

function burst(amount) {
  const box = document.querySelector(".particles");
  for (let i = 0; i < amount; i++) {
    const p = document.createElement("span");
    p.textContent = ["â™¡", "âœ¦", "Â·", "âœ§"][Math.floor(Math.random() * 4)];
    p.style.position = "absolute";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = 75 + Math.random() * 25 + "vh";
    p.style.fontSize = 10 + Math.random() * 18 + "px";
    p.style.animation = `rise ${4 + Math.random() * 4}s linear forwards`;
    box.appendChild(p);
    setTimeout(() => p.remove(), 8500);
  }
}
setInterval(() => burst(1), 1800);
