# AI-Based Budget Utilization Monitoring System

A comprehensive full-stack web application for monitoring government department budget allocations, tracking expenditures, detecting anomalies through rule-based analysis, and generating financial reports. Built with a clean, modern light-themed UI inspired by contemporary fintech design.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [UI/UX Design](#uiux-design)
4. [Features](#features)
5. [System Architecture](#system-architecture)
6. [Prerequisites](#prerequisites)
7. [Installation](#installation)
8. [Configuration](#configuration)
9. [Database Seeding](#database-seeding)
10. [Running the Application](#running-the-application)
11. [Demo Credentials](#demo-credentials)
12. [User Roles & Permissions](#user-roles--permissions)
13. [API Endpoints](#api-endpoints)
14. [Project Structure](#project-structure)
15. [Data Models](#data-models)
16. [Monitoring & Anomaly Detection](#monitoring--anomaly-detection)
17. [Reports](#reports)
18. [Testing](#testing)
19. [Seed Data Overview](#seed-data-overview)
20. [Environment Variables](#environment-variables)
21. [Troubleshooting](#troubleshooting)

---

## Project Overview

This system allows government organizations to:
- **Track Budgets**: Create and manage budget allocations across departments and financial years.
- **Record Expenditures**: Log and categorize all spending against specific budgets.
- **Monitor Utilization**: Real-time dashboards with charts showing budget vs. actual spending.
- **Detect Anomalies**: Rule-based detection of overspending, under-utilization, and spending spikes.
- **Generate Alerts**: Automated alerts with severity levels when thresholds are breached.
- **Generate Reports**: Budget utilization, expenditure, and alert reports in JSON, CSV, and PDF formats.
- **Audit Trail**: Complete audit logging of all system actions.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 17, TypeScript, Angular Material, ng2-charts (Chart.js) |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Testing** | Jest |
| **UI Font** | Inter (Google Fonts) |

## UI/UX Design

The application follows a **light & bright modern fintech design system** with a clean, professional appearance.

### Design System

| Element | Value |
|---------|-------|
| **Primary Color** | Indigo `#4f46e5` |
| **Primary Light** | `#6366f1` |
| **Primary Dark** | `#4338ca` |
| **Background** | Slate-50 `#f8fafc` |
| **Surface/Cards** | White `#ffffff` |
| **Text Primary** | Slate-900 `#0f172a` |
| **Text Secondary** | Slate-500 `#64748b` |
| **Border** | Slate-200 `#e2e8f0` |
| **Success** | Emerald `#10b981` |
| **Danger** | Red `#ef4444` |
| **Warning** | Amber `#f59e0b` |
| **Font Family** | Inter, Plus Jakarta Sans, system fonts |
| **Card Radius** | 16px (general), 24px (login) |

### Design Highlights

- **Login Page**: Light gradient background with ambient pastel orbs (indigo, sky, violet blurs), centered white card with soft shadow, custom SVG icons, indigo gradient submit button
- **Layout**: White sidebar (260px) with indigo-highlighted active links, white top header bar with subtle bottom border
- **Dashboard**: KPI cards with clean borders, Chart.js visualizations with the indigo color palette
- **Tables**: Clean borders, rounded corners, hover states
- **Forms**: Rounded input fields with indigo focus rings
- **Buttons**: Rounded (12px radius) with indigo gradient primary actions

> The design uses CSS custom properties (`--color-primary`, `--color-bg`, etc.) defined in `styles.css` for easy theming.

## Features

### Dashboard
- KPI cards (Total Budget, Spent, Remaining, Utilization %)
- Budget vs. Expenditure bar chart
- Department-wise utilization chart
- Spending trend line chart
- Alert distribution pie chart
- Recent transactions and alerts tables

### Budget Management
- Create, edit, and delete budget allocations
- Filter by financial year, department, and status
- Visual utilization indicators with color coding

### Expenditure Tracking
- Record expenditures against budgets
- 10 expense categories (salaries, infrastructure, equipment, etc.)
- Search, filter, and pagination

### Monitoring & Analytics
- Rule-based anomaly detection engine
- Department performance comparison
- Manual monitoring trigger
- Spending trend analysis

### Alerts
- Automatic alert generation (Overspending, Under-utilization, Spending Spikes, Threshold Breaches)
- 4 severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- Status workflow (OPEN → REVIEWED → RESOLVED)
- No duplicate unresolved alerts

### Reports
- Budget Utilization Report
- Expenditure Report
- Alert Report
- Export to CSV and PDF

### Administration
- User management (CRUD)
- Department management
- Threshold rule configuration
- Audit log viewer

## System Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Angular 17     │────▶│   Express.js     │────▶│    MongoDB       │
│   Frontend       │◀────│   REST API       │◀────│    Database      │
│   Port: 4200     │     │   Port: 3000     │     │   Port: 27017    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

- **Frontend → Backend**: Angular proxy (`proxy.conf.json`) forwards `/api/*` requests to Express
- **Backend → Database**: Mongoose ODM with connection retry logic
- **Authentication**: JWT tokens issued on login, verified via middleware on protected routes

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** >= 6.x (running on localhost:27017)
- **Angular CLI** (installed via npx)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Al-Based Budget Utilization"
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/budget-monitor
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

A `.env` file with defaults is already provided.

## Database Seeding

Seed the database with realistic demo data:

```bash
cd backend
npm run seed
```

This creates:
- 6 departments (Indian government structure)
- 8 users (1 admin, 2 finance officers, 5 department heads)
- 12 budgets across 2 financial years (FY 2025-26 and FY 2024-25)
- 60+ expenditure records with realistic amounts
- 6 threshold rules (overspending, under-utilization, spending spikes)
- 5 alerts with varying severities and statuses
- 5 audit log entries

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs at `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npx ng serve
```
Frontend runs at `http://localhost:4200`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npx ng build --configuration production
```
Output is generated in `frontend/dist/frontend/browser/`

## Demo Credentials

All accounts use the password: **`Password123!`**

| Role | Email | Department |
|------|-------|------------|
| **Admin** | admin@budgetmonitor.gov.in | All |
| **Finance Officer** | finance1@budgetmonitor.gov.in | All |
| **Finance Officer** | finance2@budgetmonitor.gov.in | All |
| **Department Head** | head.publicworks@budgetmonitor.gov.in | Public Works |
| **Department Head** | head.education@budgetmonitor.gov.in | Education |
| **Department Head** | head.health@budgetmonitor.gov.in | Health |
| **Department Head** | head.transport@budgetmonitor.gov.in | Transport |
| **Department Head** | head.water@budgetmonitor.gov.in | Water & Sanitation |

## User Roles & Permissions

### Admin
- Full access to all features
- User management (create, edit, activate/deactivate)
- Department management
- Threshold rule configuration
- Audit log access
- All budget and expenditure operations
- Report generation

### Finance Officer
- Create, edit, and delete budgets
- Record and manage expenditures
- View monitoring dashboard
- Review and resolve alerts
- Generate reports

### Department Head
- View budgets for their department only
- Record expenditures for their department
- View monitoring data for their department
- View alerts for their department
- Generate reports for their department

> **Note:** Role restrictions are enforced on the Express backend. Angular route guards and UI hiding are supplementary.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user profile |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | List budgets (paginated) |
| GET | `/api/budgets/dashboard-stats` | Dashboard statistics |
| POST | `/api/budgets` | Create budget |
| GET | `/api/budgets/:id` | Get budget by ID |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

### Expenditures
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenditures` | List expenditures (paginated) |
| GET | `/api/expenditures/recent` | Recent transactions |
| POST | `/api/expenditures` | Record expenditure |
| GET | `/api/expenditures/:id` | Get expenditure |
| PUT | `/api/expenditures/:id` | Update expenditure |
| DELETE | `/api/expenditures/:id` | Delete expenditure |

### Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/monitoring/overview` | Monitoring overview |
| POST | `/api/monitoring/run` | Trigger monitoring scan |
| GET | `/api/monitoring/department/:id` | Department monitoring |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | List alerts (paginated) |
| GET | `/api/alerts/stats` | Alert statistics |
| GET | `/api/alerts/recent` | Recent alerts |
| GET | `/api/alerts/:id` | Get alert |
| PATCH | `/api/alerts/:id/status` | Update alert status |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/budget-utilization` | Budget report (JSON/CSV/PDF) |
| GET | `/api/reports/expenditures` | Expenditure report |
| GET | `/api/reports/alerts` | Alert report |

### Administration
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| PATCH | `/api/users/:id/status` | Activate/deactivate user |
| GET | `/api/departments` | List departments |
| POST | `/api/departments` | Create department |
| PUT | `/api/departments/:id` | Update department |
| GET | `/api/admin/rules` | List threshold rules |
| POST | `/api/admin/rules` | Create rule |
| PUT | `/api/admin/rules/:id` | Update rule |
| GET | `/api/audit-logs` | View audit logs |

## Project Structure

```
Al-Based Budget Utilization/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment config
│   │   ├── controllers/     # Route handlers (10 files)
│   │   ├── middleware/       # Auth, authorization, validation, error handling
│   │   ├── models/           # Mongoose schemas (7 models + index)
│   │   ├── routes/           # Express route definitions (11 files)
│   │   ├── seed/             # Database seeding script with realistic data
│   │   ├── services/         # Business logic layer (9 services)
│   │   ├── tests/            # Jest unit tests (28 tests)
│   │   ├── types/            # TypeScript type declarations
│   │   ├── utils/            # API response helpers, calculations
│   │   └── validators/       # Express-validator validation chains
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/        # Admin panel (users, departments, rules)
│   │   │   ├── alerts/       # Alert list with status management
│   │   │   ├── audit/        # Audit log viewer with filters
│   │   │   ├── auth/         # Login (custom light design) & unauthorized
│   │   │   ├── budgets/      # Budget list, form, detail components
│   │   │   ├── core/         # Layout (white sidebar + header)
│   │   │   ├── dashboard/    # Dashboard with KPI cards & charts
│   │   │   ├── expenditures/ # Expenditure list & form
│   │   │   ├── guards/       # Auth & role route guards
│   │   │   ├── interceptors/ # HTTP auth interceptor (JWT)
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   ├── monitoring/   # Monitoring & analytics
│   │   │   ├── reports/      # Reports with CSV/PDF export
│   │   │   └── services/     # Angular HTTP services (11 services)
│   │   └── styles.css        # Global styles with design system variables
│   ├── angular.json
│   ├── proxy.conf.json       # API proxy config (→ localhost:3000)
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Data Models

### User
- name, email, passwordHash, role, departmentId, status

### Department
- name, description, headUserId, status

### Budget
- financialYear, departmentId, projectName, allocatedAmount, totalSpent, allocationDate, startDate, endDate, status, createdBy
- Virtual fields: remainingBudget, utilizationPercentage

### Expenditure
- budgetId, departmentId, amountSpent, expenseCategory, date, description, supportingDocumentReference, recordedBy

### Alert
- budgetId, departmentId, alertType, severity, message, triggeredValue, thresholdValue, status, reviewedBy, reviewedAt

### ThresholdRule
- ruleType, value, secondaryValue, enabled, description, createdBy

### AuditLog
- userId, action, entityType, entityId, previousValue, newValue, ipAddress

## Monitoring & Anomaly Detection

The system uses **rule-based anomaly detection** (not machine learning) to identify budget issues:

1. **Overspending Detection**: Flags budgets where `totalSpent > allocatedAmount`. Severity is CRITICAL for >20% overspend, HIGH for 10-20%.

2. **Under-utilization Detection**: Identifies budgets with low utilization relative to elapsed time period. E.g., only 30% utilized when 60% of the period has passed.

3. **Spending Spike Detection**: Uses statistical analysis (mean + standard deviation) to detect unusual weekly spending patterns. A spike is flagged when current spending exceeds `mean + (multiplier × stdDev)`.

4. **Threshold Breach Detection**: Configurable rules that trigger alerts when utilization crosses admin-defined thresholds.

> **Important**: This system uses rule-based heuristics, not machine learning. The rules are transparent, configurable, and deterministic.

## Reports

Reports are available in three formats:
- **JSON**: Default format for in-app viewing
- **CSV**: Downloadable spreadsheet format
- **PDF**: Downloadable PDF documents

Add `?format=csv` or `?format=pdf` to any report endpoint.

## Testing

```bash
cd backend
npm test
```

**28 tests covering:**
- Financial calculations (total spent, remaining budget, utilization %)
- Budget period elapsed calculation
- Spending baseline (mean & standard deviation)
- Spending spike detection
- Under-utilization detection logic
- Overspending severity classification

## Seed Data Overview

### Departments
Public Works, Education, Health, Transport, Water & Sanitation, Rural Development

### Financial Years
- **2025-26**: 9 active budgets across all departments
- **2024-25**: 3 closed budgets (historical data)

### Budget Scenarios
- Normal utilization (40-50%)
- Near-limit utilization (65%)
- Over-budget (107% - Health Department, Primary Healthcare Centers)
- Under-utilized (15% - Teacher Training Initiative)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Backend server port |
| `MONGODB_URI` | mongodb://localhost:27017/budget-monitor | MongoDB connection string |
| `JWT_SECRET` | your_jwt_secret | JWT signing secret |
| `JWT_EXPIRES_IN` | 1d | JWT token expiry |
| `NODE_ENV` | development | Environment mode |

## Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running on port 27017:
```bash
mongosh
```

### Backend TypeScript Errors
Check types:
```bash
cd backend
npx tsc --noEmit
```

### Frontend Build Issues
```bash
cd frontend
npx ng build
```

### Port Already in Use
Kill the process on the port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Login Issues
If login fails, verify the backend is running and the seed data is loaded:
```bash
cd backend
npm run seed   # Re-seed the database
npm run dev    # Restart backend
```
Then hard-refresh the browser (`Ctrl+Shift+R`) and try again with `admin@budgetmonitor.gov.in` / `Password123!`

---

**Developed as an internship project demonstrating full-stack MEAN application development with financial monitoring capabilities and modern UI design.**
