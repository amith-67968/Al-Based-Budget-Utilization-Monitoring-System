const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Al-Based Budget Utilization/backend/src';

const controllers = {
  'controllers/authController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AuthService } from '../services/authService';
import { AuditService } from '../services/auditService';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      
      await AuditService.log({
        userId: user._id,
        entityType: 'User',
        entityId: user._id,
        action: 'login',
        details: 'User logged in successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });
      
      return ApiResponse.success(res, 'Login successful', { user, token });
    } catch (error) {
      next(error);
    }
  }
  
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const user = await AuthService.getProfile(userId);
      return ApiResponse.success(res, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/userController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { UserService } from '../services/userService';
import { AuditService } from '../services/auditService';

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { role, status, page, limit, search } = req.query;
      const users = await UserService.getAll({ role, status, page, limit, search });
      return ApiResponse.success(res, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getById(req.params.id);
      return ApiResponse.success(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.create(req.body);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'User',
        entityId: user._id,
        action: 'create',
        details: 'User created successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.created(res, 'User created successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const previousUser = await UserService.getById(id);
      const updatedUser = await UserService.update(id, req.body);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'User',
        entityId: id,
        action: 'update',
        details: 'User updated successfully',
        previousValues: previousUser,
        newValues: updatedUser,
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'User updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedUser = await UserService.updateStatus(id, status);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'User',
        entityId: id,
        action: 'update_status',
        details: \`User status updated to \${status}\`,
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'User status updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/departmentController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { DepartmentService } from '../services/departmentService';
import { AuditService } from '../services/auditService';

export class DepartmentController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, search } = req.query;
      const departments = await DepartmentService.getAll({ status, search });
      return ApiResponse.success(res, 'Departments retrieved successfully', departments);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const department = await DepartmentService.getById(req.params.id);
      return ApiResponse.success(res, 'Department retrieved successfully', department);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const department = await DepartmentService.create(req.body);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Department',
        entityId: department._id,
        action: 'create',
        details: 'Department created successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.created(res, 'Department created successfully', department);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const department = await DepartmentService.update(id, req.body);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Department',
        entityId: id,
        action: 'update',
        details: 'Department updated successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'Department updated successfully', department);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/budgetController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { BudgetService } from '../services/budgetService';
import { AuditService } from '../services/auditService';

export class BudgetController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { financialYear, departmentId, status, page, limit, search, sort } = req.query;
      const budgets = await BudgetService.getAll({ financialYear, departmentId, status, page, limit, search, sort });
      return ApiResponse.success(res, 'Budgets retrieved successfully', budgets);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const budget = await BudgetService.getById(req.params.id);
      return ApiResponse.success(res, 'Budget retrieved successfully', budget);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const budgetData = { ...req.body, createdBy: (req as any).user._id };
      const budget = await BudgetService.create(budgetData);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Budget',
        entityId: budget._id,
        action: 'create',
        details: 'Budget created successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.created(res, 'Budget created successfully', budget);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const previousBudget = await BudgetService.getById(id);
      const updatedBudget = await BudgetService.update(id, req.body);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Budget',
        entityId: id,
        action: 'update',
        details: 'Budget updated successfully',
        previousValues: previousBudget,
        newValues: updatedBudget,
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'Budget updated successfully', updatedBudget);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await BudgetService.delete(id);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Budget',
        entityId: id,
        action: 'delete',
        details: 'Budget deleted successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'Budget deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { departmentId } = req.query;
      const stats = await BudgetService.getDashboardStats(departmentId as string);
      return ApiResponse.success(res, 'Dashboard stats retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/expenditureController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ExpenditureService } from '../services/expenditureService';
import { AuditService } from '../services/auditService';

export class ExpenditureController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { budgetId, departmentId, expenseCategory, startDate, endDate, page, limit, search, sort } = req.query;
      const expenditures = await ExpenditureService.getAll({ budgetId, departmentId, expenseCategory, startDate, endDate, page, limit, search, sort });
      return ApiResponse.success(res, 'Expenditures retrieved successfully', expenditures);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const expenditure = await ExpenditureService.getById(req.params.id);
      return ApiResponse.success(res, 'Expenditure retrieved successfully', expenditure);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const expenditureData = { ...req.body, recordedBy: (req as any).user._id };
      const ipAddress = req.ip || req.socket.remoteAddress;
      const expenditure = await ExpenditureService.create(expenditureData, ipAddress);
      return ApiResponse.created(res, 'Expenditure created successfully', expenditure);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const expenditure = await ExpenditureService.update(id, req.body, userId, ipAddress);
      return ApiResponse.success(res, 'Expenditure updated successfully', expenditure);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id;
      const ipAddress = req.ip || req.socket.remoteAddress;
      await ExpenditureService.delete(id, userId, ipAddress);
      return ApiResponse.success(res, 'Expenditure deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, departmentId } = req.query;
      const recent = await ExpenditureService.getRecent({ limit: Number(limit) || 10, departmentId: departmentId as string });
      return ApiResponse.success(res, 'Recent expenditures retrieved successfully', recent);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/monitoringController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { MonitoringService } from '../services/monitoringService';
import { AuditService } from '../services/auditService';

export class MonitoringController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const { departmentId } = req.query;
      const overview = await MonitoringService.getOverview(departmentId as string);
      return ApiResponse.success(res, 'Monitoring overview retrieved successfully', overview);
    } catch (error) {
      next(error);
    }
  }

  static async getDepartmentMonitoring(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const monitoringData = await MonitoringService.getDepartmentMonitoring(id);
      return ApiResponse.success(res, 'Department monitoring retrieved successfully', monitoringData);
    } catch (error) {
      next(error);
    }
  }

  static async runMonitoring(req: Request, res: Response, next: NextFunction) {
    try {
      await MonitoringService.runForAll();
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'System',
        entityId: 'monitoring',
        action: 'run_monitoring',
        details: 'Manual monitoring run triggered successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'Monitoring run initiated successfully');
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/alertController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AlertService } from '../services/alertService';
import { AuditService } from '../services/auditService';

export class AlertController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { budgetId, departmentId, alertType, severity, status, page, limit, search } = req.query;
      const alerts = await AlertService.getAll({ budgetId, departmentId, alertType, severity, status, page, limit, search });
      return ApiResponse.success(res, 'Alerts retrieved successfully', alerts);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await AlertService.getById(req.params.id);
      return ApiResponse.success(res, 'Alert retrieved successfully', alert);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedAlert = await AlertService.updateStatus(id, status);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Alert',
        entityId: id,
        action: 'update_status',
        details: \`Alert status updated to \${status}\`,
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'Alert status updated successfully', updatedAlert);
    } catch (error) {
      next(error);
    }
  }

  static async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, departmentId } = req.query;
      const recentAlerts = await AlertService.getRecent({ limit: Number(limit) || 10, departmentId: departmentId as string });
      return ApiResponse.success(res, 'Recent alerts retrieved successfully', recentAlerts);
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { departmentId } = req.query;
      const stats = await AlertService.getStats(departmentId as string);
      return ApiResponse.success(res, 'Alert stats retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/reportController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ReportService } from '../services/reportService';

export class ReportController {
  static async getBudgetUtilization(req: Request, res: Response, next: NextFunction) {
    try {
      const { format, ...filters } = req.query;
      const report = await ReportService.getBudgetUtilization(filters, format as string);
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=budget_utilization.csv');
        return res.send(report);
      } else if (format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=budget_utilization.pdf');
        return res.send(report);
      }
      
      return ApiResponse.success(res, 'Budget utilization report generated', report);
    } catch (error) {
      next(error);
    }
  }

  static async getExpenditures(req: Request, res: Response, next: NextFunction) {
    try {
      const { format, ...filters } = req.query;
      const report = await ReportService.getExpenditures(filters, format as string);
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=expenditures.csv');
        return res.send(report);
      } else if (format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=expenditures.pdf');
        return res.send(report);
      }
      
      return ApiResponse.success(res, 'Expenditure report generated', report);
    } catch (error) {
      next(error);
    }
  }

  static async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const { format, ...filters } = req.query;
      const report = await ReportService.getAlerts(filters, format as string);
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=alerts.csv');
        return res.send(report);
      } else if (format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=alerts.pdf');
        return res.send(report);
      }
      
      return ApiResponse.success(res, 'Alerts report generated', report);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/auditController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AuditService } from '../services/auditService';

export class AuditController {
  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, entityType, action, startDate, endDate, page, limit } = req.query;
      const logs = await AuditService.getLogs({ userId, entityType, action, startDate, endDate, page, limit });
      return ApiResponse.success(res, 'Audit logs retrieved successfully', logs);
    } catch (error) {
      next(error);
    }
  }
}
`,
  'controllers/adminController.ts': `
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AdminService } from '../services/adminService';
import { AuditService } from '../services/auditService';

export class AdminController {
  static async getRules(req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await AdminService.getRules();
      return ApiResponse.success(res, 'Rules retrieved successfully', rules);
    } catch (error) {
      next(error);
    }
  }

  static async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await AdminService.createRule(req.body);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Rule',
        entityId: rule._id,
        action: 'create',
        details: 'Rule created successfully',
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.created(res, 'Rule created successfully', rule);
    } catch (error) {
      next(error);
    }
  }

  static async updateRule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const previousRule = await AdminService.getRuleById(id);
      const updatedRule = await AdminService.updateRule(id, req.body);
      
      await AuditService.log({
        userId: (req as any).user._id,
        entityType: 'Rule',
        entityId: id,
        action: 'update',
        details: 'Rule updated successfully',
        previousValues: previousRule,
        newValues: updatedRule,
        ipAddress: req.ip || req.socket.remoteAddress
      });

      return ApiResponse.success(res, 'Rule updated successfully', updatedRule);
    } catch (error) {
      next(error);
    }
  }
}
`
};

Object.entries(controllers).forEach(([filepath, content]) => {
  const fullPath = path.join(baseDir, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
});

console.log('Controllers generated successfully.');
