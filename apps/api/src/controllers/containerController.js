const Container = require('../models/Container');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all containers
 * @route   GET /api/containers
 * @access  Private (containers:read)
 */
exports.getAllContainers = asyncHandler(async (req, res) => {
  const { status, containerType, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  if (status) query.status = status;
  if (containerType) query.type = containerType;
  if (search) {
    query.$or = [
      { containerNumber: { $regex: search, $options: 'i' } },
      { containerId: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const containers = await Container.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Container.countDocuments(query);

  new ApiResponse(200, {
    containers,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }, 'Containers fetched successfully').send(res);
});

/**
 * @desc    Get single container
 * @route   GET /api/containers/:id
 * @access  Private (containers:read)
 */
exports.getContainer = asyncHandler(async (req, res) => {
  const container = await Container.findById(req.params.id);

  if (!container) {
    throw new ApiError(404, 'Container not found');
  }

  new ApiResponse(200, { container }, 'Container fetched successfully').send(res);
});

/**
 * @desc    Create new container
 * @route   POST /api/containers
 * @access  Private (containers:write)
 */
exports.createContainer = asyncHandler(async (req, res) => {
  const {
    containerNumber,
    type,
    location,
    condition,
    purchaseDate,
    purchasePrice,
  } = req.body;

  // Check if container number already exists
  const existingContainer = await Container.findOne({ containerNumber });
  if (existingContainer) {
    throw new ApiError(400, 'Container with this number already exists');
  }

  const container = await Container.create({
    containerNumber,
    type,
    location,
    condition,
    purchaseDate,
    purchasePrice,
    status: 'available',
  });

  new ApiResponse(201, { container }, 'Container created successfully').send(res.status(201));
});

/**
 * @desc    Update container
 * @route   PUT /api/containers/:id
 * @access  Private (containers:write)
 */
exports.updateContainer = asyncHandler(async (req, res) => {
  const container = await Container.findById(req.params.id);

  if (!container) {
    throw new ApiError(404, 'Container not found');
  }

  // Check if container number is being changed and if it's already in use
  if (
    req.body.containerNumber &&
    req.body.containerNumber !== container.containerNumber
  ) {
    const existingContainer = await Container.findOne({
      containerNumber: req.body.containerNumber,
    });
    if (existingContainer) {
      throw new ApiError(400, 'Container number already in use');
    }
  }

  // Update fields
  const allowedUpdates = [
    'containerNumber',
    'type',
    'status',
    'location',
    'currentShipment',
    'condition',
    'lastInspectionDate',
    'purchaseDate',
    'purchasePrice',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      container[field] = req.body[field];
    }
  });

  await container.save();

  new ApiResponse(200, { container }, 'Container updated successfully').send(res);
});

/**
 * @desc    Delete container
 * @route   DELETE /api/containers/:id
 * @access  Private (containers:write)
 */
exports.deleteContainer = asyncHandler(async (req, res) => {
  const container = await Container.findById(req.params.id);

  if (!container) {
    throw new ApiError(404, 'Container not found');
  }

  // Check if container is currently in use
  if (container.status === 'in_use') {
    throw new ApiError(400, 'Cannot delete container that is currently in use');
  }

  // Check if container is assigned to any shipments
  const Shipment = require('../models/Shipment');
  const shipmentsCount = await Shipment.countDocuments({
    container: container._id,
  });
  if (shipmentsCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete container. ${shipmentsCount} shipment(s) are associated with this container`
    );
  }

  await container.deleteOne();

  new ApiResponse(200, null, 'Container deleted successfully').send(res);
});

/**
 * @desc    Get available containers
 * @route   GET /api/containers/available
 * @access  Private (containers:read)
 */
exports.getAvailableContainers = asyncHandler(async (req, res) => {
  const { containerType } = req.query;

  const query = { status: 'available' };
  if (containerType) query.type = containerType;

  const containers = await Container.find(query).sort({ containerNumber: 1 });

  new ApiResponse(200, { containers }, 'Available containers fetched successfully').send(res);
});