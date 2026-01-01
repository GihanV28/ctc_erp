require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./src/config/database');
const swaggerSpec = require('./src/config/swagger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// ===== DATABASE CONNECTION =====
connectDB();

// ===== SWAGGER DOCUMENTATION =====
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Ceylon Cargo Transport API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===== API ROUTES =====
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/roles', require('./src/routes/roleRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));
app.use('/api/containers', require('./src/routes/containerRoutes'));
app.use('/api/suppliers', require('./src/routes/supplierRoutes'));
app.use('/api/shipments', require('./src/routes/shipmentRoutes'));
app.use('/api/tracking', require('./src/routes/trackingRoutes'));
app.use('/api/invoices', require('./src/routes/invoiceRoutes'));
app.use('/api/support', require('./src/routes/supportRoutes'));

// ===== 404 HANDLER =====
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use(errorHandler);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
============================================
  Ceylon Cargo Transport API Server
============================================
  Status: Running
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  URL: http://localhost:${PORT}
  API Docs: http://localhost:${PORT}/api-docs
============================================
  `);
});

// ===== UNHANDLED REJECTION HANDLER =====
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});