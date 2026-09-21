import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <div class="gov-tricolor-strip"></div>
    
    <!-- Official Government Top Bar -->
    <div class="gov-top-bar">
      <div class="gov-top-left">
        <span class="emblem-text-hi">भारत सरकार</span>
        <span class="divider">|</span>
        <span class="emblem-text-en">GOVERNMENT OF INDIA</span>
        <span class="divider">•</span>
        <span class="ministry-text">MINISTRY OF FINANCE (वित्त मंत्रालय)</span>
      </div>
      <div class="gov-top-right">
        <span class="live-clock">{{ currentTime | date:'dd MMM yyyy, HH:mm:ss' }} IST</span>
        <span class="divider">|</span>
        <span class="gov-badge"><mat-icon class="shield-icon">verified_user</mat-icon> Official National Portal</span>
      </div>
    </div>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #sidenav
        mode="side"
        [opened]="sidenavOpened"
        class="sidenav">
        
        <div class="sidenav-header">
          <div class="emblem-container">
            <svg class="ashoka-chakra" viewBox="0 0 100 100" width="36" height="36">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#1e3a8a" stroke-width="4"/>
              <circle cx="50" cy="50" r="10" fill="#1e3a8a"/>
              <g stroke="#1e3a8a" stroke-width="2">
                <line x1="50" y1="4" x2="50" y2="96"/>
                <line x1="4" y1="50" x2="96" y2="50"/>
                <line x1="17" y1="17" x2="83" y2="83"/>
                <line x1="17" y1="83" x2="83" y2="17"/>
                <line x1="28" y1="7" x2="72" y2="93"/>
                <line x1="7" y1="28" x2="93" y2="72"/>
                <line x1="72" y1="7" x2="28" y2="93"/>
                <line x1="93" y1="28" x2="7" y2="72"/>
              </g>
            </svg>
          </div>
          <div class="app-branding">
            <div class="app-title-main">PFM-BUMS</div>
            <div class="app-title-sub">Govt. Budget Monitoring</div>
          </div>
        </div>

        <div class="active-fy-banner">
          <span class="fy-label">Current Cycle</span>
          <span class="fy-badge">FY 2025-26</span>
        </div>

        <mat-nav-list class="nav-list">
          <ng-container *ngFor="let item of navItems">
            <a mat-list-item 
               class="nav-item"
               [routerLink]="item.route" 
               routerLinkActive="active-nav-item"
               *ngIf="hasRole(item.roles)">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <div matListItemTitle class="nav-title">{{ item.label }}</div>
            </a>
          </ng-container>
        </mat-nav-list>

        <div class="sidenav-footer">
          <div class="nic-badge">
            <mat-icon class="nic-icon">security</mat-icon>
            <span>NIC Secure Cloud Node</span>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="sidenav-content">
        <mat-toolbar class="toolbar">
          <button mat-icon-button (click)="toggleSidenav()" class="menu-btn" matTooltip="Toggle Menu">
            <mat-icon>menu</mat-icon>
          </button>
          
          <div class="portal-main-heading">
            <span class="portal-title">Public Financial Management & Budget Utilization Monitoring System</span>
            <span class="portal-tagline">Integrated Expenditure Scrutiny & Rule-based Anomaly Tracking</span>
          </div>
          
          <span class="spacer"></span>
          
          <div class="officer-profile-card" [matMenuTriggerFor]="userMenu" *ngIf="user" matTooltip="Officer Profile & Settings">
            <div class="officer-avatar-badge">
              {{ (user.name ? user.name.charAt(0) : 'A') | uppercase }}
            </div>
            <div class="officer-identity">
              <span class="officer-fullname">{{ user.name || user.email }}</span>
              <span class="officer-role-tag" [ngClass]="user.role">
                <span class="status-indicator-dot"></span>
                {{ getFormattedRole(user.role) }}
              </span>
            </div>
            <mat-icon class="dropdown-chevron">expand_more</mat-icon>
          </div>

          <mat-menu #userMenu="matMenu" xPosition="before">
            <div class="menu-user-header" style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; min-width: 200px;">
              <div style="font-weight: 600; font-size: 13px; color: #0f172a;">{{ user.name }}</div>
              <div style="font-size: 12px; color: #64748b;">{{ user.email }}</div>
              <div style="font-size: 11px; color: #1e3a8a; font-weight: 600; margin-top: 4px;">{{ getFormattedRole(user.role) }}</div>
            </div>
            <button mat-menu-item (click)="logout()">
              <mat-icon color="warn">exit_to_app</mat-icon>
              <span>Log Out</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="main-content">
          <router-outlet></router-outlet>
          
          <!-- Official Government Portal Footer -->
          <footer class="gov-portal-footer">
            <div class="gov-footer-content">
              <div class="gov-footer-col">
                <div class="footer-heading">National Budget Monitoring Portal (PFM-BUMS)</div>
                <p>Designed, developed and hosted by <strong>National Informatics Centre (NIC)</strong></p>
                <p>Ministry of Electronics & Information Technology, Government of India</p>
              </div>
              <div class="gov-footer-col links-col">
                <span class="footer-link">Hyperlinking Policy</span> •
                <span class="footer-link">Privacy Policy</span> •
                <span class="footer-link">Terms & Conditions</span> •
                <span class="footer-link">Accessibility Statement</span> •
                <span class="footer-link">Helpdesk: 1800-11-7788</span>
              </div>
              <div class="gov-footer-col copyright-col">
                <p>© 2026 Ministry of Finance, Government of India. All Rights Reserved.</p>
                <p class="audit-note">Security Audited as per CERT-In Guidelines • Last Updated: 21 September 2026</p>
              </div>
            </div>
          </footer>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .gov-tricolor-strip {
      height: 4px;
      background: linear-gradient(to right, #ff9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%);
      width: 100%;
    }

    .gov-top-bar {
      background: #0f172a;
      color: #e2e8f0;
      font-size: 11px;
      padding: 6px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
      font-family: 'Inter', sans-serif;
    }

    .gov-top-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .emblem-text-hi {
      font-weight: 700;
      color: #ff9933;
    }

    .emblem-text-en {
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .ministry-text {
      color: #94a3b8;
    }

    .divider {
      color: #475569;
    }

    .gov-top-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .live-clock {
      color: #cbd5e1;
      font-family: monospace;
      font-size: 11px;
    }

    .gov-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #86efac;
      font-size: 10px;
      font-weight: 600;
    }

    .shield-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .sidenav-container {
      height: calc(100vh - 35px);
      background-color: #f8fafc;
    }

    .sidenav {
      width: 270px;
      background-color: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      padding: 16px;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
      border-bottom: 1px solid #e2e8f0;
      gap: 12px;
    }

    .emblem-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ashoka-chakra {
      animation: spin-subtle 40s linear infinite;
    }

    @keyframes spin-subtle {
      100% { transform: rotate(360deg); }
    }

    .app-branding {
      display: flex;
      flex-direction: column;
    }

    .app-title-main {
      font-size: 18px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .app-title-sub {
      font-size: 11px;
      font-weight: 500;
      color: #64748b;
    }

    .active-fy-banner {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      margin: 12px 14px 4px 14px;
      padding: 6px 12px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .fy-label {
      font-size: 11px;
      color: #166534;
      font-weight: 600;
      text-transform: uppercase;
    }

    .fy-badge {
      background-color: #16a34a;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .nav-list {
      padding-top: 10px;
      flex: 1;
    }

    .nav-item {
      color: #334155;
      margin: 3px 10px;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .nav-title {
      font-size: 13.5px;
      font-weight: 500;
    }

    .nav-item:hover {
      background-color: #f1f5f9;
      color: #1e3a8a;
    }

    .active-nav-item {
      background-color: #eff6ff !important;
      color: #1d4ed8 !important;
      border-left: 4px solid #1d4ed8;
      font-weight: 600;
    }
    
    .active-nav-item mat-icon {
      color: #1d4ed8 !important;
    }

    .sidenav-footer {
      padding: 16px;
      border-top: 1px solid #e2e8f0;
      background-color: #f8fafc;
    }

    .nic-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }

    .nic-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #16a34a;
    }

    .toolbar {
      background-color: #ffffff;
      color: #0f172a;
      height: 64px !important;
      min-height: 64px !important;
      border-bottom: 1px solid #e2e8f0;
      padding: 0 20px !important;
      display: flex;
      align-items: center;
      box-sizing: border-box;
    }
    
    .menu-btn {
      color: #475569;
      margin-right: 12px;
    }

    .portal-main-heading {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .portal-title {
      font-size: 14.5px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .portal-tagline {
      font-size: 11px;
      color: #64748b;
      font-weight: 400;
      margin-top: 1px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .officer-profile-card {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 4px 12px 4px 6px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      user-select: none;
      height: 42px;
      box-sizing: border-box;
    }

    .officer-profile-card:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .officer-avatar-badge {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }

    .officer-identity {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1.15;
      text-align: left;
    }

    .officer-fullname {
      font-size: 12.5px;
      font-weight: 600;
      color: #0f172a;
      white-space: nowrap;
    }

    .officer-role-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      white-space: nowrap;
      margin-top: 1px;
    }

    .status-indicator-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      display: inline-block;
    }

    .officer-role-tag.admin {
      color: #dc2626;
    }
    .officer-role-tag.admin .status-indicator-dot {
      background-color: #dc2626;
    }

    .officer-role-tag.finance_officer {
      color: #2563eb;
    }
    .officer-role-tag.finance_officer .status-indicator-dot {
      background-color: #2563eb;
    }

    .officer-role-tag.department_head {
      color: #d97706;
    }
    .officer-role-tag.department_head .status-indicator-dot {
      background-color: #d97706;
    }

    .dropdown-chevron {
      color: #64748b;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .main-content {
      height: calc(100vh - 95px);
      overflow-y: auto;
      background-color: #f8fafc;
      padding: 20px;
      box-sizing: border-box;
    }

    .gov-portal-footer {
      background-color: #0f172a;
      color: #94a3b8;
      padding: 24px;
      border-radius: 8px;
      margin-top: 40px;
      border-top: 3px solid #ff9933;
    }

    .gov-footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }

    .footer-heading {
      font-size: 14px;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 4px;
    }

    .gov-footer-col p {
      margin: 2px 0;
      font-size: 12px;
    }

    .links-col {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      color: #cbd5e1;
    }

    .footer-link:hover {
      color: #ffffff;
      cursor: pointer;
      text-decoration: underline;
    }

    .copyright-col {
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #1e293b;
      padding-top: 10px;
      width: 100%;
    }

    .audit-note {
      color: #4ade80;
    }

    @media (max-width: 900px) {
      .portal-tagline, .gov-top-right, .active-fy-banner { display: none; }
      .portal-title { font-size: 13px; }
    }
  `]
})
export class LayoutComponent implements OnInit {
  user: any;
  sidenavOpened = true;
  currentTime: Date = new Date();
  
  navItems: { label: string, icon: string, route: string, roles: string[] }[] = [];
  
  constructor(public authService: AuthService) {}
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.buildNavItems();
    });

    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  getFormattedRole(role: string): string {
    if (!role) return 'OFFICER';
    switch (role.toLowerCase()) {
      case 'admin': return 'System Administrator';
      case 'finance_officer': return 'Finance Controller';
      case 'department_head': return 'Department Head / Secretary';
      default: return role;
    }
  }
  
  buildNavItems() {
    this.navItems = [
      { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: [] },
      { label: 'Budgets', icon: 'account_balance', route: '/budgets', roles: [] },
      { label: 'Expenditures', icon: 'receipt_long', route: '/expenditures', roles: [] },
      { label: 'Monitoring', icon: 'analytics', route: '/monitoring', roles: [] },
      { label: 'Alerts', icon: 'notifications', route: '/alerts', roles: [] },
      { label: 'Reports', icon: 'assessment', route: '/reports', roles: [] },
      { label: 'Admin Panel', icon: 'admin_panel_settings', route: '/admin', roles: ['admin'] },
      { label: 'Audit Logs', icon: 'history', route: '/audit', roles: ['admin'] }
    ];
  }
  
  hasRole(roles: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    if (!this.user || !this.user.role) return false;
    return roles.includes(this.user.role);
  }
  
  logout() { 
    this.authService.logout(); 
  }
  
  toggleSidenav() { 
    this.sidenavOpened = !this.sidenavOpened; 
  }
}
