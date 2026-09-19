import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AuditService } from '../services/auditService';

export const auditController = {
  getLogs: async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const entityType = req.query.entityType as string;
      const action = req.query.action as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const logs: any = await AuditService.getLogs({
        userId, entityType, action, startDate, endDate, page, limit
      });
      
      const data = logs.logs || logs;
      const total = logs.total || (Array.isArray(logs) ? logs.length : 0);

      return ApiResponse.paginated(res, data, total, page, limit, 'Audit logs retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
