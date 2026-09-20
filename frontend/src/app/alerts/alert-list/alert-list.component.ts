import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AlertService } from '../../services/alert.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatCardModule, MatSnackBarModule, MatTooltipModule,
    MatMenuModule,
    DatePipe, CurrencyPipe
  ],
  template: `
    <div class="page-container">
      <div class="header-row">
        <h2>Alerts & Anomalies</h2>
      </div>
      
      <!-- Filter Bar -->
      <mat-card class="filter-card">
        <div class="filters-row">
          <mat-form-field appearance="outline">
            <mat-label>Search Alerts</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Search message...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Severity</mat-label>
            <mat-select [formControl]="severityFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All</mat-option>
              <mat-option value="LOW">Low</mat-option>
              <mat-option value="MEDIUM">Medium</mat-option>
              <mat-option value="HIGH">High</mat-option>
              <mat-option value="CRITICAL">Critical</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select [formControl]="typeFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All Types</mat-option>
              <mat-option value="OVERSPENDING">Overspending</mat-option>
              <mat-option value="UNDER_UTILIZATION">Under Utilization</mat-option>
              <mat-option value="SPENDING_SPIKE">Spending Spike</mat-option>
              <mat-option value="THRESHOLD_BREACH">Threshold Breach</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [formControl]="statusFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All Statuses</mat-option>
              <mat-option value="OPEN">Open</mat-option>
              <mat-option value="REVIEWED">Reviewed</mat-option>
              <mat-option value="RESOLVED">Resolved</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select [formControl]="departmentFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All Departments</mat-option>
              <mat-option *ngFor="let dept of departments" [value]="dept._id">{{dept.name}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>
      
      <!-- Alerts Table -->
      <mat-card>
        <div class="table-container">
          <table mat-table [dataSource]="dataSource">
            
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef> Type </th>
              <td mat-cell *matCellDef="let element">
                <div class="type-cell" [matTooltip]="element.alertType">
                  <mat-icon [ngClass]="getIconColor(element.alertType)">{{getTypeIcon(element.alertType)}}</mat-icon>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="severity">
              <th mat-header-cell *matHeaderCellDef> Severity </th>
              <td mat-cell *matCellDef="let element">
                <span class="severity-badge" [ngClass]="getSeverityClass(element.severity)">
                  {{element.severity}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef> Department </th>
              <td mat-cell *matCellDef="let element"> {{element.departmentId?.name}} </td>
            </ng-container>

            <ng-container matColumnDef="message">
              <th mat-header-cell *matHeaderCellDef> Message </th>
              <td mat-cell *matCellDef="let element" class="message-cell"> {{element.message}} </td>
            </ng-container>
            
            <ng-container matColumnDef="timestamp">
              <th mat-header-cell *matHeaderCellDef> Timestamp </th>
              <td mat-cell *matCellDef="let element"> {{element.createdAt | date:'short'}} </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let element">
                <span class="status-badge" [ngClass]="getStatusClass(element.status)">
                  {{element.status}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="action-header"> Actions </th>
              <td mat-cell *matCellDef="let element" class="action-cell">
                <button mat-icon-button color="primary" [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{alert: element}">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #actionMenu="matMenu">
                  <button mat-menu-item *ngIf="element.status === 'OPEN'" (click)="updateAlertStatus(element._id, 'REVIEWED')">
                    <mat-icon color="primary">visibility</mat-icon>
                    <span>Mark as Reviewed</span>
                  </button>
                  <button mat-menu-item *ngIf="element.status !== 'RESOLVED'" (click)="updateAlertStatus(element._id, 'RESOLVED')">
                    <mat-icon color="accent">check_circle</mat-icon>
                    <span>Mark as Resolved</span>
                  </button>
                  <button mat-menu-item *ngIf="element.status !== 'OPEN'" (click)="updateAlertStatus(element._id, 'OPEN')">
                    <mat-icon color="warn">undo</mat-icon>
                    <span>Reopen</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" [ngClass]="{'row-critical': row.severity === 'CRITICAL' && row.status === 'OPEN'}"></tr>
            
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell empty-state" colspan="7">No alerts found matching the filters.</td>
            </tr>
          </table>
        </div>
        <mat-paginator [length]="totalItems"
                       [pageSize]="pageSize"
                       [pageSizeOptions]="[10, 25, 50]"
                       (page)="onPageChange($event)">
        </mat-paginator>
      </mat-card>
      
      <!-- Import MatMenuModule in the imports above to fix menu trigger -->
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
    .type-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .message-cell {
      max-width: 350px;
      word-wrap: break-word;
    }
    
    /* Severity Badges */
    .severity-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .sev-low { background: #e8f5e9; color: #2e7d32; }
    .sev-medium { background: #fff3e0; color: #ef6c00; }
    .sev-high { background: #ffebee; color: #c62828; }
    .sev-critical { background: #c62828; color: white; }
    
    /* Status Badges */
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    .stat-open { background: #e3f2fd; color: #1565c0; }
    .stat-reviewed { background: #fff8e1; color: #f57f17; }
    .stat-resolved { background: #e8f5e9; color: #2e7d32; }

    /* Icon Colors */
    .icon-up { color: #d32f2f; }
    .icon-down { color: #f57c00; }
    .icon-spike { color: #7b1fa2; }
    .icon-warn { color: #fbc02d; }

    .action-header, .action-cell {
      text-align: right;
      width: 60px;
    }
    .empty-state {
      text-align: center;
      padding: 48px !important;
      color: #666;
    }
    .row-critical {
      background-color: rgba(229, 57, 53, 0.04);
    }
  `]
})
export class AlertListComponent implements OnInit {
  displayedColumns: string[] = ['type', 'severity', 'department', 'message', 'timestamp', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  departments: any[] = [];
  
  searchControl = new FormControl('');
  severityFilter = new FormControl('');
  typeFilter = new FormControl('');
  statusFilter = new FormControl('OPEN');
  departmentFilter = new FormControl('');

  userRole = '';
  userDepartmentId = '';

  constructor(
    private alertService: AlertService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUser()?.role || '';
    this.userDepartmentId = this.authService.getCurrentUser()?.departmentId || '';

    if (this.userRole === 'department_head') {
      this.departmentFilter.setValue(this.userDepartmentId);
      this.departmentFilter.disable();
    }

    this.departmentService.getAll().subscribe((res: any) => {
      this.departments = res.data || res;
    });

    this.loadAlerts();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadAlerts();
    });
  }

  loadAlerts() {
    const filters = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
      search: this.searchControl.value || '',
      severity: this.severityFilter.value || '',
      alertType: this.typeFilter.value || '',
      status: this.statusFilter.value || '',
      departmentId: this.departmentFilter.value || ''
    };

    this.alertService.getAll(filters).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || [];
        this.totalItems = res.pagination?.total || res.data?.length || 0;
      },
      error: () => {
        this.snackBar.open('Error loading alerts', 'Close', { duration: 3000 });
      }
    });
  }

  onFilterChange() {
    this.pageIndex = 0;
    this.loadAlerts();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlerts();
  }

  updateAlertStatus(id: string, status: string) {
    if (confirm('Are you sure you want to mark this alert as ' + status + '?')) {
      this.alertService.updateStatus(id, status).subscribe({
        next: () => {
          this.snackBar.open('Alert status updated to ' + status, 'Close', { duration: 3000 });
          this.loadAlerts();
        },
        error: () => {
          this.snackBar.open('Error updating alert status', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getTypeIcon(type: string): string {
    switch(type) {
      case 'OVERSPENDING': return 'trending_up';
      case 'UNDER_UTILIZATION': return 'trending_down';
      case 'SPENDING_SPIKE': return 'flash_on';
      case 'THRESHOLD_BREACH': return 'warning';
      default: return 'notifications';
    }
  }

  getIconColor(type: string): string {
    switch(type) {
      case 'OVERSPENDING': return 'icon-up';
      case 'UNDER_UTILIZATION': return 'icon-down';
      case 'SPENDING_SPIKE': return 'icon-spike';
      case 'THRESHOLD_BREACH': return 'icon-warn';
      default: return '';
    }
  }

  getSeverityClass(severity: string): string {
    switch(severity) {
      case 'LOW': return 'sev-low';
      case 'MEDIUM': return 'sev-medium';
      case 'HIGH': return 'sev-high';
      case 'CRITICAL': return 'sev-critical';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'OPEN': return 'stat-open';
      case 'REVIEWED': return 'stat-reviewed';
      case 'RESOLVED': return 'stat-resolved';
      default: return '';
    }
  }
}
