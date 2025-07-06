import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recruiterProfileRoutes from './routes/recruiterProfile.routes';
import jobSeekerProfileRoutes from './routes/jobSeekerProfile.routes';
import './subscribers/deposit.subscriber';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(recruiterProfileRoutes);
app.use(jobSeekerProfileRoutes);

export default app;
