/**
 * Backend response shape:
 *
 * Success:
 * {
 *   success: true,
 *   data: { ... }
 * }
 *
 * Error:
 * {
 *   success: false,
 *   code: 'RECIPE_NOT_FOUND',
 *   message: 'Recipe not found'
 * }
 *
 * The HTTP status code is in the response status.
 * This module maps backend error codes to user-friendly Spanish text.
 */

const ERROR_MESSAGES = {
  // Generic errors
  INTERNAL_ERROR: 'Ocurrió un error inesperado. Intenta de nuevo más tarde.',
  VALIDATION_ERROR: 'Algunos datos no son válidos. Revisa la información enviada.',
  DUPLICATE_ENTRY: 'El registro ya existe.',
  ROUTE_NOT_FOUND: 'La ruta solicitada no existe.',

  // Auth errors
  MISSING_USER_OR_EMAIL: 'Debes enviar un usuario o correo.',
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos.',
  MISSING_REQUIRED_FIELDS: 'Faltan campos obligatorios.',
  USERNAME_TAKEN: 'El nombre de usuario ya está registrado.',
  EMAIL_TAKEN: 'El correo ya está registrado.',
  MISSING_USERNAME: 'Debes enviar un nombre de usuario.',
  MISSING_JWT_SECRET: 'Error de configuración del servidor.',
  MISSING_TOKEN: 'No se proporcionó un token de sesión.',
  INVALID_TOKEN: 'Tu sesión es inválida. Inicia sesión de nuevo.',
  TOKEN_EXPIRED: 'Tu sesión ha expirado. Inicia sesión de nuevo.',

  // User errors
  USER_NOT_FOUND: 'Usuario no encontrado.',
  MISSING_NEW_PASSWORD: 'El nuevo password no puede estar vacío.',
  PASSWORD_MISMATCH: 'La confirmación del password no coincide.',
  INVALID_CURRENT_PASSWORD: 'El password actual es incorrecto.',

  // Recipe errors
  INVALID_RECIPE_DATA: 'Datos de receta inválidos.',
  INVALID_INGREDIENT_QUANTITY: 'Cantidad de ingrediente inválida.',
  RECIPE_NOT_FOUND: 'La receta no existe.',
  INVALID_RECIPE_TYPE: 'El tipo de receta no es válido para esta operación.',

  // Meal plan errors
  MISSING_MEAL_PLAN_DAYS: 'Debes enviar el plan semanal en days.',
  INVALID_PAGE: 'El número de página debe ser mayor o igual a 1.',
  INVALID_MEAL_PLAN_DAYS: 'Debes enviar 7 días para guardar la semana.',
  INVALID_DATE: 'Se encontró una fecha inválida en el plan semanal.',
  MISSING_USER_ID: 'Debes enviar un userId válido.',
};

/**
 * Returns a user-friendly Spanish message for a backend error code.
 * Falls back to the backend message if the code is not mapped.
 * @param {string} code - Backend error code.
 * @param {string} [backendMessage] - Backend error message fallback.
 * @returns {string} User-friendly message in Spanish.
 */
export function getErrorMessage(code, backendMessage) {
  if (code == null) {
    return ERROR_MESSAGES.INTERNAL_ERROR;
  }

  return ERROR_MESSAGES[code] || backendMessage || ERROR_MESSAGES.INTERNAL_ERROR;
}

/**
 * Parses a backend error response and returns a user-friendly message.
 * @param {object} errorData - Parsed JSON error body from the backend.
 * @returns {string} User-friendly message in Spanish.
 */
export function getErrorMessageFromResponse(errorData) {
  if (!errorData || typeof errorData !== 'object') {
    return ERROR_MESSAGES.INTERNAL_ERROR;
  }

  // New standardized shape
  if (errorData.success === false) {
    return getErrorMessage(errorData.code, errorData.message);
  }

  // Legacy flat shape: { error: 'message' }
  if (typeof errorData.error === 'string') {
    return getErrorMessage(errorData.error);
  }

  return ERROR_MESSAGES.INTERNAL_ERROR;
}

/**
 * Parses a successful backend response and returns its data.
 * Throws if the response is not successful.
 * @param {Response} response - The fetch Response object.
 * @returns {Promise<any>} The response data.
 */
export async function parseSuccess(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const message = getErrorMessageFromResponse(data);
    throw new Error(message);
  }

  return data.data;
}

/**
 * Handles a non-ok fetch response by parsing the error body and throwing
 * an Error with a user-friendly message.
 * @param {Response} response - The fetch Response object.
 * @param {string} fallbackMessage - Fallback message if parsing fails.
 * @param {object} [parsedErrorData] - Optional already-parsed error body.
 * @returns {Promise<never>} Always rejects.
 */
export async function handleApiError(response, fallbackMessage, parsedErrorData) {
  const errorData = parsedErrorData !== undefined
    ? parsedErrorData
    : await response.json().catch(() => ({}));
  const message = getErrorMessageFromResponse(errorData) || fallbackMessage;
  throw new Error(message);
}

export default getErrorMessage;
