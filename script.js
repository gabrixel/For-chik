const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// =========================
// LOADING SCREEN
// =========================

const loading = [
  "collecting courage...",
  "overthinking everything...",
  "writing this instead of saying it normally...",
  "okay, we're doing this...",
  "almost there..."
];

let progress = 0;
let li = 0;

const timer = setInterval(() => {
  progress += 2;

  const bar = $("#bar");
  const loadingText = $("#loadingText");

  if (bar) {
    bar.style.width = progress + "%";
  }

  if (progress % 20 === 0 && li < loading.length) {
    if (loadingText) {
      loadingText.textContent = loading[li];
    }
    li++;
  }

  if (progress >= 100) {
    clearInterval(timer);

    if (loadingText) {
      loadingText.textContent = "I think I'm ready.";
    }

    const openBtn = $("#openBtn");

    if (openBtn) {
      openBtn.hidden = false;
      openBtn.style.display = "inline-block";
    }
  }
}, 60);


// =========================
// OPEN THE WEBSITE
// =========================

const openBtn = $("#openBtn");

if (openBtn) {
  openBtn.addEventListener("click", () => {
    const loader = $("#loader");
    const site = $("#site");

    if (loader) {
      loader.style.display = "none";
    }

    if (site) {
      site.hidden = false;
      site.style.display = "block";
    }

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    startHearts();
    startMusic();
  });
}


// =========================
// NAVIGATION
// =========================

$$("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.go;
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});


// =========================
// REVEAL BUTTONS
// =========================

$$("[data-reveal]").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.reveal;
    const element = document.getElementById(id);

    if (!element) return;

    element.classList.toggle("show");

    button.textContent = element.classList.contains("show")
      ? "Hide note ↑"
      : "There's more ↓";
  });
});


// =========================
// THINGS I LIKE
// =========================

$$("[data-pop]").forEach(card => {
  card.addEventListener("click", () => {
    const pop = $("#pop");

    if (!pop) return;

    pop.textContent = card.dataset.pop;
    pop.hidden = false;
  });
});


// =========================
// HIDDEN MESSAGE
// =========================

const secretBtn = $("#secretBtn");

if (secretBtn) {
  secretBtn.addEventListener("click", () => {
    const secret = $("#secret");

    if (!secret) return;

    secret.hidden = false;
    secretBtn.textContent = "🔓 Hidden message opened";

    secret.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}


// =========================
// CONFESSION RESPONSES
// =========================

function showResponse(text) {
  const response = $("#response");

  if (!response) return;

  response.hidden = false;
  response.textContent = text;
}

const yesBtn = $("#yesBtn");

if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    showResponse(
      "Okay... that made this whole thing worth it. ♡"
    );

    burst();
  });
}

const timeBtn = $("#timeBtn");

if (timeBtn) {
  timeBtn.addEventListener("click", () => {
    showResponse(
      "Take all the time you need. Seriously. There's no pressure from me. ♡"
    );
  });
}


// =========================
// MODAL CLOSE BUTTON
// =========================

const closeModal = $("#closeModal");
const modal = $("#modal");

if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.hidden = true;
  });
}


// =========================
// FLOATING HEARTS
// =========================

let heartsStarted = false;

function startHearts() {
  if (heartsStarted) return;

  heartsStarted = true;

  setInterval(() => {
    const h = document.createElement("div");

    h.className = "heart";
    h.textContent = ["♡", "♥", "✦", "⋆"][
      Math.floor(Math.random() * 4)
    ];

    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize =
      12 + Math.random() * 24 + "px";
    h.style.opacity =
      0.35 + Math.random() * 0.55;
    h.style.animationDuration =
      6 + Math.random() * 7 + "s";

    document.body.appendChild(h);

    setTimeout(() => {
      h.remove();
    }, 14000);
  }, 450);
}


// =========================
// HEART BURST
// =========================

function burst() {
  for (let i = 0; i < 24; i++) {
    const h = document.createElement("div");

    h.className = "burst-heart";
    h.textContent = "♡";

    h.style.left = "50%";
    h.style.top = "55%";

    h.style.setProperty(
      "--x",
      Math.random() * 500 - 250 + "px"
    );

    h.style.setProperty(
      "--y",
      Math.random() * 400 - 200 + "px"
    );

    document.body.appendChild(h);

    setTimeout(() => {
      h.remove();
    }, 1500);
  }
}


// =========================
// AMBIENT MUSIC
// =========================

let audioCtx;
let gain;
let playing = false;
let nodes = [];

function startMusic() {
  if (playing) return;

  const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContext) return;

  audioCtx = new AudioContext();

  gain = audioCtx.createGain();
  gain.gain.value = 0.025;
  gain.connect(audioCtx.destination);

  const notes = [
    261.63,
    329.63,
    392,
    493.88
  ];

  notes.forEach(freq => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    g.gain.value = 0.03;

    osc.connect(g);
    g.connect(gain);

    osc.start();

    nodes.push(osc);
  });

  playing = true;
}


// =========================
// MUSIC BUTTON
// =========================

const musicButton = $("#music");

if (musicButton) {
  musicButton.addEventListener("click", () => {
    if (!audioCtx) {
      startMusic();
      return;
    }

    const label = $("#music span");

    if (audioCtx.state === "running") {
      audioCtx.suspend();

      if (label) {
        label.textContent = "music off";
      }
    } else {
      audioCtx.resume();

      if (label) {
        label.textContent = "music";
      }
    }
  });
}
