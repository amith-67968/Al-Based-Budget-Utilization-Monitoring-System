import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MonitoringService } from '../services/monitoring.service';
import { BudgetService } from '../services/budget.service';
import { DepartmentService } from '../services/department.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSelectModule,
    MatFormFieldModule, MatTableModule, MatProgressSpinnerModule, MatSnackBarModule,
    NgChartsModule, CurrencyPipe, PercentPipe
  ],
  template: `
    <div class="page-container">
      <div class="header-row">
        <h2>Monitoring & Analytics</h2>
      </div>
      
      <!-- Filters Row -->
      <mat-card class="filter-card">
        <div class="filters-row">
          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select [(value)]="selectedDepartment" (selectionChange)="loadDashboardData()">
              <mat-option value="">All Departments</mat-option>
              <mat-option *ngFor="let dept of departments" [value]="dept._id">{{dept.name}}</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Financial Year</mat-label>
            <mat-select [(value)]="selectedYear" (selectionChange)="loadDashboardData()">
              <mat-option value="">All Financial Years</mat-option>
              <mat-option value="2025-26">2025-26</mat-option>
              <mat-option value="2024-25">2024-25</mat-option>
              <mat-option value="2023-24">2023-24</mat-option>
            </mat-select>
          </mat-form-field>
          
          <span class="spacer"></span>
          
          <button mat-raised-button color="primary" (click)="runMonitoring()" [disabled]="isMonitoring">
            <mat-icon *ngIf="!isMonitoring">play_arrow</mat-icon>
            <mat-spinner diameter="20" *ngIf="isMonitoring" class="btn-spinner"></mat-spinner>
            Run Monitoring
          </button>
        </div>
      </mat-card>
      
      <!-- Overview KPIs -->
      <div class="kpi-row" *ngIf="overview">
        <mat-card class="kpi-card">
          <div class="kpi-label">Total Budgets</div>
          <div class="kpi-value">{{overview.totalBudgets}}</div>
          <div class="kpi-subvalue">Assigned Schemes</div>
        </mat-card>
        <mat-card class="kpi-card">
          <div class="kpi-label">Total Allocated</div>
          <div class="kpi-value amount-positive" [title]="'₹' + (overview.totalAllocated | number)">
            ₹{{overview.totalAllocated | number}}
          </div>
          <div class="kpi-subvalue">₹{{ (overview.totalAllocated / 10000000) | number:'1.2-2' }} Cr</div>
        </mat-card>
        <mat-card class="kpi-card">
          <div class="kpi-label">Total Spent</div>
          <div class="kpi-value amount-warning" [title]="'₹' + (overview.totalSpent | number)">
            ₹{{overview.totalSpent | number}}
          </div>
          <div class="kpi-subvalue">₹{{ (overview.totalSpent / 10000000) | number:'1.2-2' }} Cr</div>
        </mat-card>
        <mat-card class="kpi-card">
          <div class="kpi-label">Overall Utilization</div>
          <div class="kpi-value" [ngClass]="getUtilizationClass(overview.utilizationPercentage)">
            {{(overview.utilizationPercentage || 0) | number:'1.1-2'}}%
          </div>
          <div class="kpi-subvalue">Of Total Allocation</div>
        </mat-card>
        <mat-card class="kpi-card alert-card">
          <div class="kpi-label">Active Alerts</div>
          <div class="kpi-value alert-value">{{overview.activeAlerts}}</div>
          <div class="kpi-subvalue">Requires Attention</div>
        </mat-card>
      </div>
      
      <!-- Charts Row -->
      <div class="charts-row">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Budget Utilization by Department</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="barChartData"
              [options]="barChartOptions"
              [type]="'bar'">
            </canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Spending vs Allocation</mat-card-title>
          </mat-card-header>
          <mat-card-content class="doughnut-container">
            <canvas baseChart
              [data]="doughnutChartData"
              [options]="doughnutChartOptions"
              [type]="'doughnut'">
            </canvas>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Department Breakdown Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Department Performance</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="departmentStats">
            
            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef> Department </th>
              <td mat-cell *matCellDef="let element"> {{element.departmentId?.name || element.departmentName}} </td>
            </ng-container>

            <ng-container matColumnDef="allocated">
              <th mat-header-cell *matHeaderCellDef> Allocated </th>
              <td mat-cell *matCellDef="let element"> ₹{{element.allocatedAmount | number}} </td>
            </ng-container>

            <ng-container matColumnDef="spent">
              <th mat-header-cell *matHeaderCellDef> Spent </th>
              <td mat-cell *matCellDef="let element"> ₹{{element.spentAmount | number}} </td>
            </ng-container>
            
            <ng-container matColumnDef="remaining">
              <th mat-header-cell *matHeaderCellDef> Remaining </th>
              <td mat-cell *matCellDef="let element"> ₹{{(element.allocatedAmount - element.spentAmount) | number}} </td>
            </ng-container>

            <ng-container matColumnDef="utilization">
              <th mat-header-cell *matHeaderCellDef> Utilization </th>
              <td mat-cell *matCellDef="let element"> 
                <span [ngClass]="getUtilizationClass(element.utilizationPercentage)">
                  {{(element.utilizationPercentage || 0) | number:'1.1-2'}}%
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let element">
                <span class="status-badge" [ngClass]="getStatusClass(element.status)">
                  {{element.status | uppercase}}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .header-row {
      margin-bottom: 24px;
    }
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }
    .filter-card {
      margin-bottom: 24px;
    }
    .filters-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      padding: 18px 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      overflow: hidden;
    }
    .kpi-label {
      color: #64748b;
      font-size: 11px;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-weight: 700;
    }
    .kpi-value {
      font-size: clamp(16px, 1.35vw, 22px);
      font-weight: 700;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      letter-spacing: -0.3px;
    }
    .kpi-subvalue {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      margin-top: 4px;
    }
    .amount-positive { color: #15803d; }
    .amount-warning { color: #b45309; }
    .alert-card { border-left: 4px solid #dc2626; }
    .alert-value { color: #dc2626; font-weight: 700; }
    
    .charts-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .chart-card {
      height: 400px;
    }
    .doughnut-container {
      display: flex;
      justify-content: center;
      height: 300px;
    }
    .table-card {
      width: 100%;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-on-track { background: #e8f5e9; color: #2e7d32; }
    .status-at-risk { background: #fff3e0; color: #ef6c00; }
    .status-over-budget { background: #ffebee; color: #c62828; }
    .util-low { color: #1976d2; }
    .util-good { color: #2e7d32; }
    .util-high { color: #ef6c00; }
    .util-critical { color: #c62828; font-weight: 600; }
    
    .btn-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    
    @media (max-width: 900px) {
      .charts-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MonitoringComponent implements OnInit {
  departments: any[] = [];
  selectedDepartment: string = '';
  selectedYear: string = '2025-26';
  isMonitoring = false;
  userRole = '';
  userDepartmentId = '';

  overview: any = {
    totalBudgets: 0,
    totalAllocated: 0,
    totalSpent: 0,
    utilizationPercentage: 0,
    activeAlerts: 0
  };

  displayedColumns = ['department', 'allocated', 'spent', 'remaining', 'utilization', 'status'];
  departmentStats: any[] = [];

  // Bar Chart options
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: {}, y: { beginAtZero: true } },
    plugins: { legend: { display: true } }
  };
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Doughnut Chart options
  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
  doughnutChartData: ChartData<'doughnut'> = { labels: ['Spent', 'Remaining'], datasets: [{ data: [0, 0] }] };

  constructor(
    private monitoringService: MonitoringService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUser()?.role || '';
    this.userDepartmentId = this.authService.getCurrentUser()?.departmentId || '';

    if (this.userRole === 'department_head') {
      this.selectedDepartment = this.userDepartmentId;
    }

    this.departmentService.getAll().subscribe((res: any) => {
      this.departments = res.data || res;
    });

    this.loadDashboardData();
  }

  loadDashboardData() {
    // In a real app, you would pass filters to the service
    const filters = {
      departmentId: this.selectedDepartment,
      year: this.selectedYear
    };

    this.monitoringService.getOverview(this.selectedDepartment, this.selectedYear).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.overview = {
          totalBudgets: data.totalBudgets || 0,
          totalAllocated: data.totalAllocated || 0,
          totalSpent: data.totalSpent || 0,
          utilizationPercentage: data.utilizationPercentage || 0,
          activeAlerts: data.activeAlerts || 0
        };

        this.departmentStats = data.departmentStats || [];
        this.updateCharts();
      },
      error: () => {
        this.snackBar.open('Failed to load dashboard data', 'Close', { duration: 3000 });
      }
    });
  }

  updateCharts() {
    // Update Bar Chart
    const labels = this.departmentStats.map(d => d.departmentName);
    const allocated = this.departmentStats.map(d => d.allocatedAmount);
    const spent = this.departmentStats.map(d => d.spentAmount);

    this.barChartData = {
      labels,
      datasets: [
        { data: allocated, label: 'Allocated', backgroundColor: 'rgba(54, 162, 235, 0.6)' },
        { data: spent, label: 'Spent', backgroundColor: 'rgba(255, 99, 132, 0.6)' }
      ]
    };

    // Update Doughnut Chart
    const remaining = Math.max(0, this.overview.totalAllocated - this.overview.totalSpent);
    this.doughnutChartData = {
      labels: ['Spent', 'Remaining'],
      datasets: [
        { 
          data: [this.overview.totalSpent, remaining],
          backgroundColor: ['#f44336', '#4caf50'],
          hoverBackgroundColor: ['#d32f2f', '#388e3c']
        }
      ]
    };
  }

  runMonitoring() {
    this.isMonitoring = true;
    this.monitoringService.runMonitoring().subscribe({
      next: (res: any) => {
        this.isMonitoring = false;
        this.snackBar.open('Monitoring job completed successfully', 'Close', { duration: 3000 });
        this.loadDashboardData();
      },
      error: () => {
        this.isMonitoring = false;
        this.snackBar.open('Error running monitoring job', 'Close', { duration: 3000 });
      }
    });
  }

  getUtilizationClass(percentage: number): string {
    if (percentage < 30) return 'util-low';
    if (percentage < 80) return 'util-good';
    if (percentage <= 100) return 'util-high';
    return 'util-critical';
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-on-track';
    switch(status.toUpperCase()) {
      case 'ON_TRACK': return 'status-on-track';
      case 'AT_RISK': return 'status-at-risk';
      case 'OVER_BUDGET': return 'status-over-budget';
      default: return 'status-on-track';
    }
  }
}
