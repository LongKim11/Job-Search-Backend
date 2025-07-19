import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { JobDocument } from '../interfaces/job.interface';
import { SalaryType } from '../enums/salaryType.enum';
import { WorkplaceType } from '../enums/workplaceType.enum';
import { JobStatus } from '../enums/jobStatus.enum';

const JobSchema = new Schema<JobDocument>(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    company_name: { type: String, required: true },
    salary: { type: String },
    salary_type: {
      type: String,
      enum: [SalaryType.GROSS, SalaryType.NET, SalaryType.NEGOTIABLE],
      default: SalaryType.GROSS,
    },
    full_address: { type: String },
    location_name: { type: String },
    workplace_type: {
      type: String,
      enum: [WorkplaceType.ONSITE, WorkplaceType.REMOTE, WorkplaceType.HYBRID],
      default: WorkplaceType.ONSITE,
    },
    description: { type: String },
    requirements: [String],
    benefits: [String],
    skills: [String],
    priority: { type: String },
    tags: [String],
    views_count: { type: Number, default: 0 },
    applications_count: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [JobStatus.PENDING, JobStatus.APPROVED, JobStatus.REJECTED],
      default: JobStatus.PENDING,
    },
    slug: { type: String, unique: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    expired_at: { type: Date },
    deadline: { type: Date },
    contact_email: { type: String },
    recruiter_profile_id: { type: String, required: true },
  },
  { timestamps: false, _id: false }
);

export default model<JobDocument>('Job', JobSchema);
