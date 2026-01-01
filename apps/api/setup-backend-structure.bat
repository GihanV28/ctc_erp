@echo off
REM ===================================================
REM Ceylon Cargo Transport - Backend Structure Setup
REM Windows Batch Script
REM ===================================================

echo.
echo ============================================
echo   CCT Backend Structure Setup
echo ============================================
echo.

cd /d "%~dp0"

echo Creating directory structure...
echo.

REM Create all directories
mkdir src\config 2>nul
mkdir src\models 2>nul
mkdir src\middleware 2>nul
mkdir src\utils 2>nul
mkdir src\services 2>nul
mkdir src\validators 2>nul
mkdir src\controllers 2>nul
mkdir src\routes 2>nul
mkdir src\scripts 2>nul

echo [√] Directories created
echo.

REM ===== CONFIG FILES =====
echo Creating config files...

if not exist "src\config\constants.js" (
    echo // Constants and enumerations > src\config\constants.js
    echo module.exports = {}; >> src\config\constants.js
    echo   [√] constants.js
)

if not exist "src\config\swagger.js" (
    echo // Swagger configuration > src\config\swagger.js
    echo module.exports = {}; >> src\config\swagger.js
    echo   [√] swagger.js
)

REM ===== MODEL FILES =====
echo.
echo Creating model files...

if not exist "src\models\Container.js" (
    echo // Container model > src\models\Container.js
    echo   [√] Container.js
)

if not exist "src\models\Supplier.js" (
    echo // Supplier model > src\models\Supplier.js
    echo   [√] Supplier.js
)

if not exist "src\models\Shipment.js" (
    echo // Shipment model > src\models\Shipment.js
    echo   [√] Shipment.js
)

if not exist "src\models\TrackingUpdate.js" (
    echo // TrackingUpdate model > src\models\TrackingUpdate.js
    echo   [√] TrackingUpdate.js
)

if not exist "src\models\Invoice.js" (
    echo // Invoice model > src\models\Invoice.js
    echo   [√] Invoice.js
)

if not exist "src\models\SupportTicket.js" (
    echo // SupportTicket model > src\models\SupportTicket.js
    echo   [√] SupportTicket.js
)

if not exist "src\models\Settings.js" (
    echo // Settings model > src\models\Settings.js
    echo   [√] Settings.js
)

REM ===== MIDDLEWARE FILES =====
echo.
echo Creating middleware files...

if not exist "src\middleware\auth.js" (
    echo // Authentication middleware > src\middleware\auth.js
    echo   [√] auth.js
)

if not exist "src\middleware\rbac.js" (
    echo // Role-based access control middleware > src\middleware\rbac.js
    echo   [√] rbac.js
)

if not exist "src\middleware\errorHandler.js" (
    echo // Global error handler > src\middleware\errorHandler.js
    echo   [√] errorHandler.js
)

if not exist "src\middleware\validate.js" (
    echo // Validation middleware > src\middleware\validate.js
    echo   [√] validate.js
)

REM ===== UTILS FILES =====
echo.
echo Creating utility files...

if not exist "src\utils\jwt.js" (
    echo // JWT utilities > src\utils\jwt.js
    echo   [√] jwt.js
)

if not exist "src\utils\ApiError.js" (
    echo // Custom API Error class > src\utils\ApiError.js
    echo   [√] ApiError.js
)

if not exist "src\utils\ApiResponse.js" (
    echo // API Response wrapper > src\utils\ApiResponse.js
    echo   [√] ApiResponse.js
)

if not exist "src\utils\asyncHandler.js" (
    echo // Async handler wrapper > src\utils\asyncHandler.js
    echo   [√] asyncHandler.js
)

REM ===== SERVICES FILES =====
echo.
echo Creating service files...

if not exist "src\services\emailService.js" (
    echo // Email service > src\services\emailService.js
    echo   [√] emailService.js
)

REM ===== VALIDATORS FILES =====
echo.
echo Creating validator files...

if not exist "src\validators\authValidators.js" (
    echo // Auth validators > src\validators\authValidators.js
    echo   [√] authValidators.js
)

if not exist "src\validators\userValidators.js" (
    echo // User validators > src\validators\userValidators.js
    echo   [√] userValidators.js
)

REM ===== CONTROLLER FILES =====
echo.
echo Creating controller files...

if not exist "src\controllers\authController.js" (
    echo // Auth controller > src\controllers\authController.js
    echo   [√] authController.js
)

