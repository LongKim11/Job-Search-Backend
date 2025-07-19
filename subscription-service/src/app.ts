import express from 'express';
import dotenv from 'dotenv';
import subscriptionPlan from './routes/subscriptionPlan.route';
import recruiterSubscription from './routes/recruiterSubscription.route';
import recruiterSubscriptionUsage from './routes/recruiterSubscriptionUsage.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/subscription-plan', subscriptionPlan);
app.use('/api/recruiter-subscription', recruiterSubscription);
app.use('/api/recruiter-subscription-usage', recruiterSubscriptionUsage);

export default app;
