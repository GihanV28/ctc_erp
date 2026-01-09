const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/invoices/stats:
 *   get:
 *     summary: Get invoice statistics
 *     tags: [Invoices]
 */
router.get(
  '/stats',
  hasAnyPermission(['invoices:read', 'invoices:read:own']),
  invoiceController.getInvoiceStats
);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 */
router.get(
  '/',
  hasAnyPermission(['invoices:read', 'invoices:read:own']),
  invoiceController.getAllInvoices
);

/**
 * @swagger
 * /api/invoices/shipment/{shipmentId}/preview:
 *   get:
 *     summary: Preview invoice data for a shipment
 *     tags: [Invoices]
 */
router.get(
  '/shipment/:shipmentId/preview',
  hasAnyPermission(['invoices:read', 'invoices:read:own', 'shipments:read']),
  invoiceController.previewShipmentInvoice
);

/**
 * @swagger
 * /api/invoices/shipment/{shipmentId}/pdf:
 *   get:
 *     summary: Generate and download invoice PDF for a shipment
 *     tags: [Invoices]
 */
router.get(
  '/shipment/:shipmentId/pdf',
  hasAnyPermission(['invoices:read', 'invoices:read:own', 'shipments:read']),
  invoiceController.generateShipmentInvoicePDF
);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 */
router.get(
  '/:id',
  hasAnyPermission(['invoices:read', 'invoices:read:own']),
  invoiceController.getInvoice
);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create new invoice
 *     tags: [Invoices]
 */
router.post(
  '/',
  hasPermission('invoices:write'),
  invoiceController.createInvoice
);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [Invoices]
 */
router.put(
  '/:id',
  hasPermission('invoices:write'),
  invoiceController.updateInvoice
);

/**
 * @swagger
 * /api/invoices/{id}/pay:
 *   put:
 *     summary: Mark invoice as paid
 *     tags: [Invoices]
 */
router.put(
  '/:id/pay',
  hasPermission('invoices:write'),
  invoiceController.markInvoiceAsPaid
);

/**
 * @swagger
 * /api/invoices/{id}/cancel:
 *   put:
 *     summary: Cancel invoice
 *     tags: [Invoices]
 */
router.put(
  '/:id/cancel',
  hasPermission('invoices:write'),
  invoiceController.cancelInvoice
);

module.exports = router;