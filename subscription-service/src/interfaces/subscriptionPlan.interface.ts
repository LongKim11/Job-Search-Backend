import { Document } from 'mongoose';

export interface SubscriptionPlanDocument extends Document {
  _id: string;
  name: string;
  price: number;
  normal_post_limit: number;
  featured_post_limit: number;
  duration: string;
  isActive: boolean;
}
