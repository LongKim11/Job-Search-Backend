import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { RecruiterSubscriptionDocument } from '../interfaces/recruiterSubscription.interface';

const RecruiterSubscriptionSchema = new Schema<RecruiterSubscriptionDocument>(
  {
    _id: { type: String, default: uuidv4 },
    subscription_plan_id: {
      type: String,
      ref: 'SubscriptionPlan',
      required: true,
    },
    recruiter_profile_id: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'canceled'],
      default: 'active',
    },
    created_at: { type: Date, default: Date.now },
    expired_at: { type: Date, required: true },
    canceled_at: { type: Date },
    payment_id: { type: String },
  },
  { timestamps: false, _id: false }
);

export default model<RecruiterSubscriptionDocument>(
  'RecruiterSubscription',
  RecruiterSubscriptionSchema
);
