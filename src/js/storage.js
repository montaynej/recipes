export const STORAGE_KEY = 'everyday-table:meal-plan:v1';

export function normaliseSelection(value, validIds) {
  if (!Array.isArray(value)) return [];
  const valid = new Set(validIds);
  return [...new Set(value.filter(id => typeof id === 'string' && valid.has(id)))];
}

export function readSelection(validIds) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { ids: [], warning: '' };
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.recipeIds)) throw new Error('Invalid saved plan');
    return { ids: normaliseSelection(data.recipeIds, validIds), warning: '' };
  } catch {
    return { ids: [], warning: 'Your saved plan could not be read. You can start a new plan here.' };
  }
}

export function writeSelection(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, recipeIds: ids }));
    return '';
  } catch {
    return 'Your plan works for this visit, but could not be saved on this device.';
  }
}
