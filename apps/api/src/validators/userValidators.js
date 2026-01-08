const Joi = require('joi');

exports.createUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().optional().allow(''),
  role: Joi.string().required(), // Changed from roleId to role to match frontend
  userType: Joi.string().valid('admin', 'client').required(),
  clientId: Joi.string().when('userType', {
    is: 'client',
    then: Joi.required(),
    otherwise: Joi.optional().allow('', null), // Allow empty string and null for admin users
  }),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').optional(),
});

exports.updateUserValidator = Joi.object({
  email: Joi.string().email().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional().allow(''),
  role: Joi.string().optional(), // Changed from roleId to role to match frontend
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').optional(),
  clientId: Joi.string().optional(),
});