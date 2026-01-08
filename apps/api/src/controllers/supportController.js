const SupportTicket = require('../models/SupportTicket');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all support tickets
 * @route   GET /api/support
 * @access  Private (support:read OR support:read:own)
 */
exports.getAllTickets = asyncHandler(async (req, res) => {
  const { status, priority, category, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};

  // If user has only support:read:own, filter by createdBy
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('support:read'))
  ) {
    query.createdBy = req.user._id;
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { ticketNumber: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const tickets = await SupportTicket.find(query)
    .populate('createdBy', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email')
    .populate('shipment', 'shipmentId trackingId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await SupportTicket.countDocuments(query);

  res.json(
    new ApiResponse(200, 'Support tickets fetched successfully', {
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    })
  );
});

/**
 * @desc    Get single support ticket
 * @route   GET /api/support/:id
 * @access  Private (support:read OR support:read:own)
 */
exports.getTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate('createdBy', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email')
    .populate('shipment', 'shipmentId trackingId')
    .populate('messages.sentBy', 'firstName lastName email');

  if (!ticket) {
    throw new ApiError('Support ticket not found', 404);
  }

  // Check if user can access this ticket
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('support:read'))
  ) {
    if (ticket.createdBy._id.toString() !== req.user._id.toString()) {
      throw new ApiError('You can only view your own support tickets', 403);
    }
  }

  res.json(
    new ApiResponse(200, 'Support ticket fetched successfully', { ticket })
  );
});

/**
 * @desc    Create new support ticket
 * @route   POST /api/support
 * @access  Private
 */
exports.createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority, shipment } = req.body;

  // Verify shipment if provided
  if (shipment) {
    const Shipment = require('../models/Shipment');
    const shipmentDoc = await Shipment.findById(shipment);
    if (!shipmentDoc) {
      throw new ApiError('Shipment not found', 404);
    }
  }

  const ticket = await SupportTicket.create({
    subject,
    description,
    category,
    priority: priority || 'medium',
    shipment,
    createdBy: req.user._id,
    status: 'open',
  });

  await ticket.populate('createdBy shipment');

  res
    .status(201)
    .json(new ApiResponse(201, 'Support ticket created successfully', { ticket }));
});

/**
 * @desc    Update support ticket
 * @route   PUT /api/support/:id
 * @access  Private (support:write)
 */
exports.updateTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    throw new ApiError('Support ticket not found', 404);
  }

  const { subject, description, category, priority, status, assignedTo } =
    req.body;

  // Update fields
  if (subject) ticket.subject = subject;
  if (description) ticket.description = description;
  if (category) ticket.category = category;
  if (priority) ticket.priority = priority;
  if (status) ticket.status = status;
  if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

  // Set resolved date if status changed to resolved
  if (status === 'resolved' && ticket.status !== 'resolved') {
    ticket.resolvedAt = Date.now();
    ticket.resolvedBy = req.user._id;
  }

  await ticket.save();
  await ticket.populate('createdBy assignedTo shipment');

  res.json(
    new ApiResponse(200, 'Support ticket updated successfully', { ticket })
  );
});

/**
 * @desc    Add message to support ticket
 * @route   POST /api/support/:id/messages
 * @access  Private
 */
exports.addMessage = asyncHandler(async (req, res) => {
  const { message, isInternal } = req.body;

  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    throw new ApiError('Support ticket not found', 404);
  }

  // Check if user can access this ticket
  if (
    req.user.userType === 'client' &&
    ticket.createdBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError('You can only add messages to your own tickets', 403);
  }

  // Clients cannot send internal messages
  if (isInternal && req.user.userType === 'client') {
    throw new ApiError('You cannot send internal messages', 403);
  }

  ticket.messages.push({
    message,
    sentBy: req.user._id,
    isInternal: isInternal || false,
  });

  await ticket.save();
  await ticket.populate('messages.sentBy', 'firstName lastName email');

  res.json(
    new ApiResponse(200, 'Message added successfully', {
      ticket,
      newMessage: ticket.messages[ticket.messages.length - 1],
    })
  );
});

/**
 * @desc    Close support ticket
 * @route   PUT /api/support/:id/close
 * @access  Private (support:write)
 */
exports.closeTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    throw new ApiError('Support ticket not found', 404);
  }

  if (ticket.status === 'closed') {
    throw new ApiError('Ticket is already closed', 400);
  }

  ticket.status = 'closed';
  ticket.resolvedAt = Date.now();
  ticket.resolvedBy = req.user._id;

  await ticket.save();

  res.json(
    new ApiResponse(200, 'Support ticket closed successfully', { ticket })
  );
});

/**
 * @desc    Get support ticket statistics
 * @route   GET /api/support/stats
 * @access  Private (support:read)
 */
exports.getTicketStats = asyncHandler(async (req, res) => {
  const query = {};

  // If user has only support:read:own, filter by createdBy
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('support:read'))
  ) {
    query.createdBy = req.user._id;
  }

  const totalTickets = await SupportTicket.countDocuments(query);
  const openTickets = await SupportTicket.countDocuments({
    ...query,
    status: 'open',
  });
  const inProgressTickets = await SupportTicket.countDocuments({
    ...query,
    status: 'in_progress',
  });
  const resolvedTickets = await SupportTicket.countDocuments({
    ...query,
    status: 'resolved',
  });

  const stats = {
    total: totalTickets,
    open: openTickets,
    inProgress: inProgressTickets,
    resolved: resolvedTickets,
  };

  res.json(
    new ApiResponse(200, 'Support ticket stats fetched successfully', { stats })
  );
});