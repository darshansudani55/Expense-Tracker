# SpendWise — Personal Expense Tracker

SpendWise is a full-stack personal finance and expense tracking web application built with **React**, **Vite**, **Node.js**, **Express**, and **MongoDB**. It provides real-time income and expense logging, automated financial analytics, category distributions, monthly comparisons, and historical spending trends.

---

## 1. Project Overview

SpendWise helps individuals take control of their finances with a clean, responsive SaaS dashboard. Users can record incomes and expenses, organize transactions into appropriate categories, filter and search through records, and inspect monthly financial performance with dynamic visualizations.

> **Important Note:** This standard portfolio edition is a **single-user demonstration** without multi-user authentication. It does not provide isolated private accounts or store real banking credentials. All recorded data is for personal tracking and portfolio demonstration purposes.

---

## 2. Features

- **Summary Dashboard**:
  - **Total Income**: Sum of all income transactions for the selected month.
  - **Total Expenses**: Sum of all expenses for the selected month.
  - **Net Balance**: Selected month income minus expenses (indicates positive cash flow or deficit).
  - **Savings Rate**: `((Income - Expenses) / Income) * 100`. Gracefully handles zero-income months (`—`) and negative rates when expenses exceed earnings.
  - **All-Time Cumulative Summary**: Track long-term financial health.
- **Dynamic Charts (Recharts)**:
  - **Income vs. Expenses**: Monthly comparative bar chart for the last 6 months.
  - **Spending by Category**: Donut pie chart detailing expense percentages.
  - **Spending Trend**: 6-month line trajectory showing expense movements over time.
- **Transaction Management**:
  - Add new Income and Expense records with real-time validation.
  - Edit existing transactions with pre-populated form fields.
  - Delete transactions with an accessible confirmation dialog.
- **Server-Side Filters & Search**:
  - Full-text keyword search by description.
  - Filter by transaction type (`Income` or `Expense`).
  - Filter by category (`Salary`, `Food`, `Housing`, etc.).
  - Quick month filtering and custom start/end date range filters.
  - Multi-criteria sorting (`Newest First`, `Oldest First`, `Amount: High to Low`, `Amount: Low to High`).
  - Server-side pagination with custom page limits.
- **Currency & Localization**:
  - Formatted in **Indian Rupees (`₹`, INR)** using `Intl.NumberFormat('en-IN')`.
  - Easy one-line configuration to switch to USD (`$`), EUR (`€`), GBP (`£`), etc.
- **First-Run Experience**:
  - Polished empty states with helpful instructions and CTAs.
  - Optional development database seed script with sample transactions.

---

## 3. UI/UX & Screenshots

### Dashboard Overview
The dashboard features an indigo/blue primary aesthetic, high-contrast typography (Inter), neutral slate borders, responsive stat cards, 3 Recharts visualizations, and a recent transactions table.

```
+-----------------------------------------------------------------------------------+
|  [SpendWise Logo]   Financial Dashboard             [Month: March 2026] [+ New]   |
+-----------------------------------------------------------------------------------+
|  [ Total Income ]    [ Total Expenses ]    [ Net Balance ]    [ Savings Rate ]    |
|     ₹1,00,000.00         ₹45,000.00          +₹55,000.00            55.0%         |
+-----------------------------------------------------------------------------------+
|  [ Income vs Expenses Bar Chart ]      |  [ Expense Category Donut Chart ]        |
+-----------------------------------------------------------------------------------+
|  [ Monthly Expense Trend Line Chart ]                                             |
+-----------------------------------------------------------------------------------+
|  [ Recent Transactions Table with Edit / Delete actions ]                         |
+-----------------------------------------------------------------------------------+
```

---

## 4. Technology Stack

### Frontend
- **React 18** (Functional components, hooks)
- **Vite** (Next-generation lightning-fast build tool)
- **React Router v6** (Client-side routing)
- **Recharts** (Declarative charts: Bar, Donut, Line)
- **Lucide React** (Clean, consistent iconography)
- **Vanilla CSS3** (Modular design system with CSS custom properties, responsive grid & flexbox)

### Backend
- **Node.js** & **Express.js** (REST API)
- **Mongoose 8** (MongoDB object modeling & schema validation)
- **Helmet** (Security headers)
- **CORS** (Configurable Cross-Origin Resource Sharing)
- **express-rate-limit** (Protection against API spam)
- **dotenv** (Environment variable management)

