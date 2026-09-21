import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BudgetService } from '../../services/budget.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatMenuModule, MatCardModule, MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Budgets</h2>
        <button mat-raised-button color="primary" *ngIf="canCreateBudget" (click)="navigateToCreate()">
          <mat-icon>add</mat-icon> Create Budget
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-card-content class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Search Budgets</mat-label>
            <input matInput (keyup)="onSearch($event)" placeholder="Ex. Project Alpha" #input>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Financial Year</mat-label>
            <mat-select (selectionChange)="onFilterChange('financialYear', $event.value)">
              <mat-option value="">All</mat-option>
              <mat-option value="2025-26">2025-26</mat-option>
              <mat-option value="2024-25">2024-25</mat-option>
              <mat-option value="2023-24">2023-24</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select (selectionChange)="onFilterChange('status', $event.value)">
              <mat-option value="">All</mat-option>
              <mat-option value="active">Active</mat-option>
              <mat-option value="draft">Draft</mat-option>
              <mat-option value="closed">Closed</mat-option>
              <mat-option value="exceeded">Exceeded</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <div class="table-container">
          <div *ngIf="isLoading" class="loading-shade">
            <mat-spinner></mat-spinner>
          </div>
          <table mat-table [dataSource]="dataSource" matSort>
            
            <ng-container matColumnDef="projectName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Project Name </th>
              <td mat-cell *matCellDef="let row"> {{row.projectName}} </td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Department </th>
              <td mat-cell *matCellDef="let row"> {{row.departmentId?.name}} </td>
            </ng-container>

            <ng-container matColumnDef="financialYear">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> FY </th>
              <td mat-cell *matCellDef="let row"> {{row.financialYear}} </td>
            </ng-container>

            <ng-container matColumnDef="allocated">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Allocated </th>
              <td mat-cell *matCellDef="let row"> ₹{{row.allocatedAmount | number}} </td>
            </ng-container>

            <ng-container matColumnDef="spent">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Spent </th>
              <td mat-cell *matCellDef="let row"> ₹{{row.totalSpent | number}} </td>
            </ng-container>

            <ng-container matColumnDef="remaining">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Remaining </th>
              <td mat-cell *matCellDef="let row"> ₹{{row.remainingBudget | number}} </td>
            </ng-container>

            <ng-container matColumnDef="utilization">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Utilization </th>
              <td mat-cell *matCellDef="let row">
                <mat-chip-set>
                  <mat-chip [ngClass]="getUtilizationClass(row.utilizationPercentage)" highlighted>
                    {{row.utilizationPercentage | number:'1.0-2'}}%
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
              <td mat-cell *matCellDef="let row"> {{row.status}} </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let row" (click)="$event.stopPropagation()">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="navigateToDetail(row._id)">
                    <mat-icon>visibility</mat-icon>
                    <span>View Details</span>
                  </button>
                  <button mat-menu-item *ngIf="canCreateBudget" (click)="navigateToEdit(row._id)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item *ngIf="canCreateBudget" (click)="deleteBudget(row)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span style="color: red;">Delete</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="navigateToDetail(row._id)" class="clickable-row"></tr>

            <!-- Row shown when there is no matching data. -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="9">No data matching the filter "{{input.value}}"</td>
            </tr>
          </table>

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of budgets"></mat-paginator>
        </div>
      </mat-card>
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
    .filter-card {
      margin-bottom: 24px;
    }
    .filter-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .filter-row mat-form-field {
      flex: 1;
      min-width: 200px;
    }
    .table-container {
      position: relative;
      min-height: 200px;
    }
    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.05);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    table {
      width: 100%;
    }
    .clickable-row {
      cursor: pointer;
    }
    .clickable-row:hover {
      background-color: #f5f5f5;
    }
    .util-good { background-color: #4caf50 !important; color: white; }
    .util-warning { background-color: #ff9800 !important; color: white; }
    .util-danger { background-color: #f44336 !important; color: white; }
  `]
})
export class BudgetListComponent implements OnInit {
  displayedColumns: string[] = ['projectName', 'department', 'financialYear', 'allocated', 'spent', 'remaining', 'utilization', 'status', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isLoading = true;
  canCreateBudget = false;

  filters: any = { financialYear: '', status: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private budgetService: BudgetService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.canCreateBudget = user?.role === 'admin' || user?.role === 'finance_officer';
    this.loadBudgets();
  }

  loadBudgets() {
    this.isLoading = true;
    this.budgetService.getAll({ limit: 1000 }).subscribe({
      next: (data: any) => {
        const budgets = data.data || data;
        this.dataSource = new MatTableDataSource(budgets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = JSON.stringify({ ...this.filters, global: filterValue.trim().toLowerCase() });
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFilterChange(column: string, value: string) {
    this.filters[column] = value;
    this.applyFilters();
  }

  applyFilters() {
    this.dataSource.filter = JSON.stringify({ ...this.filters, global: this.dataSource.filter ? JSON.parse(this.dataSource.filter).global : '' });
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      const matchGlobal = !searchTerms.global || 
        data.projectName.toLowerCase().includes(searchTerms.global) ||
        (data.departmentId?.name && data.departmentId.name.toLowerCase().includes(searchTerms.global));
      const matchFy = !searchTerms.financialYear || data.financialYear === searchTerms.financialYear;
      const matchStatus = !searchTerms.status || data.status === searchTerms.status;
      return matchGlobal && matchFy && matchStatus;
    };
  }

  getUtilizationClass(percentage: number): string {
    if (percentage > 90) return 'util-danger';
    if (percentage > 70) return 'util-warning';
    return 'util-good';
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/budgets', id]);
  }

  navigateToCreate() {
    this.router.navigate(['/budgets/create']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/budgets/edit', id]);
  }

  deleteBudget(budget: any) {
    if (confirm(`Are you sure you want to delete budget for ${budget.projectName}?`)) {
      this.budgetService.delete(budget._id).subscribe(() => {
        this.loadBudgets();
      });
    }
  }
}
