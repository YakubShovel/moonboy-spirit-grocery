// Aisle filter: click an aisle, the rest of the shelf steps back.
document.querySelectorAll(".aisles button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const aisle = btn.dataset.aisle;
    document.querySelectorAll(".aisles button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b === btn))
    );
    document.querySelectorAll(".shelf .item").forEach((item) => {
      item.hidden = aisle !== "all" && item.dataset.aisle !== aisle;
    });
  });
});
