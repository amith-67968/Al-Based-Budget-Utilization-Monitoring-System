import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IThresholdRule extends Document {
  ruleType: 'UNDER_UTILIZATION' | 'OVERSPENDING' | 'SPENDING_SPIKE' | 'MAX_UTILIZATION' | 'MIN_UTILIZATION' | 'EXPENDITURE_LIMIT';
  value: number;
  secondaryValue?: number;
  enabled: boolean;
  description: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const thresholdRuleSchema = new Schema<IThresholdRule>(
  {
    ruleType: { type: String, enum: ['UNDER_UTILIZATION', 'OVERSPENDING', 'SPENDING_SPIKE', 'MAX_UTILIZATION', 'MIN_UTILIZATION', 'EXPENDITURE_LIMIT'], required: true },
    value: { type: Number, required: true },
    secondaryValue: { type: Number },
    enabled: { type: Boolean, default: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

thresholdRuleSchema.index({ ruleType: 1 });
thresholdRuleSchema.index({ enabled: 1 });

export const ThresholdRule = mongoose.model<IThresholdRule>('ThresholdRule', thresholdRuleSchema);
