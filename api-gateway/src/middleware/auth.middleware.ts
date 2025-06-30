import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware: RequestHandler = (req, res, next): void => {
  const noAuthRoutes = ['/login', '/register', '/refresh-token'];

  if (noAuthRoutes.includes(req.path)) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'access_secret'
    );
    (req as any).user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};
