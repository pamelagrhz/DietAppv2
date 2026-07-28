import { parseSuccess } from '../../../utils/errorHandler.js';

export const getProfileByUsername = async (username) => {
  const response = await fetch(`/api/users/${encodeURIComponent(username)}`);
  return parseSuccess(response);
};

export const updateProfilePassword = async ({ username, currentPassword, newPassword, confirmPassword }) => {
  const response = await fetch(`/api/users/${encodeURIComponent(username)}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmPassword,
    }),
  });

  return parseSuccess(response);
};
