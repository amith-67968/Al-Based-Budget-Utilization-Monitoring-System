import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAuditLog extends Document {
  userId: Types.ObjectId;
  action: string;
  entityType: 'budget' | 'expenditure' | 'user' | 'department' | 'alert' | 'threshold_rule' | 'auth';
  entityId?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, enum: ['budget', 'expenditure', 'user', 'department', 'alert', 'threshold_rule', 'auth'], required: true },
    entityId: { type: String },
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ipAddress: { type: String }
  },
  { timestamps: true }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ entityType: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
