import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauth-container">
      <mat-card class="unauth-card">
        <mat-icon color="warn" class="unauth-icon">block</mat-icon>
        <mat-card-title>Access Denied</mat-card-title>
        <mat-card-content>
          <p>You do not have permission to access this page.</p>
          <p>Please contact your administrator if you believe this is a mistake.</p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="goHome()">
            <mat-icon>home</mat-icon>
            Return to Dashboard
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .unauth-card {
      max-width: 400px;
      text-align: center;
      padding: 32px 24px;
    }
    
    .unauth-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }
    
    mat-card-title {
      margin-bottom: 16px !important;
      font-size: 24px;
    }
    
    p {
      color: #666;
      margin-bottom: 8px;
    }
    
    mat-card-actions {
      margin-top: 24px;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}
  
  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
