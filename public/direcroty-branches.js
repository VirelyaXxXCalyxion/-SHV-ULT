<script>
document.addEventListener("ashvault:directoryReveal", () => {
  const container = document.getElementById("directory-branches");

  // Clear old branches
  container.innerHTML = "";

  const branches = [
    { direction: "north", label: "Origins", x: 256, y: 80 },
    { direction: "east",  label: "Relics",  x: 432, y: 256 },
    { direction: "south", label: "Labyrinth", x: 256, y: 432 },
    { direction: "west",  label: "Nemesis Vault", x: 80, y: 256 }
  ];

  branches.forEach(branch => {
    const line = document.createElement("div");
    line.classList.add("ash-branch", branch.direction);

    const node = document.createElement("div");
    node.classList.add("ash-node");
    node.textContent = branch.label;

    node.style.left = branch.x + "px";
    node.style.top = branch.y + "px";

    container.appendChild(line);
    container.appendChild(node);

    // Animate after rendering
    requestAnimationFrame(() => {
      line.classList.add("grow");
      node.classList.add("reveal");
    });
  });
});
</script>
