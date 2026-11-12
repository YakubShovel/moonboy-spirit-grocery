const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");

  // Breaks: true turns single newlines into <br> — essential for poetry
  const md = markdownIt({ html: true, breaks: true, linkify: false });
  eleventyConfig.setLibrary("md", md);

  // The shelf: what's fresh, hand-ordered by `order` (lowest = front of the store).
  // Expired stock moves to the stockroom. Freshness is checked at build time,
  // so anything that expires leaves the shelf on the next deploy.
  const shelfLife = require("./src/_data/shelfLife.json");
  const DAY = 24 * 60 * 60 * 1000;
  const isExpired = (item) => {
    const now = Date.now();
    if (item.data.expires) return new Date(item.data.expires).getTime() < now;
    if (item.data.when) return new Date(item.data.when).getTime() + DAY < now;
    const life = shelfLife[item.data.aisle];
    if (life === null || life === undefined) return false;
    return item.date.getTime() + life * DAY < now;
  };
  const byOrder = (a, b) => (a.data.order ?? 999) - (b.data.order ?? 999);

  eleventyConfig.addCollection("shelf", (api) =>
    api.getFilteredByGlob("src/shelf/*.md").filter((i) => !isExpired(i)).sort(byOrder)
  );
  eleventyConfig.addCollection("stockroom", (api) =>
    api.getFilteredByGlob("src/shelf/*.md").filter(isExpired).sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("htmlDateString", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("readableDate", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("stockedDate", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
