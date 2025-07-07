import mongoose, { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CityDocument } from '../interfaces/city.interface';

const DistrictSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const CitySchema = new Schema<CityDocument>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  districts: { type: [DistrictSchema], default: [] },
});

export default model<CityDocument>('City', CitySchema);
