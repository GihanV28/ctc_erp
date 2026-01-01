const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 */
router.get('/', hasPermission('clients:read'), clientController.getAllClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 */
router.get('/:id', hasPermission('clients:read'), clientController.getClient);

/**
 * @swagger
 * /api/clients/{id}/stats:
 *   get:
 *     summary: Get client statistics
 *     tags: [Clients]
 */
router.get(
  '/:id/stats',
  hasPermission('clients:read'),
  clientController.getClientStats
);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create new client
 *     tags: [Clients]
 */
router.post('/', hasPermission('clients:write'), clientController.createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
 */
router.put(
  '/:id',
  hasPermission('clients:write'),
  clientController.updateClient
);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     tags: [Clients]
 */
router.delete(
  '/:id',
  hasPermission('clients:write'),
  clientController.deleteClient
);

module.exports = router;