### Database
- **MongoDB Atlas** (Cloud MongoDB database)

### Testing
- **Jest** & **Supertest**
- **mongodb-memory-server** (In-memory isolated MongoDB test server)

### Deployment Targets
- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)

---

## 5. Architecture Overview

SpendWise follows a decoupled client-server architecture:
```
[ Browser / Mobile ] 
        │ (HTTPS / JSON)
        ▼
[ Vercel CDN (React Single Page App) ]
        │ (REST API Fetch / JSON)
        ▼
[ Render Web Service (Express API) ]
   ├── Helmet & Rate Limiter
   ├── CORS Middleware
   ├── Transaction & Dashboard Controllers
   └── Centralized Error & 404 Handlers
        │
        ▼
[ MongoDB Atlas Cluster (Persistent Database) ]
```

---

## 6. Project Structure

```
spendwise/
├── .gitignore
├── README.md
├── backend/
│   ├── config/
│   │   └── database.js               # Mongoose connection & lifecycle handlers
│   ├── controllers/
│   │   ├── dashboardController.js    # Aggregations for summary, charts, trends
│   │   └── transactionController.js  # CRUD, filtering, sorting, pagination
│   ├── middleware/
│   │   ├── errorHandler.js           # Centralized JSON error middleware
│   │   └── notFound.js               # 404 route handler
│   ├── models/
│   │   └── Transaction.js            # Mongoose schema with validations & indexes
│   ├── routes/
│   │   ├── dashboardRoutes.js        # /api/dashboard routes
│   │   └── transactionRoutes.js      # /api/transactions routes
│   ├── seeds/
│   │   └── seed.js                   # Development database sample data seeder
│   ├── tests/
│   │   ├── dashboard.test.js         # Math, aggregations & chart test suites
│   │   └── transactions.test.js      # Validation, CRUD & query test suites
│   ├── utils/
│   │   └── validators.js             # Schema and query parameter validators
│   ├── .env.example
│   ├── .gitignore
│   ├── app.js                        # Express app configuration
│   ├── package.json
│   └── server.js                     # Server listener with database connect
└── frontend/
    ├── public/
    │   └── favicon.svg               # SVG brand icon
    ├── src/
    │   ├── api/
    │   │   ├── apiClient.js          # Fetch wrapper with timeouts & error parser
    │   │   ├── dashboard.js          # Dashboard API functions
    │   │   └── transactions.js       # Transaction API functions
    │   ├── components/
    │   │   ├── CategoryPieChart.jsx  # Recharts donut chart
    │   │   ├── ConfirmDialog.jsx     # Delete confirmation modal
    │   │   ├── EmptyState.jsx        # No-data illustration
    │   │   ├── ErrorMessage.jsx      # Error alert banner
    │   │   ├── IncomeExpenseChart.jsx# Recharts bar chart
    │   │   ├── Loading.jsx           # Loading spinner
    │   │   ├── Sidebar.jsx           # Navigation drawer & sidebar
    │   │   ├── SpendingTrendChart.jsx# Recharts line chart
    │   │   ├── StatCard.jsx          # Metric cards
    │   │   ├── Toast.jsx             # Toast notification alerts
    │   │   ├── Topbar.jsx            # Top navigation & month selector
    │   │   ├── TransactionCard.jsx   # Mobile transaction card
    │   │   ├── TransactionFilters.jsx# Search & multi-filter toolbar
    │   │   ├── TransactionForm.jsx   # Add/Edit form with validation
    │   │   └── TransactionTable.jsx  # Desktop transaction table
    │   ├── hooks/
    │   │   ├── useDashboard.js       # Dashboard data fetching hook
    │   │   └── useTransactions.js    # Transaction query & pagination hook
    │   ├── pages/
    │   │   ├── AddTransaction.jsx    # Create transaction page
    │   │   ├── Dashboard.jsx         # Main financial dashboard
    │   │   ├── EditTransaction.jsx   # Edit transaction page
    │   │   ├── NotFound.jsx          # 404 page
    │   │   └── Transactions.jsx      # Full transaction history page
    │   ├── styles/
    │   │   ├── components.css        # Buttons, cards, tables, forms, badges
    │   │   ├── layout.css            # Shell, sidebar, topbar, wrapper
    │   │   ├── responsive.css        # Mobile and tablet layouts
    │   │   └── variables.css         # CSS tokens & theme variables
    │   ├── utils/
    │   │   ├── categories.js         # Categories & visual color mappings
    │   │   ├── currency.js           # Intl.NumberFormat INR currency utility
    │   │   └── dates.js              # Date formatters & month helpers
    │   ├── App.jsx                   # Application router & main shell
    │   ├── index.css                 # Global styles & resets
    │   └── main.jsx                  # React DOM root entry
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vercel.json                   # Vercel SPA client rewrite configuration
    └── vite.config.js
```

