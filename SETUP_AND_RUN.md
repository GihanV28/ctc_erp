# Ceylon Cargo Transport - Setup & Run Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Git**: For version control

### Check Your Versions

```bash
node --version   # Should be v18.x.x or higher
npm --version    # Should be 9.x.x or higher
```

If you need to install/update Node.js, download from: https://nodejs.org/

---

## 🚀 Quick Start (Development)

### Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

This will install all dependencies for:
- Root workspace
- Admin app
- Client app
- API app
- Showcase app
- All shared packages

**Note:** This may take 2-5 minutes depending on your internet connection.

---

### Step 2: Start the Development Servers

#### Option A: Start Everything at Once (Recommended)

```bash
npm run dev
```

This will start all applications simultaneously:
- **Admin Dashboard**: http://localhost:3001
- **Client Portal**: http://localhost:3002
- **Showcase Site**: http://localhost:3003
- **API Server**: http://localhost:5000

#### Option B: Start Individual Apps

If you only want to work on specific apps:

**Admin Dashboard Only:**
```bash
cd apps/admin
npm run dev
```
Then open: http://localhost:3001

**Client Portal Only:**
```bash
cd apps/client
npm run dev
```
Then open: http://localhost:3002

**API Server Only:**
```bash
cd apps/api
npm run dev
```
API will be available at: http://localhost:5000

---

## 🌐 Access the Applications

Once running, open your browser and navigate to:

### Admin Dashboard
- **URL**: http://localhost:3001
- **Features**:
  - Team Management (Roles & Users)
  - Tracking Updates
  - Financial Management (Expenses, Income, Profit Analysis)
  - Shipments, Containers, Clients, Suppliers
  - Reports & Settings

### Client Portal
- **URL**: http://localhost:3002
- **Features**:
  - Shipment Tracking
  - Invoice Management
  - Profile & Settings
  - Support Tickets

### Showcase Website
- **URL**: http://localhost:3003
- **Features**:
  - Landing Page
  - Services Overview
  - Contact Forms

### API Server
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Docs**: http://localhost:5000/api-docs (Swagger UI)

---

## 🔧 Available Commands

### Root Level Commands (From project root)

```bash
# Development
npm run dev          # Start all apps in development mode
npm run build        # Build all apps for production
npm run start        # Start all apps in production mode
npm run lint         # Run linting on all apps
npm run test         # Run tests on all apps
npm run format       # Format code with Prettier
npm run clean        # Remove all node_modules and build files
```

### App-Specific Commands

#### Admin Dashboard (apps/admin)
```bash
cd apps/admin
npm run dev          # Start dev server on port 3001
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### Client Portal (apps/client)
```bash
cd apps/client
npm run dev          # Start dev server on port 3002
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### API Server (apps/api)
```bash
cd apps/api
npm run dev          # Start dev server with nodemon
npm run start        # Start production server
npm run test         # Run API tests
npm run seed         # Seed database with sample data
```

---

## 📁 Project Structure

```
ceylon-cargo-transport/
├── apps/
│   ├── admin/              # Admin Dashboard (Next.js) - Port 3001
│   ├── client/             # Client Portal (Next.js) - Port 3002
│   ├── showcase/           # Landing Page (Next.js) - Port 3003
│   └── api/                # Backend API (Express) - Port 5000
├── packages/
│   ├── ui/                 # Shared React components
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Shared utility functions
├── node_modules/           # Dependencies (auto-generated)
├── package.json            # Root package configuration
├── turbo.json              # Turborepo configuration
└── SETUP_AND_RUN.md        # This file
```

---

## 🎨 What You'll See

### Admin Dashboard (http://localhost:3001)

When you first open the admin dashboard:

1. **Login Page** - You'll be redirected here first
2. **Dashboard** - After login, you'll see:
   - Overview with statistics
   - Navigation sidebar with:
     - Overview
     - **Team Management** (New!) - Roles & Users
     - **Tracking Update** (New!) - Shipment tracking
     - **Financials** (New!) - Complete financial management
     - Shipments
     - Containers
     - Clients
     - Suppliers
     - Reports
     - Settings

