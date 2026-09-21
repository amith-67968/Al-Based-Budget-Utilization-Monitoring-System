import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { BudgetService } from '../../services/budget.service';
import { ExpenditureService } from '../../services/expenditure.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatTableModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatProgressBarModule, MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h2>Budget Details</h2>
        </div>
        <div class="header-right" *ngIf="budget">
          <button mat-stroked-button color="primary" [routerLink]="['/budgets/edit', budget._id]">
            <mat-icon>edit</mat-icon> Edit
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="budget && !isLoading" class="content-grid">
        <!-- Budget Info -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>{{budget.projectName}}</mat-card-title>
            <mat-card-subtitle>{{budget.departmentId?.name}} | FY: {{budget.financialYear}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Status:</span>
                <span class="value">{{budget.status}}</span>
              </div>
              <div class="info-item">
                <span class="label">Allocation Date:</span>
                <span class="value">{{budget.allocationDate | date}}</span>
              </div>
              <div class="info-item">
                <span class="label">Start Date:</span>
                <span class="value">{{budget.startDate | date}}</span>
              </div>
              <div class="info-item">
                <span class="label">End Date:</span>
                <span class="value">{{budget.endDate | date}}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Financial Summary -->
        <mat-card class="finance-card">
          <mat-card-header>
            <mat-card-title>Financial Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="finance-stats">
              <div class="stat-box">
                <div class="stat-label">Allocated</div>
                <div class="stat-value text-primary">₹{{budget.allocatedAmount | number}}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Spent</div>
                <div class="stat-value text-danger">₹{{budget.totalSpent | number}}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Remaining</div>
                <div class="stat-value text-success">₹{{budget.remainingBudget | number}}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Utilization</div>
                <div class="stat-value">{{budget.utilizationPercentage | number:'1.0-2'}}%</div>
              </div>
            </div>
            
            <div class="progress-section">
              <div class="progress-header">
                <span>Utilization</span>
                <span>{{budget.utilizationPercentage | number:'1.0-2'}}%</span>
              </div>
              <mat-progress-bar 
                mode="determinate" 
                [value]="budget.utilizationPercentage"
                [color]="getProgressBarColor(budget.utilizationPercentage)">
              </mat-progress-bar>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Expenditure History -->
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>Expenditure History</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="expenditures" class="mat-elevation-z0">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef> Date </th>
                <td mat-cell *matCellDef="let element"> {{element.date | date}} </td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef> Description </th>
                <td mat-cell *matCellDef="let element"> {{element.description}} </td>
              </ng-container>
              <ng-container matColumnDef="vendor">
                <th mat-header-cell *matHeaderCellDef> Category </th>
                <td mat-cell *matCellDef="let element"> {{element.expenseCategory}} </td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef> Amount </th>
                <td mat-cell *matCellDef="let element"> ₹{{element.amountSpent | number}} </td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef> Recorded By </th>
                <td mat-cell *matCellDef="let element"> {{element.recordedBy?.name}} </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="expColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: expColumns;"></tr>
            </table>
            <div *ngIf="expenditures.length === 0" class="empty-state">No expenditures found.</div>
          </mat-card-content>
        </mat-card>

        <!-- Alerts -->
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>Alerts</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="alerts" class="mat-elevation-z0">
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
              <tr mat-header-row *matHeaderRowDef="alertColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: alertColumns;"></tr>
            </table>
            <div *ngIf="alerts.length === 0" class="empty-state">No alerts found.</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header-left h2 {
      margin: 0;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .info-card, .finance-card {
      margin-bottom: 24px;
    }
    .table-card {
      grid-column: 1 / -1;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-item .label {
      font-size: 12px;
      color: #666;
    }
    .info-item .value {
      font-weight: 500;
      margin-top: 4px;
    }
    .finance-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 16px;
      margin-bottom: 24px;
    }
    .stat-box {
      text-align: center;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 18px;
      font-weight: 500;
    }
    .text-primary { color: #3f51b5; }
    .text-danger { color: #f44336; }
    .text-success { color: #4caf50; }
    .progress-section {
      margin-top: 16px;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
    }
    .empty-state {
      padding: 24px;
      text-align: center;
      color: #888;
    }
    table {
      width: 100%;
    }
    @media (max-width: 900px) {
      .content-grid { grid-template-columns: 1fr; }
      .finance-stats { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class BudgetDetailComponent implements OnInit {
  budget: any;
  expenditures: any[] = [];
  alerts: any[] = [];
  isLoading = true;
  
  expColumns: string[] = ['date', 'description', 'vendor', 'amount', 'status'];
  alertColumns: string[] = ['date', 'type', 'message'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private budgetService: BudgetService,
    private expenditureService: ExpenditureService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBudgetDetails(id);
    } else {
      this.goBack();
    }
  }

  loadBudgetDetails(id: string) {
    this.isLoading = true;
    const budgetId = id;
    
    // Parallel fetching
    Promise.all([
      this.budgetService.getById(budgetId).toPromise(),
      this.expenditureService.getAll({ budgetId, limit: 100 }).toPromise().catch(() => ({})),
      this.alertService.getAll({ budgetId, limit: 100 }).toPromise().catch(() => ({}))
    ]).then(([budgetRes, expsRes, alertsRes]: any[]) => {
      this.budget = budgetRes?.data || budgetRes;
      this.expenditures = expsRes?.data || expsRes || [];
      this.alerts = alertsRes?.data || alertsRes || [];
      this.isLoading = false;
    }).catch(err => {
      console.error('Error loading budget details', err);
      this.isLoading = false;
      this.goBack();
    });
  }

  getProgressBarColor(percentage: number): 'primary' | 'accent' | 'warn' {
    if (percentage > 90) return 'warn';
    if (percentage > 70) return 'accent';
    return 'primary';
  }

  goBack() {
    this.router.navigate(['/budgets']);
  }
}
