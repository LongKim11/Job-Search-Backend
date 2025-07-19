import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { JobCategoryDocument } from '../interfaces/jobCategory.interface';

const JobCategorySchema = new Schema<JobCategoryDocument>(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: false, _id: false }
);

export default model<JobCategoryDocument>('JobCategory', JobCategorySchema);
