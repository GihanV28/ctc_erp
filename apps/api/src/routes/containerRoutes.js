const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/containers/available:
 *   get:
 *     summary: Get available containers
 *     tags: [Containers]
 */
router.get(
  '/available',
  hasPermission('containers:read'),
  containerController.getAvailableContainers
);

/**
 * @swagger
 * /api/containers:
 *   get:
 *     summary: Get all containers
 *     tags: [Containers]
 */
router.get(
  '/',
  hasPermission('containers:read'),
  containerController.getAllContainers
);

/**
 * @swagger
 * /api/containers/{id}:
 *   get:
 *     summary: Get container by ID
 *     tags: [Containers]
 */
router.get(
  '/:id',
  hasPermission('containers:read'),
  containerController.getContainer
);

/**
 * @swagger
 * /api/containers:
 *   post:
 *     summary: Create new container
 *     tags: [Containers]
 */
router.post(
  '/',
  hasPermission('containers:write'),
  containerController.createContainer
);

/**
 * @swagger
 * /api/containers/{id}:
 *   put:
 *     summary: Update container
 *     tags: [Containers]
 */
router.put(
  '/:id',
  hasPermission('containers:write'),
  containerController.updateContainer
);

/**
 * @swagger
 * /api/containers/{id}:
 *   delete:
 *     summary: Delete container
 *     tags: [Containers]
 */
router.delete(
  '/:id',
  hasPermission('containers:write'),
  containerController.deleteContainer
);

module.exports = router;