import { Alert } from '../models/Alert';
import { Budget } from '../models/Budget';
import { Expenditure } from '../models/Expenditure';
import { ThresholdRule } from '../models/ThresholdRule';
import {
  calculateUtilizationPercentage,
  calculateBudgetPeriodElapsed,
  calculateSpendingBaseline,
  isSpendingSpike
} from '../utils/calculations';

export class MonitoringService {
  static async runForBudget(budgetId: string): Promise<any[]> {
    try {
      const budget = await Budget.findById(budgetId);
      if (!budget) throw new Error('Budget not found');
      if (budget.status !== 'active') return [];

      const alertsCreated: any[] = [];

      const underUtilAlert = await this.checkUnderUtilization(budget);
      if (underUtilAlert) alertsCreated.push(underUtilAlert);

      const overspendAlert = await this.checkOverspending(budget);
      if (overspendAlert) alertsCreated.push(overspendAlert);

      const spikeAlert = await this.checkSpendingSpike(budget);
      if (spikeAlert) alertsCreated.push(spikeAlert);

      const thresholdAlerts = await this.checkThresholdBreaches(budget);
      alertsCreated.push(...thresholdAlerts);

      return alertsCreated;
    } catch (error: any) {
      console.error('Error running monitoring for budget:', error);
      return [];
    }
  }

  static async runForAll(): Promise<{ processed: number; alertsCreated: number }> {
    try {
      const budgets = await Budget.find({ status: 'active' });
      let alertsCreatedCount = 0;

      for (const budget of budgets) {
        const alerts = await this.runForBudget(budget._id.toString());
        alertsCreatedCount += alerts.length;
      }

      return { processed: budgets.length, alertsCreated: alertsCreatedCount };
    } catch (error: any) {
      throw new Error(error.message || 'Error running global monitoring');
    }
  }

  static async checkUnderUtilization(budget: any): Promise<any | null> {
    const elapsed = calculateBudgetPeriodElapsed(budget.startDate, budget.endDate);
    const utilization = calculateUtilizationPercentage(budget.totalSpent, budget.allocatedAmount);
    
    // Default rule logic: if > 70% elapsed and < 40% utilized
    if (elapsed > 70 && utilization < 40) {
      const existingAlert = await Alert.findOne({ budgetId: budget._id, alertType: 'UNDER_UTILIZATION', status: 'OPEN' });
      if (existingAlert) return null;

      let severity = 'LOW';
      if (utilization < 20) severity = 'HIGH';
      else if (utilization < 40) severity = 'MEDIUM';

      const alert = new Alert({
        budgetId: budget._id,
        departmentId: budget.departmentId,
        alertType: 'UNDER_UTILIZATION',
        severity,
        message: `Budget is under-utilized. Elapsed: ${elapsed.toFixed(2)}%, Utilized: ${utilization.toFixed(2)}%`,
        status: 'OPEN'
      });
      await alert.save();
      return alert.toObject();
    }
    return null;
  }

  static async checkOverspending(budget: any): Promise<any | null> {
    if (budget.totalSpent > budget.allocatedAmount) {
      const existingAlert = await Alert.findOne({ budgetId: budget._id, alertType: 'OVERSPENDING', status: 'OPEN' });
      if (existingAlert) return null;

      const overspendRatio = ((budget.totalSpent - budget.allocatedAmount) / budget.allocatedAmount) * 100;
      let severity = 'LOW';
      if (overspendRatio > 20) severity = 'CRITICAL';
      else if (overspendRatio > 10) severity = 'HIGH';
      else if (overspendRatio > 5) severity = 'MEDIUM';

      const alert = new Alert({
        budgetId: budget._id,
        departmentId: budget.departmentId,
        alertType: 'OVERSPENDING',
        severity,
        message: `Budget overspent by ${overspendRatio.toFixed(2)}%`,
        status: 'OPEN'
      });
      await alert.save();
      return alert.toObject();
    }
    return null;
  }

