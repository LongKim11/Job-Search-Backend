import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recruiterProfileRoutes from './routes/recruiterProfile.routes';
import jobSeekerProfileRoutes from './routes/jobSeekerProfile.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recruiter-profiles', recruiterProfileRoutes);
app.use('/api/job-seeker-profiles', jobSeekerProfileRoutes);

export default app;
