import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-wrapper">
      <!-- Ambient glows -->
      <div class="glow glow-indigo"></div>
      <div class="glow glow-sky"></div>
      <div class="glow glow-violet"></div>

      <!-- Top left brand -->
      <div class="brand">
        <svg xmlns="http://www.w3.org/2000/svg" class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <span class="brand-text">Budget Monitor</span>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <div class="card-header">
          <div class="icon-wrapper">
             <svg xmlns="http://www.w3.org/2000/svg" class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
               <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
             </svg>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label>EMAIL ADDRESS</label>
            <div class="input-wrapper">
              <span class="input-prefix">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input formControlName="email" type="email" placeholder="Ex. admin@example.com">
            </div>
            <div class="error-msg" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('required')">
              Email is required
            </div>
            <div class="error-msg" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label>PASSWORD</label>
            <div class="input-wrapper">
              <span class="input-prefix">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="Enter your password">
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
            <span *ngIf="!isLoading">Sign in to Dashboard &rarr;</span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="footer">
        <svg xmlns="http://www.w3.org/2000/svg" class="security-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span>&copy; 2025 Budget Monitor. All rights reserved.</span>
      </div>
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
      justify-content: center;
      background-color: #f8fafc;
      overflow: hidden;
    }

    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      z-index: 0;
      pointer-events: none;
    }
    .glow-indigo {
      width: 400px;
      height: 400px;
      background: rgba(199, 210, 254, 0.4);
      top: -100px;
      left: -100px;
    }
    .glow-sky {
      width: 300px;
      height: 300px;
      background: rgba(186, 230, 253, 0.35);
      bottom: 10%;
      right: 5%;
    }
    .glow-violet {
      width: 350px;
      height: 350px;
      background: rgba(221, 214, 254, 0.3);
      top: 20%;
      right: -50px;
    }

    .brand {
      position: absolute;
      top: 24px;
      left: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 10;
      color: #4f46e5;
      font-weight: 700;
      font-size: 1.125rem;
    }
    .brand-icon {
      width: 24px;
      height: 24px;
    }

    .login-card {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
      background-color: #ffffff;
      border-radius: 24px;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.07);
      border: 1px solid rgba(226, 232, 240, 0.8);
      padding: 40px 32px;
      margin: 0 20px;
      box-sizing: border-box;
    }

    .card-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .icon-wrapper {
      width: 56px;
      height: 56px;
      margin: 0 auto 16px;
      background: rgba(238, 242, 255, 1);
      color: #4f46e5;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon {
      width: 28px;
      height: 28px;
    }
    .card-header h1 {
      margin: 0 0 8px;
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
    }
    .card-header p {
      margin: 0;
      color: #64748b;
      font-size: 1rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 0.75rem;
      font-weight: 600;
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
      left: 12px;
      display: flex;
      align-items: center;
      color: #94a3b8;
    }
    .input-prefix svg {
      width: 20px;
      height: 20px;
    }

    input {
      width: 100%;
      height: 48px;
      padding: 0 40px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-size: 1rem;
      color: #0f172a;
      outline: none;
      transition: all 0.2s ease;
      background-color: #fff;
      box-sizing: border-box;
    }

    input::placeholder {
      color: #94a3b8;
    }

    input:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
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
      width: 20px;
      height: 20px;
    }

    .error-msg {
      font-size: 0.875rem;
      color: #ef4444;
      margin-top: 4px;
    }

    .primary-btn {
      margin-top: 12px;
      height: 48px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(to right, #4f46e5, #4338ca);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .primary-btn:hover:not(:disabled) {
      background: linear-gradient(to right, #6366f1, #4f46e5);
      transform: translateY(-1px);
    }
    .primary-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .footer {
      position: absolute;
      bottom: 24px;
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 0.875rem;
      z-index: 10;
    }
    .security-badge {
      width: 16px;
      height: 16px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  
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
        this.snackBar.open(err.error?.message || 'Login failed. Please check your credentials.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
