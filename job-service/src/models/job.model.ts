import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const jobSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    salary: String,
    full_address: String,
    description: String,
    priority: String,
    created_at: { type: Date, default: Date.now },
    expired_at: Date,
    updated_at: Date,
    recruiter_profile_id: { type: String, required: true },
    job_category_id: { type: String, required: true },
    job_experience_id: { type: String, required: true },
    location_id: { type: String, required: true },
    job_type_id: { type: String, required: true },
    job_level_id: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);

export const Job = mongoose.model('Job', jobSchema);
