const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/expenses/categories:
 *   get:
 *     summary: Get all expense categories
 *     tags: [Expenses]
 */
router.get('/categories', hasPermission('financials:read'), expenseController.getExpenseCategories);

/**
 * @swagger
 * /api/expenses/categories:
 *   post:
 *     summary: Create new expense category
 *     tags: [Expenses]
 */
router.post('/categories', hasPermission('financials:write'), expenseController.createExpenseCategory);

/**
 * @swagger
 * /api/expenses/categories/{id}:
 *   delete:
 *     summary: Delete expense category
 *     tags: [Expenses]
 */
router.delete('/categories/:id', hasPermission('financials:write'), expenseController.deleteExpenseCategory);

/**
 * @swagger
 * /api/expenses/stats:
 *   get:
 *     summary: Get expense statistics
 *     tags: [Expenses]
 */
router.get('/stats', hasPermission('financials:read'), expenseController.getExpenseStats);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 */
router.get('/', hasPermission('financials:read'), expenseController.getAllExpenses);

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get expense by ID
 *     tags: [Expenses]
 */
router.get('/:id', hasPermission('financials:read'), expenseController.getExpense);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create new expense
 *     tags: [Expenses]
 */
router.post('/', hasPermission('financials:write'), expenseController.createExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update expense
 *     tags: [Expenses]
 */
router.put('/:id', hasPermission('financials:write'), expenseController.updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     tags: [Expenses]
 */
router.delete('/:id', hasPermission('financials:write'), expenseController.deleteExpense);

module.exports = router;
