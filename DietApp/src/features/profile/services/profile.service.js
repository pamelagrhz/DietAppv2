export const getProfileByUsername = async (username) => {
  const response = await fetch(`/api/users/${encodeURIComponent(username)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudo obtener el perfil.');
  }

  return response.json();
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudo actualizar el password.');
  }

  return response.json();
};
