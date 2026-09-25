import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';

interface DepartmentCard {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  bgLight: string;
  allocatedCr: number;
  spentCr: number;
  schemesCount: number;
  schemes: string[];
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="landing-page-wrapper">
      
      <!-- Ambient animated light glows -->
      <div class="ambient-orb orb-saffron"></div>
      <div class="ambient-orb orb-blue"></div>
      <div class="ambient-orb orb-emerald"></div>

      <!-- Top Indian Tricolor Strip -->
      <div class="gov-tricolor-strip"></div>

      <!-- Official Topmost Government Bar -->
      <header class="gov-top-bar">
        <div class="gov-top-container">
          <div class="gov-top-left">
            <span class="emblem-text-hi">भारत सरकार</span>
            <span class="divider">|</span>
            <span class="emblem-text-en">GOVERNMENT OF INDIA</span>
            <span class="divider">•</span>
            <span class="ministry-title">MINISTRY OF FINANCE (वित्त मंत्रालय)</span>
          </div>
          <div class="gov-top-right">
            <div class="accessibility-links">
              <span class="access-item" (click)="setFontScale('standard')">Standard</span>
              <span class="divider">|</span>
              <span class="access-item" (click)="setFontScale('large')">A+</span>
              <span class="divider">|</span>
              <span class="access-item">English</span>
            </div>
            <span class="divider">|</span>
            <span class="live-clock">{{ currentTime | date:'dd MMM yyyy, HH:mm:ss' }} IST</span>
            <span class="divider">|</span>
            <span class="gov-security-badge">
              <mat-icon class="badge-icon">verified</mat-icon> Official Public Portal
            </span>
          </div>
        </div>
      </header>

      <!-- Main Navigation Header -->
      <nav class="portal-navbar">
        <div class="nav-container">
          
          <div class="nav-brand" routerLink="/">
            <div class="emblem-logo">
              <svg class="ashoka-chakra" viewBox="0 0 100 100" width="42" height="42">
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
            <div class="brand-titles">
              <div class="brand-acronym">PFM-BUMS</div>
              <div class="brand-full">Public Financial Management & Budget Utilization System</div>
              <div class="brand-sub">Government of India • Central Expenditure Governance Cell</div>
            </div>
          </div>

          <div class="nav-links">
            <a href="#overview" class="nav-link">Overview</a>
            <a href="#metrics" class="nav-link">Fiscal Metrics</a>
            <a href="#departments" class="nav-link">Departments</a>
            <a href="#ai-governance" class="nav-link">AI Safeguards</a>
            <a href="#charter" class="nav-link">Citizen Charter</a>
          </div>

          <div class="nav-actions">
            <ng-container *ngIf="isLoggedIn; else loginBtn">
              <a routerLink="/dashboard" class="btn-portal-action logged-in-btn">
                <mat-icon>dashboard</mat-icon>
                <span>Go to Dashboard</span>
              </a>
            </ng-container>
            <ng-template #loginBtn>
              <a routerLink="/login" class="btn-portal-action">
                <mat-icon>lock</mat-icon>
                <span>Officer Login</span>
              </a>
            </ng-template>
          </div>
        </div>
      </nav>

      <!-- Live Notice Marquee Bar -->
      <div class="live-notice-strip">
        <div class="notice-badge">
          <span class="pulse-dot"></span>
          <span>DIRECTIVE</span>
        </div>
        <div class="marquee-wrapper">
          <div class="marquee-track">
            <span>📢 Union Budget 2025-26 Monitoring Active: All Central Ministries to submit quarterly scheme utilization certificates by 31st March.</span>
            <span class="marquee-divider">•</span>
            <span>⚡ Automated Anomaly Detection: System enforces zero-tolerance spending spike scrutinies under General Financial Rules (GFR 2017).</span>
            <span class="marquee-divider">•</span>
            <span>🛡️ Real-Time Disbursal Validation: Mandatory GeM (Government e-Marketplace) invoice mapping active for all capital asset disbursements.</span>
          </div>
        </div>
      </div>

      <!-- Hero Section -->
      <section class="hero-section" id="overview">
        <div class="hero-container">
          <div class="hero-badge">
            <span class="badge-flag">🇮🇳</span>
            <span>Official Central Monitoring Platform • Ministry of Finance</span>
          </div>

