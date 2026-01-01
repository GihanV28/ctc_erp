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

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

exports.resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
    }),
});

// Aliases for route compatibility
exports.registerValidator = exports.registerSchema;
exports.loginValidator = exports.loginSchema;
exports.changePasswordValidator = exports.changePasswordSchema;
exports.forgotPasswordValidator = exports.forgotPasswordSchema;
exports.resetPasswordValidator = exports.resetPasswordSchema;