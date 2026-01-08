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

// User System Preferences routes (for all users)
router.get('/preferences', settingsController.getUserSystemPreferences);
router.put('/preferences', settingsController.updateUserSystemPreferences);

// Two-Factor Authentication
router.put('/2fa', settingsController.toggleTwoFactor);

// Account Management
router.put('/account/deactivate', settingsController.deactivateAccount);
router.delete('/account', settingsController.deleteAccount);

// Activity Log
router.get('/activity-log', settingsController.getActivityLog);

// Data Export routes
router.get('/export', restrictTo('admin'), settingsController.exportData);
router.get('/download-data', settingsController.downloadUserData);

module.exports = router;
