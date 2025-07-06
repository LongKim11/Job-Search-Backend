import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.route';
import { initRedisSubscriber } from './subscribers/redis.subscriber';

dotenv.config();

const app = express();

// Initialize Redis subscriber for handling payment expiration
initRedisSubscriber();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(paymentRoutes);

export default app;
