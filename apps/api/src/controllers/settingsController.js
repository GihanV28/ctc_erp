const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Update company information (super_admin only)
exports.updateCompanyInfo = asyncHandler(async (req, res, next) => {
  const { companyName, companyEmail, companyPhone, companyAddress, website, taxId } = req.body;

  // Check if user has super_admin role
  if (req.user.role?.name !== 'super_admin' && !req.user.role?.permissions?.includes('*:*')) {
    return next(new ApiError('Only super admin can update company information', 403));
  }

  // Store company info in user's metadata or create a separate Company model
  // For now, we'll store it in the user's profile
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Update company info (you might want to create a separate Company model)
  user.companyInfo = {
    companyName: companyName || user.companyInfo?.companyName,
    companyEmail: companyEmail || user.companyInfo?.companyEmail,
    companyPhone: companyPhone || user.companyInfo?.companyPhone,
    companyAddress: companyAddress || user.companyInfo?.companyAddress,
    website: website || user.companyInfo?.website,
    taxId: taxId || user.companyInfo?.taxId,
    updatedAt: new Date()
  };

  await user.save();

  new ApiResponse(200, { companyInfo: user.companyInfo }, 'Company information updated successfully').send(res);
});

// Get company information
exports.getCompanyInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, { companyInfo: user.companyInfo || {} }, 'Company information retrieved successfully').send(res);
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, bio, location, jobTitle } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError('Email already exists', 400));
    }
    user.email = email;
  }

  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (jobTitle !== undefined) user.jobTitle = jobTitle;

  await user.save();

  const updatedUser = await User.findById(user._id).populate('role').select('-password');

  new ApiResponse(200, { user: updatedUser }, 'Profile updated successfully').send(res);
});

// Upload profile photo
exports.uploadProfilePhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError('Please upload a photo', 400));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Delete old photo if exists
  if (user.profilePhoto) {
    const oldPhotoPath = path.join(__dirname, '../../uploads/profiles', path.basename(user.profilePhoto));
    try {
      await fs.unlink(oldPhotoPath);
    } catch (error) {
      console.log('Old photo not found or could not be deleted');
    }
  }

  // Save new photo path
  user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
  await user.save();

  new ApiResponse(200, { profilePhoto: user.profilePhoto }, 'Profile photo uploaded successfully').send(res);
});

// Delete profile photo
exports.deleteProfilePhoto = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Delete photo file if exists
  if (user.profilePhoto) {
    const photoPath = path.join(__dirname, '../../uploads/profiles', path.basename(user.profilePhoto));
    try {
      await fs.unlink(photoPath);
    } catch (error) {
      console.log('Photo file not found or could not be deleted');
    }
  }

  // Remove photo path from user
  user.profilePhoto = null;
  await user.save();

  new ApiResponse(200, null, 'Profile photo deleted successfully').send(res);
});

// Update notification preferences
exports.updateNotifications = asyncHandler(async (req, res, next) => {
  const {
    emailNotifications,
    pushNotifications,
    smsNotifications,
    shipmentUpdates,
    invoiceAlerts,
    systemUpdates,
    newsletter
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Update notification preferences
  user.notificationPreferences = {
    emailNotifications: emailNotifications !== undefined ? emailNotifications : user.notificationPreferences?.emailNotifications,
    pushNotifications: pushNotifications !== undefined ? pushNotifications : user.notificationPreferences?.pushNotifications,
    smsNotifications: smsNotifications !== undefined ? smsNotifications : user.notificationPreferences?.smsNotifications,
    shipmentUpdates: shipmentUpdates !== undefined ? shipmentUpdates : user.notificationPreferences?.shipmentUpdates,
    invoiceAlerts: invoiceAlerts !== undefined ? invoiceAlerts : user.notificationPreferences?.invoiceAlerts,
    systemUpdates: systemUpdates !== undefined ? systemUpdates : user.notificationPreferences?.systemUpdates,
    newsletter: newsletter !== undefined ? newsletter : user.notificationPreferences?.newsletter,
    updatedAt: new Date()
  };

  await user.save();

  new ApiResponse(200, { notificationPreferences: user.notificationPreferences }, 'Notification preferences updated successfully').send(res);
});

// Get notification preferences
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, { notificationPreferences: user.notificationPreferences || {} }, 'Notification preferences retrieved successfully').send(res);
});

// Change password
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ApiError('Please provide all required fields', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ApiError('New passwords do not match', 400));
  }

  if (newPassword.length < 6) {
    return next(new ApiError('Password must be at least 6 characters long', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Check current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    return next(new ApiError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  user.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is valid
  await user.save();

  new ApiResponse(200, {}, 'Password changed successfully').send(res);
});

// Update system preferences (super_admin only)
exports.updateSystemPreferences = asyncHandler(async (req, res, next) => {
  const { language, timezone, dateFormat, currency } = req.body;

  // Check if user has super_admin role
  if (req.user.role?.name !== 'super_admin' && !req.user.role?.permissions?.includes('*:*')) {
    return next(new ApiError('Only super admin can update system preferences', 403));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Update system preferences
  user.systemPreferences = {
    language: language || user.systemPreferences?.language || 'English',
    timezone: timezone || user.systemPreferences?.timezone || 'Asia/Bangkok',
    dateFormat: dateFormat || user.systemPreferences?.dateFormat || 'DD/MM/YYYY',
    currency: currency || user.systemPreferences?.currency || 'USD',
    updatedAt: new Date()
  };

  await user.save();

  new ApiResponse(200, { systemPreferences: user.systemPreferences }, 'System preferences updated successfully').send(res);
});

// Get system preferences
exports.getSystemPreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, {
    systemPreferences: user.systemPreferences || {
      language: 'English',
      timezone: 'Asia/Bangkok',
      dateFormat: 'DD/MM/YYYY',
      currency: 'USD'
    }
  }, 'System preferences retrieved successfully').send(res);
});

