const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new ApiError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).populate('role').select('+password');

    if (!user) {
      return next(new ApiError('User no longer exists', 401));
    }

    // Check if role exists (important after role changes)
    if (!user.role) {
      return next(new ApiError('User role not found. Please contact support or log in again', 401));
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(new ApiError('Your account is not active', 403));
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new ApiError('Password recently changed. Please log in again', 401));
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError('Token expired', 401));
    }
    return next(new ApiError('Not authorized to access this route', 401));
  }
});

// Restrict to specific user types
exports.restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return next(
        new ApiError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Check if user owns the resource (for clients)
exports.ownsResource = (resourceField = 'client') => {
  return async (req, res, next) => {
    // Admins can access any resource
    if (req.user.userType === 'admin') {
      return next();
    }

    // Clients can only access their own resources
    const resource = req.params.id
      ? await req.model.findById(req.params.id)
      : null;

    if (!resource) {
      return next(new ApiError('Resource not found', 404));
    }

    // Check if the resource belongs to the client
    const resourceClientId = resource[resourceField]?.toString();
    const userClientId = req.user.clientId?.toString();

    if (resourceClientId !== userClientId) {
      return next(
        new ApiError('You do not have permission to access this resource', 403)
      );
    }

    next();
  };
};

// Alias for protect (commonly used as 'auth')
exports.auth = exports.protect;