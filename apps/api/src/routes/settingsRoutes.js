const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Company Information routes (super_admin only)
router.get('/company', settingsController.getCompanyInfo);
router.put('/company', restrictTo('admin'), settingsController.updateCompanyInfo);

// User Profile routes
router.put('/profile', settingsController.updateProfile);
router.post(
  '/profile/photo',
  settingsController.upload.single('photo'),
  settingsController.uploadProfilePhoto
);
router.delete('/profile/photo', settingsController.deleteProfilePhoto);

// Notification Preferences routes
router.get('/notifications', settingsController.getNotifications);
router.put('/notifications', settingsController.updateNotifications);

// Security routes
router.put('/password', settingsController.changePassword);

// System Preferences routes (super_admin only)
router.get('/system', settingsController.getSystemPreferences);
router.put('/system', restrictTo('admin'), settingsController.updateSystemPreferences);

// Data Export route (super_admin only)
router.get('/export', restrictTo('admin'), settingsController.exportData);

module.exports = router;
