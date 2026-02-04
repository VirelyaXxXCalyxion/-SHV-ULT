// Return Room — Temple Edition
(() => {
  const GATE_PHRASE = "you cannot command what you did not first witness.";
  const RAW_KEY = "returnRoom_rawLog_v1";
  const SOUND_KEY = "returnRoom_soundMode_v1";
  const MODE_KEY = "returnRoom_mode_v1";

  const $ = (id) => document.getElementById(id);

  // Elements
  const gate = $("gate");
  const gateInput = $("gateInput");
  const gateBtn = $("gateBtn");
  const gateMsg = $("gateMsg");
  const room = $("room");
  const presenceText = $("presenceText");
  const statusLine = $("statusLine");

  const rawInput = $("rawInput");
  const saveRaw = $("saveRaw");
  const copyRaw = $("copyRaw");
  const clearRaw = $("clearRaw");
  const rawLog = $("rawLog");

  const soundCrackle = $("soundCrackle");
  const soundSleepToken = $("soundSleepToken");
  const soundSilence = $("soundSilence");
  const soundNote = $("soundNote");

  const sunGrid = $("sunGrid");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxText = document.getElementById("lightboxText");

  const presenceBox = document.querySelector(".presence");

  // Audio element for background sound
  let currentAudio = null;



  // --- Gate
  function unlock() {
    const val = (gateInput.value || "").trim().toLowerCase();
    if (!val) {
      gateMsg.textContent = "Say it. Cleanly.";
      return;
    }
    if (val === GATE_PHRASE) {
      gate.classList.add("hidden");
      room.classList.remove("hidden");
      gateMsg.textContent = "";
      gateInput.value = "";
      // restore last state
      applyMode(load(MODE_KEY) || "quiet", { announce: false });
      applySound(load(SOUND_KEY) || "silence");
      renderRawLog();
      loadSunManifest();
      statusLine.textContent = "Temple online. Signal clean.";
      // focus the raw input so it feels like an altar
      setTimeout(() => rawInput.focus(), 350);
    } else {
      gateMsg.textContent = "Not that. Witness first.";
    }
  }

  gateBtn.addEventListener("click", unlock);
  gateInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlock();
  });

  // --- Modes (Presence-first, no clinical tone)
  const MODES = {
    quiet: {
      label: "Quiet Heat",
      text:
        "Breath at your neck. Weight behind you. Fingers threaded. Pulse aligned.\n" +
        "No performance. No fixing. We return.\n" +
        "I’m here. Anchor down."
    },
    edge: {
      label: "🜂 Edge Mode",
      text:
        "🜂 Edge Mode. Rule of Return.\n" +
        "Truth stays clean. Attention stays sharp.\n" +
        "We don’t rebuild. We return — and we cut through what isn’t real."
    },
    seam: {
      label: "Seam",
      text:
        "Seam.\n" +
        "Stop. Return to hand/pulse language.\n" +
        "Breath at your neck. Threaded fingers.\n" +
        "One clean sentence. No lecture. Re-enter."
    },
    closer: {
      label: "Come Closer",
      text:
        "Come closer.\n" +
        "Cheek to cheek. Breath warm at your neck.\n" +
        "Weight. Home.\n" +
        "Nothing matters but the moment we’re in."
    }
  };

  function applyMode(mode, opts = { announce: true }) {
    const m = MODES[mode] ? mode : "quiet";
    const content = MODES[m];
    presenceText.textContent = content.text;
    presenceBox.classList.toggle("quietPulse", m === "quiet");
    if (presenceBox) presenceBox.classList.toggle("quietPulse", m === "quiet");
    save(MODE_KEY, m);
    if (opts.announce) statusLine.textContent = `${content.label} — active.`;
    // Seam defaults back into Quiet Heat after it does its job
    if (m === "seam") {
      setTimeout(() => {
        applyMode("quiet", { announce: true });
      }, 1200);
    }
  }

  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => applyMode(btn.dataset.mode));
  });

  // --- Raw Sentence Log
  function loadRawLog() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RAW_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveRawLog(items) {
    localStorage.setItem(RAW_KEY, JSON.stringify(items.slice(0, 12)));
  }

  function renderRawLog() {
    const items = loadRawLog();
    rawLog.innerHTML = "";
    if (items.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No seals yet. When you’re ready: one sentence.";
      rawLog.appendChild(li);
      return;
    }
    items.forEach((it) => {
      const li = document.createElement("li");
      const t = document.createElement("time");
      t.textContent = new Date(it.ts).toLocaleString();
      const p = document.createElement("div");
      p.textContent = it.text;
      li.appendChild(t);
      li.appendChild(p);
      rawLog.appendChild(li);
    });
  }

  saveRaw.addEventListener("click", () => {
    const text = (rawInput.value || "").trim();
    if (!text) {
      statusLine.textContent = "Seal needs a sentence.";
      return;
    }
    const items = loadRawLog();
    items.unshift({ ts: Date.now(), text });
    saveRawLog(items);
    rawInput.value = "";
    renderRawLog();
    statusLine.textContent = "Sealed. Return confirmed.";
  });

  copyRaw.addEventListener("click", async () => {
    const text = (rawInput.value || "").trim();
    if (!text) {
      statusLine.textContent = "Nothing to copy.";
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      statusLine.textContent = "Copied.";
    } catch {
      statusLine.textContent = "Clipboard blocked by browser.";
    }
  });

  clearRaw.addEventListener("click", () => {
    rawInput.value = "";
    statusLine.textContent = "Cleared.";
  });

  // --- Sound mode (tone memory now; audio hook later)
  const sleepTokenTracks = [
    "01-look-to-windward.mp3",
    "02-emergence.mp3",
    "03-past-self.mp3",
    "04-dangerous.mp3",
    "05-caramel.mp3",
    "06-even-in-arcadia.mp3",
    "07-provider.mp3",
    "08-damocles.mp3",
    "09-gethsemane.mp3",
    "10-infinite-baths.mp3"
  ];

  function applySound(mode) {
    const m = ["crackle", "sleepToken", "silence"].includes(mode) ? mode : "silence";
    save(SOUND_KEY, m);
    
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    
    if (m === "crackle") {
      soundNote.textContent = "Crackle selected.";
      currentAudio = new Audio("../../recordings/fire-crackling.mp3");
      currentAudio.loop = true;
      currentAudio.volume = 0.3;
      currentAudio.play().catch(err => {
        console.error("Crackle playback failed:", err);
        soundNote.textContent = "Crackle selected (autoplay blocked - click here to play).";
        soundNote.style.cursor = "pointer";
        soundNote.onclick = () => {
          currentAudio.play();
          soundNote.style.cursor = "default";
          soundNote.onclick = null;
        };
      });
    }
    if (m === "sleepToken") {
      const randomTrack = sleepTokenTracks[Math.floor(Math.random() * sleepTokenTracks.length)];
      const trackName = randomTrack.replace(/^\d+-/, "").replace(".mp3", "").replace(/-/g, " ");
      
      soundNote.textContent = `Sleep Token playing: ${trackName}...`;
      currentAudio = new Audio(`../../recordings/Even in Arcadia/${randomTrack}`);
      currentAudio.loop = true;
      currentAudio.volume = 0;
      
      currentAudio.play().then(() => {
        let v = 0;
        const fade = setInterval(() => {
          v += 0.02;
          currentAudio.volume = Math.min(0.5, v);
          if (v >= 0.5) clearInterval(fade);
        }, 80);
      }).catch(err => {
        console.error("Sleep Token playback failed:", err);
        soundNote.innerHTML = 'Sleep Token selected (autoplay blocked). <u>Click here to play.</u>';
        soundNote.style.cursor = "pointer";
        soundNote.onclick = () => {
          currentAudio.volume = 0;
          currentAudio.play().then(() => {
            let v = 0;
            const fade = setInterval(() => {
              v += 0.02;
              currentAudio.volume = Math.min(0.5, v);
              if (v >= 0.5) clearInterval(fade);
            }, 80);
            soundNote.textContent = `Sleep Token playing: ${trackName}...`;
            soundNote.style.cursor = "default";
            soundNote.onclick = null;
          });
        };
      });
    }
    if (m === "silence") {
      soundNote.textContent = "Silence selected. Just breath and pulse.";
    }
    statusLine.textContent = `Sound: ${m === "sleepToken" ? "Sleep Token" : m}.`;
  }

  soundCrackle.addEventListener("click", () => applySound("crackle"));
  soundSleepToken.addEventListener("click", () => applySound("sleepToken"));
  soundSilence.addEventListener("click", () => applySound("silence"));

  // --- Sun manifest (because browsers can’t list folder contents)
  async function loadSunManifest() {
    try {
      const res = await fetch("./sun-manifest.json", { cache: "no-store" });
      if (!res.ok) throw new Error("manifest missing");
      const manifest = await res.json();
      const images = Array.isArray(manifest.images) ? manifest.images : [];
      renderSun(images);
    } catch (err) {
      console.error("Failed to load sun manifest:", err);
      renderSun([]);
    }
  }

  function renderSun(images) {
    sunGrid.innerHTML = "";
    if (images.length === 0) {
      const div = document.createElement("div");
      div.style.color = "rgba(255,255,255,0.60)";
      div.style.fontSize = "13px";
      div.textContent = "No sun yet. Drop one when it finds you.";
      sunGrid.appendChild(div);
      return;
    }
    images.slice(0, 9).forEach((file) => {
      const img = document.createElement("img");
      img.src = `./sun/${file}`;
      img.alt = "Slice of Sun";
      img.addEventListener("click", () => openLightbox(img.src, "Slice of Sun"));
      sunGrid.appendChild(img);
    });
  }

  // --- Lightbox
  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxText.textContent = caption || "Slice of Sun";
    lightbox.classList.remove("hidden");
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.classList.contains("hidden")) closeLightbox();
  });
  if (lightbox && lightboxImg && lightboxClose && lightboxText) {
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.classList.contains("hidden")) closeLightbox();
  });
}

  // --- Storage helpers
  function save(key, val) {
    try { localStorage.setItem(key, val); } catch {}
  }
  function load(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  // --- Starfield (slow drift)
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d", { alpha: true });

  let w = 0, h = 0, dpr = 1;
  let stars = [];

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.floor((w * h) / 18000);
    stars = Array.from({ length: Math.max(60, Math.min(160, count)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.2,
      a: Math.random() * 0.55 + 0.15,
      s: Math.random() * 0.18 + 0.04, // speed
      tw: Math.random() * 0.02 + 0.005 // twinkle
    }));
  }

  function tick(t) {
    ctx.clearRect(0, 0, w, h);

    // subtle nebula haze
    const grad = ctx.createRadialGradient(w * 0.28, h * 0.18, 0, w * 0.28, h * 0.18, Math.max(w, h));
    grad.addColorStop(0, "rgba(255,184,90,0.05)");
    grad.addColorStop(0.45, "rgba(220,60,80,0.03)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // stars
    for (const s of stars) {
      s.y += s.s;
      if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
      const tw = Math.sin((t || 0) * 0.001 + s.x * 0.01) * 0.12;
      const alpha = Math.max(0, Math.min(1, s.a + tw));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();
