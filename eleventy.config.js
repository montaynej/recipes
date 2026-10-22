export default function (eleventyConfig) {
  // Polling is more reliable for source files in a OneDrive-synchronised folder.
  eleventyConfig.setChokidarConfig({ usePolling: true, interval: 500 });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
