import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExpenditureService } from '../../services/expenditure.service';
import { DepartmentService } from '../../services/department.service';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-expenditure-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule,
    MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Expenditure' : 'Add New Expenditure' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="expenditureForm" (ngSubmit)="onSubmit()" class="expenditure-form">
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Budget</mat-label>
                <mat-select formControlName="budgetId" (selectionChange)="onBudgetSelect()">
                  <mat-option *ngFor="let budget of budgets" [value]="budget._id">
                    {{budget.projectName}} (Available: ₹{{budget.remainingBudget}})
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="expenditureForm.get('budgetId')?.hasError('required')">
                  Budget is required
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Department</mat-label>
                <mat-select formControlName="departmentId">
                  <mat-option *ngFor="let dept of departments" [value]="dept._id">{{dept.name}}</mat-option>
                </mat-select>
                <mat-error *ngIf="expenditureForm.get('departmentId')?.hasError('required')">
                  Department is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Amount (₹)</mat-label>
                <input matInput type="number" formControlName="amountSpent" placeholder="0.00" min="0.01" step="0.01">
                <span matPrefix>₹&nbsp;</span>
                <mat-error *ngIf="expenditureForm.get('amountSpent')?.hasError('required')">
                  Amount is required
                </mat-error>
                <mat-error *ngIf="expenditureForm.get('amountSpent')?.hasError('min')">
                  Amount must be greater than 0
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category</mat-label>
                <mat-select formControlName="expenseCategory">
                  <mat-option *ngFor="let cat of categories" [value]="cat">{{cat | titlecase}}</mat-option>
                </mat-select>
                <mat-error *ngIf="expenditureForm.get('expenseCategory')?.hasError('required')">
                  Category is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="expenditureForm.get('date')?.hasError('required')">
                  Date is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Supporting Document Reference</mat-label>
                <input matInput formControlName="supportingDocumentReference" placeholder="e.g. Invoice #12345">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Provide details about this expenditure"></textarea>
              <mat-error *ngIf="expenditureForm.get('description')?.hasError('required')">
                Description is required
              </mat-error>
            </mat-form-field>

            <div class="actions-row">
              <button mat-button type="button" routerLink="/expenditures">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="expenditureForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Save Expenditure</span>
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
    mat-card-header {
      margin-bottom: 24px;
    }
    .expenditure-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .form-row > * {
      flex: 1;
    }
    .full-width {
      width: 100%;
    }
    .actions-row {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
    }
    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
    button mat-spinner {
      margin: 0 auto;
    }
  `]
})
export class ExpenditureFormComponent implements OnInit {
  expenditureForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  expenditureId: string | null = null;

  departments: any[] = [];
  budgets: any[] = [];
  categories: string[] = ['salaries', 'infrastructure', 'equipment', 'supplies', 'travel', 'maintenance', 'consulting', 'training', 'utilities', 'miscellaneous'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private expenditureService: ExpenditureService,
    private departmentService: DepartmentService,
    private budgetService: BudgetService,
    private snackBar: MatSnackBar
  ) {
    this.expenditureForm = this.fb.group({
      budgetId: ['', Validators.required],
      departmentId: [{value: '', disabled: true}, Validators.required],
      amountSpent: ['', [Validators.required, Validators.min(0.01)]],
      expenseCategory: ['', Validators.required],
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
      supportingDocumentReference: ['']
    });
  }

  ngOnInit() {
    this.loadDependencies();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.expenditureId = id;
        this.loadExpenditure(id);
      }
    });
  }

  loadDependencies() {
    this.departmentService.getAll().subscribe((res: any) => {
      this.departments = res.data || res;
    });
    this.budgetService.getAll({ limit: 1000 }).subscribe((res: any) => {
      const items = res.data || res.items || res;
      this.budgets = Array.isArray(items) ? items.filter((b: any) => b.status === 'active') : [];
    });
  }

  loadExpenditure(id: string) {
    this.expenditureService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.expenditureForm.patchValue({
          budgetId: data.budgetId?._id || data.budgetId,
          departmentId: data.departmentId?._id || data.departmentId,
          amountSpent: data.amountSpent,
          expenseCategory: data.expenseCategory,
          date: new Date(data.date),
          description: data.description,
          supportingDocumentReference: data.supportingDocumentReference
        });
        // Re-enable to allow updates if necessary or keep disabled to enforce relation
        this.expenditureForm.get('departmentId')?.enable();
      },
      error: () => {
        this.snackBar.open('Error loading expenditure', 'Close', { duration: 3000 });
        this.router.navigate(['/expenditures']);
      }
    });
  }

  onBudgetSelect() {
    const budgetId = this.expenditureForm.get('budgetId')?.value;
    const selectedBudget = this.budgets.find(b => b._id === budgetId);
    if (selectedBudget) {
      this.expenditureForm.patchValue({ departmentId: selectedBudget.departmentId?._id || selectedBudget.departmentId });
      this.expenditureForm.get('departmentId')?.enable(); // Ensure it gets submitted
    }
  }

  onSubmit() {
    if (this.expenditureForm.invalid) return;

    this.isLoading = true;
    const formData = this.expenditureForm.getRawValue();

    const request = this.isEditMode
      ? this.expenditureService.update(this.expenditureId!, formData)
      : this.expenditureService.create(formData);

    request.subscribe({
      next: () => {
        this.snackBar.open(`Expenditure ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Close', { duration: 3000 });
        this.router.navigate(['/expenditures']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open('Error saving expenditure', 'Close', { duration: 3000 });
      }
    });
  }
}
