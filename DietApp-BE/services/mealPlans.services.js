import pool from '../db.js';

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
const WEEK_SECTION_TYPES = ['sopa', 'complemento', 'otro'];

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

const toDateKey = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return normalizeDateKey(value);
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

const resolveUserId = async (userRef) => {
  const normalizedUserRef = String(userRef || '').trim();
  if (!normalizedUserRef) {
    throw new Error('Debes enviar un userId valido.');
  }

  const asNumber = Number(normalizedUserRef);
  if (!Number.isNaN(asNumber)) {
    const [numericRows] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [asNumber]);
    if (numericRows.length > 0) {
      return numericRows[0].id;
    }
  }

  const [usernameRows] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [normalizedUserRef]);
  if (usernameRows.length === 0) {
    throw new Error('Usuario no encontrado.');
  }

  return usernameRows[0].id;
};

export async function searchRecipesByName(search = '') {
  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch.length < 3) {
    return [];
  }

  const [rows] = await pool.query(
    `
      SELECT nombre
      FROM recipes
      WHERE LOWER(nombre) LIKE CONCAT('%', ?, '%')
      ORDER BY nombre ASC
      LIMIT 25
    `,
    [normalizedSearch]
  );

  return rows.map((row) => row.nombre).filter((name) => typeof name === 'string');
}

export async function searchRecipesByNameAndType(search = '', recipeType = '') {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedType = String(recipeType || '').trim().toLowerCase();
  if (normalizedSearch.length < 3) {
    return [];
  }

  const hasType = WEEK_SECTION_TYPES.includes(normalizedType) || normalizedType === 'comida';

  const [rows] = await pool.query(
    `
      SELECT nombre
      FROM recipes
      WHERE LOWER(nombre) LIKE CONCAT('%', ?, '%')
        ${hasType ? 'AND recipe_type = ?' : ''}
      ORDER BY nombre ASC
      LIMIT 25
    `,
    hasType ? [normalizedSearch, normalizedType] : [normalizedSearch]
  );

  return rows.map((row) => row.nombre).filter((name) => typeof name === 'string');
}

export async function getMealPlanWeek({ userId = 'pamelagrhz', page = 1 }) {
  const normalizedPage = Number(page);
  if (Number.isNaN(normalizedPage) || normalizedPage < 1) {
    throw new Error('El parametro page debe ser un numero mayor o igual a 1.');
  }

  const resolvedUserId = await resolveUserId(userId);
  const [userEntries] = await pool.query(
    `
      SELECT date, recipe_name AS recipeName
      FROM meal_plan_entries
      WHERE user_id = ?
    `,
    [resolvedUserId]
  );
  const entriesMap = new Map(
    userEntries
      .map((entry) => [normalizeDateKey(entry.date), entry.recipeName])
      .filter(([dateKey]) => Boolean(dateKey))
  );

  const weekStart = getWeekStartByPage(normalizedPage);
  const weekDays = buildWeekDays(weekStart, entriesMap);
  const weekStartDate = toDateKey(weekDays[0]?.date);

  const [sectionRows] = await pool.query(
    `
      SELECT section_type AS sectionType, recipe_name AS recipeName
      FROM meal_plan_week_sections
      WHERE user_id = ? AND week_start = ?
      ORDER BY section_type ASC, recipe_name ASC
    `,
    [resolvedUserId, weekStartDate]
  );

  const weekSections = {
    sopa: [],
    complemento: [],
    otro: [],
  };

  sectionRows.forEach((row) => {
    const sectionType = String(row.sectionType || '').trim().toLowerCase();
    if (WEEK_SECTION_TYPES.includes(sectionType)) {
      weekSections[sectionType].push(row.recipeName);
    }
  });

  return {
    userId,
    page: normalizedPage,
    hasPrevious: normalizedPage > 1,
    hasNext: true,
    weekStart: weekDays[0].date,
    weekEnd: weekDays[6].date,
    days: weekDays,
    weekSections,
  };
}

