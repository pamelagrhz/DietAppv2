import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import pool from '../db.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new AppError(500, 'MISSING_JWT_SECRET', 'JWT_SECRET is not defined in environment variables');
}

/**
 * Hashea una contraseña usando bcrypt.
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con un hash.
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Genera un token JWT con los datos del usuario.
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      mail: user.mail,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Busca un usuario por username o correo.
 * Incluye el password_hash para validar el login.
 */
export async function findUserByUsernameOrEmail(user) {
  const normalized = String(user || '').trim();
  if (!normalized) {
    throw new AppError(400, 'MISSING_USER_OR_EMAIL', 'User or email is required');
  }

  const [rows] = await pool.query(
    `
      SELECT id, username, name, age, genre, mail, password_hash, score
      FROM users
      WHERE username = ? OR mail = ?
      LIMIT 1
    `,
    [normalized, normalized]
  );

  return rows[0] || null;
}

/**
 * Valida las credenciales de un usuario.
 */
export async function authenticateUser(user, password) {
  const foundUser = await findUserByUsernameOrEmail(user);

  if (!foundUser) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
  }

  const isValid = await comparePassword(password, foundUser.password_hash);

  if (!isValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
  }

  return {
    id: foundUser.id,
    username: foundUser.username,
    name: foundUser.name,
    mail: foundUser.mail,
  };
}

/**
 * Crea un nuevo usuario en la base de datos.
 */
export async function createUser({ username, name, birthYear, genre, mail, password }) {
  const normalizedUsername = String(username || '').trim();
  const normalizedMail = String(mail || '').trim();

  if (!normalizedUsername || !name || !normalizedMail || !password) {
    throw new AppError(400, 'MISSING_REQUIRED_FIELDS', 'Required fields are missing');
  }

  const existingUser = await findUserByUsernameOrEmail(normalizedUsername);
  if (existingUser) {
    throw new AppError(409, 'USERNAME_TAKEN', 'Username is already registered');
  }

  const existingMail = await findUserByUsernameOrEmail(normalizedMail);
  if (existingMail) {
    throw new AppError(409, 'EMAIL_TAKEN', 'Email is already registered');
  }

  const passwordHash = await hashPassword(password);

  // Calculamos la edad a partir del año de nacimiento
  const currentYear = new Date().getFullYear();
  const age = currentYear - Number(birthYear);

  const [result] = await pool.query(
    `
      INSERT INTO users (username, name, age, genre, mail, password_hash, score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [normalizedUsername, name, age, genre, normalizedMail, passwordHash, 4.5]
  );

  return {
    id: result.insertId,
    username: normalizedUsername,
    name,
    age,
    genre,
    mail: normalizedMail,
  };
}

/**
 * Revisa si un username está disponible.
 */
export async function isUsernameAvailable(username) {
  const normalized = String(username || '').trim();
  if (!normalized) {
    throw new AppError(400, 'MISSING_USERNAME', 'Username is required');
  }

  const user = await findUserByUsernameOrEmail(normalized);
  return !user;
}
