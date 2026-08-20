import { handleApiError } from '../utils/errorHandler.js';

const API_URL = 'http://localhost:3000/auth';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Guarda los tokens y los datos básicos del usuario en localStorage.
 */
function setAuthData({ accessToken, refreshToken, user }) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

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

  setAuthData(data.data);
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

  setAuthData(data.data);
  return data.data;
}

/**
 * Obtiene el access token guardado.
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Obtiene el refresh token guardado.
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Refresca el access token usando el refresh token guardado.
 */
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(`${API_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    clearTokens();
    await handleApiError(response, 'Error al refrescar la sesión', data);
  }

  setTokens(data.data);
  return data.data;
}

/**
 * Limpia los tokens y datos de usuario guardados.
 */
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Cierra la sesión del usuario local y en el backend.
 */
export async function logout() {
  const refreshToken = getRefreshToken();

  clearTokens();

  if (!refreshToken) {
    return { message: 'Sesión cerrada' };
  }

  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      await handleApiError(response, 'Error al cerrar sesión', data);
    }

    return data.data;
  } catch {
    // Ignoramos errores de red; el frontend ya limpió sus tokens.
    return { message: 'Sesión cerrada' };
  }
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
 * Obtiene los datos básicos del usuario guardado.
 */
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Obtiene el rol del usuario guardado.
 */
export function getUserRole() {
  return getUser()?.role || null;
}

/**
 * Revisa si el usuario tiene al menos el rol requerido.
 * Jerarquía: user < colaborador < admin.
 */
export function hasRole(minimumRole) {
  const hierarchy = { user: 1, colaborador: 2, admin: 3 };
  const userLevel = hierarchy[getUserRole()];
  const requiredLevel = hierarchy[minimumRole];
  return !!userLevel && !!requiredLevel && userLevel >= requiredLevel;
}

/**
 * Revisa si hay un access token guardado.
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

/**
 * Configura los headers para peticiones autenticadas.
 */
export function getAuthHeaders() {
  const token = getAccessToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
