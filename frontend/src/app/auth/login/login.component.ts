import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

interface DemoAccount {
  roleName: string;
  email: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  description: string;
  department: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <!-- Top Tricolor Accent Line -->
      <div class="tricolor-strip"></div>

      <!-- Ambient glows -->
      <div class="glow glow-indigo"></div>
      <div class="glow glow-sky"></div>
      <div class="glow glow-violet"></div>

      <!-- Top Header Navigation -->
      <header class="login-nav-header">
        <a routerLink="/" class="brand" title="Return to National Portal">
          <div class="emblem-circle">
            <svg class="ashoka-chakra" viewBox="0 0 100 100" width="28" height="28">
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
          <div class="brand-text-block">
            <span class="brand-title">PFM-BUMS Portal</span>
            <span class="brand-sub">Government of India • Ministry of Finance</span>
          </div>
        </a>

        <a routerLink="/" class="return-home-btn" title="Back to public landing page">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Return to National Home</span>
        </a>
      </header>

      <!-- Main Dual Split Container -->
      <main class="login-main-container">

        <!-- Left Column: Login Card -->
        <div class="login-card">
          <div class="card-header">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h1>Officer Sign In</h1>
            <p>Access the Central Financial & Budget Utilization Engine</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label>GOVERNMENT OFFICER EMAIL</label>
              <div class="input-wrapper">
                <span class="input-prefix">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input formControlName="email" type="email" placeholder="e.g. admin1@gov.in">
              </div>
              <div class="error-msg" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('required')">
                Email is required
              </div>
              <div class="error-msg" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </div>
            </div>

            <div class="form-group">
              <label>OFFICIAL PASSWORD</label>
              <div class="input-wrapper">
                <span class="input-prefix">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="Enter your secure password">
                <button type="button" class="toggle-password" (click)="hidePassword = !hidePassword" [attr.aria-label]="'Toggle password visibility'">
                  <svg *ngIf="hidePassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg *ngIf="!hidePassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
              <div class="error-msg" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')">
                Password is required
              </div>
              <div class="error-msg" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </div>
            </div>

            <button type="submit" class="primary-btn" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner"></span>
              <span *ngIf="!isLoading">Sign In to Dashboard &rarr;</span>
            </button>
          </form>

          <div class="secure-session-hint">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>256-bit Encrypted Government Authentication Session</span>
          </div>
        </div>

        <!-- Right Column: Demo Credentials Side Panel -->
        <div class="credentials-card">
          <div class="cred-card-header">
            <div class="cred-badge-row">
              <span class="cred-mode-tag">
                <span class="pulse-dot"></span>
                DEMO SYSTEM ACCESS
              </span>
              <span class="cred-hint-tag">One-Click Auto Fill</span>
            </div>

            <h2 class="cred-heading">Role-Based Demo Credentials</h2>
            <p class="cred-subheading">
              Click any account below to instantly pre-fill credentials and evaluate role permissions.
            </p>

            <div class="password-banner">
              <div class="pass-info-left">
                <span class="pass-title">Universal Demo Password:</span>
                <code class="pass-code">Password123!</code>
              </div>
              <button type="button" class="btn-copy-pass" (click)="copyPassword()" title="Copy password to clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
          </div>

          <div class="credentials-list">
            <div
              *ngFor="let user of demoUsers"
              class="cred-item"
              (click)="fillCredentials(user)"
              [class.active]="loginForm.get('email')?.value === user.email">

              <div class="cred-item-header">
                <div class="role-left">
                  <span class="role-title">{{ user.roleName }}</span>
                  <span class="role-badge" [style.color]="user.badgeColor" [style.backgroundColor]="user.badgeBg">
                    {{ user.badge }}
                  </span>
                </div>
                <button type="button" class="btn-autofill" (click)="$event.stopPropagation(); fillCredentials(user)">
                  <span>Use This</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

              <div class="cred-email-row">
                <span class="email-text">{{ user.email }}</span>
                <span class="dept-text">• {{ user.department }}</span>
              </div>

              <div class="cred-desc">{{ user.description }}</div>
            </div>
          </div>

          <div class="cred-notice-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Department heads are automatically scoped to their designated ministry data.</span>
          </div>
        </div>

      </main>

      <!-- Bottom Government Footer -->
      <footer class="login-footer">
        <div class="footer-line">
          <span>&copy; 2026 Public Financial Management System (PFM-BUMS) • Government of India</span>
          <span class="footer-sep">|</span>
          <span>Designed for Ministry of Finance & Central Departments</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .page-wrapper {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background-color: #f8fafc;
      overflow-x: hidden;
      padding-bottom: 24px;
    }

