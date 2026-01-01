# Ceylon Cargo Transport - Implementation Roadmap

## 🎯 Development Phases

### **PHASE 1: Backend Foundation (Week 1-2) - PRIORITY 1**

#### Step 1.1: Database Schema & Models Setup
**Time Estimate:** 3-4 days

**Tasks:**
1. Set up MongoDB Atlas cluster
2. Create database connection utility
3. Implement all Mongoose schemas:
   - User model (with role-based permissions)
   - Role model
   - Client model
   - Shipment model
   - Container model
   - Supplier model
   - TrackingUpdate model
   - Invoice model
   - SupportTicket model

**Files to Create:**
```
apps/api/src/
├── config/
│   ├── database.js
│   └── constants.js
├── models/
│   ├── User.js
│   ├── Role.js
│   ├── Client.js
│   ├── Shipment.js
│   ├── Container.js
│   ├── Supplier.js
│   ├── TrackingUpdate.js
│   ├── Invoice.js
│   └── SupportTicket.js
└── utils/
    └── dbConnection.js
```

**Deliverable:** All database models with proper validation, indexes, and relationships

---

#### Step 1.2: Authentication & Authorization System
**Time Estimate:** 2-3 days

**Tasks:**
1. Implement JWT-based authentication
2. Create role-based access control (RBAC) middleware
3. Set up password hashing (bcrypt)
4. Implement refresh token mechanism
5. Create permission checking utilities

**Files to Create:**
```
apps/api/src/
├── middleware/
│   ├── auth.js
│   ├── rbac.js
│   └── errorHandler.js
├── utils/
│   ├── jwt.js
│   ├── password.js
│   └── permissions.js
└── validators/
    └── authValidators.js
```

**API Endpoints:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`

---

#### Step 1.3: Core API Routes
**Time Estimate:** 4-5 days

**Tasks:**
1. Implement all CRUD operations for each resource
2. Add proper validation and error handling
3. Implement filtering, pagination, sorting
4. Add permission checks to each endpoint

**Files to Create:**
```
apps/api/src/
├── routes/
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── roles.routes.js
│   ├── clients.routes.js
│   ├── shipments.routes.js
│   ├── containers.routes.js
│   ├── suppliers.routes.js
│   ├── tracking.routes.js
│   ├── invoices.routes.js
│   └── support.routes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── roleController.js
│   ├── clientController.js
│   ├── shipmentController.js
│   ├── containerController.js
│   ├── supplierController.js
│   ├── trackingController.js
│   ├── invoiceController.js
│   └── supportController.js
└── services/
    └── [corresponding service files]
```

---

#### Step 1.4: Email Service Integration
**Time Estimate:** 1-2 days

**Tasks:**
1. Configure Nodemailer with SMTP settings
2. Create email templates
3. Implement email sending service
4. Test with info.cct@ceylongrp.com

**Files to Create:**
```
apps/api/src/
├── services/
│   └── emailService.js
├── templates/
│   ├── welcome.html
│   ├── resetPassword.html
│   ├── shipmentUpdate.html
│   └── invoice.html
└── config/
    └── email.js
```

**Email Configuration:**
```javascript
// Namecheap SMTP Settings
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=info.cct@ceylongrp.com
SMTP_PASS=[your-password]
SMTP_FROM=info.cct@ceylongrp.com
```

---

#### Step 1.5: Swagger API Documentation
**Time Estimate:** 2 days

**Tasks:**
1. Install swagger-jsdoc and swagger-ui-express
2. Add JSDoc comments to all routes
3. Create Swagger configuration
4. Set up /api-docs endpoint

**Files to Create:**
```
apps/api/src/
├── config/
│   └── swagger.js
└── docs/
    └── swagger-definitions.js
```

---

### **PHASE 2: Admin Frontend (Week 3-4) - PRIORITY 2**

#### Step 2.1: Admin App Foundation
**Time Estimate:** 2-3 days

**Tasks:**
1. Set up Next.js 14 with App Router
2. Configure Tailwind CSS with your purple/orange theme
3. Create layout components (Sidebar, Header, etc.)
4. Set up authentication context
5. Create API client utility with Axios

**Files to Create:**
```
apps/admin/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/
│       ├── layout.tsx
│       └── dashboard/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── lib/
│   ├── api.ts
│   └── auth.ts
└── contexts/
    └── AuthContext.tsx
```

---

#### Step 2.2: Integrate Admin UI Components
**Time Estimate:** 3-4 days

**Tasks:**
1. Place all 5 UI components into admin app
2. Connect components to backend API
3. Add loading states and error handling
4. Implement real-time updates where needed

**Component Placement:**
```
apps/admin/src/app/(dashboard)/
├── users/
│   └── page.tsx (UserManagement.tsx)
├── roles/
│   └── page.tsx (RoleManagement.tsx)
├── containers/
│   └── page.tsx (uses AddContainerModal.tsx)
├── suppliers/
│   └── page.tsx (uses AddSupplierModal.tsx)
└── shipments/
    └── [id]/
        └── tracking/
            └── page.tsx (TrackingUpdateModal.tsx)
```

---

#### Step 2.3: Dashboard & Reports
**Time Estimate:** 3 days

**Tasks:**
1. Create main dashboard with stats
2. Build shipment list view
3. Add charts (using Chart.js or Recharts)
4. Implement export functionality

---

### **PHASE 3: Client Portal (Week 5) - PRIORITY 3**

#### Step 3.1: Client App Setup
**Time Estimate:** 2 days

**Tasks:**
1. Set up Next.js app with client theme
2. Create authentication pages
3. Build main layout

---

#### Step 3.2: Client Features
**Time Estimate:** 3 days

**Tasks:**
1. Shipment tracking page
2. Invoice viewing
3. Support ticket system
4. Profile management

**Files to Create:**
```
apps/client/src/app/
├── (auth)/
│   ├── login/
│   └── register/
└── (dashboard)/
    ├── dashboard/
    ├── shipments/
    ├── invoices/
    ├── support/
    └── profile/
