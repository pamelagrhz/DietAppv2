import { handleApiError } from '../utils/errorHandler.js';

const API_URL = 'http://localhost:3000/auth';

/**
 * Realiza el login de un usuario.
 */
export async function login(user, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    await handleApiError(response, 'Error al iniciar sesión', data);
  }

  if (data.data.token) {
    localStorage.setItem('token', data.data.token);
  }

  return data.data;
}

/**
 * Registra un nuevo usuario.
 */
export async function register(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    await handleApiError(response, 'Error al registrarse', data);
  }

  if (data.data.token) {
    localStorage.setItem('token', data.data.token);
  }

  return data.data;
}

/**
 * Cierra la sesión del usuario.
 */
export function logout() {
  localStorage.removeItem('token');
}

/**
 * Obtiene el token guardado.
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Revisa si un nombre de usuario ya está registrado.
 */
export async function checkUsername(username) {
  const response = await fetch(
    `${API_URL}/check-username?username=${encodeURIComponent(username)}`
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    await handleApiError(response, 'Error al verificar el usuario', data);
  }

  return data.data.available === true;
}

/**
 * Revisa si hay un token guardado.
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Configura los headers para peticiones autenticadas.
 */
export function getAuthHeaders() {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