          <h1 class="hero-headline">
            Transparent Public Fund Governance & <span class="gradient-text">Algorithmic Budget Surveillance</span>
          </h1>

          <p class="hero-subhead">
            A state-of-the-art national monitoring system providing real-time financial scrutiny, 
            rule-based anomaly detection, and capital velocity tracking across 8 key ministerial portfolios.
          </p>

          <div class="hero-cta-group">
            <a routerLink="/login" class="hero-primary-btn">
              <span>Access Secure Officer Portal</span>
              <mat-icon>arrow_forward</mat-icon>
            </a>
            <a href="#metrics" class="hero-secondary-btn">
              <mat-icon>bar_chart</mat-icon>
              <span>Explore Public Metrics</span>
            </a>
          </div>

          <!-- Hero Floating Cards / Live Key Indicators -->
          <div class="hero-metrics-grid">
            <div class="hero-metric-card">
              <div class="metric-icon-box bg-blue">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">₹5,032+ Cr</div>
                <div class="metric-label">Total Allocated Grants</div>
                <div class="metric-tag">FY 2025-26 Cycle</div>
              </div>
            </div>

            <div class="hero-metric-card">
              <div class="metric-icon-box bg-orange">
                <mat-icon>payments</mat-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">₹2,893+ Cr</div>
                <div class="metric-label">Monitored Disbursals</div>
                <div class="metric-tag">671 Audited Vouchers</div>
              </div>
            </div>

            <div class="hero-metric-card">
              <div class="metric-icon-box bg-emerald">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">57.5%</div>
                <div class="metric-label">Overall Fiscal Velocity</div>
                <div class="metric-tag">Balanced Utilization</div>
              </div>
            </div>

            <div class="hero-metric-card">
              <div class="metric-icon-box bg-indigo">
                <mat-icon>verified_user</mat-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">100%</div>
                <div class="metric-label">Anomaly Interception</div>
                <div class="metric-tag">8 Real-time Safeguards</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Live Fiscal Counter Section -->
      <section class="metrics-section" id="metrics">
        <div class="section-container">
          <div class="section-header text-center">
            <div class="section-pill">LIVE CENTRAL METRICS</div>
            <h2 class="section-title">Macro Fiscal Transparency Indicators</h2>
            <p class="section-subtitle">Real-time telemetry aggregated directly from ministerial disbursal accounts.</p>
          </div>

          <div class="kpi-banner-card">
            <div class="kpi-banner-item">
              <div class="kpi-big-val text-blue">8</div>
              <div class="kpi-big-title">Monitored Ministries</div>
              <div class="kpi-big-desc">PWD, Health, Education, Jal Shakti, Transport, Rural, Urban & Agriculture</div>
            </div>
            <div class="kpi-banner-divider"></div>
            <div class="kpi-banner-item">
              <div class="kpi-big-val text-emerald">144</div>
              <div class="kpi-big-title">Active Public Budgets</div>
              <div class="kpi-big-desc">Spanning completed historical years (2023-24, 2024-25) & current cycle</div>
            </div>
            <div class="kpi-banner-divider"></div>
            <div class="kpi-banner-item">
              <div class="kpi-big-val text-amber">40+</div>
              <div class="kpi-big-title">National Flagship Schemes</div>
              <div class="kpi-big-desc">Including Ayushman Bharat, PMGSY, Jal Jeevan Mission, MGNREGA, PM-KISAN</div>
            </div>
            <div class="kpi-banner-divider"></div>
            <div class="kpi-banner-item">
              <div class="kpi-big-val text-indigo">99.4%</div>
              <div class="kpi-big-title">Public Audit Integrity</div>
              <div class="kpi-big-desc">Fully compliant with CAG & GFR 2017 regulatory standards</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Department Portfolios Section -->
      <section class="departments-section" id="departments">
        <div class="section-container">
          <div class="section-header text-center">
            <div class="section-pill">PORTFOLIO BREAKDOWN</div>
            <h2 class="section-title">Centrally Monitored Ministerial Portfolios</h2>
            <p class="section-subtitle">Explore allocations, schemes, and live fiscal discipline per department.</p>
          </div>