---

## 7. Prerequisites

Before running the application locally, ensure you have:
- **Node.js**: Version 18.x or 20.x installed ([Download Node.js](https://nodejs.org/)).
- **npm**: Version 9.x or higher (included with Node.js).
- **Git**: Installed on your operating system.
- **MongoDB Atlas Account**: Free cloud database account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)).

---

## 8. MongoDB Atlas Configuration (Step-by-Step)

Follow these steps to set up your free MongoDB Atlas database:

1. **Sign Up / Log In**:
   Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account.
2. **Create a Free Cluster**:
   - Choose the **M0 Free** shared cluster tier.
   - Select your preferred cloud provider and closest region (e.g., AWS / Mumbai, Frankfurt, or N. Virginia).
   - Click **Create Deployment**.
3. **Set Up Security & User**:
   - Navigate to **Security** -> **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Username: `spendwise_user`.
   - Password: Choose a strong password (e.g., `SecurePass123!`). *Note: If your password includes special symbols like `@`, `#`, or `%`, URL-encode them.*
   - Database User Privileges: Select **Read and write to any database**.
   - Click **Add User**.
4. **Configure IP Network Access**:
   - Navigate to **Security** -> **Network Access**.
   - Click **Add IP Address**.
   - For local development and Render deployment, select **Allow Access from Anywhere** (`0.0.0.0/0`) or enter your current public IP address.
   - Click **Confirm**.
5. **Obtain Connection String**:
   - Navigate to **Deployment** -> **Database**.
   - Click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string format:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<username>` and `<password>` with your credentials, and specify the database name `spendwise` before the query parameter:
     ```
     mongodb+srv://spendwise_user:SecurePass123!@cluster0.xxxxx.mongodb.net/spendwise?retryWrites=true&w=majority
     ```
6. **Save to Environment**:
   - Add this connection string into `backend/.env` under `MONGODB_URI`.

---

## 9. Local Installation & Setup

### Step 1: Clone or Navigate to the Workspace
Open PowerShell or Command Prompt on Windows:
```powershell
cd "d:\EXPENSE TRACKER"
```

### Step 2: Configure Environment Variables

**Backend:**
Copy `backend/.env.example` to `backend/.env`:
```powershell
copy backend\.env.example backend\.env
```
Open `backend\.env` and set your MongoDB Atlas connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://spendwise_user:YourPassword@cluster0.xxxxx.mongodb.net/spendwise?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend:**
Copy `frontend/.env.example` to `frontend/.env`:
```powershell
copy frontend\.env.example frontend\.env
```
Ensure `frontend\.env` contains:
```env
VITE_API_URL=http://localhost:5000
```

---

### Step 3: Install Dependencies

**Backend:**
```powershell
cd backend
npm install
cd ..
```

**Frontend:**
```powershell
cd frontend
npm install
cd ..
```

---

### Step 4 (Optional): Seed Sample Transactions
If you would like to test the charts and dashboard with realistic transactions right away, run the dev seed script:
```powershell
cd backend
npm run seed
cd ..
```
*To wipe demo transactions at any time:*
```powershell
cd backend
npm run seed -- --clean
cd ..
```

---

## 10. Running the Application

### Start the Backend API:
In terminal 1:
```powershell
cd "d:\EXPENSE TRACKER\backend"
npm run dev
```
The backend server starts on `http://localhost:5000`. You will see:
```
===============================================
 SpendWise Server Running on Port: 5000
 Mode: development
 Health Check: http://localhost:5000/api/health
===============================================
```

