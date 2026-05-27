import { changeUserPassword, getUserByUsername } from '../services/users.services.js';

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    res.json(user);
  } catch (error) {
    const status = error.message === 'Usuario no encontrado.' ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword = '', newPassword = '', confirmPassword = '' } = req.body ?? {};

    const response = await changeUserPassword({
      username,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    res.status(200).json(response);
  } catch (error) {
    const status = error.message === 'Usuario no encontrado.' ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};
