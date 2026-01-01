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
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

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

// Change password
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ApiError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new tokens
  const tokens = generateTokens(user._id);

  new ApiResponse(200, tokens, 'Password changed successfully').send(res);
});

// Forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not
    return new ApiResponse(200, null, 'If email exists, password reset link has been sent').send(res);
  }

  // Generate reset token
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // Send email with reset token
  const { sendPasswordResetEmail } = require('../services/emailService');
  try {
    await sendPasswordResetEmail(user, resetToken);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ApiError('Error sending email. Please try again later', 500));
  }

  new ApiResponse(200, null, 'Password reset link sent to email').send(res);
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash token
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError('Invalid or expired reset token', 400));
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new tokens
  const tokens = generateTokens(user._id);

  new ApiResponse(200, tokens, 'Password reset successfully').send(res);
});