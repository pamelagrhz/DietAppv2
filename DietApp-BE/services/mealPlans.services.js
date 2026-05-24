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

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeDateKey = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
};

const getCurrentMonday = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + diff);
  return monday;
};

const getWeekStartByPage = (page) => {
  const monday = getCurrentMonday();
  const weekStart = new Date(monday);
  weekStart.setDate(monday.getDate() + (page - 1) * 7);
  return weekStart;
};

const buildWeekDays = (weekStart, entriesMap) => {
  const days = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(weekStart.getTime() + index * DAY_MS);
    const dateKey = normalizeDateKey(date);

    days.push({
      dayLabel: WEEK_DAYS[index],
      date: dateKey,
      recipeName: entriesMap.get(dateKey) || '',
    });
  }

  return days;
};

const ensureEntriesArray = (data) => {
  if (!Array.isArray(data.mealPlanEntries)) {
    data.mealPlanEntries = [];
  }
};

export async function searchRecipesByName(search = '') {
  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch.length < 3) {
    return [];
  }

  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
  const recipes = Array.isArray(data.recetas) ? data.recetas : [];

  return recipes
    .map((recipe) => recipe?.nombre)
    .filter((name) => typeof name === 'string')
    .filter((name) => name.toLowerCase().includes(normalizedSearch))
    .slice(0, 25);
}

export async function getMealPlanWeek({ userId = 'pamelagrhz', page = 1 }) {
  const normalizedPage = Number(page);
  if (Number.isNaN(normalizedPage) || normalizedPage < 1) {
    throw new Error('El parametro page debe ser un numero mayor o igual a 1.');
  }

  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
  const entries = Array.isArray(data.mealPlanEntries) ? data.mealPlanEntries : [];
  const userEntries = entries.filter((entry) => entry.userId === userId);
  const entriesMap = new Map(
    userEntries
      .map((entry) => [normalizeDateKey(entry.date), entry.recipeName])
      .filter(([dateKey]) => Boolean(dateKey))
  );

  const weekStart = getWeekStartByPage(normalizedPage);
  const weekDays = buildWeekDays(weekStart, entriesMap);

  return {
    userId,
    page: normalizedPage,
    hasPrevious: normalizedPage > 1,
    hasNext: true,
    weekStart: weekDays[0].date,
    weekEnd: weekDays[6].date,
    days: weekDays,
  };
}

export async function saveMealPlanWeek({ userId = 'pamelagrhz', page = 1, days }) {
  const normalizedPage = Number(page);
  if (Number.isNaN(normalizedPage) || normalizedPage < 1) {
    throw new Error('El parametro page debe ser un numero mayor o igual a 1.');
  }

  if (!Array.isArray(days) || days.length !== 7) {
    throw new Error('Debes enviar 7 dias para guardar la semana.');
  }

  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
  const recipes = Array.isArray(data.recetas) ? data.recetas : [];
  const validRecipeNames = new Set(recipes.map((recipe) => recipe?.nombre).filter(Boolean));

  ensureEntriesArray(data);

  const weekStart = getWeekStartByPage(normalizedPage);

  const normalizedDays = days.map((entry, index) => {
    const fallbackDate = new Date(weekStart.getTime() + index * DAY_MS);
    const normalizedDate = normalizeDateKey(entry?.date || fallbackDate);
    const recipeName = typeof entry?.recipeName === 'string' ? entry.recipeName.trim() : '';

    if (!normalizedDate) {
      throw new Error('Se encontro una fecha invalida en el plan semanal.');
    }

    if (recipeName && !validRecipeNames.has(recipeName)) {
      throw new Error(`La receta "${recipeName}" no existe.`);
    }

    return {
      date: normalizedDate,
      recipeName,
    };
  });

  const nextEntries = data.mealPlanEntries.filter((entry) => {
    if (entry.userId !== userId) {
      return true;
    }

    const dateKey = normalizeDateKey(entry.date);
    return !normalizedDays.some((day) => day.date === dateKey);
  });

  const timestamp = new Date().toISOString();
  normalizedDays.forEach((day) => {
    if (!day.recipeName) {
      return;
    }

    nextEntries.push({
      userId,
      date: day.date,
      recipeName: day.recipeName,
      lastModifiedDate: timestamp,
    });
  });

  data.mealPlanEntries = nextEntries;
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

  return getMealPlanWeek({ userId, page: normalizedPage });
}
