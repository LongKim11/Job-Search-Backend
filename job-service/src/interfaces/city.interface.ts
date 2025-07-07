import { Document } from 'mongoose';
import { District } from './district.interface';

export interface CityDocument extends Document {
  _id: string;
  name: string;
  isActive: boolean;
  districts: District[];
}
