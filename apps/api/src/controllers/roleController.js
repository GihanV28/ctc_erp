const Role = require('../models/Role');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Private (roles:read)
 */
exports.getAllRoles = asyncHandler(async (req, res) => {
  const { userType, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  if (userType) query.userType = userType;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { displayName: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const roles = await Role.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userCount'); // Virtual field

  const total = await Role.countDocuments(query);

  new ApiResponse(200, {
    roles,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }, 'Roles fetched successfully').send(res);
});

/**
 * @desc    Get single role
 * @route   GET /api/roles/:id
 * @access  Private (roles:read)
 */
exports.getRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id).populate('userCount');

  if (!role) {
    throw new ApiError('Role not found', 404);
  }

  new ApiResponse(200, { role }, 'Role fetched successfully').send(res);
});

/**
 * @desc    Create new role
 * @route   POST /api/roles
 * @access  Private (roles:write)
 */
exports.createRole = asyncHandler(async (req, res) => {
  const { name, displayName, description, userType, permissions } = req.body;

  // Check if role already exists
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    throw new ApiError('Role with this name already exists', 400);
  }

  const role = await Role.create({
    name,
    displayName,
    description,
    userType,
    permissions,
    isSystem: false,
  });

  new ApiResponse(201, { role }, 'Role created successfully').send(res.status(201));
});

/**
 * @desc    Update role
 * @route   PUT /api/roles/:id
 * @access  Private (roles:write)
 */
exports.updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    throw new ApiError('Role not found', 404);
  }

  // Prevent updating system roles unless user is super admin
  if (role.isSystem) {
    const isSuperAdmin = await req.user.hasPermission('*');
    if (!isSuperAdmin) {
      throw new ApiError('Cannot modify system role. Only Super Admin can modify system roles.', 403);
    }
  }

  const { displayName, description, permissions } = req.body;

  // Update fields
  if (displayName) role.displayName = displayName;
  if (description !== undefined) role.description = description;
  if (permissions) role.permissions = permissions;

  await role.save();

  new ApiResponse(200, { role }, 'Role updated successfully').send(res);
});

/**
 * @desc    Delete role
 * @route   DELETE /api/roles/:id
 * @access  Private (roles:write)
 */
exports.deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    throw new ApiError('Role not found', 404);
  }

  // Prevent deleting system roles unless user is super admin
  if (role.isSystem) {
    const isSuperAdmin = await req.user.hasPermission('*');
    if (!isSuperAdmin) {
      throw new ApiError('Cannot delete system role. Only Super Admin can delete system roles.', 403);
    }
  }

  // Check if role is assigned to any users
  const usersWithRole = await User.countDocuments({ role: role._id });
  if (usersWithRole > 0) {
    throw new ApiError(
      `Cannot delete role. ${usersWithRole} user(s) are assigned to this role`,
      400
    );
  }

  await role.deleteOne();

  new ApiResponse(200, null, 'Role deleted successfully').send(res);
});

/**
 * @desc    Get all available permissions
 * @route   GET /api/roles/permissions
 * @access  Private (roles:read)
 */
exports.getAllPermissions = asyncHandler(async (req, res) => {
  const permissions = Role.getAllPermissions();

  new ApiResponse(200, { permissions }, 'Permissions fetched successfully').send(res);
});