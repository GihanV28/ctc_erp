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

    // Check if user has any of the required permissions
    for (const permission of permissions) {
      const hasPermission = await req.user.hasPermission(permission);
      if (hasPermission) {
        return next(); // User has at least one permission
      }
    }

    return next(
      new ApiError('You do not have any of the required permissions', 403)
    );
  });
};