import express from 'express';
import dotenv from 'dotenv';
import subscriptionPlan from './routes/subscriptionPlan.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/subscription-plan', subscriptionPlan);

export default app;
