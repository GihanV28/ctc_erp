const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

/**
 * @swagger
 * /api/tracking/public/{trackingNumber}:
 *   get:
 *     summary: Get tracking by tracking number (public)
 *     tags: [Tracking]
 */
router.get('/public/:trackingNumber', trackingController.getTrackingByNumber);

// All routes below require authentication
router.use(auth);

/**
 * @swagger
 * /api/tracking/active-shipments:
 *   get:
 *     summary: Get active shipments for tracking page
 *     tags: [Tracking]
 */
router.get(
  '/active-shipments',
  hasAnyPermission(['tracking:read', 'tracking:read:own']),
  trackingController.getActiveShipments
);

/**
 * @swagger
 * /api/tracking/all:
 *   get:
 *     summary: Get all tracking updates (across all shipments)
 *     tags: [Tracking]
 */
router.get(
  '/all',
  hasAnyPermission(['tracking:read', 'tracking:read:own']),
  trackingController.getAllTrackingUpdates
);

/**
 * @swagger
 * /api/tracking/shipment/{shipmentId}:
 *   get:
 *     summary: Get tracking updates for a shipment
 *     tags: [Tracking]
 */
router.get(
  '/shipment/:shipmentId',
  hasAnyPermission(['tracking:read', 'tracking:read:own']),
  trackingController.getShipmentTracking
);

/**
 * @swagger
 * /api/tracking:
 *   post:
 *     summary: Create tracking update
 *     tags: [Tracking]
 */
router.post(
  '/',
  hasPermission('tracking:write'),
  trackingController.createTrackingUpdate
);

/**
 * @swagger
 * /api/tracking/{id}:
 *   put:
 *     summary: Update tracking update
 *     tags: [Tracking]
 */
router.put(
  '/:id',
  hasPermission('tracking:write'),
  trackingController.updateTrackingUpdate
);

/**
 * @swagger
 * /api/tracking/{id}:
 *   delete:
 *     summary: Delete tracking update
 *     tags: [Tracking]
 */
router.delete(
  '/:id',
  hasPermission('tracking:write'),
  trackingController.deleteTrackingUpdate
);

module.exports = router;