### Start the Frontend Application:
In terminal 2:
```powershell
cd "d:\EXPENSE TRACKER\frontend"
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 11. Running Automated Tests

SpendWise includes an automated test suite using **Jest**, **Supertest**, and an in-memory MongoDB server (`mongodb-memory-server`), ensuring zero impact on your live cloud database:

```powershell
cd "d:\EXPENSE TRACKER\backend"
npm test
```

### Test Coverage (25 Test Suites):
1. Health endpoint (`GET /api/health`).
2. Create valid income transaction (`POST /api/transactions`).
3. Create valid expense transaction.
4. Reject missing descriptions (HTTP 400).
5. Reject zero and negative amounts.
6. Reject invalid transaction types (only Income/Expense allowed).
7. Reject invalid categories for the chosen type.
8. Reject invalid dates.
9. List transactions with pagination metadata (`GET /api/transactions`).
10. Search transactions by keyword in description.
11. Filter records by type (`Income` / `Expense`).
12. Filter records by category.
13. Filter records by custom date ranges (`startDate`, `endDate`).
14. Sort records by amount and date (ascending / descending).
15. Navigate paginated records.
16. Retrieve a single transaction by ID (`GET /api/transactions/:id`).
17. Handle invalid ObjectId format gracefully.
18. Update existing transaction (`PUT /api/transactions/:id`).
19. Delete transaction (`DELETE /api/transactions/:id`).
20. Handle nonexistent transaction IDs (HTTP 404).
21. Calculate monthly and all-time income totals.
22. Calculate monthly and all-time expense totals.
23. Calculate net balance and savings rate (including 0-income and negative rate edge cases).
24. Calculate category spending distribution and percentages.
25. Calculate monthly comparison and trend chart datasets.

### Verifying Frontend Build:
To verify that the frontend compiles cleanly for production:
```powershell
cd "d:\EXPENSE TRACKER\frontend"
npm run build
```
This produces an optimized production bundle inside `frontend/dist`.

---

## 12. REST API Documentation

### Health Check
- **`GET /api/health`**
  - **Response (200 OK)**:
    ```json
    {
      "status": "healthy",
      "message": "SpendWise API is running smoothly",
      "timestamp": "2026-10-12T07:00:00.000Z",
      "environment": "development"
    }
    ```

---

### Transactions Endpoints

- **`GET /api/transactions`**
  - **Query Parameters**:
    - `search` (string): Search keywords in description.
    - `type` (string): `Income` or `Expense`.
    - `category` (string): Category name.
    - `month` (string): `YYYY-MM`.
    - `startDate` (string): `YYYY-MM-DD`.
    - `endDate` (string): `YYYY-MM-DD`.
    - `sortBy` (string): `date` | `amount` | `description` | `createdAt`.
    - `sortOrder` (string): `asc` | `desc`.
    - `page` (number): Page number (default: `1`).
    - `limit` (number): Items per page (default: `10`, max: `100`).
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "670a41d0859c23b3208f9001",
          "type": "Expense",
          "amount": 2500,
          "category": "Food",
          "description": "Weekly grocery run",
          "date": "2026-10-10T00:00:00.000Z",
          "notes": "Paid with UPI",
          "createdAt": "2026-10-10T12:00:00.000Z",
          "updatedAt": "2026-10-10T12:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
      }
    }
    ```

- **`POST /api/transactions`**
  - **Body**:
    ```json
    {
      "type": "Income",
      "amount": 85000,
      "category": "Salary",
      "description": "Monthly Salary",
      "date": "2026-10-01",
      "notes": "Credited to bank"
    }
    ```
  - **Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": { ... }
    }
    ```

- **`GET /api/transactions/:id`**
  - Returns a single transaction by its MongoDB ObjectId.

- **`PUT /api/transactions/:id`**
  - Updates fields of an existing transaction.

- **`DELETE /api/transactions/:id`**
  - Deletes a transaction by ID.

---

### Dashboard Endpoints

- **`GET /api/dashboard/summary?month=YYYY-MM`**
  - Returns summary cards data for selected month and all-time metrics.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "month": "2026-10",
        "selectedMonth": {
          "totalIncome": 100000,
          "totalExpenses": 45000,
          "currentBalance": 55000,
          "savingsRate": 55.0,
          "totalTransactions": 12
        },
        "allTime": {
          "totalIncome": 350000,
          "totalExpenses": 180000,
          "currentBalance": 170000,
          "totalTransactions": 48
        }
      }
    }
    ```

