const TrackingUpdate = require('../models/TrackingUpdate');
const Shipment = require('../models/Shipment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get active shipments for tracking page
 * @route   GET /api/tracking/active-shipments
 * @access  Private
 */
exports.getActiveShipments = asyncHandler(async (req, res) => {
  const query = {
    status: { $nin: ['delivered', 'cancelled'] }
  };

  // If user is a client, only show their shipments
  if (req.user.userType === 'client' && req.user.clientId) {
    query.client = req.user.clientId;
  }

  const shipments = await Shipment.find(query)
    .populate('client', 'clientId companyName contactPerson')
    .populate('supplier', 'supplierId name')
    .sort({ createdAt: -1 })
    .limit(50);

  // Get latest tracking update for each shipment
  const shipmentsWithLastUpdate = await Promise.all(
    shipments.map(async (shipment) => {
      const lastUpdate = await TrackingUpdate.findOne({ shipment: shipment._id })
        .sort({ timestamp: -1 })
        .select('status timestamp');

      return {
        ...shipment.toObject(),
        lastUpdate: lastUpdate || null
      };
    })
  );

  res.json(new ApiResponse(200, { shipments: shipmentsWithLastUpdate }, 'Active shipments fetched successfully'));
});

/**
 * @desc    Get all tracking updates (across all shipments)
 * @route   GET /api/tracking/all
 * @access  Private
 */
exports.getAllTrackingUpdates = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;

  const query = {};

  // If user is a client, only show updates for their shipments
  if (req.user.userType === 'client' && req.user.clientId) {
    const clientShipments = await Shipment.find({ client: req.user.clientId }).select('_id');
    query.shipment = { $in: clientShipments.map(s => s._id) };
  }

  const trackingUpdates = await TrackingUpdate.find(query)
    .populate({
      path: 'shipment',
      select: 'shipmentId trackingNumber status origin destination client',
      populate: {
        path: 'client',
        select: 'companyName'
      }
    })
    .populate('createdBy', 'firstName lastName')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.json(new ApiResponse(200, { trackingUpdates }, 'Tracking updates fetched successfully'));
});

/**
 * @desc    Get tracking updates for a shipment
 * @route   GET /api/tracking/shipment/:shipmentId
 * @access  Private
 */
exports.getShipmentTracking = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;

  const shipment = await Shipment.findById(shipmentId).populate('client');

  if (!shipment) {
    throw new ApiError('Shipment not found', 404);
  }

  // Check if user can access this shipment's tracking
  if (req.user.userType === 'client' && req.user.clientId) {
    if (shipment.client._id.toString() !== req.user.clientId.toString()) {
      throw new ApiError('You can only view your own shipment tracking', 403);
    }
  }

  const trackingUpdates = await TrackingUpdate.find({ shipment: shipmentId })
    .populate('createdBy', 'firstName lastName email')
    .sort({ timestamp: -1 });

  res.json(new ApiResponse(200, {
    shipment: {
      _id: shipment._id,
      shipmentId: shipment.shipmentId,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
    },
    trackingUpdates,
  }, 'Tracking updates fetched successfully'));
});

/**
 * @desc    Get tracking by tracking number (public)
 * @route   GET /api/tracking/public/:trackingNumber
 * @access  Public
 */
exports.getTrackingByNumber = asyncHandler(async (req, res) => {
  const { trackingNumber } = req.params;

  const shipment = await Shipment.findOne({ trackingNumber })
    .populate('client', 'companyName')
    .select('shipmentId trackingNumber status origin destination dates');

  if (!shipment) {
    throw new ApiError('Tracking number not found', 404);
  }

  // Only get public tracking updates
  const trackingUpdates = await TrackingUpdate.find({
    shipment: shipment._id,
    isPublic: true
  })
    .select('status location description timestamp')
    .sort({ timestamp: -1 });

  res.json(new ApiResponse(200, {
    shipment,
    trackingUpdates,
  }, 'Tracking information fetched successfully'));
});

/**
 * @desc    Create tracking update
 * @route   POST /api/tracking
 * @access  Private (tracking:write)
 */
exports.createTrackingUpdate = asyncHandler(async (req, res) => {
  const {
    shipment,
    status,
    location,
    description,
    timestamp,
    isPublic,
    attachments,
    metadata
  } = req.body;

  const shipmentDoc = await Shipment.findById(shipment).populate('client', 'contactPerson');

  if (!shipmentDoc) {
    throw new ApiError('Shipment not found', 404);
  }

  if (shipmentDoc.status === 'cancelled') {
    throw new ApiError('Cannot add tracking updates to cancelled shipment', 400);
  }

  const trackingUpdate = await TrackingUpdate.create({
    shipment,
    status,
    location,
    description,
    timestamp: timestamp || Date.now(),
    isPublic: isPublic !== undefined ? isPublic : true,
    attachments: attachments || [],
    metadata: metadata || {},
    createdBy: req.user._id,
  });

  await trackingUpdate.populate('createdBy', 'firstName lastName email');

  res.status(201).json(new ApiResponse(201, { trackingUpdate }, 'Tracking update created successfully'));
});

/**
 * @desc    Update tracking update
 * @route   PUT /api/tracking/:id
 * @access  Private (tracking:write)
 */
exports.updateTrackingUpdate = asyncHandler(async (req, res) => {
  const trackingUpdate = await TrackingUpdate.findById(req.params.id);

  if (!trackingUpdate) {
    throw new ApiError('Tracking update not found', 404);
  }

  const { status, location, description, timestamp, isPublic, metadata } = req.body;

  if (status) trackingUpdate.status = status;
  if (location) trackingUpdate.location = location;
  if (description !== undefined) trackingUpdate.description = description;
  if (timestamp) trackingUpdate.timestamp = timestamp;
  if (isPublic !== undefined) trackingUpdate.isPublic = isPublic;
  if (metadata) trackingUpdate.metadata = { ...trackingUpdate.metadata, ...metadata };

  await trackingUpdate.save();
  await trackingUpdate.populate('createdBy', 'firstName lastName email');

  res.json(new ApiResponse(200, { trackingUpdate }, 'Tracking update updated successfully'));
});

/**
 * @desc    Delete tracking update
 * @route   DELETE /api/tracking/:id
 * @access  Private (tracking:write)
 */
exports.deleteTrackingUpdate = asyncHandler(async (req, res) => {
  const trackingUpdate = await TrackingUpdate.findById(req.params.id);

  if (!trackingUpdate) {
    throw new ApiError('Tracking update not found', 404);
  }

  await trackingUpdate.deleteOne();

  res.json(new ApiResponse(200, null, 'Tracking update deleted successfully'));
});

module.exports = exports;
