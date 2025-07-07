import { Document } from 'mongoose';

export interface JobCategoryDocument extends Document {
    _id: string;
    title: string;
    isActive: boolean;
}
