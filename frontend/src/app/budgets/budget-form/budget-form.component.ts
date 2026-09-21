import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BudgetService } from '../../services/budget.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Budget' : 'Create Budget' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
          
          <form *ngIf="!isLoading" [formGroup]="budgetForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Project Name</mat-label>
                <input matInput formControlName="projectName" placeholder="Enter project name">
                <mat-error *ngIf="budgetForm.get('projectName')?.hasError('required')">Project Name is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Department</mat-label>
                <mat-select formControlName="departmentId">
                  <mat-option *ngFor="let dept of departments" [value]="dept._id">
                    {{dept.name}}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="budgetForm.get('departmentId')?.hasError('required')">Department is required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Financial Year</mat-label>
                <input matInput formControlName="financialYear" placeholder="e.g. 2025-26">
                <mat-error *ngIf="budgetForm.get('financialYear')?.hasError('required')">Financial Year is required</mat-error>
                <mat-error *ngIf="budgetForm.get('financialYear')?.hasError('pattern')">Format must be YYYY-YY (e.g. 2025-26)</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Allocated Amount (₹)</mat-label>
                <input matInput type="number" formControlName="allocatedAmount" min="1">
                <mat-error *ngIf="budgetForm.get('allocatedAmount')?.hasError('required')">Amount is required</mat-error>
                <mat-error *ngIf="budgetForm.get('allocatedAmount')?.hasError('min')">Amount must be greater than 0</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Allocation Date</mat-label>
                <input matInput [matDatepicker]="allocationPicker" formControlName="allocationDate">
                <mat-datepicker-toggle matIconSuffix [for]="allocationPicker"></mat-datepicker-toggle>
                <mat-datepicker #allocationPicker></mat-datepicker>
                <mat-error *ngIf="budgetForm.get('allocationDate')?.hasError('required')">Date is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="draft">Draft</mat-option>
                  <mat-option value="active">Active</mat-option>
                  <mat-option value="closed">Closed</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
                <mat-error *ngIf="budgetForm.get('startDate')?.hasError('required')">Start Date is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
                <mat-error *ngIf="budgetForm.get('endDate')?.hasError('required')">End Date is required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/budgets">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="budgetForm.invalid || isSaving">
                <mat-spinner diameter="20" *ngIf="isSaving" class="button-spinner"></mat-spinner>
                {{ isEditMode ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      display: flex;
      justify-content: center;
    }
    .form-card {
      width: 100%;
      max-width: 800px;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }
    .full-width {
      flex: 1;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
    }
    .button-spinner {
      display: inline-block;
      margin-right: 8px;
      vertical-align: middle;
    }
    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  budgetId: string | null = null;
  departments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.budgetForm = this.fb.group({
      projectName: ['', Validators.required],
      departmentId: ['', Validators.required],
      financialYear: ['', [Validators.required, Validators.pattern(/^(\d{4}-\d{2}|\d{4}-\d{4})$/)]],
      allocatedAmount: ['', [Validators.required, Validators.min(1)]],
      allocationDate: [new Date(), Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(new Date().setFullYear(new Date().getFullYear() + 1)), Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDepartments();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.budgetId = id;
      this.loadBudget();
    }
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (data: any) => this.departments = data.data || data,
      error: () => this.showError('Failed to load departments')
    });
  }

  loadBudget() {
    this.isLoading = true;
    this.budgetService.getById(String(this.budgetId!)).subscribe({
      next: (res: any) => {
        const budget = res.data || res;
        this.budgetForm.patchValue({
          ...budget,
          departmentId: budget.departmentId?._id || budget.departmentId
        });
        this.isLoading = false;
      },
      error: () => {
        this.showError('Failed to load budget details');
        this.router.navigate(['/budgets']);
      }
    });
  }

  onSubmit() {
    if (this.budgetForm.invalid) return;

    this.isSaving = true;
    const budgetData = this.budgetForm.value;

    const request = this.isEditMode 
      ? this.budgetService.update(String(this.budgetId!), budgetData)
      : this.budgetService.create(budgetData);

    request.subscribe({
      next: () => {
        this.snackBar.open(`Budget ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'Close', { duration: 3000 });
        this.router.navigate(['/budgets']);
      },
      error: (err: any) => {
        this.isSaving = false;
        this.showError(err.error?.message || 'Operation failed');
      }
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
