const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/suppliers/by-service/{serviceType}:
 *   get:
 *     summary: Get suppliers by service type
 *     tags: [Suppliers]
 */
router.get(
  '/by-service/:serviceType',
  hasPermission('suppliers:read'),
  supplierController.getSuppliersByService
);

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 */
router.get(
  '/',
  hasPermission('suppliers:read'),
  supplierController.getAllSuppliers
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 */
router.get(
  '/:id',
  hasPermission('suppliers:read'),
  supplierController.getSupplier
);

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create new supplier
 *     tags: [Suppliers]
 */
router.post(
  '/',
  hasPermission('suppliers:write'),
  supplierController.createSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update supplier
 *     tags: [Suppliers]
 */
router.put(
  '/:id',
  hasPermission('suppliers:write'),
  supplierController.updateSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete supplier
 *     tags: [Suppliers]
 */
router.delete(
  '/:id',
  hasPermission('suppliers:write'),
  supplierController.deleteSupplier
);

module.exports = router;