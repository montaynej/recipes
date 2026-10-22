const units = new Set(['g', 'kg', 'ml', 'L', 'whole', 'tsp', 'tbsp']);

export function validateRecipes(recipes, ingredients) {
  const fail = message => { throw new Error(`Recipe data: ${message}`); };
  if (!ingredients || typeof ingredients !== 'object' || Array.isArray(ingredients)) fail('ingredient catalogue must be an object');
  for (const [id, ingredient] of Object.entries(ingredients)) {
    if (!ingredient || !ingredient.name?.trim() || !ingredient.category?.trim() || !units.has(ingredient.defaultUnit)) fail(`invalid catalogue entry "${id}"`);
  }
  if (!Array.isArray(recipes) || !recipes.length) fail('recipes must be a non-empty array');
  const ids = new Set();
  for (const recipe of recipes) {
    if (!recipe || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe.id)) fail('recipe IDs must be URL-safe slugs');
    if (ids.has(recipe.id)) fail(`duplicate recipe ID "${recipe.id}"`);
    ids.add(recipe.id);
    for (const field of ['title', 'description', 'category', 'image', 'imageAlt']) {
      if (typeof recipe[field] !== 'string' || !recipe[field].trim()) fail(`${recipe.id}: missing ${field}`);
    }
    if (!Number.isInteger(recipe.servings) || recipe.servings < 1) fail(`${recipe.id}: invalid servings`);
    for (const field of ['prepTime', 'cookTime']) {
      if (!Number.isFinite(recipe[field]) || recipe[field] < 0) fail(`${recipe.id}: invalid ${field}`);
    }
    if (!Array.isArray(recipe.ingredients) || !recipe.ingredients.length) fail(`${recipe.id}: ingredients required`);
    for (const item of recipe.ingredients) {
      if (!item || !Object.hasOwn(ingredients, item.id)) fail(`${recipe.id}: unknown ingredient "${item?.id}"`);
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) fail(`${recipe.id}: invalid quantity for ${item.id}`);
      if (!units.has(item.unit)) fail(`${recipe.id}: unsupported unit "${item.unit}"`);
    }
    if (!Array.isArray(recipe.instructions) || !recipe.instructions.length || recipe.instructions.some(step => typeof step !== 'string' || !step.trim())) fail(`${recipe.id}: instructions required`);
  }
}