```

---

### **PHASE 4: Landing Page (Week 6) - PRIORITY 4**

#### Step 4.1: Showcase Website
**Time Estimate:** 3-4 days

**Tasks:**
1. Design and build homepage
2. Create services page
3. Add contact form
4. Implement inquiry submission

---

### **PHASE 5: Testing & Deployment (Week 7-8) - PRIORITY 5**

#### Step 5.1: Testing
**Time Estimate:** 3-4 days

**Tasks:**
1. Unit tests for API endpoints
2. Integration tests
3. E2E tests for critical flows
4. Security testing

---

#### Step 5.2: Deployment Setup
**Time Estimate:** 2-3 days

**Tasks:**
1. Configure domain DNS (cct.ceylongrp.com)
2. Set up subdomains:
   - admin.cct.ceylongrp.com
   - client.cct.ceylongrp.com
   - www.cct.ceylongrp.com
   - api.cct.ceylongrp.com
3. Deploy to production
4. Configure SSL certificates
5. Set up monitoring and logging

**Deployment Plan:**
- **API:** Render.com (Free tier to start, $7/mo for production)
- **Frontend Apps:** Vercel (Free tier supports 3 projects)
- **Database:** MongoDB Atlas (Free M0 tier, upgrade to M10 $9/mo for production)
- **Email:** Already purchased Namecheap mailbox

**Total Monthly Cost (Production):**
- Render: $7/mo
- MongoDB Atlas: $9/mo
- Domain: Already purchased
- Email: Already purchased
- Vercel: $0 (Free tier)
- **Total: ~$16/month**

---

## 📋 **IMMEDIATE NEXT STEPS (Start Today)**

### Priority Order:

1. **Set up MongoDB Atlas** (30 minutes)
   - Create free cluster
   - Get connection string
   - Add to .env files

2. **Backend API Structure** (Day 1-2)
   - Create all model files
   - Set up database connection
   - Test connection

3. **Authentication System** (Day 3-4)
   - Implement JWT auth
   - Create login/register endpoints
   - Test with Postman

4. **Core CRUD Operations** (Day 5-7)
   - Build all API endpoints
   - Add validation
   - Test each endpoint

5. **Email Configuration** (Day 8)
   - Configure SMTP
   - Test email sending
   - Create templates

6. **Swagger Documentation** (Day 9)
   - Add API docs
   - Generate Swagger UI

7. **Admin Frontend Setup** (Day 10-12)
   - Create Next.js structure
   - Add authentication
   - Integrate UI components

8. **API Integration** (Day 13-15)
   - Connect frontend to backend
   - Handle loading/error states
   - Test all features

9. **Client Portal** (Day 16-20)
   - Build client app
   - Add tracking features
   - Test client flows

10. **Landing Page** (Day 21-25)
    - Design homepage
    - Add contact form
    - Deploy

11. **Testing** (Day 26-30)
    - Write tests
    - Fix bugs
    - Performance optimization

12. **Production Deployment** (Day 31-35)
    - Configure domains
    - Deploy all apps
    - Monitor and fix issues

---

## 🛠️ **TOOLS & TECHNOLOGIES CONFIRMED**

### Backend:
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- Nodemailer for emails
- Swagger for API docs
- Jest for testing

### Frontend:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Axios for API calls
- React Hook Form
- Zod for validation

### DevOps:
- Turborepo (monorepo management)
- Docker (containerization)
- GitHub Actions (CI/CD)
- Vercel (frontend hosting)
- Render (backend hosting)
- MongoDB Atlas (database)

---

## 📁 **FILE PLACEMENT FOR UPLOADED UI COMPONENTS**

Move your uploaded components here:

1. **RoleManagement.tsx** → `apps/admin/src/app/(dashboard)/roles/page.tsx`
2. **UserManagement.tsx** → `apps/admin/src/app/(dashboard)/users/page.tsx`
3. **TrackingUpdateModal.tsx** → `apps/admin/src/components/modals/TrackingUpdateModal.tsx`
4. **AddContainerModal.tsx** → `apps/admin/src/components/modals/AddContainerModal.tsx`
5. **AddSupplierModal.tsx** → `apps/admin/src/components/modals/AddSupplierModal.tsx`

---

## 🚀 **GETTING STARTED COMMAND**

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your MongoDB URI and other configs

# 3. Start development servers
npm run dev

# This will start:
# - API: http://localhost:4000
# - Admin: http://localhost:3001
# - Client: http://localhost:3002
# - Showcase: http://localhost:3003
```

---

## ❓ **QUESTIONS TO CLARIFY**

Before starting implementation, please confirm:

1. Do you have MongoDB Atlas account set up?
2. Do you have the password for info.cct@ceylongrp.com?
3. What payment gateway will you use later (Stripe, PayPal, local Sri Lankan)?
4. Do you want SMS notifications (Twilio, etc.)?
5. Any specific shipping line APIs to integrate (Maersk, MSC, etc.)?
6. Default currency (USD, LKR, both)?
7. Multi-language support needed (English + Sinhala/Tamil)?

---

## 📞 **SUPPORT & ASSISTANCE**

I'm ready to help you implement this step-by-step. Let me know which phase you'd like to start with, and I can:

1. Generate all the code files for that phase
2. Provide detailed implementation instructions
3. Help debug issues
4. Review and optimize code

**Recommended Start:** Let's begin with **Phase 1, Step 1.1 (Database Schema)**. Shall I create all the Mongoose model files for you?
