export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'finance_officer' | 'department_head';
  departmentId?: any;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  headUserId?: any;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  financialYear: string;
  departmentId: any;
  projectName: string;
  allocatedAmount: number;
  totalSpent: number;
  allocationDate: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'closed' | 'exceeded';
  createdBy: any;
  createdAt: string;
  updatedAt: string;
  remainingBudget?: number;
  utilizationPercentage?: number;
}

export interface Expenditure {
  _id: string;
  budgetId: any;
  departmentId: any;
  amountSpent: number;
  expenseCategory: string;
  date: string;
  description: string;
  supportingDocumentReference?: string;
  recordedBy: any;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  _id: string;
  budgetId: any;
  departmentId: any;
  alertType: 'UNDER_UTILIZATION' | 'OVERSPENDING' | 'SPENDING_SPIKE' | 'THRESHOLD_BREACH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  triggeredValue: number;
  thresholdValue: number;
  status: 'OPEN' | 'REVIEWED' | 'RESOLVED';
  reviewedBy?: any;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThresholdRule {
  _id: string;
  ruleType: string;
  value: number;
  secondaryValue?: number;
  enabled: boolean;
  description: string;
  createdBy?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  _id: string;
  userId: any;
  action: string;
  entityType: string;
  entityId?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  utilizationPercentage: number;
  budgetCount: number;
  departmentSummaries: DepartmentSummary[];
}

export interface DepartmentSummary {
  departmentId: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization: number;
}

export interface AlertStats {
  bySeverity: { [key: string]: number };
  byType: { [key: string]: number };
  byStatus: { [key: string]: number };
  total: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}
