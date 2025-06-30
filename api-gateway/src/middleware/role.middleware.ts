import { RequestHandler } from 'express';

// Check if user has a specific role
export const requireRole = (requiredRole: string): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized - No user data found',
      });
      return;
    }

    if (user.role !== requiredRole) {
      console.log(
        `[Role Check] Access denied. Required: ${requiredRole}, Actual: ${user.role}`
      );
      res.status(403).json({
        success: false,
        message: 'Forbidden - Insufficient permissions',
        requiredRole,
        yourRole: user.role,
      });
      return;
    }

    console.log(`[Role Check] Access granted for ${user.role}`);
    next();
  };
};

// Check if user has any of the specified roles
export const requireAnyRole = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!roles.includes(user.role)) {
      console.log(
        `[Role Check] Access denied. Required one of: ${roles.join(
          ', '
        )}, Actual: ${user.role}`
      );
      res.status(403).json({
        error: 'Forbidden',
        requiredRoles: roles,
        yourRole: user.role,
      });
      return;
    }

    console.log(`[Role Check] Access granted for ${user.role}`);
    next();
  };
};
