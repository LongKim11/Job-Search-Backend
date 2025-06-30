import express, { Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { authMiddleware } from './middleware/auth.middleware';
import dotenv from 'dotenv';
import { requireRole } from './middleware/role.middleware';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

app.use(
  '/api/auth',
  authMiddleware,
  requireRole('admin'),
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        const user = (req as any).user;
        if (user) {
          proxyReq.setHeader('X-User-Id', user.accountId || '');
          proxyReq.setHeader('X-User-Role', user.role || '');
        }
      },
    },
  })
);

app.listen(PORT, () => {
  console.log(`✅ API Gateway listening at http://localhost:${PORT}`);
});
