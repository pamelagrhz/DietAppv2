import pool from '../db.js';
import { comparePassword, hashPassword } from './auth.services.js';

export const getUserByUsername = async (username) => {
  const normalizedUsername = String(username || '').trim();
  if (!normalizedUsername) {
    throw new Error('Debes enviar un username valido.');
  }

  const [rows] = await pool.query(
    `
      SELECT id, username, name, age, genre, mail, score
      FROM users
      WHERE username = ?
      LIMIT 1
    `,
    [normalizedUsername]
  );

  const user = rows[0];

  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  const [recipesRows] = await pool.query(
    `
      SELECT nombre
      FROM recipes
      WHERE user_id = ?
      ORDER BY nombre ASC
    `,
    [user.id]
  );

  return {
    username: user.username,
    name: user.name,
    age: user.age,
    genre: user.genre,
    mail: user.mail,
    recipes: recipesRows.map((recipe) => recipe.nombre),
    recipeLength: recipesRows.length,
    // recipetypes
    score: typeof user.score === 'number' ? user.score : Number(user.score ?? 4.5),
  };
};

export const changeUserPassword = async ({ username, currentPassword, newPassword, confirmPassword }) => {
  const normalizedUsername = String(username || '').trim();
  if (!normalizedUsername) {
    throw new Error('Debes enviar un username valido.');
  }

  const current = String(currentPassword || '');
  const nextPassword = String(newPassword || '');
  const confirmation = String(confirmPassword || '');

  if (!nextPassword) {
    throw new Error('El nuevo password no puede estar vacio.');
  }

  if (nextPassword !== confirmation) {
    throw new Error('La confirmacion del password no coincide.');
  }

  const [rows] = await pool.query(
    `
      SELECT id, password_hash
      FROM users
      WHERE username = ?
      LIMIT 1
    `,
    [normalizedUsername]
  );

  const user = rows[0];

  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  const storedPassword = String(user.password_hash || '');
  const isCurrentPasswordValid = await comparePassword(current, storedPassword);

  if (!isCurrentPasswordValid) {
    throw new Error('El password actual es incorrecto.');
  }

  const newPasswordHash = await hashPassword(nextPassword);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, user.id]);

  return { message: 'Password actualizado correctamente.' };
};
