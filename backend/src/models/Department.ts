import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description?: string;
  headUserId?: Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    headUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

departmentSchema.index({ name: 1 });
departmentSchema.index({ status: 1 });

export const Department = mongoose.model<IDepartment>('Department', departmentSchema);
