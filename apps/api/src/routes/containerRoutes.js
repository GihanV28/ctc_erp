const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { createContainerValidator, updateContainerValidator } = require('../validators/containerValidators');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/containers/stats:
 *   get:
 *     summary: Get container statistics
 *     tags: [Containers]
 */
router.get(
  '/stats',
  hasPermission('containers:read'),
  containerController.getContainerStats
);

/**
 * @swagger
 * /api/containers/available/list:
 *   get:
 *     summary: Get available containers for dropdown
 *     tags: [Containers]
 */
router.get(
  '/available/list',
  hasPermission('shipments:write'),
  containerController.getAvailableContainers
);

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
  validate(createContainerValidator),
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
  validate(updateContainerValidator),
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