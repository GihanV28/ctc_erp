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
    .populate('currentShipment', 'shipmentId origin destination')
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
  const container = await Container.findById(req.params.id)
    .populate('currentShipment', 'shipmentId origin destination status');

  if (!container) {
    throw new ApiError('Container not found', 404);
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
    throw new ApiError('Container with this number already exists', 400);
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
    throw new ApiError('Container not found', 404);
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
      throw new ApiError('Container number already in use', 400);
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
    throw new ApiError('Container not found', 404);
  }

  // Check if container is currently in use
  if (container.status === 'in_use') {
    throw new ApiError('Cannot delete container that is currently in use', 400);
  }

  // Check if container is assigned to any shipments
  const Shipment = require('../models/Shipment');
  const shipmentsCount = await Shipment.countDocuments({
    container: container._id,
  });
  if (shipmentsCount > 0) {
    throw new ApiError(
      `Cannot delete container. ${shipmentsCount} shipment(s) are associated with this container`,
      400
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

/**
 * @desc    Get container statistics
 * @route   GET /api/containers/stats
 * @access  Private (containers:read)
 */
exports.getContainerStats = asyncHandler(async (req, res) => {
  const total = await Container.countDocuments();
  const available = await Container.countDocuments({ status: 'available' });
  const inUse = await Container.countDocuments({ status: 'in_use' });
  const maintenance = await Container.countDocuments({ status: 'maintenance' });
  const damaged = await Container.countDocuments({ status: 'damaged' });

  // Container type breakdown
  const typeBreakdown = await Container.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Condition breakdown
  const conditionBreakdown = await Container.aggregate([
    {
      $group: {
        _id: '$condition',
        count: { $sum: 1 }
      }
    }
  ]);

  new ApiResponse(200, {
    stats: {
      total,
      available,
      inUse,
      maintenance,
      damaged,
      typeBreakdown: typeBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      conditionBreakdown: conditionBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    }
  }, 'Container statistics fetched successfully').send(res);
});

/**
 * @desc    Get available containers for dropdown
 * @route   GET /api/containers/available/list
 * @access  Private (shipments:write)
 */
exports.getAvailableContainers = asyncHandler(async (req, res) => {
  const containers = await Container.find({ status: 'available' })
    .select('_id containerId containerNumber type condition location')
    .sort({ containerNumber: 1 });

  new ApiResponse(200, { containers }, 'Available containers fetched successfully').send(res);
});