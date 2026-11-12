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

// Packed shelves: each card takes exactly the height it needs.
const shelf = document.querySelector(".shelf");
const ROW = 4;
function pack() {
  if (!shelf) return;
  const single = getComputedStyle(shelf).gridTemplateColumns.split(" ").length === 1;
  shelf.classList.toggle("masonry", !single);
  shelf.querySelectorAll(".item").forEach((item) => {
    item.style.gridRowEnd = single ? "" : "span 1";
    if (single || item.hidden) return;
    const h = item.scrollHeight + 2 + 24; // content + border + margin-bottom
    item.style.gridRowEnd = "span " + Math.ceil(h / ROW);
  });
}
pack();
window.addEventListener("load", pack);
window.addEventListener("resize", pack);
shelf?.querySelectorAll("img, iframe").forEach((el) => el.addEventListener("load", pack));
document.querySelectorAll(".aisles button").forEach((b) => b.addEventListener("click", () => requestAnimationFrame(pack)));
