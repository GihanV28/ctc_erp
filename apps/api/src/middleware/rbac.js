const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Check if user has specific permission
exports.hasPermission = (...permissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }

    // Populate role if not already populated
    if (!req.user.role.permissions) {
      await req.user.populate('role');
    }

    // Check each required permission
    for (const permission of permissions) {
      const hasPermission = await req.user.hasPermission(permission);

      if (!hasPermission) {
        return next(
          new ApiError(`You do not have permission: ${permission}`, 403)
        );
      }
    }

    next();
  });
};

// Check if user has ANY of the permissions
exports.hasAnyPermission = (...permissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }

    // Populate role if not already populated
    if (!req.user.role.permissions) {
      await req.user.populate('role');
    }

    // Debug logging
    console.log('[RBAC Debug] User:', req.user.email);
    console.log('[RBAC Debug] User Type:', req.user.userType);
    console.log('[RBAC Debug] Required permissions (any of):', permissions);
    console.log('[RBAC Debug] User role:', req.user.role?.name);
    console.log('[RBAC Debug] User role permissions:', req.user.role?.permissions);

    // Check if user has any of the required permissions
    for (const permission of permissions) {
      const hasPermission = await req.user.hasPermission(permission);
      console.log(`[RBAC Debug] Check ${permission}:`, hasPermission);
      if (hasPermission) {
        console.log('[RBAC Debug] ✅ Permission granted');
        return next(); // User has at least one permission
      }
    }

    console.log('[RBAC Debug] ❌ No matching permissions found');
    return next(
      new ApiError('You do not have any of the required permissions', 403)
    );
  });
};