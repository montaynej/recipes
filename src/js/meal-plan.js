import { normaliseSelection } from './storage.js';

// Immutable selection changes keep state management independent of the DOM.
export function toggleRecipe(ids, id, validIds) {
  const next = ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id];
  return normaliseSelection(next, validIds);
}

export function renderMealPlan(ids) {
  const plan = document.querySelector('[data-meal-plan]');
  if (!plan) return;
  plan.hidden = false;
  plan.querySelectorAll('[data-plan-recipe]').forEach(card => {
    card.hidden = !ids.includes(card.dataset.planRecipe);
  });
  document.querySelector('[data-plan-empty]').hidden = ids.length > 0;
  document.querySelector('[data-plan-summary]').textContent = ids.length
    ? `${ids.length} ${ids.length === 1 ? 'recipe' : 'recipes'} ready to cook.`
    : 'Your plan is empty. Choose a recipe to get started.';
}
