import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAlert extends Document {
  budgetId: Types.ObjectId;
  departmentId: Types.ObjectId;
  alertType: 'UNDER_UTILIZATION' | 'OVERSPENDING' | 'SPENDING_SPIKE' | 'THRESHOLD_BREACH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  triggeredValue: number;
  thresholdValue: number;
  status: 'OPEN' | 'REVIEWED' | 'RESOLVED';
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    budgetId: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    alertType: { type: String, enum: ['UNDER_UTILIZATION', 'OVERSPENDING', 'SPENDING_SPIKE', 'THRESHOLD_BREACH'], required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    message: { type: String, required: true },
    triggeredValue: { type: Number, required: true },
    thresholdValue: { type: Number, required: true },
    status: { type: String, enum: ['OPEN', 'REVIEWED', 'RESOLVED'], default: 'OPEN' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

alertSchema.virtual('timestamp').get(function (this: any) {
  return this.createdAt;
});

alertSchema.index({ budgetId: 1 });
alertSchema.index({ departmentId: 1 });
alertSchema.index({ alertType: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ status: 1 });

export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