- **`GET /api/dashboard/monthly?months=6&month=YYYY-MM`**
  - Returns monthly income, expenses, and net savings for the past N months.

- **`GET /api/dashboard/categories?month=YYYY-MM`**
  - Returns expense amounts and percentages grouped by category.

- **`GET /api/dashboard/trend?months=6&month=YYYY-MM`**
  - Returns monthly expense trajectory for the past N months.

---

## 13. GitHub Deployment Workflow

To push SpendWise to your GitHub profile:

1. **Initialize Git Repository**:
   ```powershell
   cd "d:\EXPENSE TRACKER"
   git init
   ```
2. **Review Staged Files (Ensure no `.env` credentials are added)**:
   ```powershell
   git status
   ```
3. **Commit the Code**:
   ```powershell
   git add .
   git commit -m "Build SpendWise full-stack personal expense tracker"
   ```
4. **Create a New Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Repository Name: `spendwise`.
   - Set visibility to **Public**.
   - Do NOT initialize with a README (one is already created).
5. **Push to GitHub**:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/spendwise.git
   git push -u origin main
   ```

---

## 14. Cloud Deployment Guide

### Deploying the Backend on Render
1. Go to [render.com](https://render.com) and log in.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `spendwise`.
4. Configure service details:
   - **Name**: `spendwise-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. In **Environment Variables**, add:
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
   - `FRONTEND_URL`: `https://your-spendwise-frontend.vercel.app`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Copy your Render service URL (e.g., `https://spendwise-api.onrender.com`).
8. Verify health endpoint: `https://spendwise-api.onrender.com/api/health`.

---

### Deploying the Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository `spendwise`.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://spendwise-api.onrender.com` *(your actual Render backend URL without trailing slash)*
6. Click **Deploy**.
7. Test the live web application:
   - Verify summary card loading.
   - Record an income and an expense.
   - Test category and trend charts.
   - Verify client route refresh (enabled via `frontend/vercel.json`).

---

## 15. How to Customize Currency

To switch the display currency from Indian Rupees (INR) to another currency:

Open `frontend/src/utils/currency.js` and edit the constants:
```javascript
// Example: Change to US Dollars
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_CURRENCY = 'USD';
```
Or for Euros:
```javascript
export const DEFAULT_LOCALE = 'de-DE';
export const DEFAULT_CURRENCY = 'EUR';
```

All values in MongoDB remain stored as pure floating-point numbers, ensuring zero database migration overhead when changing display currencies.

---

## 16. Troubleshooting & Common Problems

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **`MongoServerSelectionError`** | IP not whitelisted on MongoDB Atlas | Go to Atlas -> Network Access -> Add IP `0.0.0.0/0` (Allow from anywhere). |
| **`Authentication Failed`** | Wrong DB username/password or unencoded special characters | Verify user in Database Access. If password contains `#` or `@`, URL-encode it (e.g. `@` -> `%40`). |
| **`Network Error: Unable to connect`** | Backend server not running or CORS mismatch | Ensure backend is running on `http://localhost:5000` and check `VITE_API_URL` in `frontend/.env`. |
| **`Port 5000 already in use`** | Another process is occupying port 5000 | Change `PORT=5001` in `backend/.env` and update `VITE_API_URL=http://localhost:5001` in `frontend/.env`. |
| **Vercel 404 on refresh** | Missing SPA rewrite rule | Ensure `frontend/vercel.json` contains the rewrite rule routing `/*` to `/index.html`. |

---

## 17. Security & Portfolio Limitations

- **Single-User Demo**: This version does not feature login or user authentication. It is intended for demonstrations, college submissions, and personal local use.
- **No Private Financial Credentials**: SpendWise is designed exclusively for manually entered income and expense transactions. Never input banking passwords, debit/credit card numbers, or PINs.
- **Production Enhancements**: A commercial production release should incorporate:
  - User Authentication (JWT / OAuth2 / Clerk / Supabase).
  - Multi-tenant database isolation.
  - Granular role-based access control.
  - Automated recurring transactions and bill reminders.
  - CSV / PDF export and report generation.

---

## 18. Links & References

- **Live Demo**: `[Insert your Vercel URL here]`
- **GitHub Repository**: `[Insert your GitHub repository URL here]`
- **License**: ISC Open Source