export async function saveMealPlanWeek({ userId = 'pamelagrhz', page = 1, days, weekSections = {} }) {
  const normalizedPage = Number(page);
  if (Number.isNaN(normalizedPage) || normalizedPage < 1) {
    throw new Error('El parametro page debe ser un numero mayor o igual a 1.');
  }

  if (!Array.isArray(days) || days.length !== 7) {
    throw new Error('Debes enviar 7 dias para guardar la semana.');
  }

  const resolvedUserId = await resolveUserId(userId);

  const [recipesRows] = await pool.query('SELECT nombre, recipe_type AS recipeType FROM recipes');
  const recipesByName = new Map(
    recipesRows
      .filter((recipe) => Boolean(recipe?.nombre))
      .map((recipe) => [recipe.nombre, String(recipe.recipeType || '').trim().toLowerCase()])
  );

  const weekStart = getWeekStartByPage(normalizedPage);
  const weekStartDate = toDateKey(weekStart);

  const normalizedDays = days.map((entry, index) => {
    const fallbackDate = new Date(weekStart.getTime() + index * DAY_MS);
    const normalizedDate = normalizeDateKey(entry?.date || fallbackDate);
    const recipeName = typeof entry?.recipeName === 'string' ? entry.recipeName.trim() : '';

    if (!normalizedDate) {
      throw new Error('Se encontro una fecha invalida en el plan semanal.');
    }

    if (recipeName && !recipesByName.has(recipeName)) {
      throw new Error(`La receta "${recipeName}" no existe.`);
    }

    if (recipeName && recipesByName.get(recipeName) !== 'comida') {
      throw new Error(`La receta principal "${recipeName}" debe ser de tipo comida.`);
    }

    return {
      date: normalizedDate,
      recipeName,
    };
  });

  const normalizedWeekSections = {
    sopa: Array.isArray(weekSections?.sopa) ? weekSections.sopa : [],
    complemento: Array.isArray(weekSections?.complemento) ? weekSections.complemento : [],
    otro: Array.isArray(weekSections?.otro) ? weekSections.otro : [],
  };

  for (const sectionType of WEEK_SECTION_TYPES) {
    const normalizedNames = normalizedWeekSections[sectionType]
      .map((name) => (typeof name === 'string' ? name.trim() : ''))
      .filter(Boolean);

    const uniqueNames = [...new Set(normalizedNames)];

    uniqueNames.forEach((recipeName) => {
      if (!recipesByName.has(recipeName)) {
        throw new Error(`La receta "${recipeName}" no existe.`);
      }

      if (recipesByName.get(recipeName) !== sectionType) {
        throw new Error(`La receta "${recipeName}" debe ser de tipo ${sectionType}.`);
      }
    });

    normalizedWeekSections[sectionType] = uniqueNames;
  }

  const weekDates = normalizedDays.map((day) => day.date);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `
        DELETE FROM meal_plan_entries
        WHERE user_id = ?
          AND date IN (${weekDates.map(() => '?').join(',')})
      `,
      [resolvedUserId, ...weekDates]
    );

    for (const day of normalizedDays) {
      if (!day.recipeName) {
        continue;
      }

      await conn.query(
        `
          INSERT INTO meal_plan_entries (user_id, date, recipe_name, last_modified_date)
          VALUES (?, ?, ?, ?)
        `,
        [resolvedUserId, day.date, day.recipeName, timestamp]
      );
    }

    await conn.query(
      `
        DELETE FROM meal_plan_week_sections
        WHERE user_id = ? AND week_start = ?
      `,
      [resolvedUserId, weekStartDate]
    );

    for (const sectionType of WEEK_SECTION_TYPES) {
      for (const recipeName of normalizedWeekSections[sectionType]) {
        await conn.query(
          `
            INSERT INTO meal_plan_week_sections (user_id, week_start, section_type, recipe_name, last_modified_date)
            VALUES (?, ?, ?, ?, ?)
          `,
          [resolvedUserId, weekStartDate, sectionType, recipeName, timestamp]
        );
      }
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  return getMealPlanWeek({ userId, page: normalizedPage });
}
