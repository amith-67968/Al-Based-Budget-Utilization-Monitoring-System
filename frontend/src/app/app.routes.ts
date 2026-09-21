import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'unauthorized', loadComponent: () => import('./auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'budgets', loadComponent: () => import('./budgets/budget-list/budget-list.component').then(m => m.BudgetListComponent) },
      { path: 'budgets/new', loadComponent: () => import('./budgets/budget-form/budget-form.component').then(m => m.BudgetFormComponent), canActivate: [roleGuard], data: { roles: ['admin', 'finance_officer'] } },
      { path: 'budgets/create', loadComponent: () => import('./budgets/budget-form/budget-form.component').then(m => m.BudgetFormComponent), canActivate: [roleGuard], data: { roles: ['admin', 'finance_officer'] } },
      { path: 'budgets/edit/:id', loadComponent: () => import('./budgets/budget-form/budget-form.component').then(m => m.BudgetFormComponent), canActivate: [roleGuard], data: { roles: ['admin', 'finance_officer'] } },
      { path: 'budgets/:id/edit', loadComponent: () => import('./budgets/budget-form/budget-form.component').then(m => m.BudgetFormComponent), canActivate: [roleGuard], data: { roles: ['admin', 'finance_officer'] } },
      { path: 'budgets/:id', loadComponent: () => import('./budgets/budget-detail/budget-detail.component').then(m => m.BudgetDetailComponent) },
      { path: 'expenditures', loadComponent: () => import('./expenditures/expenditure-list/expenditure-list.component').then(m => m.ExpenditureListComponent) },
      { path: 'expenditures/new', loadComponent: () => import('./expenditures/expenditure-form/expenditure-form.component').then(m => m.ExpenditureFormComponent) },
      { path: 'expenditures/create', loadComponent: () => import('./expenditures/expenditure-form/expenditure-form.component').then(m => m.ExpenditureFormComponent) },
      { path: 'expenditures/edit/:id', loadComponent: () => import('./expenditures/expenditure-form/expenditure-form.component').then(m => m.ExpenditureFormComponent), canActivate: [roleGuard], data: { roles: ['admin', 'finance_officer'] } },
      { path: 'expenditures/:id/edit', loadComponent: () => import('./expenditures/expenditure-form/expenditure-form.component').then(m => m.ExpenditureFormComponent), canActivate: [roleGuard], data: { roles: ['admin', 'finance_officer'] } },
      { path: 'monitoring', loadComponent: () => import('./monitoring/monitoring.component').then(m => m.MonitoringComponent) },
      { path: 'alerts', loadComponent: () => import('./alerts/alert-list/alert-list.component').then(m => m.AlertListComponent) },
      { path: 'reports', loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), canActivate: [roleGuard], data: { roles: ['admin'] } },
      { path: 'audit', loadComponent: () => import('./audit/audit.component').then(m => m.AuditComponent), canActivate: [roleGuard], data: { roles: ['admin'] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
