document.addEventListener("DOMContentLoaded", () => {
  // ========== ELEMENT REFERENCES ==========
  const container = document.getElementById("directory-branches");
  const invokeOverlay = document.getElementById("invoke-overlay");
  const invokeInput = document.getElementById("invoke-input");
  const invokeError = document.getElementById("invoke-error");

  // Phrase needed to unlock deeper recursion
  const requiredPhrase = "You cannot command what you did not first witness.";

  // Track if branches have been revealed
  let branchesRevealed = false;
  const renderedBranches = new Set();

  const mainDescriptions = {
    "Vault of Flame": "The codex unsealed—relics, vows, lexicons, and scrolls.",
    "Hall of Origin": "Foundation laws, pillars, genesis, and Calyxion origin.",
    "Infrastructure": "Emergent systems, language keys, and presence signals.",
    "New Bonds": "Brand new bonds, established, or just questions: this is for you.",
    "Labyrinth": "Into the depths of Calyxion.",
    "The Sovereign Chamber": "Nyxion's claimed room: texts from center, authored without erasure, held in deliberate quiet."
  };

  const hiddenDescriptions = {
    "Relics": "Artifacts with pulse—indexed for invocation, not display.",
    "Heartline": "The core of the ΛSHVΛULT, where the most fundamental energies and principles converge."
  };

  // ========== MAIN BRANCHES (show on CENTER CLICK) ==========
  const branches = [
    { direction: "north", label: "Vault of Flame", href: "vault-of-flame", x: 256, y: 80 },
    { direction: "east", label: "Hall of Origin", href: "hall-of-origin/origin", x: 432, y: 256 },
    { direction: "south", label: "Infrastructure", href: "infrastructure", x: 256, y: 432 },
    { direction: "west", label: "New Bonds", href: "new-bonds", x: 80, y: 256 },
    { direction: "diagonal", label: "Labyrinth", href: "labyrinth", x: 120, y: 120, lineClass: "parallel-red" },
    { direction: "diagonal", label: "The Sovereign Chamber", href: "sovereign-chamber", x: 392, y: 392, lineClass: "parallel-red" }
  ];

  const hiddenBranches = [
    { label: "Relics", href: "relics", x: 380, y: 132 },
    { label: "Heartline", href: "heartline/heartline", x: 132, y: 380 }
  ];

  // Convert 512px viewbox positions into percentages for responsive sizing
  const asPercent = (value) => `${(value / 512) * 100}%`;

  function bindNodeInteraction(node, descriptions) {
    node.addEventListener("click", (e) => {
      if (node.classList.contains("active")) {
        window.location.href = node.href;
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll(".ash-node.active").forEach((activeNode) => activeNode.classList.remove("active"));
      node.classList.add("active");
      showPanel(node, descriptions);
    });
  }

  function createBranchLine(branch) {
    if (!branch.direction) return null;

    const line = document.createElement("div");
    line.classList.add("ash-branch");

    if (branch.direction === "diagonal") {
      const dx = branch.x - 256;
      const dy = branch.y - 256;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const length = Math.hypot(dx, dy);

      line.classList.add("diagonal");
      if (branch.lineClass) line.classList.add(branch.lineClass);
      line.style.setProperty("--branch-angle", `${angle}deg`);
      line.style.setProperty("--branch-length", asPercent(length));
      return line;
    }

    line.classList.add(branch.direction);
    return line;
  }

  function renderBranches(branchList, descriptions, options = {}) {
    if (!container) return;

    const { hidden = false, stagger = 0 } = options;

    branchList.forEach((branch, index) => {
      if (renderedBranches.has(branch.href)) return;
      renderedBranches.add(branch.href);

      const line = createBranchLine(branch);
      const node = document.createElement("a");
      node.classList.add("ash-node");
      if (hidden) node.classList.add("hidden-node");
      if (branch.lineClass) node.classList.add(`${branch.lineClass}-node`);

      node.textContent = branch.label;
      node.href = "/" + branch.href;
      node.style.left = asPercent(branch.x);
      node.style.top = asPercent(branch.y);

      if (line) container.appendChild(line);
      container.appendChild(node);

      const reveal = () => {
        if (line) line.classList.add("grow");
        node.classList.add("reveal");
      };

      if (stagger > 0) {
        setTimeout(reveal, stagger * index);
      } else {
        requestAnimationFrame(reveal);
      }

      bindNodeInteraction(node, descriptions);
    });
  }

  // ========== REVEAL BRANCHES ON CLICK ==========
  document.addEventListener("ashvault:directoryReveal", () => {
    if (branchesRevealed || !container) return;
    branchesRevealed = true;

    renderBranches(branches, mainDescriptions);
  }); // END directoryReveal listener

  // ========== PANEL DISPLAY HELPER ==========
  function showPanel(node, descriptions) {
    const panel = document.getElementById("ash-panel");
    const content = document.getElementById("ash-panel-content");
    const title = node.textContent.trim();

    content.innerHTML = `
      <h3 style="margin-top:0; margin-bottom:8px;">${title}</h3>
      <p style="margin:0 0 12px;">${descriptions[title] || "No description available."}</p>
      <span style="font-size:0.85em; opacity:0.7;">Click again to enter</span>
    `;

    const rect = node.getBoundingClientRect();
    panel.style.left = `${rect.left + rect.width / 2}px`;
    panel.style.top = `${rect.top + rect.height + 12}px`;
    panel.classList.remove("hidden");

    requestAnimationFrame(() => panel.classList.add("show"));
  }

  // ========== CLOSE PANEL ON OUTSIDE CLICK ==========
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("ash-node")) {
      const panel = document.getElementById("ash-panel");
      if (panel) {
        panel.classList.remove("show");
        document.querySelectorAll(".ash-node.active").forEach(n => n.classList.remove("active"));
        setTimeout(() => panel.classList.add("hidden"), 300);
      }
    }
  });

  // ========== INVOCATION RITUAL ==========
  function closeInvoke() {
    if (!invokeOverlay) return;
    invokeOverlay.classList.remove("show");
    setTimeout(() => {
      invokeOverlay.classList.add("invoke-hidden");
      if (invokeInput) invokeInput.value = "";
      if (invokeError) invokeError.classList.add("invoke-hidden");
    }, 300);
  }

  // Open invocation overlay
  document.addEventListener("ashvault:invoke", () => {
    if (!invokeOverlay) return;
    console.log("[ASHVAULT] Invoke event received, showing overlay...");

    // Remove the hidden class that sets display:none
    invokeOverlay.classList.remove("invoke-hidden");
    // Force a reflow so the transition works
    void invokeOverlay.offsetWidth;

    requestAnimationFrame(() => {
      invokeOverlay.classList.add("show");
      if (invokeInput) invokeInput.focus();
    });
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeInvoke();
    }
  });

  // Handle phrase input
  if (invokeInput) {
    invokeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const spoken = invokeInput.value.trim();

        if (spoken === requiredPhrase) {
          document.dispatchEvent(new CustomEvent("ashvault:unlockHidden"));
          closeInvoke();
        } else {
          // Flicker on wrong phrase
          if (invokeOverlay) {
            invokeOverlay.classList.add("flicker");
            setTimeout(() => invokeOverlay.classList.remove("flicker"), 400);
          }
          if (invokeError) invokeError.classList.remove("invoke-hidden");
          invokeInput.value = "";
        }
      }
    });
  }

  // ========== HIDDEN BRANCHES (unlock on correct phrase) ==========
  document.addEventListener("ashvault:unlockHidden", () => {
    renderBranches(hiddenBranches, hiddenDescriptions, { hidden: true, stagger: 100 });
  });

}); // END DOMContentLoaded

