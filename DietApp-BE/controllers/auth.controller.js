import AppError from '../utils/AppError.js';
import sendSuccess from '../utils/response.js';
import {
  authenticateUser,
  createUser,
  findRefreshTokenByHash,
  generateTokenPair,
  hashRefreshToken,
  isUsernameAvailable,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
  rotateRefreshToken,
  verifyRefreshToken,
} from '../services/auth.services.js';

// Login a user
export const login = async (req, res, next) => {
  try {
    const { user = '', password = '' } = req.body ?? {};

    const authenticatedUser = await authenticateUser(user, password);
    const tokens = await generateTokenPair(authenticatedUser);

    sendSuccess(res, {
      message: 'Login successful',
      user: authenticatedUser,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Register a new user
export const register = async (req, res, next) => {
  try {
    const {
      username = '',
      name = '',
      birthYear = '',
      genre = '',
      mail = '',
      password = '',
    } = req.body ?? {};

    const newUser = await createUser({
      username,
      name,
      birthYear,
      genre,
      mail,
      password,
    });

    const tokens = await generateTokenPair(newUser);

    sendSuccess(res, {
      message: 'User registered successfully',
      user: newUser,
      ...tokens,
    }, 201);
  } catch (error) {
    next(error);
  }
};

// Refresh access token using a refresh token
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken = '' } = req.body ?? {};

    if (!refreshToken) {
      throw new AppError(401, 'MISSING_REFRESH_TOKEN', 'Refresh token is required');
    }

    const storedToken = await verifyRefreshToken(refreshToken);
    const tokens = await rotateRefreshToken(storedToken);

    sendSuccess(res, {
      message: 'Token refreshed successfully',
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Logout a user
export const logout = async (req, res, next) => {
  try {
    const { refreshToken = '' } = req.body ?? {};

    // Si se envía un refresh token, revocamos solo ese.
    // Si no, al menos no fallamos y dejamos que el frontend descarte sus tokens.
    if (refreshToken) {
      const tokenHash = hashRefreshToken(refreshToken);
      const storedToken = await findRefreshTokenByHash(tokenHash);
      if (storedToken && !storedToken.revoked_at) {
        await revokeRefreshToken(storedToken.id);
      }
    }

    sendSuccess(res, { message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

//Check if a username is available
export const checkUsername = async (req, res, next) => {
  try {
    const { username = '' } = req.query;

    const available = await isUsernameAvailable(username);

    sendSuccess(res, {
      available,
      username: String(username).trim(),
    });
  } catch (error) {
    next(error);
  }
};
