import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ExpenditureService } from '../../services/expenditure.service';
import { DepartmentService } from '../../services/department.service';
import { BudgetService } from '../../services/budget.service';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-expenditure-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, 
    MatIconModule, MatCardModule, MatSnackBarModule, MatDialogModule, CurrencyPipe, DatePipe
  ],
  template: `
    <div class="page-container">
      <div class="header-row">
        <h2>Expenditures</h2>
        <button mat-raised-button color="primary" routerLink="/expenditures/new" *ngIf="canAddExpenditure()">
          <mat-icon>add</mat-icon> Add Expenditure
        </button>
      </div>
      
      <mat-card class="filter-card">
        <div class="filters-row">
          <mat-form-field appearance="outline">
            <mat-label>Search Description</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Search...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select [formControl]="departmentFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All Departments</mat-option>
              <mat-option *ngFor="let dept of departments" [value]="dept._id">{{dept.name}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Budget</mat-label>
            <mat-select [formControl]="budgetFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All Budgets</mat-option>
              <mat-option *ngFor="let budget of filteredBudgets" [value]="budget._id">{{budget.projectName}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [formControl]="categoryFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All Categories</mat-option>
              <mat-option *ngFor="let cat of categories" [value]="cat">{{cat | titlecase}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card>
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSortChange($event)">
            
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
              <td mat-cell *matCellDef="let element"> {{element.date | date:'mediumDate'}} </td>
            </ng-container>

            <ng-container matColumnDef="departmentName">
              <th mat-header-cell *matHeaderCellDef> Department </th>
              <td mat-cell *matCellDef="let element"> {{element.departmentId?.name}} </td>
            </ng-container>

            <ng-container matColumnDef="budgetName">
              <th mat-header-cell *matHeaderCellDef> Budget </th>
              <td mat-cell *matCellDef="let element"> {{element.budgetId?.projectName}} </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Category </th>
              <td mat-cell *matCellDef="let element"> {{element.expenseCategory | titlecase}} </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Amount </th>
              <td mat-cell *matCellDef="let element" class="amount-cell"> {{element.amountSpent | currency:'INR':'symbol-narrow'}} </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef> Description </th>
              <td mat-cell *matCellDef="let element" class="desc-cell" [title]="element.description"> 
                {{element.description | slice:0:30}}{{element.description.length > 30 ? '...' : ''}}
              </td>
            </ng-container>
            
            <ng-container matColumnDef="recordedBy">
              <th mat-header-cell *matHeaderCellDef> Recorded By </th>
              <td mat-cell *matCellDef="let element"> {{element.recordedBy?.name}} </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="action-header"> Actions </th>
              <td mat-cell *matCellDef="let element" class="action-cell">
                <button mat-icon-button color="primary" [routerLink]="['/expenditures/edit', element._id]" *ngIf="canEdit(element)" matTooltip="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteExpenditure(element._id)" *ngIf="canDelete(element)" matTooltip="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <!-- Row shown when there is no matching data. -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell empty-state" colspan="8">No expenditures found matching the filters.</td>
            </tr>
          </table>
        </div>
        <mat-paginator [length]="totalItems"
                       [pageSize]="pageSize"
                       [pageSizeOptions]="[10, 25, 50, 100]"
                       (page)="onPageChange($event)"
                       aria-label="Select page">
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #333;
    }
    .filter-card {
      margin-bottom: 24px;
    }
    .filters-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .filters-row mat-form-field {
      flex: 1;
      min-width: 200px;
    }
    .table-container {
      overflow-x: auto;
    }
    .amount-cell {
      font-weight: 500;
      color: #d32f2f;
    }
    .desc-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .action-header, .action-cell {
      text-align: right;
      width: 120px;
    }
    .empty-state {
      text-align: center;
      padding: 48px !important;
      color: #666;
    }
  `]
})
export class ExpenditureListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'departmentName', 'budgetName', 'category', 'amount', 'description', 'recordedBy', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'date';
  sortDirection = 'desc';

  departments: any[] = [];
  budgets: any[] = [];
  categories: string[] = ['salaries', 'infrastructure', 'equipment', 'supplies', 'travel', 'maintenance', 'consulting', 'training', 'utilities', 'miscellaneous'];

  searchControl = new FormControl('');
  departmentFilter = new FormControl('');
  budgetFilter = new FormControl('');
  categoryFilter = new FormControl('');
  
  userRole: string = '';
  userDepartmentId: string = '';

  constructor(
    private expenditureService: ExpenditureService,
    private departmentService: DepartmentService,
    private budgetService: BudgetService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUser()?.role || '';
    this.userDepartmentId = this.authService.getCurrentUser()?.departmentId || '';

    // If department head, lock department filter
    if (this.userRole === 'department_head') {
      this.departmentFilter.setValue(this.userDepartmentId);
      this.departmentFilter.disable();
    }

    this.loadFilters();
    this.loadData();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadData();
    });
  }

  get filteredBudgets(): any[] {
    const deptId = this.departmentFilter.value;
    if (!deptId) return this.budgets;
    return this.budgets.filter(b => (b.departmentId?._id || b.departmentId) === deptId);
  }

  loadFilters() {
    this.departmentService.getAll().subscribe((res: any) => {
      this.departments = res.data || res;
    });
    this.budgetService.getAll({ limit: 1000 }).subscribe((res: any) => {
      this.budgets = res.data || res;
    });
  }

  loadData() {
    const filters = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortDirection,
      search: this.searchControl.value || '',
      departmentId: this.departmentFilter.value || '',
      budgetId: this.budgetFilter.value || '',
      expenseCategory: this.categoryFilter.value || ''
    };

    this.expenditureService.getAll(filters).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || [];
        this.totalItems = res.pagination?.total || res.data?.length || 0;
      },
      error: (err) => {
        this.snackBar.open('Error loading expenditures', 'Close', { duration: 3000 });
      }
    });
  }

  onFilterChange() {
    // If a department is selected and the current budget doesn't belong to it, reset budget filter
    const deptId = this.departmentFilter.value;
    const currentBudgetId = this.budgetFilter.value;
    if (deptId && currentBudgetId) {
      const budgetMatches = this.budgets.some(b => b._id === currentBudgetId && (b.departmentId?._id || b.departmentId) === deptId);
      if (!budgetMatches) {
        this.budgetFilter.setValue('');
      }
    }
    this.pageIndex = 0;
    this.loadData();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortField = 'date';
      this.sortDirection = 'desc';
    } else {
      this.sortField = sort.active;
      this.sortDirection = sort.direction;
    }
    this.pageIndex = 0;
    this.loadData();
  }

  canAddExpenditure(): boolean {
    return ['admin', 'department_head', 'finance_officer'].includes(this.userRole);
  }

  canEdit(element: any): boolean {
    if (this.userRole === 'admin') return true;
    if (this.userRole === 'finance_officer') return true;
    if (this.userRole === 'department_head' && element.departmentId?._id === this.userDepartmentId) return true;
    return false;
  }

  canDelete(element: any): boolean {
    return this.userRole === 'admin';
  }

  deleteExpenditure(id: string) {
    if (confirm('Are you sure you want to delete this expenditure?')) {
      this.expenditureService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Expenditure deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: () => {
          this.snackBar.open('Error deleting expenditure', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
