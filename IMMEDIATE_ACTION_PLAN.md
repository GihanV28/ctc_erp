# Ceylon Cargo Transport - Immediate Action Plan

**Date:** December 28, 2025
**Objective:** Get all apps building and ready for integration

---

## 🚨 CRITICAL FIXES REQUIRED (Do These FIRST)

### Issue #1: Admin & Client Apps Cannot Build ❌

**Problem:** ESLint configuration missing, causing build failures

**Error Messages:**
```
Error: Parsing error: Unexpected token interface
Error: Parsing error: Unexpected token ClassValue
```

**Solution:** Create `.eslintrc.json` in both apps

**Time:** 5 minutes each

**Commands to Run:**
```bash
# Fix Admin
cat > apps/admin/.eslintrc.json << 'EOF'
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "react/no-unescaped-entities": "off"
  }
}
EOF

# Fix Client
cat > apps/client/.eslintrc.json << 'EOF'
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "react/no-unescaped-entities": "off"
  }
}
EOF
```

**Verification:**
```bash
cd apps/admin && npm run build
cd apps/client && npm run build
```

Both should build successfully.

---

### Issue #2: API Cannot Start (No Database Connection) ❌

**Problem:** No .env file configured, API cannot connect to MongoDB

**Solution:** Create `.env` file with MongoDB connection

**Time:** 30 minutes (including MongoDB Atlas setup)

**Step 1: Set Up MongoDB Atlas**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a new cluster (Free M0 tier)
4. Go to Security → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Go to Security → Database Access → Add New Database User
   - Username: `cct_admin`
   - Password: Generate a secure password
   - Role: Read and write to any database
6. Go to Databases → Connect → Connect your application
7. Copy connection string

**Step 2: Create .env File**

```bash
cd apps/api
cp .env.example .env
```

**Step 3: Edit .env**

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=mongodb+srv://cct_admin:<password>@cluster0.xxxxx.mongodb.net/cct_cargo?retryWrites=true&w=majority

# JWT Secrets (Generate random strings)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_too
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (Namecheap)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=info.cct@ceylongrp.com
SMTP_PASS=your_email_password_here
SMTP_FROM=info.cct@ceylongrp.com
SMTP_FROM_NAME=Ceylon Cargo Transport

# Frontend URLs
ADMIN_URL=http://localhost:3001
CLIENT_URL=http://localhost:3002
SHOWCASE_URL=http://localhost:3003

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

**Replace:**
- `<password>` with your MongoDB password
- `xxxxx` with your cluster ID
- JWT secrets with random 32+ character strings
- Email password with actual password

**Step 4: Generate JWT Secrets**

```bash
# On Linux/Mac:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online tool:
# https://www.random.org/strings/
```

**Step 5: Test API**

```bash
cd apps/api
npm run dev
```

Should see:
```
Server running on http://localhost:4000
Connected to MongoDB successfully
```

---

### Issue #3: No Initial Data in Database ❌

**Problem:** Database is empty, cannot test features

**Solution:** Create seed script to add initial admin user and roles

**Time:** 15 minutes

**Create Seed Script:** `apps/api/scripts/seed.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Role = require('../src/models/Role');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - only for development)
    await User.deleteMany({});
    await Role.deleteMany({});
    console.log('Cleared existing data');

    // Create roles
    const adminRole = await Role.create({
      name: 'admin',
      description: 'Full system access',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        roles: ['create', 'read', 'update', 'delete'],
        clients: ['create', 'read', 'update', 'delete'],
        shipments: ['create', 'read', 'update', 'delete'],
        containers: ['create', 'read', 'update', 'delete'],
        suppliers: ['create', 'read', 'update', 'delete'],
        invoices: ['create', 'read', 'update', 'delete'],
        tracking: ['create', 'read', 'update', 'delete'],
        support: ['create', 'read', 'update', 'delete'],
        reports: ['create', 'read', 'update', 'delete'],
        settings: ['create', 'read', 'update', 'delete'],
        financials: ['create', 'read', 'update', 'delete']
      },
      isSystemRole: true
    });

    const clientRole = await Role.create({
      name: 'client',
      description: 'Client portal access',
      permissions: {
        shipments: ['read'],
        invoices: ['read'],
        tracking: ['read'],
        support: ['create', 'read']
      },
      isSystemRole: true
    });

    console.log('Created roles');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'System Admin',
      email: 'admin@ceylongrp.com',
      password: hashedPassword,
      role: adminRole._id,
      isActive: true,
      isEmailVerified: true,
      phone: '+94112345678'
    });

    console.log('Created admin user');
    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@ceylongrp.com');
    console.log('Password: Admin@123');
    console.log('\n⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
```

