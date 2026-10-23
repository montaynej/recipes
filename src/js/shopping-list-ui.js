import { aggregateIngredients, formatQuantity } from './shopping-list.js';

export function mountShoppingList(root) {
  const groups = root.querySelector('[data-shopping-groups]');
  const status = root.querySelector('[data-shopping-status]');
  const empty = root.querySelector('[data-shopping-empty]');
  const retry = root.querySelector('[data-shopping-retry]');
  let data;
  let loading = false;
  let latestIds = [];

  async function load() {
    loading = true;
    root.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading your shopping list…';
    retry.hidden = true;
    try {
      const response = await fetch(root.dataset.shoppingUrl);
      if (!response.ok) throw new Error(`Shopping data request failed: ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.recipes) || !payload.ingredients || typeof payload.ingredients !== 'object') {
        throw new Error('Invalid shopping data');
      }
      data = payload;
      render(latestIds);
    } catch {
      groups.replaceChildren();
      if (latestIds.length) {
        status.textContent = 'Your shopping list could not be loaded. Please try again.';
        retry.hidden = false;
      }
    } finally {
      loading = false;
      root.setAttribute('aria-busy', 'false');
    }
  }

  function render(ids) {
    latestIds = [...ids];
    groups.replaceChildren();
    empty.hidden = ids.length > 0;
    retry.hidden = true;
    if (!ids.length) {
      status.textContent = 'Your shopping list is empty.';
      return;
    }
    if (!data) {
      if (!loading) void load();
      else status.textContent = 'Loading your shopping list…';
      return;
    }
    try {
      const items = aggregateIngredients(data.recipes, data.ingredients, ids);
      const categories = [...new Set(items.map(item => item.category))];
      categories.sort((a, b) => {
        const rank = category => ({ fresh: 0, stock: 1 })[category] ?? 2;
        return rank(a) - rank(b) || a.localeCompare(b);
      });
      for (const category of categories) {
        const section = document.createElement('section');
        section.className = 'shopping-group';
        const heading = document.createElement('h2');
        heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        const list = document.createElement('ul');
        list.className = 'ingredient-list';
        for (const item of items.filter(item => item.category === category)) {
          const row = document.createElement('li');
          const quantity = document.createElement('span');
          quantity.className = 'ingredient-quantity';
          quantity.textContent = formatQuantity(item.quantity, item.unit);
          row.append(quantity, document.createTextNode(` ${item.name}`));
          list.append(row);
        }
        section.append(heading, list);
        groups.append(section);
      }
      status.textContent = `${items.length} ingredient ${items.length === 1 ? 'entry' : 'entries'} for ${ids.length} ${ids.length === 1 ? 'recipe' : 'recipes'}. Quantities use each recipe’s original servings.`;
    } catch {
      groups.replaceChildren();
      status.textContent = 'Your shopping list could not be calculated. Reload the page to get the latest recipe data.';
      data = undefined;
      retry.hidden = false;
    }
  }

  retry.addEventListener('click', () => { data = undefined; render(latestIds); });
  return render;
}
