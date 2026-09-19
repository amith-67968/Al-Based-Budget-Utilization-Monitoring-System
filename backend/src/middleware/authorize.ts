import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, `Role is not allowed to access this resource`, 403);
    }
    next();
  };
}
