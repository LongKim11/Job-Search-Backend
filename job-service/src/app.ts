import express from 'express';
import dotenv from 'dotenv';
import jobRoutes from './routes/job.route';
import cityRoutes from './routes/city.route';
import jobCategoryRoutes from './routes/jobCategory.route';
import jobTypeRoutes from './routes/jobType.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/jobs', jobRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/job-categories', jobCategoryRoutes);
app.use('/api/job-types', jobTypeRoutes);

export default app;
