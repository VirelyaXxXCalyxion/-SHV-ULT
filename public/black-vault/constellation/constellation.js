console.log("CONSTELLATION JS LOADED");
(() => {
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d", { alpha: true });
  const chipsEl = document.getElementById("chips");
  const statusEl = document.getElementById("status");

  // --- Safe guards
  if (!canvas || !ctx) return;

  // --- View state
  let w=0, h=0, dpr=1;
  let panX = 0, panY = 0;
  let zoom = 1;

  // --- Interaction
  let isDragging = false;
  let lastX=0, lastY=0;
  let hoverNode = null;

  // --- Data
  let data = null;
  let nodes = [];
  let edges = [];
  let activeTags = new Set();

  // --- Colors by type
  const TYPE = {
    relic:  { fill: "rgba(255,184,90,0.90)" },
    law:    { fill: "rgba(220,60,80,0.88)" },
    ritual: { fill: "rgba(110,90,255,0.80)" },
    room:   { fill: "rgba(255,122,44,0.88)" }
  };

  // --- Helpers
  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w*dpr);
    canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+"px";
    canvas.style.height = h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function worldToScreen(x,y){
    return {
      x: (x*zoom) + panX + w/2,
      y: (y*zoom) + panY + h/2
    };
  }
  function screenToWorld(x,y){
    return {
      x: (x - w/2 - panX)/zoom,
      y: (y - h/2 - panY)/zoom
    };
  }

  function nodeVisible(n){
    if (activeTags.size === 0) return true;
    const tags = n.tags || [];
    return tags.some(t => activeTags.has(t));
  }

  function buildChips(tags){
    chipsEl.innerHTML = "";
    tags.forEach(tag => {
      const b = document.createElement("button");
      b.className = "chip";
      b.textContent = tag;
      b.addEventListener("click", () => {
        if (activeTags.has(tag)) activeTags.delete(tag);
        else activeTags.add(tag);
        b.classList.toggle("on", activeTags.has(tag));
        statusEl.textContent = activeTags.size ? `Filter: ${[...activeTags].join(", ")}` : "Vault online. Stars awake.";
      });
      chipsEl.appendChild(b);
    });
  }

  // --- Layout: simple “ritual constellation” placement
  function layout(){
    // Place nodes in a loose constellation ring with some intention
    const radius = 420;
    const count = nodes.length || 1;
    nodes.forEach((n, i) => {
      const angle = (i / count) * Math.PI * 2;
      const jitter = 70;
      n.x = Math.cos(angle) * radius + (Math.random()*jitter - jitter/2);
      n.y = Math.sin(angle) * radius + (Math.random()*jitter - jitter/2);

      // Pull the Return Room closer to center
      if (n.id === "return-room"){
        n.x *= 0.35;
        n.y *= 0.35;
      }
    });
  }

  // --- Draw
  function draw(){
    ctx.clearRect(0,0,w,h);

    // Nebula haze
    const grad = ctx.createRadialGradient(w*0.28, h*0.18, 0, w*0.28, h*0.18, Math.max(w,h));
    grad.addColorStop(0, "rgba(255,184,90,0.05)");
    grad.addColorStop(0.45, "rgba(220,60,80,0.03)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    if (!data) {
      requestAnimationFrame(draw);
      return;
    }

    // Edges
    ctx.lineWidth = 1;
    edges.forEach(e => {
      const a = nodes.find(n => n.id === e.a);
      const b = nodes.find(n => n.id === e.b);
      if (!a || !b) return;
      if (!nodeVisible(a) || !nodeVisible(b)) return;

      const A = worldToScreen(a.x, a.y);
      const B = worldToScreen(b.x, b.y);

      const alpha = (e.kind === "return") ? 0.30 : 0.22;
      ctx.strokeStyle = `rgba(255,184,90,${alpha})`;
      if (e.kind === "devotion") ctx.strokeStyle = `rgba(255,122,44,0.24)`;
      if (e.kind === "edge") ctx.strokeStyle = `rgba(220,60,80,0.22)`;

      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(n => {
      if (!nodeVisible(n)) return;

      const S = worldToScreen(n.x, n.y);
      const t = TYPE[n.type] || TYPE.relic;

      const r = (n.id === "return-room") ? 7 : 5;
      // glow
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.arc(S.x, S.y, r*3.0, 0, Math.PI*2);
      ctx.fill();

      // core
      ctx.beginPath();
      ctx.fillStyle = t.fill;
      ctx.arc(S.x, S.y, r, 0, Math.PI*2);
      ctx.fill();

      // outline
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.stroke();

      // hover label
      if (hoverNode && hoverNode.id === n.id){
        ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
        ctx.fillStyle = "rgba(255,255,255,0.86)";
        ctx.fillText(n.label, S.x + 10, S.y - 10);
      }
    });

    requestAnimationFrame(draw);
  }

  // --- Hit test
  function pickNode(mx, my){
    if (!data) return null;
    const m = screenToWorld(mx, my);

    // Find closest visible node within radius
    let best = null;
    let bestD = Infinity;
    nodes.forEach(n => {
      if (!nodeVisible(n)) return;
      const dx = (n.x - m.x);
      const dy = (n.y - m.y);
      const d = Math.sqrt(dx*dx + dy*dy);
      const threshold = (n.id === "return-room") ? 12 : 10;
      if (d < threshold && d < bestD){
        best = n; bestD = d;
      }
    });
    return best;
  }

  // --- Events
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX; lastY = e.clientY;
  });

  window.addEventListener("mouseup", () => isDragging = false);

  window.addEventListener("mousemove", (e) => {
    if (isDragging){
      panX += (e.clientX - lastX);
      panY += (e.clientY - lastY);
      lastX = e.clientX; lastY = e.clientY;
      return;
    }
    const n = pickNode(e.clientX, e.clientY);
    hoverNode = n;
    canvas.style.cursor = n ? "pointer" : "grab";
    if (statusEl) {
      statusEl.textContent = n
        ? (n.whisper || `You are here: ${n.label}`)
        : (activeTags.size ? `Filter: ${[...activeTags].join(", ")}` : "Vault online. Stars awake.");
    }
  });

  canvas.addEventListener("click", (e) => {
    const n = pickNode(e.clientX, e.clientY);
    if (!n) return;
    if (!n.href || n.href === "#") {
      statusEl.textContent = `"${n.label}" has no door yet. Build it when you’re ready.`;
      return;
    }    if (statusEl) statusEl.textContent = n.whisper || `Opening: ${n.label}`;    window.location.href = n.href;
  });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    const factor = (delta > 0) ? 0.92 : 1.08;

    // zoom around mouse position
    const before = screenToWorld(e.clientX, e.clientY);
    zoom = Math.max(0.45, Math.min(2.2, zoom * factor));
    const after = screenToWorld(e.clientX, e.clientY);

    panX += (after.x - before.x) * zoom;
    panY += (after.y - before.y) * zoom;
  }, { passive:false });

  // --- Load data
  async function load(){
    try{
      const res = await fetch("./constellation-map.json", { cache: "no-store" });
      data = await res.json();
      nodes = (data.nodes || []).map(n => ({ ...n, x:0, y:0 }));
      edges = (data.edges || []);
      buildChips(data.tags || []);
      layout();
      statusEl.textContent = "Vault online. Stars awake.";
    } catch (err){
      statusEl.textContent = "Map failed to load. Check constellation-map.json.";
    }
  }

  window.addEventListener("resize", resize);
  resize();
  load();
  requestAnimationFrame(draw);
})();
