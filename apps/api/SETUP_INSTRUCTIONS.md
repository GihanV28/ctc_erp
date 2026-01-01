# Backend Setup Instructions

## Quick Setup Scripts

Two scripts are provided to automatically create the complete backend folder structure:

### For Windows Users

```bash
# Double-click the file or run in Command Prompt
setup-backend-structure.bat
```

### For Git Bash / WSL / Linux / Mac Users

```bash
# Make the script executable (first time only)
chmod +x setup-backend-structure.sh

# Run the script
./setup-backend-structure.sh
```

## What the Scripts Do

The setup scripts will automatically create:

✅ **8 Directories:**
- `src/config/` - Configuration files
- `src/models/` - Mongoose models
- `src/middleware/` - Express middleware
- `src/utils/` - Utility functions
- `src/services/` - Business logic services
- `src/validators/` - Request validators
- `src/controllers/` - Route controllers
- `src/routes/` - Express routes
- `src/scripts/` - Database seed scripts

✅ **40+ Files** with proper structure (only creates files that don't exist)

✅ **`.env` template** with all required environment variables

## After Running the Script

### Step 1: Copy Code from Documentation

Open the 3 backend documentation files and copy the code into the corresponding files:

**From `BACKEND_COMPLETE_CODE.md` (Part 1):**
- Copy remaining model files: Container.js, Supplier.js, Shipment.js, TrackingUpdate.js, Invoice.js, SupportTicket.js, Settings.js
- Copy middleware files: auth.js, rbac.js

**From `BACKEND_COMPLETE_CODE_PART2.md` (Part 2):**
- Copy all utils files (ApiError.js, ApiResponse.js, asyncHandler.js, jwt.js)
- Copy errorHandler.js and validate.js middleware
- Copy emailService.js
- Copy validator files (authValidators.js, userValidators.js)
- Copy controllers: authController.js, userController.js

**From `BACKEND_COMPLETE_CODE_PART3.md` (Part 3):**
- Copy all remaining controllers (8 files)
- Copy all route files (10 files)
- Copy swagger.js configuration
- Copy updated server.js
- Copy seedDatabase.js script

### Step 2: Configure Environment Variables

Edit the `.env` file and update:

```env
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/cct_database

# Generate a secure JWT secret (use a random string generator)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Update with your actual email credentials
EMAIL_USER=info.cct@ceylongrp.com
EMAIL_PASS=your-actual-password
```

### Step 3: Seed the Database

```bash
npm run seed
```

This will create:
- 4 default roles (super_admin, admin, operations_manager, client_user)
- 1 super admin user (admin@cct.ceylongrp.com / Admin@123456)

### Step 4: Start the Server

```bash
npm run dev
```

### Step 5: Test the API

1. **Swagger Documentation:** http://localhost:5000/api-docs
2. **Health Check:** http://localhost:5000/health
3. **Login Test:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@cct.ceylongrp.com","password":"Admin@123456"}'
   ```

## File Structure Created

```
apps/api/
├── server.js
├── .env
├── package.json
└── src/
    ├── config/
    │   ├── database.js ✅ (already exists)
    │   ├── constants.js
    │   └── swagger.js
    ├── models/
    │   ├── Role.js ✅ (already exists)
    │   ├── User.js ✅ (already exists)
    │   ├── Client.js ✅ (already exists)
    │   ├── Container.js
    │   ├── Supplier.js
    │   ├── Shipment.js
    │   ├── TrackingUpdate.js
    │   ├── Invoice.js
    │   ├── SupportTicket.js
    │   └── Settings.js
    ├── middleware/
    │   ├── auth.js
    │   ├── rbac.js
    │   ├── errorHandler.js
    │   └── validate.js
    ├── utils/
    │   ├── jwt.js
    │   ├── ApiError.js
    │   ├── ApiResponse.js
    │   └── asyncHandler.js
    ├── services/
    │   └── emailService.js
    ├── validators/
    │   ├── authValidators.js
    │   └── userValidators.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── roleController.js
    │   ├── clientController.js
    │   ├── containerController.js
    │   ├── supplierController.js
    │   ├── shipmentController.js
    │   ├── trackingController.js
    │   ├── invoiceController.js
    │   └── supportController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── roleRoutes.js
    │   ├── clientRoutes.js
    │   ├── containerRoutes.js
    │   ├── supplierRoutes.js
    │   ├── shipmentRoutes.js
    │   ├── trackingRoutes.js
    │   ├── invoiceRoutes.js
    │   └── supportRoutes.js
    └── scripts/
        └── seedDatabase.js
```

## Troubleshooting

**Script doesn't run on Windows:**
- Make sure you're in the `apps/api` directory
- Right-click `setup-backend-structure.bat` and select "Run as administrator"

**Script doesn't run on Mac/Linux:**
- Run: `chmod +x setup-backend-structure.sh`
- Make sure you have bash installed

**Permission denied errors:**
- On Windows: Run Command Prompt as Administrator
- On Mac/Linux: Use `sudo ./setup-backend-structure.sh`

## Need Help?

If you encounter any issues:
1. Check that you're in the correct directory (`apps/api`)
2. Verify Node.js and npm are installed: `node --version` and `npm --version`
3. Make sure all dependencies are installed: `npm install`
4. Check the console output for specific error messages
