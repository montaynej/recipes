import { readFile } from 'node:fs/promises';
import { validateRecipes } from './lib/validate-recipes.js';

export default function (eleventyConfig) {
  // Only validated slug IDs are embedded globally; full recipe data stays out.
  eleventyConfig.addFilter('recipeIdsJson', recipes => JSON.stringify(recipes.map(({ id }) => id)));
  eleventyConfig.addFilter('shoppingDataJson', (recipes, ingredients) => JSON.stringify({
    recipes: recipes.map(({ id, servings, ingredients }) => ({ id, servings, ingredients })),
    ingredients
  }));
  eleventyConfig.on('eleventy.before', async () => {
    const [recipes, ingredients] = await Promise.all(
      ['recipes', 'ingredients'].map(async name => JSON.parse(await readFile(new URL(`./src/_data/${name}.json`, import.meta.url), 'utf8')))
    );
    validateRecipes(recipes, ingredients);
  });
  eleventyConfig.addFilter('quantity', value => new Intl.NumberFormat('en-IE', { maximumFractionDigits: 2 }).format(value));
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