if not exist "src\controllers\userController.js" (
    echo // User controller > src\controllers\userController.js
    echo   [√] userController.js
)

if not exist "src\controllers\roleController.js" (
    echo // Role controller > src\controllers\roleController.js
    echo   [√] roleController.js
)

if not exist "src\controllers\clientController.js" (
    echo // Client controller > src\controllers\clientController.js
    echo   [√] clientController.js
)

if not exist "src\controllers\containerController.js" (
    echo // Container controller > src\controllers\containerController.js
    echo   [√] containerController.js
)

if not exist "src\controllers\supplierController.js" (
    echo // Supplier controller > src\controllers\supplierController.js
    echo   [√] supplierController.js
)

if not exist "src\controllers\shipmentController.js" (
    echo // Shipment controller > src\controllers\shipmentController.js
    echo   [√] shipmentController.js
)

if not exist "src\controllers\trackingController.js" (
    echo // Tracking controller > src\controllers\trackingController.js
    echo   [√] trackingController.js
)

if not exist "src\controllers\invoiceController.js" (
    echo // Invoice controller > src\controllers\invoiceController.js
    echo   [√] invoiceController.js
)

if not exist "src\controllers\supportController.js" (
    echo // Support controller > src\controllers\supportController.js
    echo   [√] supportController.js
)

REM ===== ROUTE FILES =====
echo.
echo Creating route files...

if not exist "src\routes\authRoutes.js" (
    echo // Auth routes > src\routes\authRoutes.js
    echo   [√] authRoutes.js
)

if not exist "src\routes\userRoutes.js" (
    echo // User routes > src\routes\userRoutes.js
    echo   [√] userRoutes.js
)

if not exist "src\routes\roleRoutes.js" (
    echo // Role routes > src\routes\roleRoutes.js
    echo   [√] roleRoutes.js
)

if not exist "src\routes\clientRoutes.js" (
    echo // Client routes > src\routes\clientRoutes.js
    echo   [√] clientRoutes.js
)

if not exist "src\routes\containerRoutes.js" (
    echo // Container routes > src\routes\containerRoutes.js
    echo   [√] containerRoutes.js
)

if not exist "src\routes\supplierRoutes.js" (
    echo // Supplier routes > src\routes\supplierRoutes.js
    echo   [√] supplierRoutes.js
)

if not exist "src\routes\shipmentRoutes.js" (
    echo // Shipment routes > src\routes\shipmentRoutes.js
    echo   [√] shipmentRoutes.js
)

if not exist "src\routes\trackingRoutes.js" (
    echo // Tracking routes > src\routes\trackingRoutes.js
    echo   [√] trackingRoutes.js
)

if not exist "src\routes\invoiceRoutes.js" (
    echo // Invoice routes > src\routes\invoiceRoutes.js
    echo   [√] invoiceRoutes.js
)

if not exist "src\routes\supportRoutes.js" (
    echo // Support routes > src\routes\supportRoutes.js
    echo   [√] supportRoutes.js
)

REM ===== SCRIPTS FOLDER =====
echo.
echo Creating scripts directory for seed file...
echo   [√] scripts directory ready

REM ===== ENV FILE =====
echo.
if not exist ".env" (
    echo Creating .env template...
    echo # Server Configuration > .env
    echo NODE_ENV=development >> .env
    echo PORT=5000 >> .env
    echo. >> .env
    echo # Database >> .env
    echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cct_database >> .env
    echo. >> .env
    echo # JWT >> .env
    echo JWT_SECRET=change-this-secret-key >> .env
    echo JWT_ACCESS_EXPIRATION=1h >> .env
    echo JWT_REFRESH_EXPIRATION=7d >> .env
    echo. >> .env
    echo # Email >> .env
    echo EMAIL_HOST=mail.privateemail.com >> .env
    echo EMAIL_PORT=587 >> .env
    echo EMAIL_USER=info.cct@ceylongrp.com >> .env
    echo EMAIL_PASS=your-password >> .env
    echo   [√] .env template created
) else (
    echo   [!] .env already exists (skipped)
)

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo   1. Copy code from BACKEND_COMPLETE_CODE_PART1.md
echo   2. Copy code from BACKEND_COMPLETE_CODE_PART2.md
echo   3. Copy code from BACKEND_COMPLETE_CODE_PART3.md
echo   4. Update .env with your MongoDB connection
echo   5. Run: npm run seed
echo   6. Run: npm run dev
echo.
echo ============================================
echo.

pause
