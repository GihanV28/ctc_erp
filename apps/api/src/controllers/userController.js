const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { userType, status, page = 1, limit = 20, search } = req.query;

  // Build query
  const query = {};
  if (userType) query.userType = userType;
  if (status) query.status = status;

  // Search by name or email
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .populate('role')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  new ApiResponse(
    200,
    {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Users retrieved successfully'
  ).send(res);
});

// Get single user
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('role clientId');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, { user }, 'User retrieved successfully').send(res);
});

// Create user
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  new ApiResponse(201, { user }, 'User created successfully').send(res);
});

// Update user
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Don't allow password update through this endpoint
  delete req.body.password;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('role');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, { user }, 'User updated successfully').send(res);
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  new ApiResponse(200, null, 'User deleted successfully').send(res);
});