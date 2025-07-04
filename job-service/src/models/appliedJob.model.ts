import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const appliedJobSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    job_seeker_id: { type: String, required: true },
    job_id: { type: String, required: true },
    resume_url: String,
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true, _id: false }
);

export const AppliedJob = mongoose.model('AppliedJob', appliedJobSchema);
