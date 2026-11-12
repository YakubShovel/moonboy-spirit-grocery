const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");

  // Breaks: true turns single newlines into <br> — essential for poetry
  const md = markdownIt({ html: true, breaks: true, linkify: false });
  eleventyConfig.setLibrary("md", md);

  // The shelf: everything in the store, hand-ordered by `order` (lowest = front of the store)
  eleventyConfig.addCollection("shelf", function (api) {
    return api
      .getFilteredByGlob("src/shelf/*.md")
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
  });

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
