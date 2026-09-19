export function calculateTotalSpent(expenditures: { amountSpent: number }[]): number {
  return expenditures.reduce((total, exp) => total + exp.amountSpent, 0);
}

export function calculateRemainingBudget(allocated: number, spent: number): number {
  return allocated - spent;
}

export function calculateUtilizationPercentage(spent: number, allocated: number): number {
  if (allocated === 0) return 0;
  const percentage = (spent / allocated) * 100;
  return Math.round(percentage * 100) / 100;
}

export function calculateBudgetPeriodElapsed(startDate: Date, endDate: Date): number {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now <= start) return 0;
  if (now >= end) return 100;
  
  const totalDuration = end.getTime() - start.getTime();
  const elapsedDuration = now.getTime() - start.getTime();
  
  const percentage = (elapsedDuration / totalDuration) * 100;
  return Math.round(percentage * 100) / 100;
}

export function calculateSpendingBaseline(amounts: number[]): { mean: number, stdDev: number } {
  if (amounts.length === 0) return { mean: 0, stdDev: 0 };
  
  const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
  
  if (amounts.length === 1) return { mean, stdDev: 0 };
  
  const squaredDiffs = amounts.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (amounts.length - 1);
  const stdDev = Math.sqrt(variance);
  
  return { mean, stdDev };
}

export function isSpendingSpike(currentAmount: number, baseline: { mean: number, stdDev: number }, multiplier: number): boolean {
  if (baseline.stdDev === 0) {
    if (baseline.mean === 0) return currentAmount > 0;
    return currentAmount > baseline.mean * (1 + multiplier);
  }
  const threshold = baseline.mean + (baseline.stdDev * multiplier);
  return currentAmount > threshold;
}
