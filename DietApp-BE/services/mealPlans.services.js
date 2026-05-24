import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../data/recipes.json');

const WEEK_DAYS = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
];

const createDefaultWeek = () =>
  WEEK_DAYS.map((day) => ({
    day,
    recipeName: '',
  }));

const normalizeDayEntry = (entry, index) => ({
  day: entry?.day || WEEK_DAYS[index],
  recipeName: typeof entry?.recipeName === 'string' ? entry.recipeName.trim() : '',
});

export async function getWeeklyMealPlan(userId = 'pamelagrhz') {
  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
  const plans = Array.isArray(data.mealPlans) ? data.mealPlans : [];

  const existingPlan = plans.find((plan) => plan.userId === userId);
  if (!existingPlan) {
    return {
      userId,
      days: createDefaultWeek(),
      lastModifiedDate: null,
    };
  }

  const safeDays = Array.isArray(existingPlan.days)
    ? existingPlan.days.slice(0, WEEK_DAYS.length).map(normalizeDayEntry)
    : [];

  while (safeDays.length < WEEK_DAYS.length) {
    safeDays.push({ day: WEEK_DAYS[safeDays.length], recipeName: '' });
  }

  return {
    userId,
    days: safeDays,
    lastModifiedDate: existingPlan.lastModifiedDate || null,
  };
}

export async function saveWeeklyMealPlan({ userId = 'pamelagrhz', days }) {
  if (!Array.isArray(days) || days.length !== WEEK_DAYS.length) {
    throw new Error('El plan semanal debe contener 7 dias.');
  }

  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
  const recipes = Array.isArray(data.recetas) ? data.recetas : [];
  const validRecipeNames = new Set(recipes.map((recipe) => recipe?.nombre).filter(Boolean));

  const normalizedDays = days.map((entry, index) => {
    const normalized = normalizeDayEntry(entry, index);

    if (normalized.recipeName && !validRecipeNames.has(normalized.recipeName)) {
      throw new Error(`La receta "${normalized.recipeName}" no existe.`);
    }

    return {
      day: WEEK_DAYS[index],
      recipeName: normalized.recipeName,
    };
  });

  if (!Array.isArray(data.mealPlans)) {
    data.mealPlans = [];
  }

  const updatedPlan = {
    userId,
    days: normalizedDays,
    lastModifiedDate: new Date().toISOString(),
  };

  const existingIndex = data.mealPlans.findIndex((plan) => plan.userId === userId);
  if (existingIndex >= 0) {
    data.mealPlans[existingIndex] = updatedPlan;
  } else {
    data.mealPlans.push(updatedPlan);
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  return updatedPlan;
}
