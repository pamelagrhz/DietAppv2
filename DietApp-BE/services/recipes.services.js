import pool from '../db.js';

const normalizePreparation = (value) => {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .filter((step) => typeof step === 'string')
      .join('\n')
      .trim();
  }

  return '';
};

const toDateOrNow = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const toMySqlDateTime = (value) => toDateOrNow(value).toISOString().slice(0, 19).replace('T', ' ');
const normalizeIngredientName = (value) => String(value || '').trim();

export const getAllRecipes = async () => {
  const [rows] = await pool.query(
    `
      SELECT
        r.id,
        r.nombre,
        u.username AS userId,
        r.creation_date AS creationDate,
        r.last_modified_date AS lastModifiedDate,
        r.preparacion,
        r.score,
        ri.cantidad,
        ri.medida,
        i.nombre AS ingrediente
      FROM recipes r
      INNER JOIN users u ON u.id = r.user_id
      LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
      LEFT JOIN ingredients i ON i.id = ri.ingredient_id
      ORDER BY r.id ASC, ri.id ASC
    `
  );

  const recipesMap = new Map();

  rows.forEach((row) => {
    if (!recipesMap.has(row.id)) {
      recipesMap.set(row.id, {
        nombre: row.nombre,
        userId: row.userId,
        creationDate: new Date(row.creationDate).toISOString(),
        lastModifiedDate: new Date(row.lastModifiedDate).toISOString(),
        score: Number(row.score),
        ingredientes: [],
        preparacion: normalizePreparation(row.preparacion),
      });
    }

    if (row.ingrediente) {
      recipesMap.get(row.id).ingredientes.push({
        cantidad: Number(row.cantidad),
        medida: row.medida,
        ingrediente: row.ingrediente,
      });
    }
  });

  return Array.from(recipesMap.values());
};

const resolveUserId = async (conn, userRef) => {
  const asNumber = Number(userRef);

  if (!Number.isNaN(asNumber)) {
    const [numericRows] = await conn.query('SELECT id FROM users WHERE id = ? LIMIT 1', [asNumber]);
    if (numericRows.length > 0) {
      return numericRows[0].id;
    }
  }

  const [usernameRows] = await conn.query('SELECT id FROM users WHERE username = ? LIMIT 1', [String(userRef)]);
  if (usernameRows.length === 0) {
    throw new Error('Usuario no encontrado para crear receta.');
  }

  return usernameRows[0].id;
};

export async function addRecipe(nuevaReceta) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const userId = await resolveUserId(conn, nuevaReceta.userId);
    const creationDateObject = toDateOrNow(nuevaReceta.creationDate);
    const lastModifiedDateObject = toDateOrNow(nuevaReceta.lastModifiedDate || creationDateObject);
    const creationDate = toMySqlDateTime(creationDateObject);
    const lastModifiedDate = toMySqlDateTime(lastModifiedDateObject);
    const porciones = Number(nuevaReceta.porciones ?? 1);
    const score = Number(nuevaReceta.score ?? 4.5);

    const [recipeInsertResult] = await conn.query(
      `
        INSERT INTO recipes (nombre, user_id, preparacion, score, porciones, creation_date, last_modified_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nuevaReceta.nombre,
        userId,
        normalizePreparation(nuevaReceta.preparacion),
        Number.isNaN(score) ? 4.5 : score,
        Number.isNaN(porciones) || porciones < 1 ? 1 : porciones,
        creationDate,
        lastModifiedDate,
      ]
    );

    const recipeId = recipeInsertResult.insertId;
    const ingredients = Array.isArray(nuevaReceta.ingredientes) ? nuevaReceta.ingredientes : [];

    for (const ingredient of ingredients) {
      const ingredientName = normalizeIngredientName(ingredient.ingrediente);

      if (!ingredientName) {
        continue;
      }

      await conn.query(
        `
          INSERT INTO ingredients (nombre)
          VALUES (?)
          ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
        `,
        [ingredientName]
      );

      const [ingredientIdRows] = await conn.query('SELECT LAST_INSERT_ID() AS id');
      const ingredientId = ingredientIdRows[0]?.id;

      await conn.query(
        `
          INSERT INTO recipe_ingredients (recipe_id, ingredient_id, cantidad, medida)
          VALUES (?, ?, ?, ?)
        `,
        [
          recipeId,
          ingredientId,
          Number(ingredient.cantidad),
          String(ingredient.medida || '').trim(),
        ]
      );
    }

    await conn.commit();

    const [userRows] = await conn.query('SELECT username FROM users WHERE id = ? LIMIT 1', [userId]);
    return {
      nombre: nuevaReceta.nombre,
      userId: userRows[0]?.username || String(nuevaReceta.userId),
      creationDate: creationDateObject.toISOString(),
      lastModifiedDate: lastModifiedDateObject.toISOString(),
      score: Number.isNaN(score) ? 4.5 : score,
      ingredientes: ingredients,
      preparacion: normalizePreparation(nuevaReceta.preparacion),
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}