// Export all data (super_admin only)
exports.exportData = asyncHandler(async (req, res, next) => {
  // Check if user has super_admin role
  if (req.user.role?.name !== 'super_admin' && !req.user.role?.permissions?.includes('*:*')) {
    return next(new ApiError('Only super admin can export data', 403));
  }

  const Client = require('../models/Client');
  const Supplier = require('../models/Supplier');
  const Container = require('../models/Container');
  const Shipment = require('../models/Shipment');
  const Expense = require('../models/Expense');
  const Income = require('../models/Income');

  // Fetch all data
  const [users, clients, suppliers, containers, shipments, expenses, income] = await Promise.all([
    User.find().populate('role').select('-password'),
    Client.find(),
    Supplier.find(),
    Container.find(),
    Shipment.find(),
    Expense.find(),
    Income.find()
  ]);

  const exportData = {
    exportDate: new Date().toISOString(),
    exportedBy: {
      id: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email
    },
    data: {
      users: users.length,
      clients: clients.length,
      suppliers: suppliers.length,
      containers: containers.length,
      shipments: shipments.length,
      expenses: expenses.length,
      income: income.length
    },
    users,
    clients,
    suppliers,
    containers,
    shipments,
    expenses,
    income
  };

  new ApiResponse(200, exportData, 'Data exported successfully').send(res);
});

// Download user data (for regular users - their own data only)
exports.downloadUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('role').select('-password');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  const Shipment = require('../models/Shipment');

  // Build query for user's shipments
  const shipmentQuery = {};
  if (user.userType === 'client' && user.clientId) {
    shipmentQuery.client = user.clientId;
  }

  const shipments = user.userType === 'client' ? await Shipment.find(shipmentQuery) : [];

  const userData = {
    exportDate: new Date().toISOString(),
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      userType: user.userType,
      role: user.role.displayName,
      createdAt: user.createdAt,
      notificationPreferences: user.notificationPreferences,
      systemPreferences: user.systemPreferences
    },
    shipments: shipments.length,
    shipmentsData: shipments
  };

  new ApiResponse(200, userData, 'User data exported successfully').send(res);
});

// Update system preferences (for all users - their own preferences)
exports.updateUserSystemPreferences = asyncHandler(async (req, res, next) => {
  const { language, timezone, dateFormat, currency } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Update system preferences
  user.systemPreferences = {
    language: language || user.systemPreferences?.language || 'English',
    timezone: timezone || user.systemPreferences?.timezone || 'Asia/Bangkok',
    dateFormat: dateFormat || user.systemPreferences?.dateFormat || 'DD/MM/YYYY',
    currency: currency || user.systemPreferences?.currency || 'USD',
    updatedAt: new Date()
  };

  await user.save();

  new ApiResponse(200, { systemPreferences: user.systemPreferences }, 'Preferences updated successfully').send(res);
});

// Get user system preferences
exports.getUserSystemPreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, {
    systemPreferences: user.systemPreferences || {
      language: 'English',
      timezone: 'Asia/Bangkok',
      dateFormat: 'DD/MM/YYYY',
      currency: 'USD'
    }
  }, 'Preferences retrieved successfully').send(res);
});

// Toggle Two-Factor Authentication
exports.toggleTwoFactor = asyncHandler(async (req, res, next) => {
  const { enabled } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  user.twoFactorEnabled = enabled;

  // If enabling 2FA, generate a secret (simplified for now)
  if (enabled && !user.twoFactorSecret) {
    const crypto = require('crypto');
    user.twoFactorSecret = crypto.randomBytes(20).toString('hex');
  }

  await user.save();

  new ApiResponse(200, { twoFactorEnabled: user.twoFactorEnabled }, `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`).send(res);
});

// Deactivate account
exports.deactivateAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  user.status = 'inactive';
  await user.save();

  new ApiResponse(200, {}, 'Account deactivated successfully').send(res);
});

// Delete account
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new ApiError('Please provide your password to confirm deletion', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new ApiError('Incorrect password', 401));
  }

  // Mark as deleted instead of actual deletion (soft delete)
  user.status = 'suspended';
  user.email = `deleted_${Date.now()}_${user.email}`; // Prevent email conflicts
  await user.save();

  new ApiResponse(200, {}, 'Account deleted successfully').send(res);
});

// Get activity log
exports.getActivityLog = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('lastLogin lastLoginIP createdAt updatedAt');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  const activityLog = {
    lastLogin: user.lastLogin,
    lastLoginIP: user.lastLoginIP,
    accountCreated: user.createdAt,
    lastUpdated: user.updatedAt
  };

  new ApiResponse(200, { activityLog }, 'Activity log retrieved successfully').send(res);
});
