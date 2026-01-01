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