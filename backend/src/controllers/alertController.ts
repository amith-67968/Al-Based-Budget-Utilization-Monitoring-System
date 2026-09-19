import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AlertService } from '../services/alertService';

export const alertController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const budgetId = req.query.budgetId as string;
      const departmentId = req.query.departmentId as string;
      const alertType = req.query.alertType as string;
      const severity = req.query.severity as string;
      const status = req.query.status as string;
      const search = req.query.search as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { alerts, total } = await AlertService.getAll({
        budgetId, departmentId, alertType, severity, status, search, page, limit
      });
      return ApiResponse.paginated(res, alerts, total, page, limit, 'Alerts retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const alert = await AlertService.getById(req.params.id);
      return ApiResponse.success(res, alert, 'Alert retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user!._id;
      const alert = await AlertService.updateStatus(req.params.id, req.body.status, userId);
      return ApiResponse.success(res, alert, 'Alert status updated');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getRecent: async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const departmentId = req.query.departmentId as string | undefined;
      const alerts = await AlertService.getRecentAlerts(limit, departmentId);
      return ApiResponse.success(res, alerts, 'Recent alerts retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getStats: async (req: Request, res: Response) => {
    try {
      const departmentId = req.query.departmentId as string | undefined;
      const stats = await AlertService.getAlertStats(departmentId);
      return ApiResponse.success(res, stats, 'Alert stats retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
