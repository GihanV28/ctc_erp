# Ceylon Cargo Transport - Quick Start Guide

**Last Updated:** December 15, 2024

---

## 🚀 Get Started in 3 Steps

### Step 1: Review Your Project Status
Read these files in order:

1. **[PROJECT_STATUS.md](PROJECT_STATUS.md)** ← Start here
   - See what's done (15%)
   - See what's needed (85%)
   - Understand the scope

2. **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)**
   - Complete development plan
   - 6 phases with time estimates
   - Step-by-step instructions

3. **[README.md](README.md)**
   - Project overview
   - Deployment structure

---

### Step 2: Set Up Your Development Environment

#### Prerequisites
Install these first:
```bash
# Node.js (v18 or higher)
node -v  # Should show v18.x.x or higher

# npm or pnpm
npm -v   # Should show v9.x.x or higher

# Git
git --version
```

#### Clone & Install
```bash
# You're already in the project directory
# Just install dependencies
npm install

# Or use pnpm for faster installs
pnpm install
```

---

### Step 3: Choose Your Starting Point

You have 2 options:

#### Option A: Full Backend-First Approach (Recommended)
**Best for:** Complete system implementation
**Timeline:** 7-8 weeks solo

```bash
Phase 1: Backend API (2 weeks)
  ├── Database models
  ├── Authentication
  ├── API endpoints
  └── Email service

Phase 2: Admin Frontend (2 weeks)
  ├── Next.js setup
  ├── Integrate UI components
  └── API integration

Phase 3: Client Portal (1 week)
Phase 4: Landing Page (1 week)
Phase 5: Testing (1 week)
Phase 6: Deployment (3 days)
```

**Start command:**
Reply: **"Start Phase 1"** → I'll generate all backend files

---

#### Option B: Quick Prototype Approach
**Best for:** Demo/MVP to show stakeholders
**Timeline:** 1 week

```bash
Day 1-2: Backend essentials
  └── Auth + Shipments + Tracking APIs only

Day 3-4: Admin panel
  └── Integrate 5 UI components with mock data

Day 5: Deploy to staging
  └── Get a working demo live

Day 6-7: Polish & test
```

**Start command:**
Reply: **"Quick MVP"** → I'll generate minimal viable code

---

## 📁 Where Are Your UI Components?

Your 5 complete UI components are uploaded in the chat but NOT in the project yet.

**They need to be placed here:**

```
apps/admin/src/
├── app/(dashboard)/
│   ├── users/
│   │   └── page.tsx  ← UserManagement.tsx goes here
│   ├── roles/
│   │   └── page.tsx  ← RoleManagement.tsx goes here
│   └── ... (other pages)
└── components/modals/
    ├── TrackingUpdateModal.tsx  ← Place here
    ├── AddContainerModal.tsx    ← Place here
    └── AddSupplierModal.tsx     ← Place here
```

**I can do this for you automatically when we start Phase 2.**

---

## 🗄️ Database Setup (Required First)

### MongoDB Atlas (Free)

1. **Create Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free)

2. **Create Cluster**
   - Choose M0 (free tier)
   - Select region closest to you (Singapore or Mumbai for Sri Lanka)
   - Cluster name: `cct-dev`

3. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password

4. **Add to .env**
   ```env
   # apps/api/.env
   MONGODB_URI=mongodb+srv://username:<password>@cct-dev.xxxxx.mongodb.net/ceylon-cargo-transport?retryWrites=true&w=majority
   ```

**Time needed:** 10 minutes

---

## 📧 Email Setup (Required for Notifications)

### Namecheap Private Email SMTP Settings

Since you have `info.cct@ceylongrp.com` already:

```env
# apps/api/.env
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info.cct@ceylongrp.com
SMTP_PASS=your-email-password-here
SMTP_FROM=info.cct@ceylongrp.com
EMAIL_FROM_NAME=Ceylon Cargo Transport
```

