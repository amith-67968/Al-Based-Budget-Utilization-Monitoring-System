import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface AuditLog {
  _id: string;
  userId?: any;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details: any;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  template: `
    <div class="page-container">
      <div class="header">
        <h2>Audit Logs</h2>
        <p class="subtitle">System-wide activity tracking and history.</p>
      </div>
      
      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Entity Type</mat-label>
              <mat-select [(value)]="filters.entityType" (selectionChange)="loadLogs()">
                <mat-option value="">All Entities</mat-option>
                <mat-option value="budget">Budget</mat-option>
                <mat-option value="expenditure">Expenditure</mat-option>
                <mat-option value="user">User</mat-option>
                <mat-option value="department">Department</mat-option>
                <mat-option value="alert">Alert</mat-option>
                <mat-option value="threshold_rule">Threshold Rule</mat-option>
                <mat-option value="auth">Authentication</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Action</mat-label>
              <mat-select [(value)]="filters.action" (selectionChange)="loadLogs()">
                <mat-option value="">All Actions</mat-option>
                <mat-option value="CREATE">Create</mat-option>
                <mat-option value="UPDATE">Update</mat-option>
                <mat-option value="DELETE">Delete</mat-option>
                <mat-option value="LOGIN">Login</mat-option>
                <mat-option value="STATUS_CHANGE">Status Change</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="table-card">
        <table mat-table [dataSource]="logs" multiTemplateDataRows class="mat-elevation-z0">
          
          <ng-container matColumnDef="timestamp">
            <th mat-header-cell *matHeaderCellDef> Timestamp </th>
            <td mat-cell *matCellDef="let element" class="mono-text"> 
              {{element.timestamp | date:'MMM dd, yyyy HH:mm:ss'}} 
            </td>
          </ng-container>

          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef> User </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="user-info">
                <mat-icon class="small-icon">person</mat-icon>
                {{element.userId?.name || 'System'}}
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef> Action </th>
            <td mat-cell *matCellDef="let element">
              <span class="action-badge" [ngClass]="element.action.toLowerCase()">
                {{element.action}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="entityType">
            <th mat-header-cell *matHeaderCellDef> Entity </th>
            <td mat-cell *matCellDef="let element" class="entity-text"> {{element.entityType | uppercase}} </td>
          </ng-container>

          <ng-container matColumnDef="entityId">
            <th mat-header-cell *matHeaderCellDef> Entity ID </th>
            <td mat-cell *matCellDef="let element" class="mono-text text-muted"> {{element.entityId}} </td>
          </ng-container>
          
          <ng-container matColumnDef="expand">
            <th mat-header-cell *matHeaderCellDef aria-label="row actions">&nbsp;</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button aria-label="expand row" (click)="(expandedElement = expandedElement === element ? null : element); $event.stopPropagation()">
                <mat-icon *ngIf="expandedElement !== element">keyboard_arrow_down</mat-icon>
                <mat-icon *ngIf="expandedElement === element">keyboard_arrow_up</mat-icon>
              </button>
            </td>
          </ng-container>

          <!-- Expanded Detail Row -->
          <ng-container matColumnDef="expandedDetail">
            <td mat-cell *matCellDef="let element" [attr.colspan]="columnsToDisplayWithExpand.length">
              <div class="example-element-detail" [@detailExpand]="element === expandedElement ? 'expanded' : 'collapsed'">
                <div class="detail-container">
                  <div class="detail-header">Change Payload Details</div>
                  <pre class="json-preview">{{element.details | json}}</pre>
                </div>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnsToDisplayWithExpand"></tr>
          <tr mat-row *matRowDef="let element; columns: columnsToDisplayWithExpand;"
              class="example-element-row"
              [class.example-expanded-row]="expandedElement === element"
              (click)="expandedElement = expandedElement === element ? null : element">
          </tr>
          <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="example-detail-row"></tr>
          
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-cell" colspan="6">No audit logs matching your filters.</td>
          </tr>
        </table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
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
    
    .filter-card {
      margin-bottom: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
    }
    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      padding-top: 8px;
    }
    .filters-row mat-form-field { margin-bottom: -1.34375em; }
    
    .table-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
      padding: 0;
      overflow: hidden;
    }
    table { width: 100%; }
    th.mat-header-cell {
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
    }
    td.mat-cell { color: #334155; font-size: 14px; padding: 12px 16px; border-bottom-color: #f1f5f9; }
    
    .mono-text { font-family: 'Roboto Mono', monospace; font-size: 13px; }
    .text-muted { color: #94a3b8; }
    .entity-text { font-weight: 600; color: #475569; letter-spacing: 0.5px; font-size: 12px; }
    
    .user-info { display: flex; align-items: center; gap: 6px; }
    .small-icon { font-size: 18px; width: 18px; height: 18px; color: #64748b; }
    
    .action-badge {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .action-badge.create { background-color: #dcfce3; color: #166534; border: 1px solid #86efac; }
    .action-badge.update { background-color: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; }
    .action-badge.delete { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .action-badge.login { background-color: #f3e8ff; color: #7e22ce; border: 1px solid #d8b4fe; }
    
    /* Expandable Row Styles */
    tr.example-detail-row { height: 0; }
    tr.example-element-row:not(.example-expanded-row):hover { background: #f8fafc; cursor: pointer; }
    tr.example-element-row:not(.example-expanded-row):active { background: #f1f5f9; }
    .example-element-row td { border-bottom-width: 0; }
    
    .example-element-detail {
      overflow: hidden;
      display: flex;
      width: 100%;
    }
    .detail-container {
      width: 100%;
      padding: 16px;
      margin: 8px 16px 16px 16px;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .detail-header {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .json-preview {
      margin: 0;
      padding: 12px;
      background-color: #1e293b;
      color: #e2e8f0;
      border-radius: 6px;
      font-family: 'Roboto Mono', monospace;
      font-size: 13px;
      overflow-x: auto;
    }
    
    .empty-cell {
      text-align: center;
      padding: 48px !important;
      color: #64748b;
      font-style: italic;
    }
  `]
})
export class AuditComponent implements OnInit {
  private http = inject(HttpClient);

  columnsToDisplay = ['timestamp', 'user', 'action', 'entityType', 'entityId'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  
  logs: AuditLog[] = [];
  expandedElement: AuditLog | null = null;
  
  filters = {
    entityType: '',
    action: ''
  };

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    // Simulated API Call
    this.logs = [
      { 
        _id: '1', 
        userId: { name: 'Alice Smith' }, 
        action: 'UPDATE', 
        entityType: 'budget', 
        entityId: 'b-2024-eng', 
        timestamp: new Date().toISOString(),
        details: { oldAmount: 400000, newAmount: 500000, reason: 'Q3 adjustment' }
      },
      { 
        _id: '2', 
        userId: { name: 'System' }, 
        action: 'CREATE', 
        entityType: 'alert', 
        entityId: 'al-998', 
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: { severity: 'HIGH', threshold: '90%', current: '92%' }
      },
      { 
        _id: '3', 
        userId: { name: 'Bob Jones' }, 
        action: 'LOGIN', 
        entityType: 'auth', 
        entityId: 'session-xyz', 
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: { ip: '192.168.1.5', browser: 'Chrome' }
      }
    ];
  }
}
