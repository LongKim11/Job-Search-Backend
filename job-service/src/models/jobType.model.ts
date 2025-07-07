import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { JobTypeDocument } from '../interfaces/jobType.interface';


const JobTypeSchema = new Schema<JobTypeDocument>(
    {
        _id: { type: String, default: uuidv4 },
        title: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: false, _id: false }
);

export default model<JobTypeDocument>('JobType', JobTypeSchema);
