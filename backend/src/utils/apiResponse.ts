import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, errors?: any[]) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      ...(errors && { errors })
    });
  }

  static paginated(res: Response, data: any[], total: number, page: number, limit: number, message: string = 'Success') {
    const pages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  }
}
