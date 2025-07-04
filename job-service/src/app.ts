import express from 'express';
import dotenv from 'dotenv';
import jobRoutes from './routes/job.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/jobs', jobRoutes);

export default app;
