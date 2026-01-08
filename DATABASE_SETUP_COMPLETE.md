# ✅ MongoDB Database Setup Complete

**Date:** January 1, 2026  
**Database:** ceylon-cargo-transport  
**Cluster:** cct-cluster.p4cbtlr.mongodb.net

---

## 🎉 What Was Done

### 1. **Environment Configuration**
- ✅ Created `apps/api/.env` file with MongoDB connection string
- ✅ Configured all necessary environment variables
- ✅ URL-encoded special characters in password

### 2. **Database Connection**
- ✅ Successfully connected to MongoDB Atlas
- ✅ Database: `ceylon-cargo-transport`
- ✅ 9 Collections created

### 3. **Database Schemas (Models)**

All 10 models are in place and working:

| Model | File | Status |
|-------|------|--------|
| User | `apps/api/src/models/User.js` | ✅ Active |
| Role | `apps/api/src/models/Role.js` | ✅ Active |
| Client | `apps/api/src/models/Client.js` | ✅ Active |
| Shipment | `apps/api/src/models/Shipment.js` | ✅ Active |
| Container | `apps/api/src/models/Container.js` | ✅ Active |
| Invoice | `apps/api/src/models/Invoice.js` | ✅ Active |
| Supplier | `apps/api/src/models/Supplier.js` | ✅ Active |
| TrackingUpdate | `apps/api/src/models/TrackingUpdate.js` | ✅ Active |
| SupportTicket | `apps/api/src/models/SupportTicket.js` | ✅ Active |
| Settings | `apps/api/src/models/Settings.js` | ✅ Active |

### 4. **Seeded Data**

#### Roles Created:
- **Admin** - Full system access (all permissions)
- **Manager** - Operations management (shipments, clients, reports)
- **Staff** - Limited access (view and update shipments)
- **Client** - Portal access (view own shipments and invoices)

#### Users Created:

| Role | Name | Email | Password | Access Level |
|------|------|-------|----------|--------------|
| Admin | System Administrator | admin@ceylongrp.com | `Admin@123` | Full System Access |
| Manager | John Manager | manager@ceylongrp.com | `Manager@123` | Operations Management |
| Staff | Jane Staff | staff@ceylongrp.com | `Staff@123` | Limited Access |
| Client | Demo Client | client@example.com | `Client@123` | Client Portal |

#### Sample Client Created:
- **Company:** Demo Trading Company
- **Contact:** Demo Client
- **Status:** Active
- **Credit Limit:** $50,000
- **Payment Terms:** 30 days

---

## 📊 Database Collections

Your MongoDB database now has these collections:

1. **users** - User accounts (admin, staff, clients)
2. **roles** - Permission-based roles
3. **clients** - Client/customer information
4. **shipments** - Shipment records
5. **containers** - Container tracking
6. **invoices** - Billing and invoices
7. **suppliers** - Supplier management
8. **trackingupdates** - Shipment tracking history
9. **supporttickets** - Customer support tickets

---

## 🔑 Login Credentials

### Admin Dashboard (http://localhost:3001)

**Super Admin:**
```
Email: admin@ceylongrp.com
Password: Admin@123
```

**Manager:**
```
Email: manager@ceylongrp.com
Password: Manager@123
```

**Staff:**
```
Email: staff@ceylongrp.com
Password: Staff@123
```

### Client Portal (http://localhost:3002)

**Demo Client:**
```
Email: client@example.com
Password: Client@123
```

---

## ⚠️ IMPORTANT SECURITY WARNINGS

### 🔴 CRITICAL - Change These Immediately in Production:

1. **Default Passwords:**
   - All users have simple default passwords
   - CHANGE these before deploying to production
   - Use strong passwords (12+ characters, mixed case, numbers, symbols)

2. **JWT Secrets:**
   - Current JWT secrets are for development only
   - Generate new random secrets for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Email Password:**
   - Update `SMTP_PASS` in `.env` with your actual email password

4. **Security Best Practices:**
   - Enable 2FA for admin accounts
   - Regularly rotate passwords
   - Monitor access logs
   - Use HTTPS in production
   - Keep MongoDB IP whitelist restricted

---

## 🚀 Next Steps

### 1. Test the API Server

Start the API server:
```bash
cd apps/api
npm run dev
```

The API should be running at: http://localhost:5000

### 2. Test Database Connection

The API will automatically connect to MongoDB on startup. Look for:
```
✅ MongoDB Connected: cct-cluster.p4cbtlr.mongodb.net
📁 Database: ceylon-cargo-transport
```

### 3. Test Login

Try logging in with the admin credentials:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ceylongrp.com",
    "password": "Admin@123"
  }'
```

### 4. Start Frontend Apps

Start all apps together:
```bash
# From project root
npm run dev
```

This will start:
- Admin Dashboard: http://localhost:3001
- Client Portal: http://localhost:3002
- Showcase Site: http://localhost:3003
- API Server: http://localhost:5000

---

## 📝 Database Schema Details

### User Schema
- Email (unique, required)
- Password (hashed with bcrypt)
- First Name, Last Name
- Phone, Avatar
- Role (reference to Role model)
- User Type (admin/client)
- Status (active/inactive/suspended/pending)
- Email Verification
- Phone Verification
- 2FA Support
- Permission Overrides
- Password Reset Tokens
- Refresh Tokens

### Role Schema
- Name (unique, lowercase)
- Display Name
- Description
- User Type (admin/client)
- Permissions Array
- System Flag (prevents deletion)

### Client Schema
- Company Name, Trading Name
- Industry, Registration Number
- Tax ID
- Address (street, city, state, postal code, country)
- Contact Person Details
- Billing Address
- Payment Terms, Credit Limit
- Status, Notes

### Shipment Schema
- Tracking Number (unique)
- Client Reference
- Origin & Destination
- Container Details
- Status & Timeline
- Customs Information
- Financial Details

### Container Schema
- Container Number
- Type, Size
- Status, Location
- Current Shipment Reference

### Invoice Schema
- Invoice Number
- Client Reference
- Shipment Reference
- Line Items, Amounts
- Tax, Discounts
- Payment Status & Terms

---

## 🔧 Maintenance Commands

### Re-seed Database
```bash
cd apps/api
node scripts/seed.js
```

### Check Database Connection
```bash
cd apps/api
node test-connection.js
```

### MongoDB Atlas Dashboard
Access your cluster: https://cloud.mongodb.com/

---

## 📞 Support

If you encounter any issues:

1. Check the API console for error messages
2. Verify MongoDB connection in Atlas dashboard
3. Ensure `.env` file has correct credentials
4. Check network connectivity
5. Review MongoDB Atlas IP whitelist

---

## ✅ Setup Complete!

Your Ceylon Cargo Transport ERP system is now ready for development!

**Database:** ✅ Connected  
**Schemas:** ✅ Created (10 models)  
**Seed Data:** ✅ Populated  
**Users:** ✅ 4 test users created  
**Roles:** ✅ 4 roles with permissions  

🚀 **You can now start building and testing your application!**

---

*Last Updated: January 1, 2026*
*Version: 1.0.0*
