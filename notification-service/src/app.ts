import express from 'express';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.route';
import './subscribers/notification.subscriber';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

export default app;
