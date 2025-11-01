document.addEventListener("DOMContentLoaded", () => {
  const gate = document.querySelector(".gate-link");

  gate.addEventListener("click", (e) => {
    e.preventDefault();

    const veil = document.createElement("div");
    veil.classList.add("ember-fade");
    document.body.appendChild(veil);

    setTimeout(() => {
      window.location = gate.href;
    }, 800);
  });
});