  static async checkSpendingSpike(budget: any): Promise<any | null> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expenditures = await Expenditure.find({
      budgetId: budget._id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    if (!expenditures.length) return null;

    // Group by week (simple approach: 4 weeks roughly)
    const weeks: number[] = [0, 0, 0, 0];
    expenditures.forEach((exp: any) => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(exp.date).getTime()) / (1000 * 3600 * 24));
      const weekIndex = Math.floor(daysDiff / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        weeks[weekIndex] += exp.amountSpent;
      }
    });

    const historicalWeeks = weeks.slice(1);
    const currentWeek = weeks[0];

    const nonZeroHistorical = historicalWeeks.filter(w => w > 0);
    if (nonZeroHistorical.length < 2) return null; // Need enough data

    const baseline = calculateSpendingBaseline(historicalWeeks);
    const multiplier = 2.0;

    if (isSpendingSpike(currentWeek, baseline, multiplier)) {
      const existingAlert = await Alert.findOne({ budgetId: budget._id, alertType: 'SPENDING_SPIKE', status: 'OPEN' });
      if (existingAlert) return null;

      const alert = new Alert({
        budgetId: budget._id,
        departmentId: budget.departmentId,
        alertType: 'SPENDING_SPIKE',
        severity: 'MEDIUM',
        message: `Anomalous spending spike detected in the current week. Current: ${currentWeek}, Mean: ${baseline.mean.toFixed(2)}`,
        status: 'OPEN'
      });
      await alert.save();
      return alert.toObject();
    }
    return null;
  }

  static async checkThresholdBreaches(budget: any): Promise<any[]> {
    const alerts: any[] = [];
    const rules = await ThresholdRule.find({ isEnabled: true });
    
    const utilization = calculateUtilizationPercentage(budget.totalSpent, budget.allocatedAmount);
    const elapsed = calculateBudgetPeriodElapsed(budget.startDate, budget.endDate);

    for (const rule of rules) {
      let isBreached = false;
      let message = '';

      if (rule.ruleType === 'MAX_UTILIZATION' && utilization > rule.value) {
        isBreached = true;
        message = `Maximum utilization threshold breached. Value: ${utilization.toFixed(2)}% > ${rule.value}%`;
      } else if (rule.ruleType === 'MIN_UTILIZATION' && rule.secondaryValue && elapsed > rule.secondaryValue && utilization < rule.value) {
        isBreached = true;
        message = `Minimum utilization threshold breached. Period elapsed: ${elapsed.toFixed(2)}%, Utilized: ${utilization.toFixed(2)}% < ${rule.value}%`;
      } else if (rule.ruleType === 'EXPENDITURE_LIMIT' && budget.totalSpent > rule.value) {
        isBreached = true;
        message = `Expenditure limit threshold breached. Spent: ${budget.totalSpent} > ${rule.value}`;
      }

      if (isBreached) {
        const existingAlert = await Alert.findOne({ budgetId: budget._id, alertType: 'THRESHOLD_BREACH', status: 'OPEN' });
        if (!existingAlert) {
          const severity = utilization > 120 ? 'CRITICAL' : utilization > 100 ? 'HIGH' : 'MEDIUM';
          const alert = new Alert({
            budgetId: budget._id,
            departmentId: budget.departmentId,
            alertType: 'THRESHOLD_BREACH',
            severity,
            message,
            triggeredValue: utilization,
            thresholdValue: rule.value,
            status: 'OPEN'
          });
          await alert.save();
          alerts.push(alert.toObject());
        }
      }
    }

    return alerts;
  }

  static async getOverview(departmentId?: string, financialYear?: string): Promise<object> {
    const query: any = {};
    if (departmentId) query.departmentId = departmentId;
    if (financialYear) query.financialYear = financialYear;
    
    const budgets = await Budget.find(query).populate('departmentId', 'name');
    const alertsQuery: any = { status: 'OPEN' };
    if (departmentId) alertsQuery.departmentId = departmentId;

    const alerts = await Alert.find(alertsQuery);

    let totalAllocated = 0;
    let totalSpent = 0;
    let overBudget = 0;
    let underUtilized = 0;
    const deptMap: any = {};

    budgets.forEach((b: any) => {
      totalAllocated += b.allocatedAmount;
      totalSpent += b.totalSpent;
      const util = calculateUtilizationPercentage(b.totalSpent, b.allocatedAmount);
      const elapsed = calculateBudgetPeriodElapsed(b.startDate, b.endDate);
      if (b.totalSpent > b.allocatedAmount) overBudget++;
      if (elapsed > 70 && util < 40) underUtilized++;

      const deptId = b.departmentId?._id?.toString() || 'unknown';
      const deptName = b.departmentId?.name || 'Unknown';
      if (!deptMap[deptId]) {
        deptMap[deptId] = { departmentName: deptName, allocatedAmount: 0, spentAmount: 0 };
      }
      deptMap[deptId].allocatedAmount += b.allocatedAmount;
      deptMap[deptId].spentAmount += b.totalSpent;
    });

    const departmentStats = Object.values(deptMap).map((d: any) => ({
      ...d,
      utilization: calculateUtilizationPercentage(d.spentAmount, d.allocatedAmount)
    }));

    const severityCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    alerts.forEach((a: any) => {
      if (severityCounts[a.severity as keyof typeof severityCounts] !== undefined) {
        severityCounts[a.severity as keyof typeof severityCounts]++;
      }
    });

    return {
      totalBudgets: budgets.length,
      totalAllocated,
      totalSpent,
      utilizationPercentage: calculateUtilizationPercentage(totalSpent, totalAllocated),
      activeAlerts: alerts.length,
      overBudget,
      underUtilized,
      alertsBySeverity: severityCounts,
      departmentStats
    };
  }

  static async getDepartmentMonitoring(departmentId: string): Promise<object> {
    return this.getOverview(departmentId);
  }
}
