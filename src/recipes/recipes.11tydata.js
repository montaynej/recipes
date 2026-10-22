export default {
  // Return raw text so the layout escapes it once, including ampersands.
  eleventyComputed: {
    title: data => data.recipe.title,
    description: data => data.recipe.description
  }
};