**IMAP Settings (for receiving emails):**
```env
IMAP_HOST=mail.privateemail.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USER=info.cct@ceylongrp.com
IMAP_PASS=your-email-password-here
```

**Time needed:** 5 minutes

---

## 🔐 Environment Variables Template

Create these files with proper values:

### apps/api/.env
```env
# Server
NODE_ENV=development
PORT=4000
API_URL=http://localhost:4000

# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Email (Namecheap)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info.cct@ceylongrp.com
SMTP_PASS=your-password
SMTP_FROM=info.cct@ceylongrp.com

# Frontend URLs (for CORS)
ADMIN_URL=http://localhost:3001
CLIENT_URL=http://localhost:3002
SHOWCASE_URL=http://localhost:3003

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### apps/admin/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=CCT Admin
```

### apps/client/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=CCT Client Portal
```

### apps/showcase/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=Ceylon Cargo Transport
```

---

## 🏃‍♂️ Running the Project

### Development Mode (All Apps)
```bash
# From root directory
npm run dev

# This starts:
# ✅ API:      http://localhost:4000
# ✅ Admin:    http://localhost:3001
# ✅ Client:   http://localhost:3002
# ✅ Showcase: http://localhost:3003
```

### Individual Apps
```bash
# Just the API
cd apps/api
npm run dev

# Just the admin panel
cd apps/admin
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 🧪 Testing the API

### With Postman
1. Import Swagger docs from `http://localhost:4000/api-docs`
2. Test endpoints

### With curl
```bash
# Health check
curl http://localhost:4000/health

# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test@1234",
    "firstName": "Admin",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test@1234"
  }'
```

---

## 📦 Project Structure Overview

```
ceylon-cargo-transport/
├── apps/
│   ├── admin/          # Admin dashboard (Next.js)
│   ├── client/         # Client portal (Next.js)
│   ├── showcase/       # Landing page (Next.js)
│   └── api/            # Backend API (Express)
├── packages/
│   ├── ui/             # Shared UI components
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── configs/        # Shared configs
├── docs/               # Documentation
├── scripts/            # Build & deploy scripts
└── .github/            # CI/CD workflows
```

---

## 🎯 What to Do Right Now

### If You Want to Start Building:

**Reply with one of these:**

1. **"Start Phase 1"**
   → I'll generate all backend database models and setup files

2. **"Quick MVP"**
   → I'll create a minimal working version you can deploy today

3. **"Show me the UI components"**
   → I'll place all 5 components in the right folders

4. **"Set up database first"**
   → I'll walk you through MongoDB Atlas setup

5. **"Configure email"**
   → I'll help set up Namecheap SMTP/IMAP

6. **"All of it, step by step"**
   → I'll do Phase 1, Step 1.1 completely for you

---

## ❓ Common Questions

**Q: I'm not a developer, can I still build this?**
A: Yes! I'll generate all the code. You just need to:
- Copy files to the right places
- Run npm commands
- Configure environment variables

**Q: How long will this take?**
A:
- Quick MVP: 1 week
- Full system: 7-8 weeks (working part-time)
- With help: 4-5 weeks

**Q: What's the total cost?**
A:
- Development: Free (if you build it)
- Monthly hosting: $0-16/month
- Domain: Already paid
- Email: Already paid

**Q: Can I hire someone to build this?**
A: Yes, estimated cost: $3,000-5,000 for freelancer or $10,000-15,000 for agency

**Q: Do I need to know coding?**
A: Basic knowledge helps, but I'll provide:
- All code files
- Step-by-step instructions
- Explanations for everything
- Debugging help

---

## 📞 Ready to Start?

**Choose your path and let me know:**

🚀 **Fast Track** → "Quick MVP" → 1 week to demo
🏗️ **Complete Build** → "Start Phase 1" → 7-8 weeks to production
🎓 **Learn & Build** → "All of it, step by step" → I'll teach as we go

**I'm ready to generate code when you are!** 🎉
