# Deployment Guide — PFM-BUMS (Vercel + Render)

This guide walks you through deploying the **Public Financial Management & Budget Utilization Monitoring System (PFM-BUMS)**:
- **Frontend (Angular 17)**: Deployed to **Vercel** (Global Edge CDN, High Performance)
- **Backend (Node/Express/TypeScript)**: Deployed to **Render** (Free Web Service)
- **Database**: **MongoDB Atlas** (Free M0 Cloud Cluster)

---

## Architecture Overview

```
 [Browser] 
     │
     ├──► https://your-app.vercel.app (Vercel: Angular 17 SPA)
     │         │
     │         ▼ (API requests: /api/*)
     └──► https://your-backend.onrender.com (Render: Express / Node.js)
               │
               ▼ (Mongoose Connection)
          MongoDB Atlas (Cloud Cluster with 144 Budgets, 671 Expenditures)
```

---

## Prerequisites

1. A **GitHub** account with this repository pushed to your GitHub.
2. A free **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)** account.
3. A free **[Render](https://render.com/)** account.
4. A free **[Vercel](https://vercel.com/)** account.

---

## Step 1: Set Up Free MongoDB Atlas Database

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a new cluster:
   - Select **M0 Free Tier** (Shared).
   - Choose any provider/region closest to you (e.g., AWS / N. Virginia or Frankfurt).
3. **Database Access** (Create User):
   - Go to **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Username: `admin` (or your choice).
   - Password: Click *Autogenerate Secure Password* or choose a strong password (save this password!).
   - Role: **Atlas Admin** or **Read and write to any database**.
4. **Network Access** (Allow Connections from Render):
   - Go to **Security** → **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Confirm**.
5. **Get Connection String**:
   - Go to **Clusters** → Click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string. It will look like:
     ```
     mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/budget_db?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with your actual database user password.
   - Note down this connection URI.

---

## Step 2: Deploy Backend to Render

### Option A: Using Render Blueprints (Recommended — 1-Click)

The repository includes a ready-to-use [`render.yaml`](./render.yaml).

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` and configure:
   - Service Name: `pfm-bums-backend`
   - Runtime: `Node`
   - Plan: `Free`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Fill in the prompted Environment Variables:
   - `MONGODB_URI`: Paste your MongoDB Atlas connection string from Step 1.
   - `FRONTEND_URL`: Leave blank or put `http://localhost:4200` for now (you will update it after deploying Vercel in Step 4).
   - `AUTO_SEED`: Keep as `true` (automatically populates all 144 budgets, 671 expenditures, 8 departments, 13 users, 8 rules, 20 alerts on first launch!).
6. Click **Apply**. Render will build and deploy your backend.

---

### Option B: Manual Web Service Setup on Render

1. Log into [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Name**: `pfm-bums-backend` (or your custom name)
   - **Region**: Choose closest to your MongoDB Atlas region (e.g., Oregon or Frankfurt)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and click **Add Environment Variable**:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Production environment flag |
   | `PORT` | `10000` | Port for Express (Render defaults to 10000) |
   | `MONGODB_URI` | `mongodb+srv://admin:...@cluster0...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `generate-a-random-32-char-string` | Secret key for JWT signing |
   | `JWT_EXPIRES_IN` | `7d` | Token lifetime |
   | `AUTO_SEED` | `true` | Auto-seeds database on first launch |
   | `FRONTEND_URL` | `http://localhost:4200` | Update this to your Vercel URL once deployed |
6. Click **Create Web Service**.
7. Once deployed, Render will provide your public backend URL, e.g.:
   ```
   https://pfm-bums-backend.onrender.com
   ```

---

## Step 3: Verify Backend Health & Seeding

1. Open your Render backend URL in a browser:
   ```
   https://pfm-bums-backend.onrender.com/
   ```
   You should see:
   ```json
   {
     "name": "PFM-BUMS Government Portal Backend API",
     "status": "online",
     "version": "1.0.0",
     "healthCheck": "/api/health"
   }
   ```
2. Check `/api/health`:
   ```
   https://pfm-bums-backend.onrender.com/api/health
   ```
   Response:
   ```json
   { "status": "ok" }
   ```
3. Check Render deployment logs to confirm that `AUTO_SEED` ran successfully:
   ```
   🌱 AUTO_SEED is enabled and database is empty. Seeding initial data...
   Departments : 8
   Users       : 13
   Budgets     : 144
   Expenditures: 671
   Alerts      : 20
   Rules       : 8
   Audit Logs  : 60
   ✅ Initial database seed completed successfully.
   ```

---

## Step 4: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** screen:
   - **Project Name**: `pfm-bums` (or your choice)
   - **Framework Preset**: Select **Angular** (or Other)
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build and Output Settings**:
     - Build Command: `npm run build`
     - Output Directory: `dist/frontend/browser`
     - Install Command: `npm install`
5. Configure the Backend URL (Choose either method):

   - **Method 1 (Direct via environment.prod.ts)**:
     Before deploying, open [`frontend/src/environments/environment.prod.ts`](./frontend/src/environments/environment.prod.ts) and set:
     ```typescript
     export const environment = {
       production: true,
       apiUrl: 'https://pfm-bums-backend.onrender.com' // Your Render URL
     };
     ```
     Commit and push.

   - **Method 2 (Using Vercel Rewrites — Zero CORS)**:
     Open [`frontend/vercel.json`](./frontend/vercel.json) and set the proxy rewrite to your Render backend:
     ```json
     {
       "$schema": "https://openapi.vercel.sh/vercel.json",
       "cleanUrls": true,
       "rewrites": [
         {
           "source": "/api/:path*",
           "destination": "https://pfm-bums-backend.onrender.com/api/:path*"
         },
         {
           "source": "/(.*)",
           "destination": "/index.html"
         }
       ]
     }
     ```
     Commit and push.

6. Click **Deploy**.
7. Vercel will build the Angular application and provide a live URL, e.g.:
   ```
   https://pfm-bums.vercel.app
   ```

---

## Step 5: Update Backend `FRONTEND_URL` on Render

1. Go back to your [Render Dashboard](https://dashboard.render.com/).
2. Select your `pfm-bums-backend` service.
3. Go to **Environment** tab.
4. Update `FRONTEND_URL` to your live Vercel URL:
   ```
   https://pfm-bums.vercel.app
   ```
5. Click **Save Changes**. Render will automatically redeploy with the updated CORS configuration.

---

## Step 6: Test the Live Application

1. Open your Vercel URL in your browser:
   ```
   https://pfm-bums.vercel.app
   ```
2. You will see the **National Public Landing Page** (`/`):
   - Ashoka Chakra emblem animation
   - Live directive ticker marquee
   - Hero metrics (₹5,032+ Cr allocated, ₹2,893+ Cr disbursals, 57.5% velocity)
   - 8 Central ministerial portfolios
3. Click **Officer Login** to visit `/login`.
4. Use the **Demo Credentials Side Panel** on the login page:
   - Click **Use This** on any account (e.g. **System Admin** `admin1@gov.in` or **Finance Controller** `finance1@gov.in`).
   - The form will auto-fill with the email and `Password123!`.
   - Click **Sign In to Dashboard**.
5. You will enter the live dashboard with real-time financial tracking, charts, budget lists, expenditure logs, alerts, reports, and audit trails!

---

## Summary of Demo Credentials

| Role | Email | Password | Department Scope |
|------|-------|----------|------------------|
| **System Admin** | `admin1@gov.in` | `Password123!` | All Ministries & Rule Admin |
| **Finance Controller** | `finance1@gov.in` | `Password123!` | Ministry of Finance (Central Approvals) |
| **PWD Head** | `head.public@gov.in` | `Password123!` | Public Works Department (PWD) |
| **Health Head** | `head.health@gov.in` | `Password123!` | Health & Family Welfare |
| **Education Head** | `head.education@gov.in` | `Password123!` | Education Department |
| **Agriculture Head** | `head.agriculture@gov.in` | `Password123!` | Agriculture & Farmers Welfare |

---

## Troubleshooting & FAQ

### 1. Render Free Tier Cold Starts
- Render free-tier services "spin down" after 15 minutes of inactivity.
- When making the first request after spin-down, the backend may take 30–50 seconds to respond. Subsequent requests are instant.
- To prevent cold starts, you can set up a free uptime monitor (like [UptimeRobot](https://uptimerobot.com/) or [Cron-Job.org](https://cron-job.org/)) to ping `https://pfm-bums-backend.onrender.com/api/health` every 10 minutes.

### 2. Manual Database Re-Seeding
If you ever want to re-seed or reset your database on Render:
1. In Render, go to your service.
2. In the Environment tab, change `AUTO_SEED` to `false` when running normally.
3. If you want to wipe and re-seed, you can connect MongoDB Compass to your Atlas cluster, delete the `budget_db` database, and restart the Render service with `AUTO_SEED=true`.
4. Alternatively, you can run the seed script locally pointing to your Atlas database:
   ```bash
   cd backend
   MONGODB_URI="mongodb+srv://admin:pass@cluster..." npm run seed
   ```

### 3. SPA Route Refreshing on Vercel
- The provided `frontend/vercel.json` and root `vercel.json` already contain the SPA rewrite rule (`/(.*) -> /index.html`), ensuring refreshing routes like `/dashboard`, `/budgets`, `/monitoring` never returns a 404 error.
