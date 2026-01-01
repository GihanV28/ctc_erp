const TrackingUpdate = require('../models/TrackingUpdate');
const Shipment = require('../models/Shipment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const emailService = require('../services/emailService');

/**
 * @desc    Get tracking updates for a shipment
 * @route   GET /api/tracking/shipment/:shipmentId
 * @access  Private (tracking:read OR tracking:read:own)
 */
exports.getShipmentTracking = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;

  // Verify shipment exists
  const shipment = await Shipment.findById(shipmentId).populate('client');

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  // Check if user can access this shipment's tracking
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('tracking:read'))
  ) {
    if (shipment.client._id.toString() !== req.user.clientId.toString()) {
      throw new ApiError(403, 'You can only view your own shipment tracking');
    }
  }

  // Get all tracking updates
  const trackingUpdates = await TrackingUpdate.find({ shipment: shipmentId })
    .populate('updatedBy', 'firstName lastName email')
    .sort({ timestamp: -1 });

  new ApiResponse(200, {
    shipment: {
      _id: shipment._id,
      shipmentId: shipment.shipmentId,
      trackingId: shipment.trackingId,
      status: shipment.status,
    },
    trackingUpdates,
  }, 'Tracking updates fetched successfully').send(res);
});

/**
 * @desc    Get tracking by tracking ID (public)
 * @route   GET /api/tracking/:trackingId
 * @access  Public
 */
exports.getTrackingByTrackingId = asyncHandler(async (req, res) => {
  const { trackingId } = req.params;

  // Find shipment by tracking ID
  const shipment = await Shipment.findOne({ trackingId })
    .populate('client', 'companyName')
    .select('shipmentId trackingId status origin destination estimatedArrival');

  if (!shipment) {
    throw new ApiError(404, 'Tracking ID not found');
  }

  // Get tracking updates
  const trackingUpdates = await TrackingUpdate.find({
    shipment: shipment._id,
  })
    .select('status location notes timestamp')
    .sort({ timestamp: -1 });

  new ApiResponse(200, {
    shipment,
    trackingUpdates,
  }, 'Tracking information fetched successfully').send(res);
});

/**
 * @desc    Create tracking update
 * @route   POST /api/tracking
 * @access  Private (tracking:write)
 */
exports.createTrackingUpdate = asyncHandler(async (req, res) => {
  const { shipment, status, location, notes, timestamp, notifyClient } =
    req.body;

  // Verify shipment exists
  const shipmentDoc = await Shipment.findById(shipment).populate(
    'client',
    'contactPerson'
  );

  if (!shipmentDoc) {
    throw new ApiError(404, 'Shipment not found');
  }

  // Cannot add tracking updates to cancelled shipments
  if (shipmentDoc.status === 'cancelled') {
    throw new ApiError(400, 'Cannot add tracking updates to cancelled shipment');
  }

  // Create tracking update
  const trackingUpdate = await TrackingUpdate.create({
    shipment,
    status,
    location,
    notes,
    timestamp: timestamp || Date.now(),
    updatedBy: req.user._id,
  });

  await trackingUpdate.populate('updatedBy', 'firstName lastName email');

  // Send email notification if requested
  if (notifyClient && shipmentDoc.client.contactPerson?.email) {
    try {
      await emailService.sendTrackingUpdateEmail(
        shipmentDoc.client.contactPerson.email,
        {
          clientName: shipmentDoc.client.contactPerson.firstName,
          shipmentId: shipmentDoc.shipmentId,
          trackingId: shipmentDoc.trackingId,
          status,
          location,
          notes,
          timestamp: trackingUpdate.timestamp,
        }
      );
    } catch (emailError) {
      console.error('Failed to send tracking update email:', emailError);
      // Don't fail the request if email fails
    }
  }

  new ApiResponse(201, {
    trackingUpdate,
  }, 'Tracking update created successfully').send(res.status(201));
});

/**
 * @desc    Update tracking update
 * @route   PUT /api/tracking/:id
 * @access  Private (tracking:write)
 */
exports.updateTrackingUpdate = asyncHandler(async (req, res) => {
  const trackingUpdate = await TrackingUpdate.findById(req.params.id);

  if (!trackingUpdate) {
    throw new ApiError(404, 'Tracking update not found');
  }

  const { status, location, notes, timestamp } = req.body;

  // Update fields
  if (status) trackingUpdate.status = status;
  if (location) trackingUpdate.location = location;
  if (notes !== undefined) trackingUpdate.notes = notes;
  if (timestamp) trackingUpdate.timestamp = timestamp;

  await trackingUpdate.save();
  await trackingUpdate.populate('updatedBy', 'firstName lastName email');

  new ApiResponse(200, {
    trackingUpdate,
  }, 'Tracking update updated successfully').send(res);
});

/**
 * @desc    Delete tracking update
 * @route   DELETE /api/tracking/:id
 * @access  Private (tracking:write)
 */
exports.deleteTrackingUpdate = asyncHandler(async (req, res) => {
  const trackingUpdate = await TrackingUpdate.findById(req.params.id);

  if (!trackingUpdate) {
    throw new ApiError(404, 'Tracking update not found');
  }

  await trackingUpdate.deleteOne();

  new ApiResponse(200, null, 'Tracking update deleted successfully').send(res);
});