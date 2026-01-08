const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/income/sources:
 *   get:
 *     summary: Get all income sources
 *     tags: [Income]
 */
router.get('/sources', hasPermission('financials:read'), incomeController.getIncomeSources);

/**
 * @swagger
 * /api/income/sources:
 *   post:
 *     summary: Create new income source
 *     tags: [Income]
 */
router.post('/sources', hasPermission('financials:write'), incomeController.createIncomeSource);

/**
 * @swagger
 * /api/income/sources/{id}:
 *   delete:
 *     summary: Delete income source
 *     tags: [Income]
 */
router.delete('/sources/:id', hasPermission('financials:write'), incomeController.deleteIncomeSource);

/**
 * @swagger
 * /api/income/stats:
 *   get:
 *     summary: Get income statistics
 *     tags: [Income]
 */
router.get('/stats', hasPermission('financials:read'), incomeController.getIncomeStats);

/**
 * @swagger
 * /api/income:
 *   get:
 *     summary: Get all income records
 *     tags: [Income]
 */
router.get('/', hasPermission('financials:read'), incomeController.getAllIncome);

/**
 * @swagger
 * /api/income/{id}:
 *   get:
 *     summary: Get income record by ID
 *     tags: [Income]
 */
router.get('/:id', hasPermission('financials:read'), incomeController.getIncome);

/**
 * @swagger
 * /api/income:
 *   post:
 *     summary: Create new income record
 *     tags: [Income]
 */
router.post('/', hasPermission('financials:write'), incomeController.createIncome);

/**
 * @swagger
 * /api/income/{id}:
 *   put:
 *     summary: Update income record
 *     tags: [Income]
 */
router.put('/:id', hasPermission('financials:write'), incomeController.updateIncome);

/**
 * @swagger
 * /api/income/{id}/payment:
 *   post:
 *     summary: Record payment for income
 *     tags: [Income]
 */
router.post('/:id/payment', hasPermission('financials:write'), incomeController.recordPayment);

/**
 * @swagger
 * /api/income/{id}:
 *   delete:
 *     summary: Delete income record
 *     tags: [Income]
 */
router.delete('/:id', hasPermission('financials:write'), incomeController.deleteIncome);

module.exports = router;
