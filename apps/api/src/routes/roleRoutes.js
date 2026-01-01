const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/roles/permissions:
 *   get:
 *     summary: Get all available permissions
 *     tags: [Roles]
 */
router.get(
  '/permissions',
  hasPermission('roles:read'),
  roleController.getAllPermissions
);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 */
router.get('/', hasPermission('roles:read'), roleController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 */
router.get('/:id', hasPermission('roles:read'), roleController.getRole);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create new role
 *     tags: [Roles]
 */
router.post('/', hasPermission('roles:write'), roleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 */
router.put('/:id', hasPermission('roles:write'), roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 */
router.delete('/:id', hasPermission('roles:write'), roleController.deleteRole);

module.exports = router;