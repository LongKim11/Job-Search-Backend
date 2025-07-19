import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionPlanDocument } from '../interfaces/subscriptionPlan.interface';

const SubscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    normal_post_limit: { type: Number, required: true },
    featured_post_limit: { type: Number, required: true },
    duration: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, _id: false }
);

export default model<SubscriptionPlanDocument>(
  'SubscriptionPlan',
  SubscriptionPlanSchema
);
