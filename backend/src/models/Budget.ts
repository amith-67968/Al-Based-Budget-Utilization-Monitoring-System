import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBudget extends Document {
  financialYear: string;
  departmentId: Types.ObjectId;
  projectName: string;
  allocatedAmount: number;
  totalSpent: number;
  allocationDate: Date;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'closed' | 'exceeded';
  createdBy: Types.ObjectId;
  remainingBudget: number;
  utilizationPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    financialYear: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    projectName: { type: String, required: true },
    allocatedAmount: { type: Number, required: true, min: 0 },
    totalSpent: { type: Number, default: 0 },
    allocationDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'active', 'closed', 'exceeded'], default: 'draft' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

budgetSchema.virtual('remainingBudget').get(function (this: any) {
  return this.allocatedAmount - this.totalSpent;
});

budgetSchema.virtual('utilizationPercentage').get(function (this: any) {
  if (this.allocatedAmount === 0) return 0;
  return (this.totalSpent / this.allocatedAmount) * 100;
});

budgetSchema.index({ financialYear: 1 });
budgetSchema.index({ departmentId: 1 });
budgetSchema.index({ status: 1 });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
