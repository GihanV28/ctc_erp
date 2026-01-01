#!/bin/bash

# ===================================================
# Ceylon Cargo Transport - Backend Structure Setup
# Bash Script (Git Bash, WSL, Linux, Mac)
# ===================================================

echo ""
echo "============================================"
echo "  CCT Backend Structure Setup"
echo "============================================"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Creating directory structure..."
echo ""

# Create all directories
mkdir -p src/config
mkdir -p src/models
mkdir -p src/middleware
mkdir -p src/utils
mkdir -p src/services
mkdir -p src/validators
mkdir -p src/controllers
mkdir -p src/routes
mkdir -p src/scripts

echo "[√] Directories created"
echo ""

# ===== CONFIG FILES =====
echo "Creating config files..."

if [ ! -f "src/config/constants.js" ]; then
    cat > src/config/constants.js << 'EOF'
// Constants and enumerations
module.exports = {};
EOF
    echo "  [√] constants.js"
fi

if [ ! -f "src/config/swagger.js" ]; then
    cat > src/config/swagger.js << 'EOF'
// Swagger configuration
module.exports = {};
EOF
    echo "  [√] swagger.js"
fi

# ===== MODEL FILES =====
echo ""
echo "Creating model files..."

[ ! -f "src/models/Container.js" ] && touch src/models/Container.js && echo "  [√] Container.js"
[ ! -f "src/models/Supplier.js" ] && touch src/models/Supplier.js && echo "  [√] Supplier.js"
[ ! -f "src/models/Shipment.js" ] && touch src/models/Shipment.js && echo "  [√] Shipment.js"
[ ! -f "src/models/TrackingUpdate.js" ] && touch src/models/TrackingUpdate.js && echo "  [√] TrackingUpdate.js"
[ ! -f "src/models/Invoice.js" ] && touch src/models/Invoice.js && echo "  [√] Invoice.js"
[ ! -f "src/models/SupportTicket.js" ] && touch src/models/SupportTicket.js && echo "  [√] SupportTicket.js"
[ ! -f "src/models/Settings.js" ] && touch src/models/Settings.js && echo "  [√] Settings.js"

# ===== MIDDLEWARE FILES =====
echo ""
echo "Creating middleware files..."

[ ! -f "src/middleware/auth.js" ] && touch src/middleware/auth.js && echo "  [√] auth.js"
[ ! -f "src/middleware/rbac.js" ] && touch src/middleware/rbac.js && echo "  [√] rbac.js"
[ ! -f "src/middleware/errorHandler.js" ] && touch src/middleware/errorHandler.js && echo "  [√] errorHandler.js"
[ ! -f "src/middleware/validate.js" ] && touch src/middleware/validate.js && echo "  [√] validate.js"

# ===== UTILS FILES =====
echo ""
echo "Creating utility files..."

[ ! -f "src/utils/jwt.js" ] && touch src/utils/jwt.js && echo "  [√] jwt.js"
[ ! -f "src/utils/ApiError.js" ] && touch src/utils/ApiError.js && echo "  [√] ApiError.js"
[ ! -f "src/utils/ApiResponse.js" ] && touch src/utils/ApiResponse.js && echo "  [√] ApiResponse.js"
[ ! -f "src/utils/asyncHandler.js" ] && touch src/utils/asyncHandler.js && echo "  [√] asyncHandler.js"

# ===== SERVICES FILES =====
echo ""
echo "Creating service files..."

[ ! -f "src/services/emailService.js" ] && touch src/services/emailService.js && echo "  [√] emailService.js"

# ===== VALIDATORS FILES =====
echo ""
echo "Creating validator files..."

[ ! -f "src/validators/authValidators.js" ] && touch src/validators/authValidators.js && echo "  [√] authValidators.js"
[ ! -f "src/validators/userValidators.js" ] && touch src/validators/userValidators.js && echo "  [√] userValidators.js"

# ===== CONTROLLER FILES =====
echo ""
echo "Creating controller files..."

