import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const savedJobSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    job_seeker_profile_id: { type: String, required: true },
    job_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true, _id: false }
);

export const SavedJob = mongoose.model('SavedJob', savedJobSchema);
