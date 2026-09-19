import { Budget } from '../models/Budget';
import { Expenditure } from '../models/Expenditure';
import { calculateRemainingBudget, calculateUtilizationPercentage } from '../utils/calculations';

export class BudgetService {
  static async getAll(filters: {
    financialYear?: string;
    departmentId?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<{ budgets: any[]; total: number }> {
    try {
      const query: any = {};
      
      if (filters.financialYear) query.financialYear = filters.financialYear;
      if (filters.departmentId) query.departmentId = filters.departmentId;
      if (filters.status) query.status = filters.status;
      
      if (filters.search) {
        query.projectName = { $regex: filters.search, $options: 'i' };
      }

      let sortOptions: any = { createdAt: -1 };
      if (filters.sort) {
        if (filters.sort === 'allocatedAmount') sortOptions = { allocatedAmount: -1 };
        else if (filters.sort === 'totalSpent') sortOptions = { totalSpent: -1 };
        else if (filters.sort === 'financialYear') sortOptions = { financialYear: -1 };
        else if (filters.sort === 'createdAt') sortOptions = { createdAt: -1 };
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [budgets, total] = await Promise.all([
        Budget.find(query)
          .populate('departmentId', 'name')
          .populate('createdBy', 'name')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        Budget.countDocuments(query)
      ]);

      return { budgets, total };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching budgets');
    }
  }

  static async getById(id: string): Promise<object> {
    try {
      const budget = await Budget.findById(id)
        .populate('departmentId', 'name')
        .populate('createdBy', 'name');
        
      if (!budget) throw new Error('Budget not found');
      
      const budgetObj = budget.toObject();
      return {
        ...budgetObj,
        remainingBudget: budget.remainingBudget,
        utilizationPercentage: budget.utilizationPercentage
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching budget');
    }
  }

  static async create(data: {
    financialYear: string;
    departmentId: string;
    projectName: string;
    allocatedAmount: number;
    allocationDate: Date;
    startDate: Date;
    endDate: Date;
    status?: string;
    createdBy: string;
  }): Promise<object> {
    try {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new Error('startDate must be before endDate');
      }

      const budget = new Budget(data);
      await budget.save();
      return budget.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error creating budget');
    }
  }

  static async update(id: string, data: Partial<{
    financialYear: string;
    departmentId: string;
    projectName: string;
    allocatedAmount: number;
    allocationDate: Date;
    startDate: Date;
    endDate: Date;
    status: string;
    createdBy: string;
  }>): Promise<object> {
    try {
      const budget = await Budget.findById(id);
      if (!budget) throw new Error('Budget not found');

      if (data.startDate && data.endDate) {
        if (new Date(data.startDate) >= new Date(data.endDate)) {
          throw new Error('startDate must be before endDate');
        }
      } else if (data.startDate) {
        if (new Date(data.startDate) >= new Date(budget.endDate)) {
          throw new Error('startDate must be before endDate');
        }
      } else if (data.endDate) {
        if (new Date(budget.startDate) >= new Date(data.endDate)) {
          throw new Error('startDate must be before endDate');
        }
      }

      Object.assign(budget, data);
      
      if (budget.totalSpent > budget.allocatedAmount) {
        budget.status = 'exceeded';
      }

      await budget.save();
      return budget.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error updating budget');
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const expendituresCount = await Expenditure.countDocuments({ budgetId: id });
      if (expendituresCount > 0) {
        throw new Error('Cannot delete budget with existing expenditures');
      }
      
      const result = await Budget.findByIdAndDelete(id);
      if (!result) throw new Error('Budget not found');
    } catch (error: any) {
      throw new Error(error.message || 'Error deleting budget');
    }
  }

  static async recalculateTotals(budgetId: string): Promise<object> {
    try {
      const budget = await Budget.findById(budgetId);
      if (!budget) throw new Error('Budget not found');

      const result = await Expenditure.aggregate([
        { $match: { budgetId: budget._id } },
        { $group: { _id: null, total: { $sum: '$amountSpent' } } }
      ]);

      const totalSpent = result.length > 0 ? result[0].total : 0;
      
      budget.totalSpent = totalSpent;
      if (budget.totalSpent > budget.allocatedAmount) {
        budget.status = 'exceeded';
      }
      
      await budget.save();
      return budget.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error recalculating budget totals');
    }
  }

  static async getDashboardStats(departmentId?: string): Promise<object> {
    try {
      const query: any = {};
      if (departmentId) query.departmentId = departmentId;

      const budgets = await Budget.find(query).populate('departmentId', 'name');
      
      let totalBudget = 0;
      let totalSpent = 0;
      const deptStats: any = {};

      budgets.forEach((b: any) => {
        totalBudget += b.allocatedAmount;
        totalSpent += b.totalSpent;
        
        const deptId = (b.departmentId as any)._id.toString();
        if (!deptStats[deptId]) {
          deptStats[deptId] = {
            name: (b.departmentId as any).name,
            allocated: 0,
            spent: 0
          };
        }
        deptStats[deptId].allocated += b.allocatedAmount;
        deptStats[deptId].spent += b.totalSpent;
      });

      const departmentSummaries = Object.values(deptStats).map((dept: any) => ({
        ...dept,
        remaining: dept.allocated - dept.spent,
        utilization: calculateUtilizationPercentage(dept.spent, dept.allocated)
      }));

      return {
        totalBudget,
        totalSpent,
        remainingBudget: totalBudget - totalSpent,
        utilizationPercentage: calculateUtilizationPercentage(totalSpent, totalBudget),
        budgetCount: budgets.length,
        departmentSummaries
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching dashboard stats');
    }
  }
}