[ ! -f "src/controllers/authController.js" ] && touch src/controllers/authController.js && echo "  [√] authController.js"
[ ! -f "src/controllers/userController.js" ] && touch src/controllers/userController.js && echo "  [√] userController.js"
[ ! -f "src/controllers/roleController.js" ] && touch src/controllers/roleController.js && echo "  [√] roleController.js"
[ ! -f "src/controllers/clientController.js" ] && touch src/controllers/clientController.js && echo "  [√] clientController.js"
[ ! -f "src/controllers/containerController.js" ] && touch src/controllers/containerController.js && echo "  [√] containerController.js"
[ ! -f "src/controllers/supplierController.js" ] && touch src/controllers/supplierController.js && echo "  [√] supplierController.js"
[ ! -f "src/controllers/shipmentController.js" ] && touch src/controllers/shipmentController.js && echo "  [√] shipmentController.js"
[ ! -f "src/controllers/trackingController.js" ] && touch src/controllers/trackingController.js && echo "  [√] trackingController.js"
[ ! -f "src/controllers/invoiceController.js" ] && touch src/controllers/invoiceController.js && echo "  [√] invoiceController.js"
[ ! -f "src/controllers/supportController.js" ] && touch src/controllers/supportController.js && echo "  [√] supportController.js"

# ===== ROUTE FILES =====
echo ""
echo "Creating route files..."

[ ! -f "src/routes/authRoutes.js" ] && touch src/routes/authRoutes.js && echo "  [√] authRoutes.js"
[ ! -f "src/routes/userRoutes.js" ] && touch src/routes/userRoutes.js && echo "  [√] userRoutes.js"
[ ! -f "src/routes/roleRoutes.js" ] && touch src/routes/roleRoutes.js && echo "  [√] roleRoutes.js"
[ ! -f "src/routes/clientRoutes.js" ] && touch src/routes/clientRoutes.js && echo "  [√] clientRoutes.js"
[ ! -f "src/routes/containerRoutes.js" ] && touch src/routes/containerRoutes.js && echo "  [√] containerRoutes.js"
[ ! -f "src/routes/supplierRoutes.js" ] && touch src/routes/supplierRoutes.js && echo "  [√] supplierRoutes.js"
[ ! -f "src/routes/shipmentRoutes.js" ] && touch src/routes/shipmentRoutes.js && echo "  [√] shipmentRoutes.js"
[ ! -f "src/routes/trackingRoutes.js" ] && touch src/routes/trackingRoutes.js && echo "  [√] trackingRoutes.js"
[ ! -f "src/routes/invoiceRoutes.js" ] && touch src/routes/invoiceRoutes.js && echo "  [√] invoiceRoutes.js"
[ ! -f "src/routes/supportRoutes.js" ] && touch src/routes/supportRoutes.js && echo "  [√] supportRoutes.js"

# ===== SCRIPTS FOLDER =====
echo ""
echo "Creating scripts directory for seed file..."
echo "  [√] scripts directory ready"

# ===== ENV FILE =====
echo ""
if [ ! -f ".env" ]; then
    echo "Creating .env template..."
    cat > .env << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cct_database

# JWT
JWT_SECRET=change-this-secret-key
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Email
EMAIL_HOST=mail.privateemail.com
EMAIL_PORT=587
EMAIL_USER=info.cct@ceylongrp.com
EMAIL_PASS=your-password
EOF
    echo "  [√] .env template created"
else
    echo "  [!] .env already exists (skipped)"
fi

echo ""
echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Next Steps:"
echo "  1. Copy code from BACKEND_COMPLETE_CODE_PART1.md"
echo "  2. Copy code from BACKEND_COMPLETE_CODE_PART2.md"
echo "  3. Copy code from BACKEND_COMPLETE_CODE_PART3.md"
echo "  4. Update .env with your MongoDB connection"
echo "  5. Run: npm run seed"
echo "  6. Run: npm run dev"
echo ""
echo "============================================"
echo ""
