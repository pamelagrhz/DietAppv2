const API_URL = 'http://localhost:3000/auth';

/**
 * Realiza el login de un usuario.
 * Envía el usuario/correo y la contraseña al backend.
 * Si es exitoso, guarda el token en localStorage.
 */
export async function login(user, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

/**
 * Registra un nuevo usuario.
 * Envía los datos del registro al backend.
 */
export async function register(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al registrarse');
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

/**
 * Cierra la sesión del usuario.
 * Elimina el token guardado.
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
 * Devuelve true si está disponible, false si ya existe.
 */
export async function checkUsername(username) {
  const response = await fetch(
    `${API_URL}/check-username?username=${encodeURIComponent(username)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al verificar el usuario');
  }

  return data.available === true;
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
