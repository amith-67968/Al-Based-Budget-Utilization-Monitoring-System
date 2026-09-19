import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { BudgetService } from '../services/budgetService';

export const budgetController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const financialYear = req.query.financialYear as string;
      const departmentId = req.query.departmentId as string;
      const status = req.query.status as string;
      const search = req.query.search as string;
      const sort = req.query.sort as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { budgets, total } = await BudgetService.getAll({
        financialYear, departmentId, status, search, sort, page, limit
      });
      return ApiResponse.paginated(res, budgets, total, page, limit, 'Budgets retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const budget = await BudgetService.getById(req.params.id);
      return ApiResponse.success(res, budget, 'Budget retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data = { ...req.body, createdBy: (req as any).user!._id };
      const budget = await BudgetService.create(data);
      return ApiResponse.success(res, budget, 'Budget created', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const budget = await BudgetService.update(req.params.id, req.body);
      return ApiResponse.success(res, budget, 'Budget updated');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await BudgetService.delete(req.params.id);
      return ApiResponse.success(res, null, 'Budget deleted');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getDashboardStats: async (req: Request, res: Response) => {
    try {
      const departmentId = req.query.departmentId as string | undefined;
      const stats = await BudgetService.getDashboardStats(departmentId);
      return ApiResponse.success(res, stats, 'Dashboard stats retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
