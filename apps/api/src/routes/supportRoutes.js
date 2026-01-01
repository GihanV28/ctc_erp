const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/support/stats:
 *   get:
 *     summary: Get support ticket statistics
 *     tags: [Support]
 */
router.get(
  '/stats',
  hasAnyPermission(['support:read', 'support:read:own']),
  supportController.getTicketStats
);

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Get all support tickets
 *     tags: [Support]
 */
router.get(
  '/',
  hasAnyPermission(['support:read', 'support:read:own']),
  supportController.getAllTickets
);

/**
 * @swagger
 * /api/support/{id}:
 *   get:
 *     summary: Get support ticket by ID
 *     tags: [Support]
 */
router.get(
  '/:id',
  hasAnyPermission(['support:read', 'support:read:own']),
  supportController.getTicket
);

/**
 * @swagger
 * /api/support:
 *   post:
 *     summary: Create new support ticket
 *     tags: [Support]
 */
router.post('/', supportController.createTicket);

/**
 * @swagger
 * /api/support/{id}:
 *   put:
 *     summary: Update support ticket
 *     tags: [Support]
 */
router.put(
  '/:id',
  hasPermission('support:write'),
  supportController.updateTicket
);

/**
 * @swagger
 * /api/support/{id}/messages:
 *   post:
 *     summary: Add message to support ticket
 *     tags: [Support]
 */
router.post('/:id/messages', supportController.addMessage);

/**
 * @swagger
 * /api/support/{id}/close:
 *   put:
 *     summary: Close support ticket
 *     tags: [Support]
 */
router.put(
  '/:id/close',
  hasPermission('support:write'),
  supportController.closeTicket
);

module.exports = router;