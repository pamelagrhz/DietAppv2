/**
 * Valida que el email tenga formato básico: texto@texto.dominio
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email || '').trim());
}

/**
 * Valida que el nombre/apellido contenga solo letras, acentos, ñ, ü y espacios.
 * No permite números ni caracteres especiales.
 */
export function isValidName(name) {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  const trimmed = String(name || '').trim();
  return trimmed.length > 0 && nameRegex.test(trimmed);
}

/**
 * Valida que la contraseña cumpla con:
 * - Mínimo 10 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial común
 *
 * Devuelve un objeto con el resultado y los requisitos cumplidos.
 */
export function validatePassword(password) {
  const value = String(password || '');

  const checks = {
    minLength: value.length >= 10,
    hasUppercase: /[A-Z]/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasNumber: /[0-9]/.test(value),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
  };

  const isValid = Object.values(checks).every(Boolean);

  return {
    isValid,
    checks,
  };
}

/**
 * Mensajes de error para cada requisito de la contraseña.
 */
export const passwordRequirements = [
  { key: 'minLength', label: 'Mínimo 10 caracteres' },
  { key: 'hasUppercase', label: 'Al menos una mayúscula' },
  { key: 'hasLowercase', label: 'Al menos una minúscula' },
  { key: 'hasNumber', label: 'Al menos un número' },
  { key: 'hasSpecialChar', label: 'Al menos un carácter especial (!@#$%^&*...)' },
];
