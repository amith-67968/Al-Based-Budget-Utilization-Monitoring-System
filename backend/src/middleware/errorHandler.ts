import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((val: any) => val.message);
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'JSON Web Token is invalid. Try again';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'JSON Web Token is expired. Try again';
  }

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction && statusCode === 500) {
    console.error(err.stack);
  }

  const responseErrors = errors || (!isProduction ? [{ stack: err.stack }] : undefined);

  return ApiResponse.error(res, message, statusCode, responseErrors);
};
