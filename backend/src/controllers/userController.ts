import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { UserService } from '../services/userService';

export const userController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const role = req.query.role as string;
      const status = req.query.status as string;
      const search = req.query.search as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { users, total } = await UserService.getAll({ role, status, search, page, limit });
      return ApiResponse.paginated(res, users, total, page, limit, 'Users retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message || 'Failed to fetch users', 400);
    }
  },
  
  getById: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getById(req.params.id);
      return ApiResponse.success(res, user, 'User retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const user = await UserService.create(req.body);
      return ApiResponse.success(res, user, 'User created', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const user = await UserService.update(req.params.id, req.body);
      return ApiResponse.success(res, user, 'User updated');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const user = await UserService.updateStatus(req.params.id, req.body.status);
      return ApiResponse.success(res, user, 'User status updated');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
