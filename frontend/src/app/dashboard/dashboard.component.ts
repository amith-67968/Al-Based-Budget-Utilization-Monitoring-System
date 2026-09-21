import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BudgetService } from '../services/budget.service';
import { AlertService } from '../services/alert.service';
import { ExpenditureService } from '../services/expenditure.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatTableModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule,
    NgChartsModule
  ],
  template: `
    <div class="page-container">
      <h2>Dashboard</h2>
      
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      
      <ng-container *ngIf="!isLoading">
        <!-- KPI Cards Row -->
        <div class="kpi-row">
          <mat-card class="kpi-card">
            <div class="kpi-label">Total Budget</div>
            <div class="kpi-value">₹{{dashboardStats?.totalBudget | number}}</div>
          </mat-card>
          <mat-card class="kpi-card">
            <div class="kpi-label">Total Spent</div>
            <div class="kpi-value">₹{{dashboardStats?.totalSpent | number}}</div>
          </mat-card>
          <mat-card class="kpi-card">
            <div class="kpi-label">Remaining</div>
            <div class="kpi-value">₹{{dashboardStats?.remainingBudget | number}}</div>
          </mat-card>
          <mat-card class="kpi-card" [ngClass]="getUtilizationClass(dashboardStats?.utilizationPercentage)">
            <div class="kpi-label">Utilization</div>
            <div class="kpi-value">{{dashboardStats?.utilizationPercentage | number:'1.0-2'}}%</div>
          </mat-card>
          <mat-card class="kpi-card alert-kpi">
            <div class="kpi-label">Open Alerts</div>
            <div class="kpi-value">{{alertStats?.openAlerts || 0}}</div>
          </mat-card>
          <mat-card class="kpi-card critical-alert-kpi">
            <div class="kpi-label">Critical Alerts</div>
            <div class="kpi-value">{{alertStats?.criticalAlerts || 0}}</div>
          </mat-card>
        </div>
        
        <!-- Charts Row -->
        <div class="charts-row">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Budget vs Expenditure</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas baseChart 
                [data]="budgetVsExpenseChart" 
                [options]="barChartOptions" 
                [type]="'bar'">
              </canvas>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Utilization by Department</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas baseChart 
                [data]="utilizationChart" 
                [options]="barChartOptions" 
                [type]="'bar'">
              </canvas>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="charts-row">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Spending Trend</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas baseChart 
                [data]="spendingTrendChart" 
                [options]="lineChartOptions" 
                [type]="'line'">
              </canvas>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Alert Distribution</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="pie-chart-container">
                <canvas baseChart 
                  [data]="alertDistributionChart" 
                  [options]="pieChartOptions" 
                  [type]="'pie'">
                </canvas>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <!-- Tables Row -->
        <div class="tables-row">
          <!-- Recent Transactions -->
          <mat-card class="table-card">
            <mat-card-header>
              <mat-card-title>Recent Transactions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="recentTransactions" class="mat-elevation-z0">
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef> Date </th>
                  <td mat-cell *matCellDef="let element"> {{element.date | date}} </td>
                </ng-container>
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef> Description </th>
                  <td mat-cell *matCellDef="let element"> {{element.description}} </td>
                </ng-container>
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef> Amount </th>
                  <td mat-cell *matCellDef="let element"> ₹{{element.amountSpent | number}} </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['date', 'description', 'amount']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['date', 'description', 'amount'];"></tr>
              </table>
              <div *ngIf="recentTransactions.length === 0" class="empty-state">No recent transactions</div>
            </mat-card-content>
          </mat-card>

          <!-- Recent Alerts -->
          <mat-card class="table-card">
            <mat-card-header>
              <mat-card-title>Recent Alerts</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="recentAlerts" class="mat-elevation-z0">
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef> Date </th>
                  <td mat-cell *matCellDef="let element"> {{element.createdAt | date}} </td>
                </ng-container>
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef> Type </th>
                  <td mat-cell *matCellDef="let element"> 
                    <mat-chip-set>
                      <mat-chip [color]="element.severity === 'CRITICAL' ? 'warn' : 'accent'" highlighted>
                        {{element.alertType}}
                      </mat-chip>
                    </mat-chip-set>
                  </td>
                </ng-container>
                <ng-container matColumnDef="message">
                  <th mat-header-cell *matHeaderCellDef> Message </th>
                  <td mat-cell *matCellDef="let element"> {{element.message}} </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['date', 'type', 'message']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['date', 'type', 'message'];"></tr>
              </table>
              <div *ngIf="recentAlerts.length === 0" class="empty-state">No recent alerts</div>
            </mat-card-content>
          </mat-card>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 12px;
      overflow: hidden;
    }
    .kpi-label {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 6px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-value {
      font-size: clamp(16px, 1.2vw, 20px);
      font-weight: 700;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .kpi-good { border-left: 4px solid #4caf50; }
    .kpi-warning { border-left: 4px solid #ff9800; }
    .kpi-danger { border-left: 4px solid #f44336; }
    .alert-kpi { border-left: 4px solid #ff9800; }
    .critical-alert-kpi { border-left: 4px solid #f44336; }
    
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .chart-card {
      padding: 16px;
    }
    .pie-chart-container {
      height: 300px;
      display: flex;
      justify-content: center;
    }
    .tables-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .table-card {
      padding: 16px;
    }
    .empty-state {
      padding: 16px;
      text-align: center;
      color: #888;
    }
    @media (max-width: 768px) {
      .charts-row, .tables-row { grid-template-columns: 1fr; }
    }
    table {
      width: 100%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  dashboardStats: any = {};
  alertStats: any = {};
  recentTransactions: any[] = [];
  recentAlerts: any[] = [];
  
  // Chart data
  budgetVsExpenseChart: ChartData<'bar'> = { labels: [], datasets: [] };
  utilizationChart: ChartData<'bar'> = { labels: [], datasets: [] };
  spendingTrendChart: ChartData<'line'> = { labels: [], datasets: [] };
  alertDistributionChart: ChartData<'pie'> = { labels: [], datasets: [] };
  
  // Chart options
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  };
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };
  
  constructor(
    private budgetService: BudgetService,
    private alertService: AlertService,
    private expenditureService: ExpenditureService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  getUtilizationClass(percentage: number): string {
    if (percentage == null) return '';
    if (percentage > 90) return 'kpi-danger';
    if (percentage > 70) return 'kpi-warning';
    return 'kpi-good';
  }

  loadData() {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    const deptId = currentUser?.departmentId;

    // Simulate concurrent data fetching, adapt as needed with RxJS forkJoin
    Promise.all([
      this.budgetService.getDashboardStats(deptId).toPromise().catch(() => ({})),
      this.alertService.getStats(deptId).toPromise().catch(() => ({})),
      this.alertService.getRecent(5).toPromise().catch(() => []),
      this.expenditureService.getRecent(5).toPromise().catch(() => [])
    ]).then(([dashStats, alertStats, alerts, txs]: any[]) => {
      this.dashboardStats = dashStats?.data || dashStats;
      this.alertStats = alertStats?.data || alertStats;
      this.recentAlerts = (alerts as any)?.data || alerts || [];
      this.recentTransactions = (txs as any)?.data || txs || [];
      
      this.setupCharts(this.dashboardStats, this.alertStats);
      this.isLoading = false;
    });
  }

  setupCharts(dashStats: any, alertStats: any) {
    if (dashStats?.departmentSummaries) {
      const deptLabels = dashStats.departmentSummaries.map((s: any) => s.name);
      const deptBudgets = dashStats.departmentSummaries.map((s: any) => s.allocated);
      const deptSpent = dashStats.departmentSummaries.map((s: any) => s.spent);
      const deptUtil = dashStats.departmentSummaries.map((s: any) => s.utilization);

      this.budgetVsExpenseChart = {
        labels: deptLabels,
        datasets: [
          { data: deptBudgets, label: 'Allocated Budget', backgroundColor: '#4f46e5' },
          { data: deptSpent, label: 'Spent', backgroundColor: '#f44336' }
        ]
      };

      this.utilizationChart = {
        labels: deptLabels,
        datasets: [
          { data: deptUtil, label: 'Utilization %', backgroundColor: '#10b981' }
        ]
      };
    }

    if (dashStats?.spendingTrend) {
      this.spendingTrendChart = {
        labels: dashStats.spendingTrend.map((t: any) => t.month),
        datasets: [
          { data: dashStats.spendingTrend.map((t: any) => t.amount), label: 'Monthly Spending', borderColor: '#3f51b5', fill: false, tension: 0.1 }
        ]
      };
    }

    if (alertStats?.byType) {
      this.alertDistributionChart = {
        labels: Object.keys(alertStats.byType),
        datasets: [{
          data: Object.values(alertStats.byType),
          backgroundColor: ['#f44336', '#ff9800', '#4f46e5', '#10b981']
        }]
      };
    }
  }
}
