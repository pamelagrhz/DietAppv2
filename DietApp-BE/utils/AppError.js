/**
 * Custom application error.
 * Used to standardize error responses from the backend.
 *
 * The response shape sent to the client is:
 * {
 *   success: false,
 *   code: 'RECIPE_NOT_FOUND',
 *   message: 'Recipe not found'
 * }
 *
 * The HTTP status code is sent as the response status.
 * The frontend owns the localized, friendly messages.
 *
 * @property {number} statusCode HTTP status code (e.g. 400, 401, 404, 500)
 * @property {string} code Short error identifier (e.g. 'RECIPE_NOT_FOUND')
 * @property {string} message English error description (e.g. 'Recipe not found')
 */
class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
