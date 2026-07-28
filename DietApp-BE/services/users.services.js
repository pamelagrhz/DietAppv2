import AppError from '../utils/AppError.js';
import pool from '../db.js';
import { comparePassword, hashPassword } from './auth.services.js';

export const getUserByUsername = async (username) => {
  const normalizedUsername = String(username || '').trim();
  if (!normalizedUsername) {
    throw new AppError(400, 'MISSING_USERNAME', 'Username is required');
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
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
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
    score: typeof user.score === 'number' ? user.score : Number(user.score ?? 4.5),
  };
};

export const changeUserPassword = async ({ username, currentPassword, newPassword, confirmPassword }) => {
  const normalizedUsername = String(username || '').trim();
  if (!normalizedUsername) {
    throw new AppError(400, 'MISSING_USERNAME', 'Username is required');
  }

  const current = String(currentPassword || '');
  const nextPassword = String(newPassword || '');
  const confirmation = String(confirmPassword || '');

  if (!nextPassword) {
    throw new AppError(400, 'MISSING_NEW_PASSWORD', 'New password is required');
  }

  if (nextPassword !== confirmation) {
    throw new AppError(400, 'PASSWORD_MISMATCH', 'Password confirmation does not match');
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
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  }

  const storedPassword = String(user.password_hash || '');
  const isCurrentPasswordValid = await comparePassword(current, storedPassword);

  if (!isCurrentPasswordValid) {
    throw new AppError(401, 'INVALID_CURRENT_PASSWORD', 'Current password is incorrect');
  }

  const newPasswordHash = await hashPassword(nextPassword);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, user.id]);

  return { message: 'Password updated successfully' };
};
