const Joi = require('joi');

exports.createContainerValidator = Joi.object({
  containerNumber: Joi.string().required().uppercase().trim()
    .messages({
      'string.empty': 'Container number is required',
      'any.required': 'Container number is required',
    }),
  type: Joi.string()
    .valid('20ft_standard', '40ft_standard', '40ft_high_cube', '20ft_high_cube', '40ft_refrigerated', '20ft_refrigerated')
    .required()
    .messages({
      'any.only': 'Invalid container type',
      'any.required': 'Container type is required',
    }),
  location: Joi.string().optional().allow(''),
  condition: Joi.string()
    .valid('excellent', 'good', 'fair', 'poor')
    .optional()
    .default('good'),
  purchaseDate: Joi.date().optional(),
  purchasePrice: Joi.number().min(0).optional(),
});

exports.updateContainerValidator = Joi.object({
  type: Joi.string()
    .valid('20ft_standard', '40ft_standard', '40ft_high_cube', '20ft_high_cube', '40ft_refrigerated', '20ft_refrigerated')
    .optional(),
  status: Joi.string()
    .valid('available', 'in_use', 'maintenance', 'damaged')
    .optional(),
  location: Joi.string().optional().allow(''),
  condition: Joi.string()
    .valid('excellent', 'good', 'fair', 'poor')
    .optional(),
  lastInspectionDate: Joi.date().optional(),
  purchaseDate: Joi.date().optional(),
  purchasePrice: Joi.number().min(0).optional(),
  currentShipment: Joi.string().optional().allow('', null),
});
