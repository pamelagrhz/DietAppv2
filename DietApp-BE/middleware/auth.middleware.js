import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new AppError(500, 'MISSING_JWT_SECRET', 'JWT_SECRET is not defined in environment variables');
}

//Authenticate the token sent in the request headers
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError(401, 'MISSING_TOKEN', 'Token not provided'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const isExpired = error.name === 'TokenExpiredError';
    const code = isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    const message = isExpired ? 'Token expired' : 'Invalid token';
    return next(new AppError(401, code, message));
  }
}
