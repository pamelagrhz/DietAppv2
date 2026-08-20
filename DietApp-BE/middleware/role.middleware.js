import AppError from '../utils/AppError.js';

const ROLE_HIERARCHY = {
  user: 1,
  colaborador: 2,
  admin: 3,
};

/**
 * Middleware factory that restricts access to users with the required role
 * or higher in the hierarchy.
 *
 * Usage:
 *   router.get('/', authenticateToken, requireRole('colaborador'), handler);
 *   router.delete('/:id', authenticateToken, requireRole('admin'), handler);
 */
export function requireRole(minimumRole) {
  const requiredLevel = ROLE_HIERARCHY[minimumRole];

  if (!requiredLevel) {
    throw new Error(`Unknown role: ${minimumRole}`);
  }

  return (req, res, next) => {
    const userRole = req.user?.role;
    const userLevel = ROLE_HIERARCHY[userRole];

    if (!userRole || !userLevel || userLevel < requiredLevel) {
      return next(
        new AppError(
          403,
          'FORBIDDEN',
          `This action requires the '${minimumRole}' role or higher`
        )
      );
    }

    next();
  };
}

/**
 * Middleware that ensures the authenticated user can only access their own
 * resource, unless they are an admin.
 *
 * The parameter name to compare against req.user.username can be configured.
 */
export function requireOwnerOrAdmin(paramName = 'username') {
  return (req, res, next) => {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required'));
    }

    const requestedUsername = String(req.params[paramName] || '').trim();

    if (
      authenticatedUser.role === 'admin' ||
      authenticatedUser.username === requestedUsername
    ) {
      return next();
    }

    next(
      new AppError(
        403,
        'FORBIDDEN',
        'You can only access your own resources'
      )
    );
  };
}
