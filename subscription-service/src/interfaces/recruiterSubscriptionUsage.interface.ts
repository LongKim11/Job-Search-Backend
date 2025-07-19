import { Document } from 'mongoose';

export interface RecruiterSubscriptionUsageDocument extends Document {
  _id: string;
  recruiter_subscription_id: string;
  post_id: string;
  post_type: string;
  used_at: Date;
  status: 'approved' | 'pending' | 'rejected';
}
