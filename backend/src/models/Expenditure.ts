import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IExpenditure extends Document {
  budgetId: Types.ObjectId;
  departmentId: Types.ObjectId;
  amountSpent: number;
  expenseCategory: 'salaries' | 'infrastructure' | 'equipment' | 'supplies' | 'travel' | 'maintenance' | 'consulting' | 'training' | 'utilities' | 'miscellaneous';
  date: Date;
  description: string;
  supportingDocumentReference?: string;
  recordedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenditureSchema = new Schema<IExpenditure>(
  {
    budgetId: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    amountSpent: { type: Number, required: true, min: 0.01 },
    expenseCategory: { 
      type: String, 
      required: true, 
      enum: ['salaries', 'infrastructure', 'equipment', 'supplies', 'travel', 'maintenance', 'consulting', 'training', 'utilities', 'miscellaneous'] 
    },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    supportingDocumentReference: { type: String },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

expenditureSchema.index({ budgetId: 1 });
expenditureSchema.index({ departmentId: 1 });
expenditureSchema.index({ date: 1 });
expenditureSchema.index({ expenseCategory: 1 });

export const Expenditure = mongoose.model<IExpenditure>('Expenditure', expenditureSchema);
