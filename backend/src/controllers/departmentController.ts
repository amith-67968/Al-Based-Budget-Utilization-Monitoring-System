import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { DepartmentService } from '../services/departmentService';

export const departmentController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string;
      const search = req.query.search as string;
      const departments = await DepartmentService.getAll({ status, search });
      return ApiResponse.success(res, departments, 'Departments retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const department = await DepartmentService.getById(req.params.id);
      return ApiResponse.success(res, department, 'Department retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const department = await DepartmentService.create(req.body);
      return ApiResponse.success(res, department, 'Department created', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const department = await DepartmentService.update(req.params.id, req.body);
      return ApiResponse.success(res, department, 'Department updated');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
