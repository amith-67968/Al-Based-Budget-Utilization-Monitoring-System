import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ThresholdRule } from '../models/ThresholdRule';

export const adminController = {
  getRules: async (req: Request, res: Response) => {
    try {
      const rules = await ThresholdRule.find();
      return ApiResponse.success(res, rules, 'Rules retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  createRule: async (req: Request, res: Response) => {
    try {
      const rule = await ThresholdRule.create(req.body);
      return ApiResponse.success(res, rule, 'Rule created', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  updateRule: async (req: Request, res: Response) => {
    try {
      const rule = await ThresholdRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return ApiResponse.success(res, rule, 'Rule updated');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
};
