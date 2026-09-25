import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface Department {
  _id: string;
  name: string;
}

interface BudgetReportItem {
  department: string;
  project: string;
  year: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilizationPercentage: number;
  status: string;
}

interface ExpenditureReportItem {
  date: string;
  department: string;
  amount: number;
  category: string;
  description: string;
  status: string;
}

interface AlertReportItem {
  date: string;
  department: string;
  severity: string;
  message: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="header">
        <h2>Reports Dashboard</h2>
        <p class="subtitle">Comprehensive analysis of budget, expenditures, and alerts.</p>
      </div>
      
      <mat-card class="content-card">
        <mat-tab-group (selectedTabChange)="onTabChange($event)" color="primary" animationDuration="0ms">
          
          <!-- Budget Utilization Report -->
          <mat-tab label="Budget Utilization">
            <div class="report-content">
              <!-- Filters -->
              <div class="filters-row">
                <mat-form-field appearance="outline">
                  <mat-label>Financial Year</mat-label>
                  <mat-select [(value)]="budgetFilters.financialYear" (selectionChange)="loadBudgetReport()">
                    <mat-option value="2025-26">2025-26</mat-option>
                    <mat-option value="2024-25">2024-25</mat-option>
                    <mat-option value="2023-24">2023-24</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Department</mat-label>
                  <mat-select [(value)]="budgetFilters.departmentId" (selectionChange)="loadBudgetReport()">
                    <mat-option value="">All Departments</mat-option>
                    <mat-option *ngFor="let dept of departments" [value]="dept._id">{{dept.name}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="spacer"></div>
                
                <div class="actions">
                  <button mat-stroked-button color="primary" (click)="exportBudgetReport('csv')">
                    <mat-icon>download</mat-icon> CSV
                  </button>
                  <button mat-flat-button color="primary" (click)="exportBudgetReport('pdf')">
                    <mat-icon>picture_as_pdf</mat-icon> PDF
                  </button>
                </div>
              </div>
              
              <!-- Report Table -->
              <div class="table-container">
                <table mat-table [dataSource]="budgetReportData" class="mat-elevation-z1">
                  <ng-container matColumnDef="department">
                    <th mat-header-cell *matHeaderCellDef> Department </th>
                    <td mat-cell *matCellDef="let element"> {{element.department}} </td>
                  </ng-container>
                  
                  <ng-container matColumnDef="project">
                    <th mat-header-cell *matHeaderCellDef> Project </th>
                    <td mat-cell *matCellDef="let element"> {{element.projectName || element.project}} </td>
                  </ng-container>

                  <ng-container matColumnDef="year">
                    <th mat-header-cell *matHeaderCellDef> Year </th>
                    <td mat-cell *matCellDef="let element"> {{element.financialYear || element.year}} </td>
                  </ng-container>

                  <ng-container matColumnDef="allocated">
                    <th mat-header-cell *matHeaderCellDef> Allocated </th>
                    <td mat-cell *matCellDef="let element" class="currency"> ₹{{element.allocated | number}} </td>
                  </ng-container>

                  <ng-container matColumnDef="spent">
                    <th mat-header-cell *matHeaderCellDef> Spent </th>
                    <td mat-cell *matCellDef="let element" class="currency"> ₹{{element.spent | number}} </td>
                  </ng-container>

                  <ng-container matColumnDef="remaining">
                    <th mat-header-cell *matHeaderCellDef> Remaining </th>
                    <td mat-cell *matCellDef="let element" class="currency"> ₹{{element.remaining | number}} </td>
                  </ng-container>

                  <ng-container matColumnDef="utilization">
                    <th mat-header-cell *matHeaderCellDef> Utilization % </th>
                    <td mat-cell *matCellDef="let element">
                      <div class="utilization-bar-container">
                        <div class="utilization-bar" [style.width.%]="element.utilization || element.utilizationPercentage" [ngClass]="getUtilizationClass(element.utilization || element.utilizationPercentage)"></div>
                        <span>{{(element.utilization || element.utilizationPercentage) | number:'1.0-2'}}%</span>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Status </th>
                    <td mat-cell *matCellDef="let element">
                      <span class="status-badge" [ngClass]="element.status?.toLowerCase()">{{element.status}}</span>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="budgetColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: budgetColumns;"></tr>
                  
                  <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell empty-cell" colspan="8">No budget data available for selected filters.</td>
                  </tr>
                </table>
              </div>
            </div>
          </mat-tab>
          
          <!-- Expenditure Report -->
          <mat-tab label="Expenditures">
            <div class="report-content">
              <div class="filters-row">
                <mat-form-field appearance="outline">
                  <mat-label>Department</mat-label>
                  <mat-select [(value)]="expenditureFilters.departmentId" (selectionChange)="loadExpenditureReport()">
                    <mat-option value="">All Departments</mat-option>
                    <mat-option *ngFor="let dept of departments" [value]="dept._id">{{dept.name}}</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <div class="spacer"></div>
                
                <div class="actions">
                  <button mat-stroked-button color="primary" (click)="exportExpenditureReport('csv')">
                    <mat-icon>download</mat-icon> CSV
                  </button>
                  <button mat-flat-button color="primary" (click)="exportExpenditureReport('pdf')">
                    <mat-icon>picture_as_pdf</mat-icon> PDF
                  </button>
                </div>
              </div>
              
              <div class="table-container">
                <table mat-table [dataSource]="expenditureReportData" class="mat-elevation-z1">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef> Date </th>
                    <td mat-cell *matCellDef="let element"> {{element.date | date:'mediumDate'}} </td>
                  </ng-container>
                  <ng-container matColumnDef="department">
                    <th mat-header-cell *matHeaderCellDef> Department </th>
                    <td mat-cell *matCellDef="let element"> {{element.department}} </td>
                  </ng-container>
                  <ng-container matColumnDef="category">
                    <th mat-header-cell *matHeaderCellDef> Category </th>
                    <td mat-cell *matCellDef="let element"> {{element.category | titlecase}} </td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef> Description </th>
                    <td mat-cell *matCellDef="let element"> {{element.description}} </td>
                  </ng-container>
                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef> Amount </th>
                    <td mat-cell *matCellDef="let element" class="currency"> ₹{{element.amount | number}} </td>
                  </ng-container>
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Recorded By </th>
                    <td mat-cell *matCellDef="let element">
                      {{element.recordedBy || 'System'}}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="expenditureColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: expenditureColumns;"></tr>
                  <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell empty-cell" colspan="6">No expenditure data available.</td>
                  </tr>
                </table>
              </div>
            </div>
          </mat-tab>
          
          <!-- Alert Report -->
          <mat-tab label="Alerts">
            <div class="report-content">
              <div class="filters-row">
                <mat-form-field appearance="outline">
                  <mat-label>Severity</mat-label>
                  <mat-select [(value)]="alertFilters.severity" (selectionChange)="loadAlertReport()">
                    <mat-option value="">All Severities</mat-option>
                    <mat-option value="CRITICAL">Critical</mat-option>
                    <mat-option value="HIGH">High</mat-option>
                    <mat-option value="MEDIUM">Medium</mat-option>
                    <mat-option value="LOW">Low</mat-option>
                  </mat-select>
                </mat-form-field>
                <div class="spacer"></div>
                <div class="actions">
                  <button mat-stroked-button color="primary" (click)="exportAlertReport('csv')">
                    <mat-icon>download</mat-icon> CSV
                  </button>
                  <button mat-flat-button color="primary" (click)="exportAlertReport('pdf')">
                    <mat-icon>picture_as_pdf</mat-icon> PDF
                  </button>
                </div>
              </div>
              
              <div class="table-container">
                <table mat-table [dataSource]="alertReportData" class="mat-elevation-z1">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef> Date </th>
                    <td mat-cell *matCellDef="let element"> {{element.date || element.timestamp | date:'medium'}} </td>
                  </ng-container>
                  <ng-container matColumnDef="department">
                    <th mat-header-cell *matHeaderCellDef> Department </th>
                    <td mat-cell *matCellDef="let element"> {{element.department}} </td>
                  </ng-container>
                  <ng-container matColumnDef="severity">
                    <th mat-header-cell *matHeaderCellDef> Severity </th>
                    <td mat-cell *matCellDef="let element">
                      <span class="severity-badge" [ngClass]="element.severity?.toLowerCase()">{{element.severity}}</span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="message">
                    <th mat-header-cell *matHeaderCellDef> Message </th>
                    <td mat-cell *matCellDef="let element"> {{element.message}} </td>
                  </ng-container>
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Status </th>
                    <td mat-cell *matCellDef="let element"> {{element.status}} </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="alertColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: alertColumns;"></tr>
                  <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell empty-cell" colspan="5">No alerts found.</td>
                  </tr>
                </table>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      background-color: #f8fafc;
      min-height: calc(100vh - 64px);
    }
    .header {
      margin-bottom: 24px;
    }
    .header h2 {
      margin: 0 0 8px 0;
      color: #1e293b;
      font-size: 28px;
      font-weight: 600;
    }
    .subtitle {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }
    .content-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
      padding: 0;
      overflow: hidden;
    }
    .report-content {
      padding: 24px;
    }
    .filters-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .actions {
      display: flex;
      gap: 12px;
      align-items: center;
      height: 56px;
    }
    .table-container {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    table {
      width: 100%;
    }
    th.mat-header-cell {
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
    }
    td.mat-cell {
      color: #334155;
      font-size: 14px;
      padding: 12px 16px;
    }
    .currency {
      font-family: 'Roboto Mono', monospace;
      text-align: right;
    }
    th.mat-header-cell.currency {
      text-align: right;
    }
    .utilization-bar-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .utilization-bar {
      height: 8px;
      border-radius: 4px;
      background-color: #3b82f6;
      min-width: 60px;
    }
    .utilization-bar.warning { background-color: #f59e0b; }
    .utilization-bar.danger { background-color: #ef4444; }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-badge.active, .status-badge.approved { background-color: #dcfce3; color: #166534; }
    .status-badge.warning, .status-badge.pending { background-color: #fef3c7; color: #92400e; }
    .status-badge.critical, .status-badge.rejected { background-color: #fee2e2; color: #991b1b; }
    
    .severity-badge {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .severity-badge.high { background-color: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
    .severity-badge.medium { background-color: #fef3c7; color: #92400e; border: 1px solid #fbbf24; }
    .severity-badge.low { background-color: #e0f2fe; color: #075985; border: 1px solid #38bdf8; }
    
    .empty-cell {
      text-align: center;
      padding: 48px !important;
      color: #64748b;
      font-style: italic;
    }
  `]
})
export class ReportsComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  budgetColumns: string[] = ['department', 'project', 'year', 'allocated', 'spent', 'remaining', 'utilization', 'status'];
  expenditureColumns: string[] = ['date', 'department', 'category', 'description', 'amount', 'status'];
  alertColumns: string[] = ['date', 'department', 'severity', 'message', 'status'];

  departments: Department[] = [];
  
  budgetReportData: BudgetReportItem[] = [];
  expenditureReportData: ExpenditureReportItem[] = [];
  alertReportData: AlertReportItem[] = [];

  budgetFilters = { financialYear: '2024-25', departmentId: '' };
  expenditureFilters = { departmentId: '' };
  alertFilters = { severity: '' };

  ngOnInit() {
    this.loadDepartments();
    this.loadBudgetReport();
  }

  onTabChange(event: any) {
    if (event.index === 0) this.loadBudgetReport();
    else if (event.index === 1) this.loadExpenditureReport();
    else if (event.index === 2) this.loadAlertReport();
  }

  loadDepartments() {
    this.http.get<any>('/api/departments').subscribe({
      next: (res) => this.departments = res.data || res || [],
      error: () => {
        this.snackBar.open('Failed to load departments', 'Close', { duration: 3000 });
      }
    });
  }

  private cleanParams(params: Record<string, any>): Record<string, string> {
    const cleaned: Record<string, string> = {};
    Object.keys(params).forEach(k => {
      if (params[k] !== null && params[k] !== undefined && params[k] !== '') {
        cleaned[k] = String(params[k]);
      }
    });
    return cleaned;
  }

  loadBudgetReport() {
    const params = this.cleanParams(this.budgetFilters);
    this.http.get<any>('/api/reports/budget-utilization', { params }).subscribe({
      next: (res) => this.budgetReportData = res.data || res || [],
      error: () => {
        this.snackBar.open('Failed to load budget report', 'Close', { duration: 3000 });
      }
    });
  }

  loadExpenditureReport() {
    const params = this.cleanParams(this.expenditureFilters);
    this.http.get<any>('/api/reports/expenditures', { params }).subscribe({
      next: (res) => this.expenditureReportData = res.data || res || [],
      error: () => {
        this.snackBar.open('Failed to load expenditure report', 'Close', { duration: 3000 });
      }
    });
  }

  loadAlertReport() {
    const params = this.cleanParams(this.alertFilters);
    this.http.get<any>('/api/reports/alerts', { params }).subscribe({
      next: (res) => this.alertReportData = res.data || res || [],
      error: () => {
        this.snackBar.open('Failed to load alert report', 'Close', { duration: 3000 });
      }
    });
  }

  exportBudgetReport(format: 'csv' | 'pdf') {
    const params = new URLSearchParams(this.cleanParams({ ...this.budgetFilters, format }));
    this.downloadFile(`/api/reports/budget-utilization?${params.toString()}`, `budget-utilization-report.${format}`);
  }

  exportExpenditureReport(format: 'csv' | 'pdf') {
    const params = new URLSearchParams(this.cleanParams({ ...this.expenditureFilters, format }));
    this.downloadFile(`/api/reports/expenditures?${params.toString()}`, `expenditure-report.${format}`);
  }

  exportAlertReport(format: 'csv' | 'pdf') {
    const params = new URLSearchParams(this.cleanParams({ ...this.alertFilters, format }));
    this.downloadFile(`/api/reports/alerts?${params.toString()}`, `alert-report.${format}`);
  }

  private downloadFile(url: string, filename: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.snackBar.open(`Successfully exported ${filename}`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open(`Export failed. Please check server status.`, 'Close', { duration: 3000 });
      }
    });
  }

  getUtilizationClass(percentage: number): string {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return '';
  }
}
