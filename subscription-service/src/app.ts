import express from 'express';
import dotenv from 'dotenv';
import subscriptionPlan from './routes/subscriptionPlan.route';
import recruiterSubscription from './routes/recruiterSubscription.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/subscription-plan', subscriptionPlan);
app.use('/api/recruiter-subscription', recruiterSubscription);

export default app;
