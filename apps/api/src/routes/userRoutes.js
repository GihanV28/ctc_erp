const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const {
  createUserValidator,
  updateUserValidator,
} = require('../validators/userValidators');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
router.get('/', hasPermission('users:read'), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 */
router.get('/:id', hasPermission('users:read'), userController.getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 */
router.post(
  '/',
  hasPermission('users:write'),
  validate(createUserValidator),
  userController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 */
router.put(
  '/:id',
  hasPermission('users:write'),
  validate(updateUserValidator),
  userController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
router.delete(
  '/:id',
  hasPermission('users:write'),
  userController.deleteUser
);

module.exports = router;