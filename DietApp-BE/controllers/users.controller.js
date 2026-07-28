import AppError from '../utils/AppError.js';
import sendSuccess from '../utils/response.js';
import { changeUserPassword, getUserByUsername } from '../services/users.services.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { currentPassword = '', newPassword = '', confirmPassword = '' } = req.body ?? {};

    const response = await changeUserPassword({
      username,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};
