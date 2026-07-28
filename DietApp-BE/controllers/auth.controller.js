import AppError from '../utils/AppError.js';
import sendSuccess from '../utils/response.js';
import {
  authenticateUser,
  createUser,
  generateToken,
  isUsernameAvailable,
} from '../services/auth.services.js';

// Login a user
export const login = async (req, res, next) => {
  try {
    const { user = '', password = '' } = req.body ?? {};

    const authenticatedUser = await authenticateUser(user, password);
    const token = generateToken(authenticatedUser);

    sendSuccess(res, {
      message: 'Login successful',
      token,
      user: authenticatedUser,
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

    const token = generateToken(newUser);

    sendSuccess(res, {
      message: 'User registered successfully',
      token,
      user: newUser,
    }, 201);
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