          <div class="departments-grid">
            <div class="dept-card" *ngFor="let dept of departments" (click)="selectedDept = dept" [class.selected]="selectedDept?.id === dept.id">
              <div class="dept-card-top">
                <div class="dept-icon-wrapper" [style.background-color]="dept.bgLight" [style.color]="dept.color">
                  <mat-icon>{{ dept.icon }}</mat-icon>
                </div>
                <div class="dept-stats-pill">
                  <span class="dept-schemes-badge">{{ dept.schemesCount }} Schemes</span>
                </div>
              </div>

              <h3 class="dept-name">{{ dept.name }}</h3>

              <div class="dept-financial-row">
                <div class="fin-col">
                  <span class="fin-lbl">Allocated</span>
                  <span class="fin-val text-blue">₹{{ dept.allocatedCr }} Cr</span>
                </div>
                <div class="fin-col">
                  <span class="fin-lbl">Spent</span>
                  <span class="fin-val text-orange">₹{{ dept.spentCr }} Cr</span>
                </div>
                <div class="fin-col">
                  <span class="fin-lbl">Velocity</span>
                  <span class="fin-val text-emerald">{{ ((dept.spentCr / dept.allocatedCr) * 100) | number:'1.0-0' }}%</span>
                </div>
              </div>

              <div class="dept-progress-container">
                <div class="dept-progress-bar" [style.width.%]="(dept.spentCr / dept.allocatedCr) * 100" [style.background-color]="dept.color"></div>
              </div>

              <div class="dept-schemes-list">
                <div class="scheme-item" *ngFor="let s of dept.schemes.slice(0, 3)">
                  <mat-icon class="scheme-dot">fiber_manual_record</mat-icon>
                  <span>{{ s }}</span>
                </div>
              </div>

              <div class="dept-card-footer">
                <span class="dept-view-link">View Department Data &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- AI-Driven Governance Pillars -->
      <section class="ai-section" id="ai-governance">
        <div class="section-container">
          <div class="section-header text-center">
            <div class="section-pill">ALGORITHMIC SURVEILLANCE</div>
            <h2 class="section-title">Automated AI Safeguards & Anomaly Detection</h2>
            <p class="section-subtitle">Preventing fiscal leaks, overrun breaches, and unverified spending spikes.</p>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon bg-red-light text-red">
                <mat-icon>notification_important</mat-icon>
              </div>
              <h3>Overspending Interceptor</h3>
              <p>Continuous algorithmic monitoring automatically triggers high-priority alerts whenever departmental expenditure reaches 90% and freezes over-budget authorizations.</p>
              <div class="feature-tag">Threshold Safeguard</div>
            </div>

            <div class="feature-card">
              <div class="feature-icon bg-amber-light text-amber">
                <mat-icon>bolt</mat-icon>
              </div>
              <h3>Spending Spike Detection</h3>
              <p>Machine learning monitors spending velocity. Sudden 30%+ spikes within single disbursement cycles trigger immediate departmental head scrutiny.</p>
              <div class="feature-tag">Velocity Anomaly</div>
            </div>

            <div class="feature-card">
              <div class="feature-icon bg-blue-light text-blue">
                <mat-icon>hourglass_bottom</mat-icon>
              </div>
              <h3>Under-utilization Warning</h3>
              <p>Flags delayed public welfare implementations if schemes remain under 25% utilized by the close of Q3, ensuring timely resource re-allocation.</p>
              <div class="feature-tag">Proactive Governance</div>
            </div>

