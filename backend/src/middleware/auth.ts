import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse';
import { User } from '../models/User'; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        departmentId?: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return ApiResponse.error(res, 'Not authorized to access this route', 401);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    // Fallback or assuming User model has a findById method
    const user = await User.findById(decoded.id || decoded._id);
    
    if (!user) {
      return ApiResponse.error(res, 'The user belonging to this token does no longer exist.', 401);
    }
    
    if (user.status !== 'active') {
      return ApiResponse.error(res, 'User is inactive.', 401);
    }
    
    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId?.toString()
    };
    
    next();
  } catch (error) {
    next(error); 
  }
};
