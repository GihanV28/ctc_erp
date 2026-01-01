const Shipment = require('../models/Shipment');
const TrackingUpdate = require('../models/TrackingUpdate');
const Container = require('../models/Container');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all shipments
 * @route   GET /api/shipments
 * @access  Private (shipments:read OR shipments:read:own)
 */
exports.getAllShipments = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};

  // If user has only shipments:read:own, filter by client
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('shipments:read'))
  ) {
    if (!req.user.clientId) {
      throw new ApiError(403, 'Client ID not found for user');
    }
    query.client = req.user.clientId;
  }

  if (status) query.status = status;
  if (search) {
    query.$or = [
      { shipmentId: { $regex: search, $options: 'i' } },
      { trackingNumber: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const shipments = await Shipment.find(query)
    .populate('client', 'clientId companyName contactPerson')
    .populate('supplier', 'supplierId name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Shipment.countDocuments(query);

  new ApiResponse(200, {
    shipments,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }, 'Shipments fetched successfully').send(res);
});

/**
 * @desc    Get single shipment
 * @route   GET /api/shipments/:id
 * @access  Private (shipments:read OR shipments:read:own)
 */
exports.getShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id)
    .populate('client', 'clientId companyName contactPerson address')
    .populate('supplier', 'supplierId name contactPerson')
    .populate('trackingUpdates');

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  // Check if user can access this shipment
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('shipments:read'))
  ) {
    if (shipment.client._id.toString() !== req.user.clientId.toString()) {
      throw new ApiError(403, 'You can only view your own shipments');
    }
  }

  res.json(
    new ApiResponse(200, 'Shipment fetched successfully', { shipment })
  );
});

/**
 * @desc    Create new shipment
 * @route   POST /api/shipments
 * @access  Private (shipments:write)
 */
exports.createShipment = asyncHandler(async (req, res) => {
  const {
    client,
    origin,
    destination,
    cargo,
    dates,
    supplier,
    totalCost,
    currency,
    notes,
  } = req.body;

  // Verify client exists
  const Client = require('../models/Client');
  const clientDoc = await Client.findById(client);
  if (!clientDoc) {
    throw new ApiError(404, 'Client not found');
  }

  // Verify supplier exists if provided
  if (supplier) {
    const Supplier = require('../models/Supplier');
    const supplierDoc = await Supplier.findById(supplier);
    if (!supplierDoc) {
      throw new ApiError(404, 'Supplier not found');
    }
  }

  // Create shipment
  const shipment = await Shipment.create({
    client,
    origin,
    destination,
    cargo,
    dates,
    supplier,
    totalCost,
    currency,
    notes,
    status: 'pending',
  });

  // Populate fields before returning
  await shipment.populate('client supplier');

  res
    .status(201)
    .json(new ApiResponse(201, 'Shipment created successfully', { shipment }));
});

/**
 * @desc    Update shipment
 * @route   PUT /api/shipments/:id
 * @access  Private (shipments:write)
 */
exports.updateShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  // Cannot update delivered or cancelled shipments
  if (['delivered', 'cancelled'].includes(shipment.status)) {
    throw new ApiError(
      400,
      `Cannot update shipment with status: ${shipment.status}`
    );
  }

  // Update fields
  const allowedUpdates = [
    'origin',
    'destination',
    'cargo',
    'dates',
    'supplier',
    'totalCost',
    'currency',
    'status',
    'notes',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      shipment[field] = req.body[field];
    }
  });

  await shipment.save();
  await shipment.populate('client supplier');

  res.json(
    new ApiResponse(200, 'Shipment updated successfully', { shipment })
  );
});

/**
 * @desc    Cancel shipment
 * @route   PUT /api/shipments/:id/cancel
 * @access  Private (shipments:write)
 */
exports.cancelShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  if (shipment.status === 'delivered') {
    throw new ApiError(400, 'Cannot cancel delivered shipment');
  }

  if (shipment.status === 'cancelled') {
    throw new ApiError(400, 'Shipment is already cancelled');
  }

  shipment.status = 'cancelled';
  await shipment.save();

  res.json(new ApiResponse(200, 'Shipment cancelled successfully', { shipment }));
});

/**
 * @desc    Get shipment statistics
 * @route   GET /api/shipments/stats
 * @access  Private (shipments:read)
 */
exports.getShipmentStats = asyncHandler(async (req, res) => {
  const query = {};

  // If user has only shipments:read:own, filter by client
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('shipments:read'))
  ) {
    if (!req.user.clientId) {
      throw new ApiError(403, 'Client ID not found for user');
    }
    query.client = req.user.clientId;
  }

  const totalShipments = await Shipment.countDocuments(query);
  const activeShipments = await Shipment.countDocuments({
    ...query,
    status: { $nin: ['delivered', 'cancelled'] },
  });
  const deliveredShipments = await Shipment.countDocuments({
    ...query,
    status: 'delivered',
  });
  const delayedShipments = await Shipment.countDocuments({
    ...query,
    status: 'delayed',
  });

  const stats = {
    total: totalShipments,
    active: activeShipments,
    delivered: deliveredShipments,
    delayed: delayedShipments,
  };

  res.json(
    new ApiResponse(200, 'Shipment stats fetched successfully', { stats })
  );
});