import { Expenditure } from '../models/Expenditure';
import { Budget } from '../models/Budget';
import { MonitoringService } from './monitoringService';
import { AuditService } from './auditService';
import { BudgetService } from './budgetService';

export class ExpenditureService {
  static async getAll(filters: {
    budgetId?: string;
    departmentId?: string;
    expenseCategory?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<{ expenditures: any[]; total: number }> {
    try {
      const query: any = {};

      if (filters.budgetId) query.budgetId = filters.budgetId;
      if (filters.departmentId) query.departmentId = filters.departmentId;
      if (filters.expenseCategory) query.expenseCategory = filters.expenseCategory;

      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }
      
      if (filters.search) {
        query.description = { $regex: filters.search, $options: 'i' };
      }

      let sortOptions: any = { date: -1 };
      if (filters.sort) {
        if (filters.sort === 'amountSpent') sortOptions = { amountSpent: -1 };
        else if (filters.sort === 'date') sortOptions = { date: -1 };
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [expenditures, total] = await Promise.all([
        Expenditure.find(query)
          .populate('budgetId', 'projectName financialYear')
          .populate('departmentId', 'name')
          .populate('recordedBy', 'name')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        Expenditure.countDocuments(query)
      ]);

      return { expenditures, total };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching expenditures');
    }
  }

  static async getById(id: string): Promise<object> {
    try {
      const expenditure = await Expenditure.findById(id)
        .populate('budgetId', 'projectName financialYear')
        .populate('departmentId', 'name')
        .populate('recordedBy', 'name');
      
      if (!expenditure) throw new Error('Expenditure not found');
      return expenditure.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching expenditure');
    }
  }

  static async create(data: {
    budgetId: string;
    departmentId: string;
    amountSpent: number;
    expenseCategory: string;
    date: Date;
    description: string;
    supportingDocumentReference?: string;
    recordedBy: string;
  }, userId: string, ipAddress?: string): Promise<object> {
    try {
      const budget = await Budget.findById(data.budgetId);
      if (!budget) throw new Error('Budget not found');
      if (budget.status !== 'active') throw new Error('Budget is not active');

      const expenditure = new Expenditure(data);
      await expenditure.save();

      await BudgetService.recalculateTotals(data.budgetId);
      await MonitoringService.runForBudget(data.budgetId);

      await AuditService.createLog({
        userId,
        action: 'CREATE',
        entityType: 'Expenditure',
        entityId: expenditure._id.toString(),
        newValue: expenditure.toObject(),
        ipAddress
      });

      return expenditure.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error creating expenditure');
    }
  }

  static async update(id: string, data: Partial<{
    budgetId: string;
    departmentId: string;
    amountSpent: number;
    expenseCategory: string;
    date: Date;
    description: string;
    supportingDocumentReference: string;
  }>, userId: string, ipAddress?: string): Promise<object> {
    try {
      const expenditure = await Expenditure.findById(id);
      if (!expenditure) throw new Error('Expenditure not found');

      const previousValue = expenditure.toObject();

      if (data.budgetId && data.budgetId !== expenditure.budgetId.toString()) {
         const newBudget = await Budget.findById(data.budgetId);
         if (!newBudget || newBudget.status !== 'active') {
             throw new Error('New budget is not valid or active');
         }
      }

      Object.assign(expenditure, data);
      await expenditure.save();

      if (data.amountSpent !== undefined || data.budgetId !== undefined) {
          if (data.budgetId !== undefined && previousValue.budgetId.toString() !== data.budgetId.toString()) {
              await BudgetService.recalculateTotals(previousValue.budgetId.toString());
              await BudgetService.recalculateTotals(data.budgetId.toString());
              await MonitoringService.runForBudget(data.budgetId.toString());
          } else {
              await BudgetService.recalculateTotals(expenditure.budgetId.toString());
              await MonitoringService.runForBudget(expenditure.budgetId.toString());
          }
      }

      await AuditService.createLog({
        userId,
        action: 'UPDATE',
        entityType: 'Expenditure',
        entityId: expenditure._id.toString(),
        previousValue,
        newValue: expenditure.toObject(),
        ipAddress
      });

      return expenditure.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error updating expenditure');
    }
  }

  static async delete(id: string, userId: string, ipAddress?: string): Promise<void> {
    try {
      const expenditure = await Expenditure.findById(id);
      if (!expenditure) throw new Error('Expenditure not found');

      const previousValue = expenditure.toObject();
      await Expenditure.findByIdAndDelete(id);

      await BudgetService.recalculateTotals(expenditure.budgetId.toString());
      await MonitoringService.runForBudget(expenditure.budgetId.toString());

      await AuditService.createLog({
        userId,
        action: 'DELETE',
        entityType: 'Expenditure',
        entityId: id,
        previousValue,
        ipAddress
      });
    } catch (error: any) {
      throw new Error(error.message || 'Error deleting expenditure');
    }
  }

  static async getRecentTransactions(limit: number, departmentId?: string): Promise<any[]> {
    try {
      const query: any = {};
      if (departmentId) query.departmentId = departmentId;

      return await Expenditure.find(query)
        .populate('budgetId', 'projectName')
        .populate('departmentId', 'name')
        .sort({ date: -1 })
        .limit(limit);
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching recent transactions');
    }
  }
}
