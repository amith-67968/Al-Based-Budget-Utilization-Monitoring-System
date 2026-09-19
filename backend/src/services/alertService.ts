import { Alert } from '../models/Alert';

export class AlertService {
  static async getAll(filters: {
    budgetId?: string;
    departmentId?: string;
    alertType?: string;
    severity?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ alerts: any[]; total: number }> {
    try {
      const query: any = {};
      if (filters.budgetId) query.budgetId = filters.budgetId;
      if (filters.departmentId) query.departmentId = filters.departmentId;
      if (filters.alertType) query.alertType = filters.alertType;
      if (filters.severity) query.severity = filters.severity;
      if (filters.status) query.status = filters.status;
      if (filters.search) query.message = { $regex: filters.search, $options: 'i' };

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [alerts, total] = await Promise.all([
        Alert.find(query)
          .populate('budgetId', 'projectName')
          .populate('departmentId', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Alert.countDocuments(query)
      ]);

      return { alerts, total };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching alerts');
    }
  }

  static async getById(id: string): Promise<object> {
    try {
      const alert = await Alert.findById(id)
        .populate('budgetId', 'projectName')
        .populate('departmentId', 'name')
        .populate('reviewedBy', 'name');
      
      if (!alert) throw new Error('Alert not found');
      return alert.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching alert');
    }
  }

  static async updateStatus(id: string, status: string, userId: string): Promise<object> {
    try {
      const updateData: any = { status };
      if (status === 'REVIEWED' || status === 'RESOLVED') {
        updateData.reviewedBy = userId;
        updateData.reviewedAt = new Date();
      }

      const alert = await Alert.findByIdAndUpdate(id, updateData, { new: true })
        .populate('budgetId', 'projectName')
        .populate('departmentId', 'name');
      
      if (!alert) throw new Error('Alert not found');
      return alert.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error updating alert status');
    }
  }

  static async getRecentAlerts(limit: number, departmentId?: string): Promise<any[]> {
    try {
      const query: any = { status: 'OPEN' };
      if (departmentId) query.departmentId = departmentId;

      return await Alert.find(query)
        .populate('budgetId', 'projectName')
        .populate('departmentId', 'name')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching recent alerts');
    }
  }

  static async getAlertStats(departmentId?: string): Promise<object> {
    try {
      const query: any = {};
      if (departmentId) query.departmentId = departmentId;

      const alerts = await Alert.find(query);

      const bySeverity = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
      const byType: Record<string, number> = {};
      const byStatus = { OPEN: 0, REVIEWED: 0, RESOLVED: 0, DISMISSED: 0 };

      alerts.forEach((a: any) => {
        if (bySeverity[a.severity as keyof typeof bySeverity] !== undefined) {
          bySeverity[a.severity as keyof typeof bySeverity]++;
        }
        
        if (!byType[a.alertType]) byType[a.alertType] = 0;
        byType[a.alertType]++;

        if (byStatus[a.status as keyof typeof byStatus] !== undefined) {
          byStatus[a.status as keyof typeof byStatus]++;
        }
      });

      return { bySeverity, byType, byStatus };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching alert stats');
    }
  }
}
