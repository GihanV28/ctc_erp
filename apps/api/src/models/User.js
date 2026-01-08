const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String, // URL to avatar image
    },
    profilePhoto: {
      type: String, // URL to profile photo
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    companyInfo: {
      companyName: String,
      companyEmail: String,
      companyPhone: String,
      companyAddress: String,
      website: String,
      taxId: String,
      updatedAt: Date,
    },
    notificationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      shipmentUpdates: { type: Boolean, default: true },
      invoiceAlerts: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
      updatedAt: Date,
    },
    systemPreferences: {
      language: { type: String, default: 'English' },
      timezone: { type: String, default: 'Asia/Phnom_Penh (UTC+7:00)' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      currency: { type: String, default: 'USD ($)' },
      updatedAt: Date,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Role is required'],
    },
    userType: {
      type: String,
      enum: ['admin', 'client'],
      required: [true, 'User type is required'],
      default: 'client',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    lastLogin: Date,
    lastLoginIP: String,
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      // Required only for client users
    },
    permissions: {
      override: [
        {
          type: String, // Permissions explicitly granted
        },
      ],
      blocked: [
        {
          type: String, // Permissions explicitly denied
        },
      ],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [
      {
        token: String,
        expiresAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ status: 1 });
userSchema.index({ clientId: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1s to ensure token is always created after password change
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Check if user has permission
userSchema.methods.hasPermission = async function (permission) {
  // Check if permission is explicitly blocked
  if (this.permissions.blocked.includes(permission)) {
    return false;
  }

  // Check if permission is explicitly granted
  if (this.permissions.override.includes(permission)) {
    return true;
  }

  // Check role permissions
  await this.populate('role');
  if (!this.role) return false;

  // If role has wildcard permission
  if (this.role.permissions.includes('*')) {
    return true;
  }

  // Check if role has the specific permission
  return this.role.permissions.includes(permission);
};

// Get all user permissions (combined from role and overrides)
userSchema.methods.getAllPermissions = async function () {
  await this.populate('role');

  if (!this.role) return this.permissions.override || [];

  // If role has wildcard, return all permissions
  if (this.role.permissions.includes('*')) {
    return ['*'];
  }

  // Combine role permissions and overrides, exclude blocked
  const allPermissions = [...this.role.permissions, ...this.permissions.override];
  return allPermissions.filter((p) => !this.permissions.blocked.includes(p));
};

const User = mongoose.model('User', userSchema);

module.exports = User;