            <div class="feature-card">
              <div class="feature-icon bg-emerald-light text-emerald">
                <mat-icon>history_edu</mat-icon>
              </div>
              <h3>Immutable Audit Trail</h3>
              <p>Every allocation modification, user role modification, and voucher clearance is permanently journaled with user identity, client IP, and timestamps.</p>
              <div class="feature-tag">CERT-In Aligned</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Citizen Transparency & RTI Section -->
      <section class="charter-section" id="charter">
        <div class="section-container">
          <div class="charter-box">
            <div class="charter-content">
              <div class="section-pill" style="background-color: #fef3c7; color: #b45309;">PUBLIC TRANSPARENCY MANDATE</div>
              <h2>Open Governance & Citizen Accountability</h2>
              <p>
                In alignment with the Right to Information (RTI) Act and National Open Data Initiatives, 
                PFM-BUMS guarantees public access to macro-level budget allocations and scheme execution velocity. 
                Citizens, researchers, and media can verify the authentic deployment of public funds.
              </p>
              <div class="charter-stats">
                <div class="stat-bubble">
                  <strong>100%</strong>
                  <span>Public Scheme Visibility</span>
                </div>
                <div class="stat-bubble">
                  <strong>GFR 2017</strong>
                  <span>Compliance Mandated</span>
                </div>
                <div class="stat-bubble">
                  <strong>24/7</strong>
                  <span>Public Telemetry</span>
                </div>
              </div>
            </div>
            <div class="charter-visual">
              <div class="security-seal-card">
                <mat-icon class="large-shield">security</mat-icon>
                <div class="seal-title">National Fiscal Data Integrity</div>
                <div class="seal-subtitle">Standardized under Central Financial Rules</div>
                <div class="seal-check">
                  <mat-icon>check_circle</mat-icon>
                  <span>Validated by Ministry of Finance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Official Portal Footer -->
      <footer class="portal-footer">
        <div class="footer-tricolor"></div>
        <div class="footer-container">
          <div class="footer-top-grid">
            <div class="footer-col brand-col">
              <div class="footer-emblem-title">
                <svg viewBox="0 0 100 100" width="32" height="32">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#ffffff" stroke-width="4"/>
                  <circle cx="50" cy="50" r="10" fill="#ffffff"/>
                  <g stroke="#ffffff" stroke-width="2">
                    <line x1="50" y1="4" x2="50" y2="96"/>
                    <line x1="4" y1="50" x2="96" y2="50"/>
                  </g>
                </svg>
                <span>PFM-BUMS</span>
              </div>
              <p class="footer-about">
                National Budget Utilization & Expenditure Monitoring System. 
                Designed, developed, and maintained by the National Informatics Centre (NIC), 
                Ministry of Electronics & Information Technology, Government of India.
              </p>
              <div class="footer-badges">
                <span class="badge-pill">Digital India</span>
                <span class="badge-pill">GIGW Compliant</span>
                <span class="badge-pill">NIC Hosted</span>
              </div>
            </div>

            <div class="footer-col">
              <h4>Quick Navigation</h4>
              <ul>
                <li><a routerLink="/login">Officer Portal Login</a></li>
                <li><a href="#overview">System Overview</a></li>
                <li><a href="#metrics">Live Key Metrics</a></li>
                <li><a href="#departments">Departmental Budgets</a></li>
                <li><a href="#ai-governance">AI Surveillance</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Citizen Resources</h4>
              <ul>
                <li><a href="#charter">Citizen Transparency Charter</a></li>
                <li><a href="#">Right to Information (RTI)</a></li>
                <li><a href="#">Open Data Policy</a></li>
                <li><a href="#">Public Grievance Portal (CPGRAMS)</a></li>
                <li><a href="#">Union Budget Documents</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Official Support</h4>
              <p class="support-text">Toll-Free National Helpdesk:</p>
              <div class="toll-free">1800-11-7788</div>
              <p class="support-hours">Operational: 09:00 AM - 06:00 PM IST (Mon-Fri)</p>
              <p class="support-email">Email: support-pfmbums&#64;nic.in</p>
            </div>
          </div>

          <div class="footer-bottom-row">
            <div class="footer-legal-links">
              <a href="#">Website Policies</a> •
              <a href="#">Privacy Policy</a> •
              <a href="#">Hyperlinking Policy</a> •
              <a href="#">Terms & Conditions</a> •
              <a href="#">Accessibility Statement</a> •
              <a href="#">Help</a>
            </div>
            <div class="footer-copyright">
              © 2026 Ministry of Finance, Government of India. All rights reserved. 
              <span class="audit-status">Security Audited as per CERT-In Guidelines</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      overflow-x: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .landing-page-wrapper {
      position: relative;
      background-color: #f8fafc;
      color: #0f172a;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Ambient animated glows */
    .ambient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;
      opacity: 0.35;
      z-index: 0;
    }

    .orb-saffron {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, #ff9933 0%, rgba(255, 153, 51, 0) 70%);
      top: -100px;
      left: 10%;
      animation: float-slow 14s ease-in-out infinite alternate;
    }

    .orb-blue {
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, #38bdf8 0%, rgba(56, 189, 248, 0) 70%);
      top: 150px;
      right: 5%;
      animation: float-slow 18s ease-in-out infinite alternate-reverse;
    }

