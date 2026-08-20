import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import pool from '../db.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

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
 * Devuelve el payload base para los tokens JWT.
 */
function getTokenPayload(user) {
  return {
    id: user.id,
    username: user.username,
    mail: user.mail,
    role: user.role,
  };
}

/**
 * Genera un access token JWT con los datos del usuario.
 */
export function generateAccessToken(user) {
  return jwt.sign(getTokenPayload(user), JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

/**
 * Genera un refresh token JWT.
 */
export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

/**
 * Genera un par de tokens (access + refresh) y persiste el refresh token.
 */
export async function generateTokenPair(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const tokenHash = hashRefreshToken(refreshToken);
  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await storeRefreshToken(user.id, tokenHash, expiresAt);

  return { accessToken, refreshToken, expiresAt };
}

/**
 * Hashea un refresh token usando SHA-256.
 */
export function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Guarda el hash de un refresh token en la base de datos.
 */
export async function storeRefreshToken(userId, tokenHash, expiresAt) {
  await pool.query(
    `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `,
    [userId, tokenHash, expiresAt]
  );
}

/**
 * Busca un refresh token por su hash.
 */
export async function findRefreshTokenByHash(tokenHash) {
  const [rows] = await pool.query(
    `
      SELECT id, user_id, token_hash, expires_at, used_at, revoked_at
      FROM refresh_tokens
      WHERE token_hash = ?
      LIMIT 1
    `,
    [tokenHash]
  );

  return rows[0] || null;
}

/**
 * Marca un refresh token como revocado.
 */
export async function revokeRefreshToken(tokenId) {
  await pool.query(
    'UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE id = ?',
    [tokenId]
  );
}

/**
 * Marca un refresh token como usado.
 */
export async function markRefreshTokenAsUsed(tokenId) {
  await pool.query(
    'UPDATE refresh_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?',
    [tokenId]
  );
}

/**
 * Revoca todos los refresh tokens activos de un usuario.
 */
export async function revokeAllUserRefreshTokens(userId) {
  await pool.query(
    `
      UPDATE refresh_tokens
      SET revoked_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND revoked_at IS NULL
    `,
    [userId]
  );
}

/**
 * Verifica un refresh token: firma, existencia en DB, expiración, revocación y uso previo.
 */
export async function verifyRefreshToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    const isExpired = error.name === 'TokenExpiredError';
    const code = isExpired ? 'REFRESH_TOKEN_EXPIRED' : 'INVALID_REFRESH_TOKEN';
    const message = isExpired ? 'Refresh token expired' : 'Invalid refresh token';
    throw new AppError(401, code, message);
  }

  if (!decoded || !decoded.id || decoded.type !== 'refresh') {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token payload');
  }

  const tokenHash = hashRefreshToken(token);
  const storedToken = await findRefreshTokenByHash(tokenHash);

  if (!storedToken) {
    throw new AppError(401, 'REFRESH_TOKEN_NOT_FOUND', 'Refresh token not recognized');
  }

  if (storedToken.revoked_at) {
    throw new AppError(401, 'REFRESH_TOKEN_REVOKED', 'Refresh token revoked');
  }

  if (storedToken.used_at) {
    // Si un token ya usado se reutiliza, consideramos posible robo y revocamos todos.
    await revokeAllUserRefreshTokens(storedToken.user_id);
    throw new AppError(401, 'REFRESH_TOKEN_REUSED', 'Refresh token reused. Please log in again.');
  }

  return storedToken;
}

/**
 * Rota un refresh token: marca el actual como usado y genera un par nuevo.
 */
export async function rotateRefreshToken(storedToken) {
  await markRefreshTokenAsUsed(storedToken.id);

  const [userRows] = await pool.query(
    'SELECT id, username, mail FROM users WHERE id = ? LIMIT 1',
    [storedToken.user_id]
  );

  const user = userRows[0];
  if (!user) {
    throw new AppError(401, 'USER_NOT_FOUND', 'User associated with refresh token not found');
  }

  return generateTokenPair(user);
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
      SELECT id, username, name, age, genre, mail, password_hash, role, score
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
    role: foundUser.role,
  };
}

/**
 * Crea un nuevo usuario en la base de datos.
 */
const ALLOWED_ROLES = new Set(['user', 'colaborador', 'admin']);

export async function createUser({ username, name, birthYear, genre, mail, password, role }) {
  const normalizedUsername = String(username || '').trim();
  const normalizedMail = String(mail || '').trim();
  const normalizedRole = ALLOWED_ROLES.has(role) ? role : 'user';

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
      INSERT INTO users (username, name, age, genre, mail, password_hash, role, score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [normalizedUsername, name, age, genre, normalizedMail, passwordHash, normalizedRole, 4.5]
  );

  return {
    id: result.insertId,
    username: normalizedUsername,
    name,
    age,
    genre,
    mail: normalizedMail,
    role: normalizedRole,
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
