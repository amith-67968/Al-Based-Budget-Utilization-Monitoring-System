import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  departmentId?: any;
  status: 'ACTIVE' | 'INACTIVE';
  password?: string;
}

interface Department {
  _id?: string;
  name: string;
  description: string;
  headUserId?: string;
  headUserName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface ThresholdRule {
  _id?: string;
  ruleType: string;
  value: number;
  secondaryValue?: number;
  enabled: boolean;
  description: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="header">
        <h2>Administration Panel</h2>
        <p class="subtitle">Manage users, departments, and system configurations.</p>
      </div>
      
      <mat-card class="content-card">
        <mat-tab-group color="primary" animationDuration="0ms">
          
          <!-- User Management Tab -->
          <mat-tab label="Users">
            <div class="tab-content">
              <div class="actions-row">
                <mat-form-field appearance="outline" class="search-field">
                  <mat-label>Search users</mat-label>
                  <mat-icon matPrefix>search</mat-icon>
                  <input matInput placeholder="Name or email..." [(ngModel)]="userSearchTerm">
                </mat-form-field>
                <div class="spacer"></div>
                <button mat-flat-button color="primary" (click)="showCreateUserDialog()">
                  <mat-icon>person_add</mat-icon> Add User
                </button>
              </div>

              <!-- Inline User Form -->
              <mat-card class="inline-form-card" *ngIf="showUserForm">
                <mat-card-header>
                  <mat-card-title>{{ editingUser._id ? 'Edit User' : 'Create New User' }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Full Name</mat-label>
                      <input matInput [(ngModel)]="editingUser.name" required>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Email Address</mat-label>
                      <input matInput type="email" [(ngModel)]="editingUser.email" required>
                    </mat-form-field>
                    <mat-form-field appearance="outline" *ngIf="!editingUser._id">
                      <mat-label>Password</mat-label>
                      <input matInput type="password" [(ngModel)]="editingUser.password" required>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Role</mat-label>
                      <mat-select [(ngModel)]="editingUser.role" required>
                        <mat-option value="ADMIN">Admin</mat-option>
                        <mat-option value="MANAGER">Manager</mat-option>
                        <mat-option value="VIEWER">Viewer</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Department</mat-label>
                      <mat-select [(ngModel)]="editingUser.departmentId">
                        <mat-option value="">None</mat-option>
                        <mat-option *ngFor="let dept of departments" [value]="dept._id">{{dept.name}}</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-button (click)="cancelUserForm()">Cancel</button>
                  <button mat-flat-button color="primary" (click)="saveUser()">Save User</button>
                </mat-card-actions>
              </mat-card>

              <div class="table-container">
                <table mat-table [dataSource]="users" class="mat-elevation-z1">
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef> Name </th>
                    <td mat-cell *matCellDef="let element">
                      <div class="user-cell">
                        <div class="avatar">{{element.name.charAt(0)}}</div>
                        <span>{{element.name}}</span>
                      </div>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="email">
                    <th mat-header-cell *matHeaderCellDef> Email </th>
                    <td mat-cell *matCellDef="let element"> {{element.email}} </td>
                  </ng-container>
                  <ng-container matColumnDef="role">
                    <th mat-header-cell *matHeaderCellDef> Role </th>
                    <td mat-cell *matCellDef="let element">
                      <span class="role-badge" [ngClass]="element.role.toLowerCase()">{{element.role}}</span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="department">
                    <th mat-header-cell *matHeaderCellDef> Department </th>
                    <td mat-cell *matCellDef="let element"> {{element.departmentId?.name || 'N/A'}} </td>
                  </ng-container>
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Status </th>
                    <td mat-cell *matCellDef="let element">
                      <span class="status-badge" [ngClass]="element.status.toLowerCase()">{{element.status}}</span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="actions-col"> Actions </th>
                    <td mat-cell *matCellDef="let element" class="actions-col">
                      <button mat-icon-button color="primary" matTooltip="Edit User" (click)="editUser(element)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button [color]="element.status === 'ACTIVE' ? 'warn' : 'accent'" 
                              [matTooltip]="element.status === 'ACTIVE' ? 'Deactivate' : 'Activate'"
                              (click)="toggleUserStatus(element)">
                        <mat-icon>{{element.status === 'ACTIVE' ? 'block' : 'check_circle'}}</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
                </table>
                <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
              </div>
            </div>
          </mat-tab>
          
          <!-- Department Management Tab -->
          <mat-tab label="Departments">
            <div class="tab-content">
              <div class="actions-row">
                <div class="spacer"></div>
                <button mat-flat-button color="primary" (click)="showCreateDepartmentDialog()">
                  <mat-icon>add_business</mat-icon> Add Department
                </button>
              </div>

              <!-- Inline Department Form -->
              <mat-card class="inline-form-card" *ngIf="showDeptForm">
                <mat-card-header>
                  <mat-card-title>{{ editingDept._id ? 'Edit Department' : 'Create New Department' }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Department Name</mat-label>
                      <input matInput [(ngModel)]="editingDept.name" required>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Department Head</mat-label>
                      <mat-select [(ngModel)]="editingDept.headUserId">
                        <mat-option *ngFor="let user of users" [value]="user._id">{{user.name}}</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description</mat-label>
                      <textarea matInput [(ngModel)]="editingDept.description" rows="2"></textarea>
                    </mat-form-field>
                  </div>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-button (click)="cancelDeptForm()">Cancel</button>
                  <button mat-flat-button color="primary" (click)="saveDepartment()">Save Department</button>
                </mat-card-actions>
              </mat-card>

              <div class="table-container">
                <table mat-table [dataSource]="departments" class="mat-elevation-z1">
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef> Name </th>
                    <td mat-cell *matCellDef="let element"> <strong>{{element.name}}</strong> </td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef> Description </th>
                    <td mat-cell *matCellDef="let element"> {{element.description}} </td>
                  </ng-container>
                  <ng-container matColumnDef="head">
                    <th mat-header-cell *matHeaderCellDef> Head </th>
                    <td mat-cell *matCellDef="let element"> {{element.headUserName || 'Unassigned'}} </td>
                  </ng-container>
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Status </th>
                    <td mat-cell *matCellDef="let element">
                      <span class="status-badge" [ngClass]="element.status.toLowerCase()">{{element.status}}</span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="actions-col"> Actions </th>
                    <td mat-cell *matCellDef="let element" class="actions-col">
                      <button mat-icon-button color="primary" matTooltip="Edit Department" (click)="editDepartment(element)">
                        <mat-icon>edit</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="deptColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: deptColumns;"></tr>
                </table>
              </div>
            </div>
          </mat-tab>
          
          <!-- Threshold Rules Tab -->
          <mat-tab label="Threshold Rules">
            <div class="tab-content">
              <div class="actions-row">
                <div class="spacer"></div>
                <button mat-flat-button color="primary" (click)="showCreateRuleDialog()">
                  <mat-icon>tune</mat-icon> Add Rule
                </button>
              </div>

              <!-- Inline Rule Form -->
              <mat-card class="inline-form-card" *ngIf="showRuleForm">
                <mat-card-header>
                  <mat-card-title>{{ editingRule._id ? 'Edit Rule' : 'Create New Rule' }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Rule Type</mat-label>
                      <mat-select [(ngModel)]="editingRule.ruleType" required>
                        <mat-option value="BUDGET_WARNING">Budget Warning %</mat-option>
                        <mat-option value="BUDGET_CRITICAL">Budget Critical %</mat-option>
                        <mat-option value="MAX_TRANSACTION">Max Transaction Limit</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Value</mat-label>
                      <input matInput type="number" [(ngModel)]="editingRule.value" required>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Secondary Value (Optional)</mat-label>
                      <input matInput type="number" [(ngModel)]="editingRule.secondaryValue">
                    </mat-form-field>
                    <div class="toggle-container">
                      <mat-slide-toggle color="primary" [(ngModel)]="editingRule.enabled">Rule Enabled</mat-slide-toggle>
                    </div>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description</mat-label>
                      <textarea matInput [(ngModel)]="editingRule.description" rows="2"></textarea>
                    </mat-form-field>
                  </div>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-button (click)="cancelRuleForm()">Cancel</button>
                  <button mat-flat-button color="primary" (click)="saveRule()">Save Rule</button>
                </mat-card-actions>
              </mat-card>

              <div class="table-container">
                <table mat-table [dataSource]="rules" class="mat-elevation-z1">
                  <ng-container matColumnDef="ruleType">
                    <th mat-header-cell *matHeaderCellDef> Rule Type </th>
                    <td mat-cell *matCellDef="let element"> {{element.ruleType}} </td>
                  </ng-container>
                  <ng-container matColumnDef="value">
                    <th mat-header-cell *matHeaderCellDef> Value </th>
                    <td mat-cell *matCellDef="let element" class="number-cell"> {{element.value}} </td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef> Description </th>
                    <td mat-cell *matCellDef="let element"> {{element.description}} </td>
                  </ng-container>
                  <ng-container matColumnDef="enabled">
                    <th mat-header-cell *matHeaderCellDef> Enabled </th>
                    <td mat-cell *matCellDef="let element">
                      <mat-slide-toggle color="primary" [checked]="element.enabled" (change)="toggleRuleStatus(element)"></mat-slide-toggle>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="actions-col"> Actions </th>
                    <td mat-cell *matCellDef="let element" class="actions-col">
                      <button mat-icon-button color="primary" matTooltip="Edit Rule" (click)="editRule(element)">
                        <mat-icon>edit</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="ruleColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: ruleColumns;" [ngClass]="{'disabled-row': !row.enabled}"></tr>
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
    .header { margin-bottom: 24px; }
    .header h2 { margin: 0 0 8px 0; color: #1e293b; font-size: 28px; font-weight: 600; }
    .subtitle { margin: 0; color: #64748b; font-size: 14px; }
    
    .content-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
      padding: 0;
      overflow: hidden;
    }
    .tab-content { padding: 24px; }
    .actions-row {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      gap: 16px;
    }
    .spacer { flex: 1 1 auto; }
    .search-field { width: 300px; margin-bottom: -1.34375em; }
    
    .inline-form-card {
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: none !important;
      background-color: #f8fafc;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      padding-top: 16px;
    }
    .full-width { grid-column: 1 / -1; }
    .toggle-container {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    
    .table-container {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    table { width: 100%; }
    th.mat-header-cell {
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
    }
    td.mat-cell { color: #334155; font-size: 14px; padding: 12px 16px; }
    .actions-col { width: 100px; text-align: right; padding-right: 16px !important; }
    .number-cell { font-family: 'Roboto Mono', monospace; font-weight: 500; }
    
    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #3b82f6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    
    .role-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .role-badge.admin { background-color: #f3e8ff; color: #7e22ce; }
    .role-badge.manager { background-color: #e0f2fe; color: #0369a1; }
    .role-badge.viewer { background-color: #f1f5f9; color: #475569; }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge.active { background-color: #dcfce3; color: #166534; }
    .status-badge.inactive { background-color: #f1f5f9; color: #64748b; }
    
    .disabled-row td.mat-cell { opacity: 0.5; }
  `]
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  userColumns: string[] = ['name', 'email', 'role', 'department', 'status', 'actions'];
  deptColumns: string[] = ['name', 'description', 'head', 'status', 'actions'];
  ruleColumns: string[] = ['ruleType', 'value', 'description', 'enabled', 'actions'];

  users: User[] = [];
  departments: Department[] = [];
  rules: ThresholdRule[] = [];

  userSearchTerm = '';

  // Form states
  showUserForm = false;
  showDeptForm = false;
  showRuleForm = false;

  editingUser: Partial<User> = {};
  editingDept: Partial<Department> = {};
  editingRule: Partial<ThresholdRule> = {};

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Simulated API calls for demonstration
    this.users = [
      { _id: 'u1', name: 'Alice Smith', email: 'alice@company.com', role: 'ADMIN', status: 'ACTIVE' },
      { _id: 'u2', name: 'Bob Jones', email: 'bob@company.com', role: 'MANAGER', departmentId: { _id: 'd1', name: 'Engineering' }, status: 'ACTIVE' }
    ];
    this.departments = [
      { _id: 'd1', name: 'Engineering', description: 'Software Development', headUserName: 'Bob Jones', status: 'ACTIVE' }
    ];
    this.rules = [
      { _id: 'r1', ruleType: 'BUDGET_WARNING', value: 80, enabled: true, description: 'Warn when budget hits 80%' },
      { _id: 'r2', ruleType: 'MAX_TRANSACTION', value: 50000, enabled: false, description: 'Require approval over 50k' }
    ];
  }

  // User Management
  showCreateUserDialog() {
    this.editingUser = { status: 'ACTIVE', role: 'VIEWER' };
    this.showUserForm = true;
  }

  editUser(user: User) {
    this.editingUser = { ...user };
    this.showUserForm = true;
  }

  cancelUserForm() {
    this.showUserForm = false;
    this.editingUser = {};
  }

  saveUser() {
    if (!this.editingUser.name || !this.editingUser.email) return;
    // Simulate API call
    if (this.editingUser._id) {
      const idx = this.users.findIndex(u => u._id === this.editingUser._id);
      if (idx > -1) this.users[idx] = this.editingUser as User;
      this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
    } else {
      this.editingUser._id = 'u' + Date.now();
      this.users = [...this.users, this.editingUser as User];
      this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
    }
    this.cancelUserForm();
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.snackBar.open(`User ${user.status.toLowerCase()}`, 'Close', { duration: 3000 });
  }

  // Department Management
  showCreateDepartmentDialog() {
    this.editingDept = { status: 'ACTIVE' };
    this.showDeptForm = true;
  }

  editDepartment(dept: Department) {
    this.editingDept = { ...dept };
    this.showDeptForm = true;
  }

  cancelDeptForm() {
    this.showDeptForm = false;
    this.editingDept = {};
  }

  saveDepartment() {
    if (!this.editingDept.name) return;
    if (this.editingDept._id) {
      const idx = this.departments.findIndex(d => d._id === this.editingDept._id);
      if (idx > -1) this.departments[idx] = this.editingDept as Department;
      this.snackBar.open('Department updated', 'Close', { duration: 3000 });
    } else {
      this.editingDept._id = 'd' + Date.now();
      this.departments = [...this.departments, this.editingDept as Department];
      this.snackBar.open('Department created', 'Close', { duration: 3000 });
    }
    this.cancelDeptForm();
  }

  // Rule Management
  showCreateRuleDialog() {
    this.editingRule = { enabled: true, ruleType: 'BUDGET_WARNING' };
    this.showRuleForm = true;
  }

  editRule(rule: ThresholdRule) {
    this.editingRule = { ...rule };
    this.showRuleForm = true;
  }

  cancelRuleForm() {
    this.showRuleForm = false;
    this.editingRule = {};
  }

  saveRule() {
    if (!this.editingRule.ruleType || this.editingRule.value === undefined) return;
    if (this.editingRule._id) {
      const idx = this.rules.findIndex(r => r._id === this.editingRule._id);
      if (idx > -1) this.rules[idx] = this.editingRule as ThresholdRule;
      this.snackBar.open('Rule updated', 'Close', { duration: 3000 });
    } else {
      this.editingRule._id = 'r' + Date.now();
      this.rules = [...this.rules, this.editingRule as ThresholdRule];
      this.snackBar.open('Rule created', 'Close', { duration: 3000 });
    }
    this.cancelRuleForm();
  }

  toggleRuleStatus(rule: ThresholdRule) {
    rule.enabled = !rule.enabled;
    this.snackBar.open(`Rule ${rule.enabled ? 'enabled' : 'disabled'}`, 'Close', { duration: 3000 });
  }
}
