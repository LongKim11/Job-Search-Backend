import { Document } from 'mongoose';

export interface JobTypeDocument extends Document{
  _id: string;
  title: string;
  isActive: boolean;
}
