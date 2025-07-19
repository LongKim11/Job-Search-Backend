import { Document } from 'mongoose';
import { SalaryType } from '../enums/salaryType.enum';
import { WorkplaceType } from '../enums/workplaceType.enum';
import { JobStatus } from '../enums/jobStatus.enum';

export interface JobDocument extends Document {
  _id: string;
  title: string;
  company_name: string;
  salary: string;
  salary_type: SalaryType.GROSS | SalaryType.NET | SalaryType.NEGOTIABLE;
  full_address: string;
  location_name: string;
  workplace_type:
    | WorkplaceType.ONSITE
    | WorkplaceType.REMOTE
    | WorkplaceType.HYBRID;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  priority: string;
  tags: string[];
  views_count: number;
  applications_count: number;
  status: JobStatus.PENDING | JobStatus.APPROVED | JobStatus.REJECTED;
  slug: string;
  created_at: Date;
  updated_at: Date;
  expired_at: Date;
  deadline: Date;
  contact_email: string;
  recruiter_profile_id: string;
}