3. **New Features Implemented:**

   **Team Management:**
   - Role Management: Create, edit, delete roles with 12 permission categories
   - User Management: Manage admin and client users with full CRUD operations

   **Tracking Update:**
   - Add tracking updates to shipments
   - 12 tracking status types
   - Timeline visualization
   - File attachments support

   **Financials:**
   - **Overview Tab**: KPI cards (Revenue, Expenses, Profit, ROI)
   - **Expenses Tab**: Track all business expenses with 12 categories
   - **Income Tab**: Manage revenue from 8 different sources
   - **Analysis Tab**: Profit analysis with visual breakdowns

---

## 🗄️ Database Setup (Optional - For Full Functionality)

Currently, the app uses **mock data** for demonstration. To use real data:

### MongoDB Setup

1. **Create MongoDB Atlas Account** (Free)
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free tier (M0)

2. **Create a Cluster**
   - Follow the setup wizard
   - Choose a region close to you
   - Copy the connection string

3. **Configure Environment Variables**

Create a `.env` file in `apps/api/`:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ceylon-cargo-transport?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3002,http://localhost:3003

# Email (Optional)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=info.cct@ceylongrp.com
SMTP_PASS=your-email-password
SMTP_FROM=info.cct@ceylongrp.com
```

4. **Seed the Database** (Optional)

```bash
cd apps/api
npm run seed
```

This will populate the database with sample data.

---

## 🐛 Troubleshooting

### Problem: "Port already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Problem: "Module not found" errors

**Solution:**
```bash
# Clear everything and reinstall
npm run clean
npm install
```

### Problem: Next.js build errors

**Solution:**
```bash
# Clear Next.js cache
cd apps/admin
rm -rf .next
npm run dev
```

### Problem: TypeScript errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
# Type "TypeScript: Restart TS Server"
```

### Problem: Dependencies not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete package-lock.json
rm package-lock.json

# Reinstall
npm install
```

---

## 🔥 Hot Reload & Live Updates

All applications support **hot reload**:
- Edit any file in `apps/admin/src/` and see changes instantly
- No need to restart the server
- Changes reflect in browser automatically

---

## 🎯 Next Steps

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Open Admin Dashboard**
   - Navigate to http://localhost:3001
   - Explore the new features:
     - Team Management
     - Tracking Update
     - Financials

3. **Explore the Code**
   - Check `apps/admin/src/app/dashboard/team/` for Team Management
   - Check `apps/admin/src/app/dashboard/tracking/` for Tracking
   - Check `apps/admin/src/app/dashboard/financials/` for Financial features

4. **Connect to Backend** (When ready)
   - Set up MongoDB (see Database Setup above)
   - Configure environment variables
   - Replace mock data with API calls

---

## 📝 Development Tips

1. **Use Multiple Terminals**
   - Terminal 1: Run `npm run dev` from root
   - Terminal 2: For git commands, file operations, etc.

2. **VS Code Extensions (Recommended)**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

3. **Browser DevTools**
   - Press F12 to open
   - Check Console for errors
   - Use React DevTools extension

4. **Code Organization**
   - Components in `apps/admin/src/components/`
   - Pages in `apps/admin/src/app/`
   - Shared utilities in `packages/`

---

## 🚀 Production Build (When Ready)

```bash
# Build all apps
npm run build

# Start in production mode
npm run start
```

**Production URLs** (After deployment):
- Admin: https://admin.cct.ceylongrp.com
- Client: https://client.cct.ceylongrp.com
- API: https://api.cct.ceylongrp.com
- Showcase: https://www.cct.ceylongrp.com

---

## 📞 Need Help?

If you encounter any issues:

1. Check this README
2. Check the console for error messages
3. Review the troubleshooting section
4. Check the project documentation in `/docs`

---

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Admin dashboard accessible at http://localhost:3001
- [ ] All features working (Team, Tracking, Financials)

---

**Happy Coding! 🎉**

Last Updated: December 23, 2024
Version: 1.0.0
