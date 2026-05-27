import 'dotenv/config';
import fs from 'fs/promises';
import pool from '../db.js';

// Read json db files
const usersPath = new URL('../data/users.json', import.meta.url);
const recipesPath = new URL('../data/recipes.json', import.meta.url);
// Parse json data and validate structure
const usersJson = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
const recipesJson = JSON.parse(await fs.readFile(recipesPath, 'utf-8'));

const users = Array.isArray(usersJson.users) ? usersJson.users : [];
const recipes = Array.isArray(recipesJson.recetas) ? recipesJson.recetas : [];
// open a connection to the MySQL database and insert the data from the pool
const conn = await pool.getConnection();

try {
    // save the data in the MySQL database using transactions to ensure data integrity
  await conn.beginTransaction();
// Clean tables before inserting new data
  await conn.query('DELETE FROM meal_plan_entries');
  await conn.query('DELETE FROM recipe_ingredients');
  await conn.query('DELETE FROM recipes');
  await conn.query('DELETE FROM users');
// Insert users and recipes data into the MySQL database, linking recipes to users by username and ensuring that all data is properly formatted and validated before insertion
  for (const user of users) {
    await conn.query(
      `
        INSERT INTO users (username, name, age, genre, mail, password_hash, score)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.username,
        user.name,
        Number(user.age ?? 0),
        user.genre || null,
        user.mail,
        user.password || '',
        Number(user.score ?? 0),
      ]
    );
  }

  for (const recipe of recipes) {
    const username = String(recipe.userId || '').trim();
    const [rows] = await conn.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);

    if (rows.length === 0) {
      continue;
    }

    const creationDate = recipe.creationDate || new Date().toISOString();
    const lastModifiedDate = recipe.lastModifiedDate || creationDate;

    const [insertRecipe] = await conn.query(
      `
        INSERT INTO recipes (nombre, user_id, preparacion, score, porciones, creation_date, last_modified_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        recipe.nombre,
        rows[0].id,
        typeof recipe.preparacion === 'string'
          ? recipe.preparacion.trim()
          : Array.isArray(recipe.preparacion)
            ? recipe.preparacion.filter((step) => typeof step === 'string').join('\n').trim()
            : '',
        Number(recipe.score ?? 0),
        1,
        creationDate,
        lastModifiedDate,
      ]
    );

    const ingredients = Array.isArray(recipe.ingredientes) ? recipe.ingredientes : [];

    for (const ingredient of ingredients) {
      await conn.query(
        `
          INSERT INTO recipe_ingredients (recipe_id, ingrediente, cantidad, medida)
          VALUES (?, ?, ?, ?)
        `,
        [
          insertRecipe.insertId,
          String(ingredient.ingrediente || '').trim(),
          Number(ingredient.cantidad ?? 0),
          String(ingredient.medida || '').trim(),
        ]
      );
    }
  }
// Conform data integrity
  await conn.commit();
  console.log('Datos migrados de JSON a MySQL correctamente.');
} catch (error) {
    // if any error occurs, rollback the transaction.
  await conn.rollback();
  throw error;
} finally {
    // release the connection back to the pool
  conn.release();
  await pool.end();
}
