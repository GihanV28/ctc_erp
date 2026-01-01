# Ceylon Cargo Transport - Complete Backend Code Part 2

**Utilities, Services, Controllers, Routes, and Configuration**

---

## 🔧 **UTILITIES**

### **File:** `src/utils/ApiError.js`

\`\`\`javascript
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
\`\`\`

---

### **File:** `src/utils/ApiResponse.js`

\`\`\`javascript
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
\`\`\`

---

### **File:** `src/utils/asyncHandler.js`

\`\`\`javascript
// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
\`\`\`

---

### **File:** `src/utils/jwt.js`

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generate access token
exports.generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// Generate refresh token
exports.generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// Verify token
exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// Generate both tokens
exports.generateTokens = (userId) => {
  return {
    accessToken: exports.generateAccessToken(userId),
    refreshToken: exports.generateRefreshToken(userId),
  };
};
\`\`\`

---

### **File:** `src/middleware/errorHandler.js`

\`\`\`javascript
const ApiError = require('../utils/ApiError');

// Handle Mongoose validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(message, 400);
};

// Handle Mongoose duplicate key errors
const handleDuplicateKeyError = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown';
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new ApiError(message, 400);
};

// Handle Mongoose cast errors
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

// Handle JWT errors
const handleJWTError = () => new ApiError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () =>
  new ApiError('Your token has expired. Please log in again', 401);

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production error response
  let error = { ...err };
  error.message = err.message;

  // Mongoose errors
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'CastError') error = handleCastError(err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Operational, trusted error: send message to client
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Programming or unknown error: don't leak details
  console.error('ERROR 💥:', err);

  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};

module.exports = errorHandler;
\`\`\`

---

### **File:** `src/middleware/validate.js`

\`\`\`javascript
const ApiError = require('../utils/ApiError');

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Show all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return next(new ApiError(errors.join('. '), 400));
    }

    req.body = value; // Use validated/sanitized data
    next();
  };
};

module.exports = validate;
\`\`\`

---

## 📧 **SERVICES**

### **File:** `src/services/emailService.js`

\`\`\`javascript
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email
exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Ceylon Cargo Transport'}" <${
        process.env.SMTP_FROM
      }>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user, password) => {
  const subject = 'Welcome to Ceylon Cargo Transport';
  const html = `
    <h1>Welcome ${user.firstName}!</h1>
    <p>Your account has been created successfully.</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Temporary Password:</strong> ${password}</p>
    <p>Please log in and change your password immediately.</p>
    <p>Login at: ${process.env.ADMIN_URL || 'http://localhost:3001'}/login</p>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
  });
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.ADMIN_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;

  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset</h1>
    <p>Hi ${user.firstName},</p>
    <p>You requested to reset your password. Click the link below:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
  });
};

