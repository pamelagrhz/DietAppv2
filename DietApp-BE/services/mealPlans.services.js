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

  const resolvedUserId = await resolveUserId(userId);

  const [recipesRows] = await pool.query('SELECT nombre FROM recipes');
  const validRecipeNames = new Set(recipesRows.map((recipe) => recipe?.nombre).filter(Boolean));

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

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  return getMealPlanWeek({ userId, page: normalizedPage });
}
