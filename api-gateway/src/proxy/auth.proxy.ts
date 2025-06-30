import { createProxyMiddleware } from 'http-proxy-middleware';

export const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  changeOrigin: true,
});