**Add to package.json:**
```json
{
  "scripts": {
    "seed": "node scripts/seed.js"
  }
}
```

**Run Seed:**
```bash
cd apps/api
npm run seed
```

**Test Login:**
- Email: admin@ceylongrp.com
- Password: Admin@123

---

## ✅ VERIFICATION CHECKLIST

After completing the above fixes, verify:

### Admin App
```bash
cd apps/admin
npm run build
```
Expected: ✅ Build succeeds

### Client App
```bash
cd apps/client
npm run build
```
Expected: ✅ Build succeeds

### Showcase App
```bash
cd apps/showcase
npm run build
```
Expected: ✅ Build succeeds (already working)

### API App
```bash
cd apps/api
npm run dev
```
Expected:
- ✅ Server starts on port 4000
- ✅ MongoDB connects
- ✅ No error messages

### Test API Endpoint
```bash
curl http://localhost:4000/api/health
```
Expected: JSON response with status

### Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ceylongrp.com",
    "password": "Admin@123"
  }'
```
Expected: JWT token in response

---

## 📝 NEXT STEPS (After Fixes)

Once all 3 issues are fixed:

1. **Test All Apps Locally**
   ```bash
   npm run dev
   # This starts all 4 apps:
   # - API: http://localhost:4000
   # - Admin: http://localhost:3001
   # - Client: http://localhost:3002
   # - Showcase: http://localhost:3003
   ```

2. **Integrate Frontend with Backend**
   - Create API client utilities in admin/client apps
   - Replace mock data with real API calls
   - Add authentication flow

3. **Test End-to-End Flow**
   - Login to admin portal
   - Create a client
   - Create a shipment
   - Add tracking updates
   - View in client portal

4. **Deploy Showcase (Can do immediately)**
   ```bash
   cd apps/showcase
   vercel
   ```

5. **Continue Development**
   - Add email service
   - Add file uploads
   - Add PDF generation
   - Write tests
   - Deploy other apps

---

## 🆘 TROUBLESHOOTING

### "Cannot connect to MongoDB"
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify connection string in .env
- Ensure database user exists with correct password

### "JWT malformed" errors
- Ensure JWT_SECRET is set in .env
- Secret must be at least 32 characters
- Restart API server after changing .env

### "SMTP connection failed"
- Verify email credentials
- Check SMTP port (587 for TLS)
- Test email account can send manually

### "Module not found" errors
- Run `npm install` in the specific app directory
- Check package.json has all dependencies
- Delete node_modules and reinstall

### Build still fails
- Clear .next directory: `rm -rf .next`
- Clear cache: `rm -rf .turbo`
- Reinstall: `rm -rf node_modules && npm install`

---

## 📞 SUMMARY

**Total Time to Fix All Issues:** ~1-2 hours

**Priority Order:**
1. Fix ESLint (5 min) ← Do this first
2. Configure MongoDB (30 min)
3. Create .env file (5 min)
4. Run seed script (5 min)
5. Test everything (15 min)

**After Fixes:**
- ✅ All 4 apps can build
- ✅ All 4 apps can run locally
- ✅ API connects to database
- ✅ Admin user exists
- ✅ Ready for integration work

**Next Major Task:** Connect frontend apps to backend API (3-4 days)

---

*This plan should be executed sequentially. Each fix depends on the previous one.*
*Start with ESLint, then database, then testing.*
