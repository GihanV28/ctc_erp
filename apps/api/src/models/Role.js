const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z_]+$/, 'Role name must contain only lowercase letters and underscores'],
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userType: {
      type: String,
      enum: ['admin', 'client'],
      required: [true, 'User type is required'],
      default: 'client',
    },
    isSystem: {
      type: Boolean,
      default: false,
      // System roles cannot be deleted
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
roleSchema.index({ name: 1 });
roleSchema.index({ userType: 1 });

// Virtual for user count (will be populated when needed)
roleSchema.virtual('userCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'role',
  count: true,
});

// Static method to get all permissions
roleSchema.statics.getAllPermissions = function () {
  return [
    'users:read',
    'users:write',
    'users:permissions',
    'roles:read',
    'roles:write',
    'shipments:read',
    'shipments:write',
    'shipments:read:own',
    'containers:read',
    'containers:write',
    'clients:read',
    'clients:write',
    'suppliers:read',
    'suppliers:write',
    'tracking:read',
    'tracking:write',
    'tracking:read:own',
    'reports:read',
    'reports:write',
    'invoices:read',
    'invoices:write',
    'invoices:read:own',
    'support:read',
    'support:write',
    'support:read:own',
    'settings:read',
    'settings:write',
    'profile:read',
    'profile:write',
  ];
};

// Prevent deletion of system roles
roleSchema.pre('remove', function (next) {
  if (this.isSystem) {
    return next(new Error('Cannot delete system role'));
  }
  next();
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
