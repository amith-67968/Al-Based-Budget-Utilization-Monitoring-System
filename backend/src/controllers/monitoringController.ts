import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { MonitoringService } from '../services/monitoringService';

export const monitoringController = {
  getOverview: async (req: Request, res: Response) => {
    try {
      const departmentId = req.query.departmentId as string | undefined;
      const overview = await MonitoringService.getOverview(departmentId);
      return ApiResponse.success(res, overview, 'Monitoring overview retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getDepartmentMonitoring: async (req: Request, res: Response) => {
    try {
      const data = await MonitoringService.getDepartmentMonitoring(req.params.departmentId);
      return ApiResponse.success(res, data, 'Department monitoring retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  runMonitoring: async (req: Request, res: Response) => {
    try {
      const result = await MonitoringService.runForAll();
      return ApiResponse.success(res, result, 'Monitoring run successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
