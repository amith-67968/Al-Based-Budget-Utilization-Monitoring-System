import { AuditLog } from '../models/AuditLog';

export class AuditService {
  static async createLog(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
  }): Promise<void> {
    try {
      const { previousValue, newValue, ...rest } = data;
      
      // Filter out passwordHash
      const cleanPreviousValue = previousValue ? { ...previousValue } : undefined;
      if (cleanPreviousValue && cleanPreviousValue.passwordHash) {
        delete cleanPreviousValue.passwordHash;
      }
      
      const cleanNewValue = newValue ? { ...newValue } : undefined;
      if (cleanNewValue && cleanNewValue.passwordHash) {
        delete cleanNewValue.passwordHash;
      }

      const log = new AuditLog({
        ...rest,
        previousValue: cleanPreviousValue,
        newValue: cleanNewValue,
      });

      await log.save();
    } catch (error: any) {
      console.error('AuditLog Error:', error);
      throw new Error(error.message || 'Error creating audit log');
    }
  }

  static async getLogs(filters: {
    userId?: string;
    entityType?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: any[]; total: number }> {
    try {
      const query: any = {};

      if (filters.userId) query.userId = filters.userId;
      if (filters.entityType) query.entityType = filters.entityType;
      if (filters.action) query.action = filters.action;
      
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'name email'),
        AuditLog.countDocuments(query)
      ]);

      return { logs, total };
    } catch (error: any) {
      throw new Error(error.message || 'Error retrieving audit logs');
    }
  }
}
