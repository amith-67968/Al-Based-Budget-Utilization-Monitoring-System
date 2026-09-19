import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AuthService } from '../services/authService';
import { AuditService } from '../services/auditService';

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      
      await AuditService.createLog({
        userId: (user as any)._id || (user as any).id,
        action: 'LOGIN',
        entityType: 'User',
        ipAddress: req.ip
      });
      
      return ApiResponse.success(res, { token, user }, 'Login successful');
    } catch (error: any) {
      return ApiResponse.error(res, error.message || 'Login failed', 400);
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user!._id;
      const user = await AuthService.getProfile(userId);
      return ApiResponse.success(res, user, 'Profile retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message || 'Failed to get profile', 400);
    }
  }
};
