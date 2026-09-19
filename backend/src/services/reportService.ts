import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { Budget } from '../models/Budget';
import { Expenditure } from '../models/Expenditure';
import { Alert } from '../models/Alert';

export class ReportService {
  static async getBudgetUtilizationReport(filters: {
    financialYear?: string;
    departmentId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    try {
      const query: any = {};
      if (filters.financialYear) query.financialYear = filters.financialYear;
      if (filters.departmentId) query.departmentId = filters.departmentId;
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }

      const budgets = await Budget.find(query).populate('departmentId', 'name');

      return budgets.map(b => ({
        department: (b.departmentId as any)?.name || 'Unknown',
        budget: b._id.toString(),
        projectName: b.projectName,
        financialYear: b.financialYear,
        allocated: b.allocatedAmount,
        spent: b.totalSpent,
        remaining: b.remainingBudget,
        utilization: b.utilizationPercentage,
        status: b.status
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Error generating budget utilization report');
    }
  }

  static async getExpenditureReport(filters: {
    financialYear?: string;
    departmentId?: string;
    budgetId?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<any[]> {
    try {
      const query: any = {};
      if (filters.departmentId) query.departmentId = filters.departmentId;
      if (filters.budgetId) query.budgetId = filters.budgetId;
      if (filters.category) query.expenseCategory = filters.category;
      
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }

      // Add financialYear filter logic by joining budget
      let budgetsList: string[] = [];
      if (filters.financialYear) {
         const matchedBudgets = await Budget.find({ financialYear: filters.financialYear });
         budgetsList = matchedBudgets.map(b => b._id.toString());
         query.budgetId = { $in: budgetsList };
      }

      const expenditures = await Expenditure.find(query)
        .populate('budgetId', 'projectName')
        .populate('departmentId', 'name')
        .populate('recordedBy', 'name');

      return expenditures.map(e => ({
        transactionId: e._id.toString(),
        department: (e.departmentId as any)?.name || 'Unknown',
        budget: (e.budgetId as any)?.projectName || 'Unknown',
        category: e.expenseCategory,
        amount: e.amountSpent,
        date: e.date,
        description: e.description,
        recordedBy: (e.recordedBy as any)?.name || 'Unknown'
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Error generating expenditure report');
    }
  }

  static async getAlertReport(filters: {
    departmentId?: string;
    alertType?: string;
    severity?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    try {
      const query: any = {};
      if (filters.departmentId) query.departmentId = filters.departmentId;
      if (filters.alertType) query.alertType = filters.alertType;
      if (filters.severity) query.severity = filters.severity;
      if (filters.status) query.status = filters.status;

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }

      const alerts = await Alert.find(query)
        .populate('budgetId', 'projectName')
        .populate('departmentId', 'name');

      return alerts.map(a => ({
        department: (a.departmentId as any)?.name || 'Unknown',
        budget: (a.budgetId as any)?.projectName || 'Unknown',
        type: a.alertType,
        severity: a.severity,
        status: a.status,
        message: a.message,
        createdAt: a.createdAt
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Error generating alert report');
    }
  }

  static generateCSV(data: any[], fields: string[]): string {
    try {
      const parser = new Parser({ fields });
      return parser.parse(data);
    } catch (error: any) {
      throw new Error('Error generating CSV');
    }
  }

  static generatePDF(data: any[], title: string, columns: { header: string; key: string }[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const buffers: Buffer[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Title
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Simple table rendering
        const tableTop = doc.y;
        const columnSpacing = 10;
        const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const columnWidth = usableWidth / columns.length;

        // Headers
        doc.font('Helvetica-Bold').fontSize(10);
        columns.forEach((col, i) => {
          doc.text(col.header, doc.page.margins.left + (i * columnWidth), tableTop, { width: columnWidth - columnSpacing, align: 'left' });
        });

        doc.moveTo(doc.page.margins.left, doc.y + 5).lineTo(doc.page.width - doc.page.margins.right, doc.y + 5).stroke();
        doc.moveDown(0.5);

        // Data rows
        doc.font('Helvetica').fontSize(9);
        let y = doc.y;

        data.forEach((row) => {
          if (y > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            y = doc.page.margins.top;
          }

          let maxRowHeight = 15;
          columns.forEach((col, i) => {
             const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
             doc.text(val, doc.page.margins.left + (i * columnWidth), y, { width: columnWidth - columnSpacing, align: 'left' });
          });
          y += maxRowHeight;
        });

        doc.end();
      } catch (error: any) {
        reject(new Error('Error generating PDF'));
      }
    });
  }
}
