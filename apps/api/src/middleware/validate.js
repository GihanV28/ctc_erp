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

module.exports = { validate };