import { Document } from 'mongoose';

export interface RecruiterSubscriptionDocument extends Document {
  _id: string;
  subscription_plan_id: string;
  recruiter_profile_id: string;
  price: number;
  status: 'active' | 'expired' | 'canceled';
  created_at: Date;
  expired_at: Date;
  canceled_at?: Date;
  payment_id?: string;
}