    /* Top Tricolor Accent Line */
    .tricolor-strip {
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #ff9933 0%, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 50;
    }

    /* Ambient Soft Glows */
    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      z-index: 0;
      pointer-events: none;
    }
    .glow-indigo {
      width: 450px;
      height: 450px;
      background: rgba(199, 210, 254, 0.45);
      top: -80px;
      left: -100px;
    }
    .glow-sky {
      width: 380px;
      height: 380px;
      background: rgba(186, 230, 253, 0.4);
      bottom: 5%;
      right: 5%;
    }
    .glow-violet {
      width: 400px;
      height: 400px;
      background: rgba(221, 214, 254, 0.35);
      top: 25%;
      right: -80px;
    }

    /* Top Header */
    .login-nav-header {
      width: 100%;
      max-width: 1120px;
      padding: 24px 24px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
      box-sizing: border-box;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .emblem-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid #bfdbfe;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(30, 58, 138, 0.08);
    }

    .brand-text-block {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 1.125rem;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: -0.01em;
    }

    .brand-sub {
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 500;
    }

    .return-home-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.813rem;
      font-weight: 600;
      color: #1e3a8a;
      background: #ffffff;
      border: 1px solid #bfdbfe;
      padding: 8px 16px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    .return-home-btn:hover {
      background: #eff6ff;
      border-color: #93c5fd;
      transform: translateX(-2px);
    }

    /* Main Container: Split Layout */
    .login-main-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1120px;
      margin: auto;
      padding: 16px 24px;
      display: flex;
      gap: 28px;
      align-items: stretch;
      box-sizing: border-box;
    }

    /* Left Card: Login Form */
    .login-card {
      flex: 1;
      max-width: 450px;
      background-color: #ffffff;
      border-radius: 24px;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.9);
      padding: 36px 32px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .icon-wrapper {
      width: 52px;
      height: 52px;
      margin: 0 auto 14px;
      background: #eff6ff;
      color: #1e3a8a;
      border-radius: 14px;
      border: 1px solid #bfdbfe;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon {
      width: 26px;
      height: 26px;
    }
    .card-header h1 {
      margin: 0 0 6px;
      font-size: 1.625rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .card-header p {
      margin: 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #334155;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-prefix {
      position: absolute;
      left: 14px;
      display: flex;
      align-items: center;
      color: #94a3b8;
    }
    .input-prefix svg {
      width: 18px;
      height: 18px;
    }

    input {
      width: 100%;
      height: 46px;
      padding: 0 42px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-size: 0.938rem;
      color: #0f172a;
      outline: none;
      transition: all 0.2s ease;
      background-color: #fff;
      box-sizing: border-box;
    }
    input::placeholder {
      color: #94a3b8;
      font-size: 0.875rem;
    }
    input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      padding: 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #94a3b8;
      transition: color 0.2s ease;
    }
    .toggle-password:hover {
      color: #64748b;
    }
    .toggle-password svg {
      width: 18px;
      height: 18px;
    }

    .error-msg {
      font-size: 0.813rem;
      color: #ef4444;
      margin-top: 2px;
    }

    .primary-btn {
      margin-top: 8px;
      height: 48px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: white;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.35);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .primary-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
      transform: translateY(-1px);
      box-shadow: 0 10px 24px -4px rgba(37, 99, 235, 0.45);
    }
    .primary-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .secure-session-hint {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Right Card: Credentials Side Panel */
    .credentials-card {
      flex: 1.25;
      background-color: #ffffff;
      border-radius: 24px;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.9);
      padding: 32px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .cred-badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .cred-mode-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.688rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #1e3a8a;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 3px 10px;
      border-radius: 9999px;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    .cred-hint-tag {
      font-size: 0.72rem;
      font-weight: 600;
      color: #059669;
      background: #ecfdf5;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .cred-heading {
      margin: 0 0 4px;
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.01em;
    }

    .cred-subheading {
      margin: 0 0 16px;
      font-size: 0.825rem;
      color: #64748b;
    }

    .password-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .pass-info-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.813rem;
    }
    .pass-title {
      font-weight: 600;
      color: #334155;
    }
    .pass-code {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 2px 8px;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.825rem;
      font-weight: 700;
      color: #1e3a8a;
    }

    .btn-copy-pass {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-copy-pass:hover {
      background: #f1f5f9;
      color: #1e3a8a;
      border-color: #94a3b8;
    }

    /* Credentials List */
    .credentials-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 420px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .credentials-list::-webkit-scrollbar {
      width: 5px;
    }
    .credentials-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .cred-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .cred-item:hover {
      border-color: #93c5fd;
      background: #f8fafc;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);
    }
    .cred-item.active {
      border-color: #2563eb;
      background: #eff6ff;
      box-shadow: 0 0 0 1px #2563eb;
    }

    .cred-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .role-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .role-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
    }
    .role-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .btn-autofill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e3a8a;
      font-size: 0.688rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .cred-item:hover .btn-autofill {
      background: #2563eb;
      color: #ffffff;
      border-color: #2563eb;
    }

    .cred-email-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.775rem;
      margin-bottom: 3px;
    }
    .email-text {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
      color: #2563eb;
    }
    .dept-text {
      color: #64748b;
      font-size: 0.72rem;
    }

    .cred-desc {
      font-size: 0.72rem;
      color: #64748b;
      line-height: 1.35;
    }

    .cred-notice-box {
      margin-top: 14px;
      padding: 8px 12px;
      border-radius: 8px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.72rem;
      color: #1e3a8a;
      font-weight: 500;
    }

    /* Footer */
    .login-footer {
      width: 100%;
      text-align: center;
      padding: 16px 24px 0;
      color: #94a3b8;
      font-size: 0.75rem;
      z-index: 10;
      box-sizing: border-box;
    }
    .footer-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .footer-sep {
      opacity: 0.5;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 960px) {
      .login-main-container {
        flex-direction: column;
        align-items: center;
      }
      .login-card, .credentials-card {
        max-width: 520px;
        width: 100%;
      }
      .credentials-list {
        max-height: 320px;
      }
    }

    @media (max-width: 600px) {
      .login-nav-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
      .login-card, .credentials-card {
        padding: 24px 18px;
      }
      .footer-line {
        flex-direction: column;
        gap: 4px;
      }
      .footer-sep {
        display: none;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  copied = false;

  demoUsers: DemoAccount[] = [
    {
      roleName: 'System Admin',
      email: 'admin1@gov.in',
      badge: 'Full Admin',
      badgeColor: '#1e3a8a',
      badgeBg: '#eff6ff',
      department: 'Central Administration',
      description: 'Full portal governance, threshold rule configuration & user authority'
    },
    {
      roleName: 'Finance Controller',
      email: 'finance1@gov.in',
      badge: 'Finance Officer',
      badgeColor: '#059669',
      badgeBg: '#ecfdf5',
      department: 'Ministry of Finance',
      description: 'Budget allocations, multi-departmental expenditure approvals & audit export'
    },
    {
      roleName: 'PWD Head',
      email: 'head.public@gov.in',
      badge: 'Dept Head',
      badgeColor: '#2563eb',
      badgeBg: '#eff6ff',
      department: 'Public Works Dept',
      description: 'Highway corridors, flyovers & rural road infrastructure disbursals'
    },
    {
      roleName: 'Health Head',
      email: 'head.health@gov.in',
      badge: 'Dept Head',
      badgeColor: '#dc2626',
      badgeBg: '#fee2e2',
      department: 'Health & Family Welfare',
      description: 'Hospital infrastructure, PMJAY tertiary care & medicine procurement'
    },
    {
      roleName: 'Education Head',
      email: 'head.education@gov.in',
      badge: 'Dept Head',
      badgeColor: '#d97706',
      badgeBg: '#fef3c7',
      department: 'Education Department',
      description: 'School digitization, academic grants & midday meal nutrition funding'
    },
    {
      roleName: 'Agriculture Head',
      email: 'head.agriculture@gov.in',
      badge: 'Dept Head',
      badgeColor: '#16a34a',
      badgeBg: '#f0fdf4',
      department: 'Agriculture & Farmers',
      description: 'PM-KISAN income grants, crop insurance & micro-irrigation subsidies'
    }
  ];

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  fillCredentials(user: DemoAccount) {
    this.loginForm.patchValue({
      email: user.email,
      password: 'Password123!'
    });
    this.snackBar.open(`Selected ${user.roleName} credentials (${user.email})!`, 'Sign In Now', {
      duration: 3500
    });
  }

  copyPassword() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('Password123!').then(() => {
        this.copied = true;
        this.snackBar.open('Password copied to clipboard: Password123!', 'OK', { duration: 2500 });
        setTimeout(() => (this.copied = false), 3000);
      });
    } else {
      this.snackBar.open('Demo password: Password123!', 'OK', { duration: 3000 });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Login failed. Please verify selected credentials.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
