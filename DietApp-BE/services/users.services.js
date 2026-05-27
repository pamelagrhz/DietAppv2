import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../data/users.json');

const readUsersData = async () => {
  const rawData = await fs.readFile(DATA_PATH, 'utf-8');
  const parsedData = JSON.parse(rawData);

  if (!Array.isArray(parsedData.users)) {
    parsedData.users = [];
  }

  return parsedData;
};

const saveUsersData = async (data) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
};

export const getUserByUsername = async (username) => {
  const normalizedUsername = String(username || '').trim();
  if (!normalizedUsername) {
    throw new Error('Debes enviar un username valido.');
  }

  const data = await readUsersData();
  const user = data.users.find((item) => item.username === normalizedUsername);

  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  return {
    username: user.username,
    name: user.name,
    age: user.age,
    genre: user.genre,
    mail: user.mail,
    recipes: Array.isArray(user.recipes) ? user.recipes : [],
    score: typeof user.score === 'number' ? user.score : 4.5,
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

  const data = await readUsersData();
  const userIndex = data.users.findIndex((item) => item.username === normalizedUsername);

  if (userIndex < 0) {
    throw new Error('Usuario no encontrado.');
  }

  const storedPassword = String(data.users[userIndex].password || '');
  if (storedPassword !== current) {
    throw new Error('El password actual es incorrecto.');
  }

  data.users[userIndex].password = nextPassword;
  await saveUsersData(data);

  return { message: 'Password actualizado correctamente.' };
};
