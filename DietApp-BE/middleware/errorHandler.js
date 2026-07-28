import AppError from '../utils/AppError.js';

/**
 * Centralized error handler middleware.
 * Converts any thrown error into the standardized response shape:
 *
 * {
 *   success: false,
 *   code: 'RECIPE_NOT_FOUND',
 *   message: 'Recipe not found'
 * }
 *
 * The HTTP status code is sent as the response status.
 * Friendly, localized text is resolved by the frontend.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Internal server error';

  // Handle known MySQL / database errors
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'Resource already exists';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token expired';
  }

  // Handle validation errors from Express / other libraries
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.message || 'Validation error';
  }

  const errorResponse = {
    success: false,
    code,
    message,
  };

  // Log unexpected errors for debugging
  if (statusCode >= 500) {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
