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