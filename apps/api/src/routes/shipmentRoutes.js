const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/shipments/stats:
 *   get:
 *     summary: Get shipment statistics
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shipment statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         active:
 *                           type: number
 *                         delivered:
 *                           type: number
 *                         delayed:
 *                           type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/stats',
  hasAnyPermission('shipments:read', 'shipments:read:own'),
  shipmentController.getShipmentStats
);

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments with pagination
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, in_transit, customs, out_for_delivery, delivered, cancelled, on_hold]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by shipment ID or tracking number
 *     responses:
 *       200:
 *         description: Shipments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  hasAnyPermission('shipments:read', 'shipments:read:own'),
  shipmentController.getAllShipments
);

/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ObjectId
 *     responses:
 *       200:
 *         description: Shipment retrieved successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/:id',
  hasAnyPermission('shipments:read', 'shipments:read:own'),
  shipmentController.getShipment
);

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create new shipment
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - origin
 *               - destination
 *               - cargo
 *             properties:
 *               client:
 *                 type: string
 *                 description: Client ObjectId
 *               origin:
 *                 type: object
 *                 properties:
 *                   port:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               destination:
 *                 type: object
 *                 properties:
 *                   port:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               cargo:
 *                 type: object
 *                 properties:
 *                   description:
 *                     type: string
 *                   weight:
 *                     type: number
 *                   volume:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   containerType:
 *                     type: string
 *               dates:
 *                 type: object
 *                 properties:
 *                   bookingDate:
 *                     type: string
 *                     format: date-time
 *                   departureDate:
 *                     type: string
 *                     format: date-time
 *                   estimatedArrival:
 *                     type: string
 *                     format: date-time
 *               supplier:
 *                 type: string
 *                 description: Supplier ObjectId
 *               totalCost:
 *                 type: number
 *               currency:
 *                 type: string
 *                 default: USD
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  hasPermission('shipments:write'),
  shipmentController.createShipment
);

/**
 * @swagger
 * /api/shipments/{id}:
 *   put:
 *     summary: Update shipment
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Shipment updated successfully
 *       400:
 *         description: Cannot update delivered or cancelled shipments
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  '/:id',
  hasPermission('shipments:write'),
  shipmentController.updateShipment
);

/**
 * @swagger
 * /api/shipments/{id}/cancel:
 *   put:
 *     summary: Cancel shipment
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment cancelled successfully
 *       400:
 *         description: Cannot cancel delivered shipment
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  '/:id/cancel',
  hasPermission('shipments:write'),
  shipmentController.cancelShipment
);

/**
 * @swagger
 * /api/shipments/{id}:
 *   delete:
 *     summary: Delete shipment
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment deleted successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
  '/:id',
  hasPermission('shipments:write'),
  shipmentController.deleteShipment
);

module.exports = router;