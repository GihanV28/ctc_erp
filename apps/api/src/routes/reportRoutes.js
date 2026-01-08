const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/reports/stats:
 *   get:
 *     summary: Get report statistics
 *     tags: [Reports]
 */
router.get('/stats', hasPermission('reports:read'), reportController.getReportStats);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports with pagination and filtering
 *     tags: [Reports]
 */
router.get('/', hasPermission('reports:read'), reportController.getAllReports);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 */
router.get('/:id', hasPermission('reports:read'), reportController.getReport);

/**
 * @swagger
 * /api/reports/{id}/download:
 *   get:
 *     summary: Download report file
 *     tags: [Reports]
 */
router.get('/:id/download', hasPermission('reports:read'), reportController.downloadReport);

/**
 * @swagger
 * /api/reports/generate:
 *   post:
 *     summary: Generate a new report
 *     tags: [Reports]
 */
router.post('/generate', hasPermission('reports:write'), reportController.generateReport);

/**
 * @swagger
 * /api/reports/configure:
 *   post:
 *     summary: Get configuration options for report type
 *     tags: [Reports]
 */
router.post('/configure', hasPermission('reports:write'), reportController.configureReport);

/**
 * @swagger
 * /api/reports/{id}/email:
 *   post:
 *     summary: Email report to recipients
 *     tags: [Reports]
 */
router.post('/:id/email', hasPermission('reports:write'), reportController.emailReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete report
 *     tags: [Reports]
 */
router.delete('/:id', hasPermission('reports:write'), reportController.deleteReport);

module.exports = router;
