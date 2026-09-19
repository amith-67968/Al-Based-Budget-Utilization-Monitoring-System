import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ReportService } from '../services/reportService';

export const reportController = {
  getBudgetUtilization: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { financialYear, departmentId, startDate, endDate, format } = req.query;
      const data = await ReportService.getBudgetUtilizationReport({
        financialYear: financialYear as string,
        departmentId: departmentId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      if (format === 'csv') {
        const csv = ReportService.generateCSV(data, ['department', 'projectName', 'financialYear', 'allocated', 'spent', 'remaining', 'utilization', 'status']);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=budget-utilization-report.csv');
        return res.send(csv);
      }

      if (format === 'pdf') {
        const columns = [
          { header: 'Department', key: 'department' },
          { header: 'Project', key: 'projectName' },
          { header: 'Year', key: 'financialYear' },
          { header: 'Allocated', key: 'allocated' },
          { header: 'Spent', key: 'spent' },
          { header: 'Remaining', key: 'remaining' },
          { header: 'Utilization %', key: 'utilization' },
          { header: 'Status', key: 'status' },
        ];
        const pdfBuffer = await ReportService.generatePDF(data, 'Budget Utilization Report', columns);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=budget-utilization-report.pdf');
        return res.send(pdfBuffer);
      }

      return ApiResponse.success(res, data, 'Budget utilization report generated');
    } catch (error) {
      next(error);
    }
  },

  getExpenditures: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { financialYear, departmentId, budgetId, startDate, endDate, category, format } = req.query;
      const data = await ReportService.getExpenditureReport({
        financialYear: financialYear as string,
        departmentId: departmentId as string,
        budgetId: budgetId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        category: category as string,
      });

      if (format === 'csv') {
        const csv = ReportService.generateCSV(data, ['transactionId', 'department', 'budget', 'category', 'amount', 'date', 'description', 'recordedBy']);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=expenditure-report.csv');
        return res.send(csv);
      }

      if (format === 'pdf') {
        const columns = [
          { header: 'Transaction ID', key: 'transactionId' },
          { header: 'Department', key: 'department' },
          { header: 'Category', key: 'category' },
          { header: 'Amount', key: 'amount' },
          { header: 'Date', key: 'date' },
          { header: 'Description', key: 'description' },
        ];
        const pdfBuffer = await ReportService.generatePDF(data, 'Expenditure Report', columns);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=expenditure-report.pdf');
        return res.send(pdfBuffer);
      }

      return ApiResponse.success(res, data, 'Expenditure report generated');
    } catch (error) {
      next(error);
    }
  },

  getAlerts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { departmentId, alertType, severity, status, startDate, endDate, format } = req.query;
      const data = await ReportService.getAlertReport({
        departmentId: departmentId as string,
        alertType: alertType as string,
        severity: severity as string,
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      if (format === 'csv') {
        const csv = ReportService.generateCSV(data, ['alertType', 'department', 'severity', 'triggeredValue', 'thresholdValue', 'status', 'timestamp']);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=alert-report.csv');
        return res.send(csv);
      }

      if (format === 'pdf') {
        const columns = [
          { header: 'Type', key: 'alertType' },
          { header: 'Department', key: 'department' },
          { header: 'Severity', key: 'severity' },
          { header: 'Triggered Value', key: 'triggeredValue' },
          { header: 'Threshold', key: 'thresholdValue' },
          { header: 'Status', key: 'status' },
        ];
        const pdfBuffer = await ReportService.generatePDF(data, 'Alert Report', columns);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=alert-report.pdf');
        return res.send(pdfBuffer);
      }

      return ApiResponse.success(res, data, 'Alert report generated');
    } catch (error) {
      next(error);
    }
  },
};
