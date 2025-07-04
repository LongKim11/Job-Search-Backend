import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const jobPreferenceSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    description: String,
    job_seeker_id: { type: String, required: true },
    job_category_id: { type: String, required: true },
    job_experience_id: { type: String, required: true },
    location_id: { type: String, required: true },
    job_type_id: { type: String, required: true },
    job_level_id: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);

export const JobPreference = mongoose.model('JobPreference', jobPreferenceSchema);