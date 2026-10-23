const conversions = new Map([
  ['kg', { unit: 'g', factor: 1000 }],
  ['g', { unit: 'g', factor: 1 }],
  ['L', { unit: 'ml', factor: 1000 }],
  ['ml', { unit: 'ml', factor: 1 }],
  ['whole', { unit: 'whole', factor: 1 }],
  ['tsp', { unit: 'tsp', factor: 1 }],
  ['tbsp', { unit: 'tbsp', factor: 1 }]
]);

// No DOM or storage access: identical inputs always produce identical totals.
// Serving overrides prepare the calculation for Phase 5 without adding controls.
export function aggregateIngredients(recipes, catalogue, selectedIds, servingsById = {}) {
  const recipesById = new Map(recipes.map(recipe => [recipe.id, recipe]));
  const totals = new Map();
  for (const recipeId of new Set(selectedIds)) {
    const recipe = recipesById.get(recipeId);
    if (!recipe) throw new Error(`Unknown recipe "${recipeId}"`);
    const servings = Object.hasOwn(servingsById, recipeId) ? servingsById[recipeId] : recipe.servings;
    if (!Number.isFinite(servings) || servings <= 0 || !Number.isFinite(recipe.servings) || recipe.servings <= 0) {
      throw new Error(`Invalid servings for "${recipeId}"`);
    }
    for (const item of recipe.ingredients) {
      if (!Object.hasOwn(catalogue, item.id)) throw new Error(`Unknown ingredient "${item.id}" in "${recipeId}"`);
      const ingredient = catalogue[item.id];
      const conversion = conversions.get(item.unit);
      if (!conversion) throw new Error(`Unsupported unit "${item.unit}"`);
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) throw new Error(`Invalid quantity for "${item.id}"`);
      const quantity = item.quantity * conversion.factor * (servings / recipe.servings);
      // Units remain part of the key: grams, whole items, and spoon measures stay separate.
      const key = JSON.stringify([item.id, conversion.unit]);
      const previous = totals.get(key);
      const total = (previous?.quantity ?? 0) + quantity;
      if (!Number.isFinite(total) || total <= 0) throw new Error(`Invalid total for "${item.id}"`);
      totals.set(key, {
        id: item.id, name: ingredient.name, category: ingredient.category,
        unit: conversion.unit, quantity: total
      });
    }
  }
  return [...totals.values()].sort((a, b) => a.name.localeCompare(b.name, 'en') || a.unit.localeCompare(b.unit, 'en'));
}

export function formatQuantity(quantity, unit) {
  const number = new Intl.NumberFormat('en-IE', { maximumSignificantDigits: 6 }).format(quantity);
  return unit === 'whole' ? number : `${number} ${unit}`;
}
