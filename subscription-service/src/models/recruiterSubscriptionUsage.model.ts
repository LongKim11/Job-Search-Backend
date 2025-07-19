import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { RecruiterSubscriptionUsageDocument } from '../interfaces/recruiterSubscriptionUsage.interface';

const RecruiterSubscriptionUsageSchema =
  new Schema<RecruiterSubscriptionUsageDocument>({
    _id: { type: String, default: uuidv4 },
    recruiter_subscription_id: {
      type: String,
      ref: 'RecruiterSubscription',
      required: true,
    },
    post_id: { type: String, required: true },
    post_type: { type: String, required: true },
    used_at: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
  });

export default model<RecruiterSubscriptionUsageDocument>(
  'RecruiterSubscriptionUsage',
  RecruiterSubscriptionUsageSchema
);
