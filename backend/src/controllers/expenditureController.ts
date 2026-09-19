import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ExpenditureService } from '../services/expenditureService';

export const expenditureController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const budgetId = req.query.budgetId as string;
      const departmentId = req.query.departmentId as string;
      const expenseCategory = req.query.expenseCategory as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const search = req.query.search as string;
      const sort = req.query.sort as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { expenditures, total } = await ExpenditureService.getAll({
        budgetId, departmentId, expenseCategory, startDate, endDate, search, sort, page, limit
      });
      return ApiResponse.paginated(res, expenditures, total, page, limit, 'Expenditures retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const expenditure = await ExpenditureService.getById(req.params.id);
      return ApiResponse.success(res, expenditure, 'Expenditure retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user!._id;
      const ipAddress = req.ip;
      const expenditure = await ExpenditureService.create(req.body, userId, ipAddress);
      return ApiResponse.success(res, expenditure, 'Expenditure created', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user!._id;
      const ipAddress = req.ip;
      const expenditure = await ExpenditureService.update(req.params.id, req.body, userId, ipAddress);
      return ApiResponse.success(res, expenditure, 'Expenditure updated');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user!._id;
      const ipAddress = req.ip;
      await ExpenditureService.delete(req.params.id, userId, ipAddress);
      return ApiResponse.success(res, null, 'Expenditure deleted');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getRecent: async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const departmentId = req.query.departmentId as string | undefined;
      const recent = await ExpenditureService.getRecentTransactions(limit, departmentId);
      return ApiResponse.success(res, recent, 'Recent transactions retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