    .orb-emerald {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #34d399 0%, rgba(52, 211, 153, 0) 70%);
      top: 900px;
      left: 5%;
      animation: float-slow 16s ease-in-out infinite alternate;
    }

    @keyframes float-slow {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(60px) scale(1.08); }
    }

    /* Tricolor Stripe */
    .gov-tricolor-strip {
      height: 4px;
      background: linear-gradient(to right, #ff9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%);
      width: 100%;
      position: relative;
      z-index: 100;
    }

    /* Topmost Gov Bar */
    .gov-top-bar {
      background: #0f172a;
      color: #cbd5e1;
      font-size: 11px;
      padding: 6px 0;
      border-bottom: 1px solid #1e293b;
      position: relative;
      z-index: 100;
    }

    .gov-top-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      color: #ffffff;
    }

    .ministry-title {
      color: #94a3b8;
    }

    .divider {
      color: #475569;
    }

    .gov-top-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .accessibility-links {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .access-item {
      cursor: pointer;
      transition: color 0.2s;
    }

    .access-item:hover {
      color: #ffffff;
    }

    .live-clock {
      font-family: monospace;
      color: #e2e8f0;
    }

    .gov-security-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #4ade80;
      font-weight: 600;
      font-size: 10.5px;
    }

    .badge-icon {
      font-size: 13px;
      width: 13px;
      height: 13px;
    }

    /* Main Navbar */
    .portal-navbar {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 99;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }

    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      text-decoration: none;
    }

    .emblem-logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ashoka-chakra {
      animation: spin-chakra 60s linear infinite;
    }

    @keyframes spin-chakra {
      100% { transform: rotate(360deg); }
    }

    .brand-titles {
      display: flex;
      flex-direction: column;
    }

    .brand-acronym {
      font-size: 19px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.5px;
      line-height: 1.1;
    }

    .brand-full {
      font-size: 11.5px;
      font-weight: 600;
      color: #334155;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: 10px;
      color: #64748b;
      font-weight: 500;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .nav-link {
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 600;
      color: #475569;
      transition: all 0.2s;
      position: relative;
      padding: 6px 0;
    }

    .nav-link:hover {
      color: #1e3a8a;
    }

    .nav-actions {
      display: flex;
      align-items: center;
    }

    .btn-portal-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: #ffffff;
      padding: 8px 18px;
      border-radius: 24px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
      transition: all 0.25s;
    }

    .btn-portal-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }

    .btn-portal-action mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .logged-in-btn {
      background: linear-gradient(135deg, #166534 0%, #15803d 100%);
      box-shadow: 0 2px 6px rgba(22, 101, 52, 0.25);
    }

    /* Live Notice Bar */
    .live-notice-strip {
      background: #eff6ff;
      border-bottom: 1px solid #dbeafe;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      position: relative;
      z-index: 90;
    }

    .notice-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #1e3a8a;
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      animation: pulse-green 1.5s infinite;
    }

    @keyframes pulse-green {
      0% { transform: scale(0.9); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.6; }
      100% { transform: scale(0.9); opacity: 1; }
    }

    .marquee-wrapper {
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
    }

    .marquee-track {
      display: inline-block;
      animation: marquee 35s linear infinite;
      color: #1e293b;
      font-weight: 500;
    }

    .marquee-divider {
      margin: 0 16px;
      color: #94a3b8;
    }

    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      padding: 70px 24px 50px 24px;
      z-index: 10;
    }

    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 6px 16px;
      border-radius: 24px;
      font-size: 12px;
      font-weight: 600;
      color: #1e3a8a;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      margin-bottom: 24px;
      animation: fadeInUp 0.6s ease-out;
    }

    .hero-headline {
      font-size: 44px;
      font-weight: 800;
      line-height: 1.18;
      color: #0f172a;
      max-width: 900px;
      margin: 0 auto 20px auto;
      letter-spacing: -0.5px;
      animation: fadeInUp 0.7s ease-out;
    }

    .gradient-text {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #ea580c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subhead {
      font-size: 17px;
      line-height: 1.6;
      color: #475569;
      max-width: 760px;
      margin: 0 auto 36px auto;
      font-weight: 400;
      animation: fadeInUp 0.8s ease-out;
    }

    .hero-cta-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 60px;
      animation: fadeInUp 0.9s ease-out;
    }

    .hero-primary-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: #ffffff;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
      transition: all 0.25s;
    }

    .hero-primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
    }

    .hero-secondary-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ffffff;
      color: #334155;
      border: 1px solid #cbd5e1;
      padding: 14px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      transition: all 0.2s;
    }

    .hero-secondary-btn:hover {
      background: #f8fafc;
      color: #1e3a8a;
      border-color: #94a3b8;
    }

    /* Hero Metrics 4 Cards */
    .hero-metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      animation: fadeInUp 1s ease-out;
    }

    .hero-metric-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 16px;
      padding: 22px 18px;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hero-metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }

    .metric-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .metric-icon-box.bg-blue { background: #eff6ff; color: #1d4ed8; }
    .metric-icon-box.bg-orange { background: #fff7ed; color: #c2410c; }
    .metric-icon-box.bg-emerald { background: #f0fdf4; color: #15803d; }
    .metric-icon-box.bg-indigo { background: #eef2ff; color: #4338ca; }

    .metric-info {
      display: flex;
      flex-direction: column;
    }

    .metric-number {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.15;
    }

    .metric-label {
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      margin-top: 2px;
    }

    .metric-tag {
      font-size: 10.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* Section Layout Utilities */
    .section-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 10;
    }

    .section-header {
      margin-bottom: 44px;
    }

    .text-center {
      text-align: center;
    }

    .section-pill {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }

    .section-subtitle {
      font-size: 15px;
      color: #64748b;
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.5;
    }

    /* Metrics Section KPI Banner */
    .metrics-section {
      padding: 40px 0 60px 0;
    }

    .kpi-banner-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
      padding: 36px 28px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .kpi-banner-item {
      text-align: center;
      flex: 1;
      padding: 0 16px;
    }

    .kpi-big-val {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.1;
      margin-bottom: 8px;
    }

    .text-blue { color: #1d4ed8; }
    .text-emerald { color: #15803d; }
    .text-amber { color: #d97706; }
    .text-indigo { color: #4f46e5; }
    .text-orange { color: #ea580c; }
    .text-red { color: #dc2626; }

    .kpi-big-title {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 6px;
    }

    .kpi-big-desc {
      font-size: 11.5px;
      color: #64748b;
      line-height: 1.4;
    }

    .kpi-banner-divider {
      width: 1px;
      height: 70px;
      background: #e2e8f0;
    }

    /* Departments Section */
    .departments-section {
      padding: 60px 0 80px 0;
      background: #f1f5f9;
      position: relative;
    }

    .departments-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .dept-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dept-card:hover, .dept-card.selected {
      transform: translateY(-6px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
      border-color: #94a3b8;
    }

    .dept-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .dept-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dept-schemes-badge {
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .dept-name {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 16px 0;
      line-height: 1.3;
      min-height: 42px;
    }

    .dept-financial-row {
      display: flex;
      justify-content: space-between;
      background: #f8fafc;
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .fin-col {
      display: flex;
      flex-direction: column;
    }

    .fin-lbl {
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .fin-val {
      font-size: 12.5px;
      font-weight: 700;
      margin-top: 2px;
    }

    .dept-progress-container {
      height: 6px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .dept-progress-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.8s ease-in-out;
    }

    .dept-schemes-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .scheme-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 11.5px;
      color: #475569;
      line-height: 1.35;
    }

    .scheme-dot {
      font-size: 8px;
      width: 8px;
      height: 8px;
      color: #94a3b8;
      margin-top: 4px;
      flex-shrink: 0;
    }

    .dept-card-footer {
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }

    .dept-view-link {
      font-size: 12px;
      font-weight: 600;
      color: #1e3a8a;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* AI Surveillance Section */
    .ai-section {
      padding: 80px 0;
      background: #ffffff;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px 22px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      transition: all 0.3s;
    }

    .feature-card:hover {
      background: #ffffff;
      transform: translateY(-4px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
      border-color: #cbd5e1;
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }

    .bg-red-light { background: #fee2e2; }
    .bg-amber-light { background: #fef3c7; }
    .bg-blue-light { background: #dbeafe; }
    .bg-emerald-light { background: #dcfce7; }

    .feature-card h3 {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 10px 0;
    }

    .feature-card p {
      font-size: 13px;
      color: #475569;
      line-height: 1.55;
      margin: 0 0 18px 0;
      flex: 1;
    }

    .feature-tag {
      font-size: 11px;
      font-weight: 600;
      color: #1e3a8a;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 3px 8px;
      border-radius: 6px;
      width: fit-content;
    }

    /* Citizen Charter Box */
    .charter-section {
      padding: 40px 0 80px 0;
      background: #ffffff;
    }

    .charter-box {
      background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%);
      border-radius: 24px;
      padding: 50px 44px;
      color: #ffffff;
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 40px;
      align-items: center;
      box-shadow: 0 12px 36px rgba(30, 58, 138, 0.25);
    }

    .charter-content h2 {
      font-size: 30px;
      font-weight: 800;
      margin: 12px 0 14px 0;
      letter-spacing: -0.5px;
    }

    .charter-content p {
      font-size: 14.5px;
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }

    .charter-stats {
      display: flex;
      gap: 24px;
    }

    .stat-bubble {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 12px 18px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
    }

    .stat-bubble strong {
      font-size: 20px;
      font-weight: 800;
      color: #38bdf8;
    }

    .stat-bubble span {
      font-size: 11px;
      color: #e2e8f0;
      margin-top: 2px;
    }

    .charter-visual {
      display: flex;
      justify-content: center;
    }

    .security-seal-card {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 32px 24px;
      text-align: center;
      width: 100%;
      max-width: 320px;
    }

    .large-shield {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #4ade80;
      margin-bottom: 12px;
    }

    .seal-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .seal-subtitle {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 16px;
    }

    .seal-check {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(74, 222, 128, 0.15);
      border: 1px solid #4ade80;
      color: #4ade80;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .seal-check mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Footer */
    .portal-footer {
      background: #0f172a;
      color: #94a3b8;
      font-size: 13px;
      position: relative;
    }

    .footer-tricolor {
      height: 4px;
      background: linear-gradient(to right, #ff9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%);
      width: 100%;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 60px 24px 30px 24px;
    }

    .footer-top-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
      gap: 40px;
      margin-bottom: 48px;
    }

    .footer-emblem-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ffffff;
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 14px;
    }

    .footer-about {
      color: #94a3b8;
      line-height: 1.6;
      font-size: 12.5px;
      margin-bottom: 20px;
    }

    .footer-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge-pill {
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .footer-col h4 {
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 16px 0;
    }

    .footer-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-col ul li a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 13px;
      transition: color 0.2s;
    }

    .footer-col ul li a:hover {
      color: #38bdf8;
    }

    .support-text {
      color: #cbd5e1;
      margin: 0 0 4px 0;
      font-size: 12px;
    }

    .toll-free {
      font-size: 22px;
      font-weight: 800;
      color: #4ade80;
      font-family: monospace;
      margin-bottom: 8px;
    }

    .support-hours {
      font-size: 11.5px;
      color: #94a3b8;
      margin: 0 0 4px 0;
    }

    .support-email {
      font-size: 12px;
      color: #38bdf8;
      margin: 0;
    }

    .footer-bottom-row {
      border-top: 1px solid #1e293b;
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 12px;
    }

    .footer-legal-links a {
      color: #94a3b8;
      text-decoration: none;
      margin: 0 4px;
    }

    .footer-legal-links a:hover {
      color: #ffffff;
    }

    .footer-copyright {
      color: #64748b;
    }

    .audit-status {
      color: #4ade80;
      margin-left: 8px;
    }

    /* Keyframe Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-metrics-grid { grid-template-columns: repeat(2, 1fr); }
      .departments-grid { grid-template-columns: repeat(2, 1fr); }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .kpi-banner-card { flex-direction: column; gap: 24px; }
      .kpi-banner-divider { display: none; }
      .charter-box { grid-template-columns: 1fr; text-align: center; }
      .charter-stats { justify-content: center; }
      .footer-top-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .gov-top-right, .nav-links, .ministry-title, .divider { display: none; }
      .hero-headline { font-size: 32px; }
      .hero-metrics-grid { grid-template-columns: 1fr; }
      .departments-grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .footer-top-grid { grid-template-columns: 1fr; }
      .footer-bottom-row { flex-direction: column; text-align: center; }
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  private clockInterval: any;
  isLoggedIn = false;
  selectedDept: DepartmentCard | null = null;

  departments: DepartmentCard[] = [
    {
      id: 'pwd',
      name: 'Public Works Department (PWD)',
      shortName: 'PWD',
      icon: 'construction',
      color: '#2563eb',
      bgLight: '#eff6ff',
      allocatedCr: 885.50,
      spentCr: 512.40,
      schemesCount: 5,
      schemes: [
        'National Highway Corridor Expansion (NH-48)',
        'PM Gram Sadak Yojana Phase-IV (Rural Connectivity)',
        'State High-Density Flyover & Elevated Corridors'
      ]
    },
    {
      id: 'health',
      name: 'Health & Family Welfare Department',
      shortName: 'Health',
      icon: 'local_hospital',
      color: '#dc2626',
      bgLight: '#fee2e2',
      allocatedCr: 720.00,
      spentCr: 435.80,
      schemesCount: 5,
      schemes: [
        'Ayushman Bharat - PMJAY Tertiary Care Implementation',
        'National Health Mission - Primary Health Infrastructure',
        'Critical Care Hospital Blocks & Medical Oxygen Grid'
      ]
    },
    {
      id: 'education',
      name: 'Education Department',
      shortName: 'Education',
      icon: 'school',
      color: '#4f46e5',
      bgLight: '#eef2ff',
      allocatedCr: 650.25,
      spentCr: 390.15,
      schemesCount: 5,
      schemes: [
        'Samagra Shiksha Integrated School Infrastructure',
        'PM SHRI Schools of Excellence Development',
        'PM-POSHAN National Nutritious Meal Program'
      ]
    },
    {
      id: 'water',
      name: 'Water Resources & Sanitation (Jal Shakti)',
      shortName: 'Jal Shakti',
      icon: 'water_drop',
      color: '#0284c7',
      bgLight: '#e0f2fe',
      allocatedCr: 580.40,
      spentCr: 310.20,
      schemesCount: 5,
      schemes: [
        'Jal Jeevan Mission - Har Ghar Nal Se Jal Piped Water',
        'Swachh Bharat Mission (Grameen) Phase-II ODF Plus',
        'River Basin Desiltation & Flood Mitigation Network'
      ]
    },
    {
      id: 'transport',
      name: 'Transport Department',
      shortName: 'Transport',
      icon: 'directions_bus',
      color: '#d97706',
      bgLight: '#fef3c7',
      allocatedCr: 490.80,
      spentCr: 275.60,
      schemesCount: 5,
      schemes: [
        'Electric Bus Induction & Fast-Charging Network',
        'State Road Transport Fleet Modernization',
        'Intelligent Highway Traffic Command & Safety Patrol'
      ]
    },
    {
      id: 'rural',
      name: 'Rural Development & Panchayati Raj',
      shortName: 'Rural Dev',
      icon: 'holiday_village',
      color: '#16a34a',
      bgLight: '#f0fdf4',
      allocatedCr: 640.10,
      spentCr: 410.30,
      schemesCount: 5,
      schemes: [
        'Mahatma Gandhi National Rural Employment (MGNREGA)',
        'Pradhan Mantri Awaas Yojana - Gramin Housing',
        'Deendayal Antyodaya Yojana - Rural Livelihoods Mission'
      ]
    },
    {
      id: 'urban',
      name: 'Urban Development & Housing',
      shortName: 'Urban Dev',
      icon: 'apartment',
      color: '#7c3aed',
      bgLight: '#f5f3ff',
      allocatedCr: 540.75,
      spentCr: 295.40,
      schemesCount: 5,
      schemes: [
        'Atal Mission for Rejuvenation (AMRUT 2.0)',
        'Smart Cities Mission Integrated Command Centers',
        'Pradhan Mantri Awas Yojana - Urban Affordable Housing'
      ]
    },
    {
      id: 'agriculture',
      name: 'Agriculture & Farmers Welfare',
      shortName: 'Agriculture',
      icon: 'agriculture',
      color: '#059669',
      bgLight: '#ecfdf5',
      allocatedCr: 520.00,
      spentCr: 263.90,
      schemesCount: 5,
      schemes: [
        'PM-KISAN Direct Benefit Income Support Scheme',
        'Pradhan Mantri Fasal Bima Yojana (Crop Insurance)',
        'Micro-Irrigation Program - Per Drop More Crop'
      ]
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.selectedDept = this.departments[0];

    this.clockInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  setFontScale(size: 'standard' | 'large') {
    document.documentElement.style.fontSize = size === 'large' ? '18px' : '16px';
  }
}
