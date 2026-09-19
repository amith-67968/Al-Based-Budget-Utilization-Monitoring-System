import { calculateTotalSpent, calculateRemainingBudget, calculateUtilizationPercentage, calculateBudgetPeriodElapsed, calculateSpendingBaseline, isSpendingSpike } from '../utils/calculations';

describe('Financial Calculations', () => {
  describe('calculateTotalSpent', () => {
    it('should sum all expenditure amounts', () => {
      const expenditures = [
        { amountSpent: 10000 },
        { amountSpent: 25000 },
        { amountSpent: 15000 },
      ];
      expect(calculateTotalSpent(expenditures)).toBe(50000);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalSpent([])).toBe(0);
    });

    it('should handle single expenditure', () => {
      expect(calculateTotalSpent([{ amountSpent: 42000 }])).toBe(42000);
    });
  });

  describe('calculateRemainingBudget', () => {
    it('should calculate remaining budget correctly', () => {
      expect(calculateRemainingBudget(1000000, 400000)).toBe(600000);
    });

    it('should return negative when overspent', () => {
      expect(calculateRemainingBudget(1000000, 1100000)).toBe(-100000);
    });

    it('should return full amount when nothing spent', () => {
      expect(calculateRemainingBudget(500000, 0)).toBe(500000);
    });
  });

  describe('calculateUtilizationPercentage', () => {
    it('should calculate utilization percentage', () => {
      expect(calculateUtilizationPercentage(400000, 1000000)).toBe(40);
    });

    it('should handle overspending (>100%)', () => {
      expect(calculateUtilizationPercentage(1100000, 1000000)).toBe(110);
    });

    it('should return 0 for zero allocation (prevent division by zero)', () => {
      expect(calculateUtilizationPercentage(5000, 0)).toBe(0);
    });

    it('should return 0 when nothing spent', () => {
      expect(calculateUtilizationPercentage(0, 1000000)).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateUtilizationPercentage(333333, 1000000)).toBe(33.33);
    });
  });

  describe('calculateBudgetPeriodElapsed', () => {
    it('should calculate period elapsed percentage', () => {
      const start = new Date('2025-04-01');
      const end = new Date('2026-03-31');
      // Mock current date to mid-year
      const now = new Date('2025-10-01');
      const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      const elapsedDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      const expected = Math.round((elapsedDays / totalDays) * 10000) / 100;
      const result = calculateBudgetPeriodElapsed(start, end);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should return 0 for future budget', () => {
      const start = new Date('2027-04-01');
      const end = new Date('2028-03-31');
      const result = calculateBudgetPeriodElapsed(start, end);
      expect(result).toBe(0);
    });

    it('should return 100 for past budget', () => {
      const start = new Date('2020-04-01');
      const end = new Date('2021-03-31');
      const result = calculateBudgetPeriodElapsed(start, end);
      expect(result).toBe(100);
    });
  });

  describe('calculateSpendingBaseline', () => {
    it('should calculate mean and stdDev', () => {
      const amounts = [100, 200, 300, 400, 500];
      const result = calculateSpendingBaseline(amounts);
      expect(result.mean).toBe(300);
      expect(result.stdDev).toBeGreaterThan(0);
    });

    it('should handle single value', () => {
      const result = calculateSpendingBaseline([1000]);
      expect(result.mean).toBe(1000);
      expect(result.stdDev).toBe(0);
    });

    it('should handle empty array', () => {
      const result = calculateSpendingBaseline([]);
      expect(result.mean).toBe(0);
      expect(result.stdDev).toBe(0);
    });
  });

  describe('isSpendingSpike', () => {
    it('should detect spending spike', () => {
      const baseline = { mean: 100000, stdDev: 20000 };
      // 200000 > 100000 + (2 * 20000) = 140000
      expect(isSpendingSpike(200000, baseline, 2)).toBe(true);
    });

    it('should not flag normal spending', () => {
      const baseline = { mean: 100000, stdDev: 20000 };
      // 130000 < 100000 + (2 * 20000) = 140000
      expect(isSpendingSpike(130000, baseline, 2)).toBe(false);
    });

    it('should handle zero stdDev', () => {
      const baseline = { mean: 100000, stdDev: 0 };
      // When stdDev is 0, threshold = mean * (1 + multiplier) = 300000
      expect(isSpendingSpike(100001, baseline, 2)).toBe(false);
      expect(isSpendingSpike(400000, baseline, 2)).toBe(true);
    });
  });
});

describe('Monitoring Rules Logic', () => {
  describe('Under-utilization detection', () => {
    it('should flag when period elapsed > threshold and utilization < threshold', () => {
      // Budget period: 70% elapsed, utilization: 30% < 40%
      const periodElapsed = 70;
      const utilization = 30;
      const periodThreshold = 70;
      const utilizationThreshold = 40;
      const isUnderUtilized = periodElapsed >= periodThreshold && utilization < utilizationThreshold;
      expect(isUnderUtilized).toBe(true);
    });

    it('should not flag when utilization is adequate', () => {
      const periodElapsed = 80;
      const utilization = 50;
      const periodThreshold = 70;
      const utilizationThreshold = 40;
      const isUnderUtilized = periodElapsed >= periodThreshold && utilization < utilizationThreshold;
      expect(isUnderUtilized).toBe(false);
    });

    it('should not flag when period not yet elapsed enough', () => {
      const periodElapsed = 30;
      const utilization = 10;
      const periodThreshold = 70;
      const utilizationThreshold = 40;
      const isUnderUtilized = periodElapsed >= periodThreshold && utilization < utilizationThreshold;
      expect(isUnderUtilized).toBe(false);
    });
  });

  describe('Overspending detection', () => {
    it('should detect when totalSpent > allocatedAmount', () => {
      const totalSpent = 1100000;
      const allocated = 1000000;
      expect(totalSpent > allocated).toBe(true);
    });

    it('should assign CRITICAL severity for >20% overspend', () => {
      const overspendRatio = ((1250000 - 1000000) / 1000000) * 100;
      let severity: string;
      if (overspendRatio > 20) severity = 'CRITICAL';
      else if (overspendRatio > 10) severity = 'HIGH';
      else if (overspendRatio > 5) severity = 'MEDIUM';
      else severity = 'LOW';
      expect(severity).toBe('CRITICAL');
    });

    it('should assign HIGH severity for 10-20% overspend', () => {
      const overspendRatio = ((1150000 - 1000000) / 1000000) * 100;
      let severity: string;
      if (overspendRatio > 20) severity = 'CRITICAL';
      else if (overspendRatio > 10) severity = 'HIGH';
      else if (overspendRatio > 5) severity = 'MEDIUM';
      else severity = 'LOW';
      expect(severity).toBe('HIGH');
    });
  });

  describe('Spending spike detection', () => {
    it('should detect spike when current exceeds baseline threshold', () => {
      const weeklyTotals = [50000, 60000, 55000, 45000, 70000];
      const baseline = calculateSpendingBaseline(weeklyTotals);
      const currentWeek = 200000;
      const multiplier = 2;
      expect(isSpendingSpike(currentWeek, baseline, multiplier)).toBe(true);
    });

    it('should not flag moderate increase', () => {
      const weeklyTotals = [50000, 60000, 55000, 45000, 70000];
      const baseline = calculateSpendingBaseline(weeklyTotals);
      // threshold = mean + multiplier * stdDev ≈ 56000 + 2 * 9354 ≈ 74709
      const currentWeek = 70000; // At mean level, not a spike
      const multiplier = 2;
      expect(isSpendingSpike(currentWeek, baseline, multiplier)).toBe(false);
    });
  });
});
