import { STORAGE_KEY, readSelection, writeSelection } from './storage.js';
import { toggleRecipe, renderMealPlan } from './meal-plan.js';

const catalogue = document.querySelector('[data-recipe-ids]');
const validIds = JSON.parse(catalogue.textContent);
let { ids, warning } = readSelection(validIds);
const status = document.querySelector('[data-plan-status]');
const notice = document.querySelector('[data-storage-warning]');

function render() {
  document.querySelectorAll('[data-plan-count]').forEach(count => {
    count.textContent = `(${ids.length})`;
    count.hidden = false;
  });
  document.querySelectorAll('[data-select-recipe]').forEach(button => {
    const selected = ids.includes(button.dataset.selectRecipe);
    button.hidden = false;
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = selected ? 'Remove from meal plan' : 'Add to meal plan';
    button.setAttribute('aria-label', `${button.textContent}: ${button.dataset.recipeTitle}`);
    button.closest('.recipe-card')?.classList.toggle('is-selected', selected);
  });
  notice.textContent = warning;
  notice.hidden = !warning;
  renderMealPlan(ids);
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-select-recipe]');
  if (!button) return;
  const id = button.dataset.selectRecipe;
  const removing = ids.includes(id);
  ids = toggleRecipe(ids, id, validIds);
  warning = writeSelection(ids);
  render();
  status.textContent = `${button.dataset.recipeTitle} ${removing ? 'removed from' : 'added to'} your meal plan. ${ids.length} selected.`;
  if (removing && button.closest('[data-meal-plan]')) {
    const next = document.querySelector('[data-plan-recipe]:not([hidden]) [data-select-recipe]');
    (next ?? document.querySelector('[data-plan-empty] a')).focus();
  }
});

window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  ({ ids, warning } = readSelection(validIds));
  render();
  status.textContent = `Meal plan updated from another tab. ${ids.length} selected.`;
});

render();