// Send shipment tracking update email
exports.sendTrackingUpdateEmail = async (client, shipment, trackingUpdate) => {
  const subject = `Shipment Update: ${shipment.shipmentId}`;
  const html = `
    <h1>Shipment Tracking Update</h1>
    <p>Hi ${client.contactPerson.firstName},</p>
    <p>Your shipment <strong>${shipment.trackingId}</strong> has been updated.</p>
    <p><strong>Status:</strong> ${trackingUpdate.status}</p>
    <p><strong>Location:</strong> ${trackingUpdate.location.name}, ${trackingUpdate.location.country}</p>
    <p><strong>Update:</strong> ${trackingUpdate.description}</p>
    <p>Track your shipment: ${process.env.CLIENT_URL}/shipments/${shipment._id}</p>
  `;

  return exports.sendEmail({
    to: client.contactPerson.email,
    subject,
    html,
  });
};
\`\`\`

---

## ✅ **VALIDATORS**

### **File:** `src/validators/authValidators.js`

\`\`\`javascript
const Joi = require('joi');

exports.registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Password is required',
    }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  phone: Joi.string().optional(),
  roleId: Joi.string().required().messages({
    'any.required': 'Role is required',
  }),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
    }),
});
\`\`\`

---

### **File:** `src/validators/userValidators.js`

\`\`\`javascript
const Joi = require('joi');

exports.createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().optional(),
  roleId: Joi.string().required(),
  userType: Joi.string().valid('admin', 'client').required(),
  clientId: Joi.string().when('userType', {
    is: 'client',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').default('pending'),
});

exports.updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  roleId: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').optional(),
  permissionsOverride: Joi.array().items(Joi.string()).optional(),
  permissionsBlocked: Joi.array().items(Joi.string()).optional(),
});
\`\`\`

---

## 🎮 **CONTROLLERS** (Partial - showing key ones)

### **File:** `src/controllers/authController.js`

\`\`\`javascript
const User = require('../models/User');
const Role = require('../models/Role');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateTokens } = require('../utils/jwt');
const { sendWelcomeEmail } = require('../services/emailService');

// Register new user
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, phone, roleId, userType, clientId } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError('Email already registered', 400));
  }

  // Verify role exists and matches user type
  const role = await Role.findById(roleId);
  if (!role) {
    return next(new ApiError('Invalid role', 400));
  }

  if (role.userType !== userType) {
    return next(new ApiError('Role does not match user type', 400));
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: roleId,
    userType,
    clientId: userType === 'client' ? clientId : undefined,
    status: 'pending',
  });

  // Send welcome email (don't wait for it)
  sendWelcomeEmail(user, password).catch((err) =>
    console.error('Failed to send welcome email:', err)
  );

  // Generate tokens
  const tokens = generateTokens(user._id);

  // Remove password from response
  user.password = undefined;

  new ApiResponse(201, { user, ...tokens }, 'User registered successfully').send(res);
});

// Login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new ApiError('Please provide email and password', 400));
  }

  // Find user and select password
  const user = await User.findOne({ email }).select('+password').populate('role');

  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }

  // Check if user is active
  if (user.status !== 'active') {
    return next(new ApiError('Your account is not active. Please contact support', 403));
  }

  // Update last login
  user.lastLogin = Date.now();
  user.lastLoginIP = req.ip;
  await user.save({ validateBeforeSave: false });

  // Generate tokens
  const tokens = generateTokens(user._id);

  // Remove password from response
  user.password = undefined;

  new ApiResponse(200, { user, ...tokens }, 'Logged in successfully').send(res);
});

// Get current user
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('role');

  new ApiResponse(200, { user }, 'User retrieved successfully').send(res);
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  // Clear refresh token from database
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshTokens: [] },
  });

  new ApiResponse(200, null, 'Logged out successfully').send(res);
});

// Refresh token
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError('Refresh token required', 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    new ApiResponse(200, tokens, 'Token refreshed successfully').send(res);
  } catch (error) {
    return next(new ApiError('Invalid refresh token', 401));
  }
});
\`\`\`

---

### **File:** `src/controllers/userController.js`

\`\`\`javascript
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { userType, status, page = 1, limit = 20, search } = req.query;

  // Build query
  const query = {};
  if (userType) query.userType = userType;
  if (status) query.status = status;

  // Search by name or email
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .populate('role')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  new ApiResponse(
    200,
    {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Users retrieved successfully'
  ).send(res);
});

// Get single user
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('role clientId');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, { user }, 'User retrieved successfully').send(res);
});

// Create user
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  new ApiResponse(201, { user }, 'User created successfully').send(res);
});

// Update user
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Don't allow password update through this endpoint
  delete req.body.password;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('role');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, { user }, 'User updated successfully').send(res);
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, null, 'User deleted successfully').send(res);
});
\`\`\`

---

**[CONTINUED IN NEXT FILE - MORE CONTROLLERS & ROUTES]**

This is Part 2. Should I create Part 3 with routes and final server.js integration?
