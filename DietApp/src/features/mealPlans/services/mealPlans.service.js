import { parseSuccess } from '../../../utils/errorHandler.js';

export const getMealPlan = async ({ userId = 'pamelagrhz', page = 1 } = {}) => {
  const query = new URLSearchParams({ userId, page: String(page) });
  const response = await fetch(`/api/meal-plans?${query.toString()}`);
  console.log('Respuesta del servidor para getMealPlan:', response);

  return parseSuccess(response);
};

export const saveMealPlan = async ({ userId = 'pamelagrhz', page = 1, days, weekSections }) => {
  const response = await fetch('/api/meal-plans', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, page, days, weekSections }),
  });

  return parseSuccess(response);
};

export const searchMealPlanRecipes = async (query, type = '') => {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 3) {
    return [];
  }

  const searchParams = new URLSearchParams({ q: normalizedQuery });
  if (type.trim()) {
    searchParams.set('type', type.trim());
  }
  const response = await fetch(`/api/meal-plans/recipes/search?${searchParams.toString()}`);

  return parseSuccess(response);
};
