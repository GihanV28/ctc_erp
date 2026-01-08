const Invoice = require('../models/Invoice');
const Shipment = require('../models/Shipment');
const Client = require('../models/Client');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all invoices
 * @route   GET /api/invoices
 * @access  Private (invoices:read OR invoices:read:own)
 */
exports.getAllInvoices = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};

  // If user has only invoices:read:own, filter by client
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('invoices:read'))
  ) {
    if (!req.user.clientId) {
      throw new ApiError('Client ID not found for user', 403);
    }
    query.client = req.user.clientId;
  }

  if (status) query.status = status;
  if (search) {
    query.$or = [{ invoiceNumber: { $regex: search, $options: 'i' } }];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const invoices = await Invoice.find(query)
    .populate('client', 'clientId companyName contactPerson')
    .populate('shipment', 'shipmentId trackingNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Invoice.countDocuments(query);

  new ApiResponse(200, {
    invoices,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }, 'Invoices fetched successfully').send(res);
});

/**
 * @desc    Get single invoice
 * @route   GET /api/invoices/:id
 * @access  Private (invoices:read OR invoices:read:own)
 */
exports.getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('client', 'clientId companyName contactPerson address')
    .populate('shipment', 'shipmentId trackingNumber origin destination');

  if (!invoice) {
    throw new ApiError('Invoice not found', 404);
  }

  // Check if user can access this invoice
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('invoices:read'))
  ) {
    if (invoice.client._id.toString() !== req.user.clientId.toString()) {
      throw new ApiError('You can only view your own invoices', 403);
    }
  }

  new ApiResponse(200, { invoice }, 'Invoice fetched successfully').send(res);
});

/**
 * @desc    Create new invoice
 * @route   POST /api/invoices
 * @access  Private (invoices:write)
 */
exports.createInvoice = asyncHandler(async (req, res) => {
  const { client, shipment, items, tax, dueDate, notes } = req.body;

  // Verify client exists
  const clientDoc = await Client.findById(client);
  if (!clientDoc) {
    throw new ApiError('Client not found', 404);
  }

  // Verify shipment exists if provided
  if (shipment) {
    const shipmentDoc = await Shipment.findById(shipment);
    if (!shipmentDoc) {
      throw new ApiError('Shipment not found', 404);
    }

    // Verify shipment belongs to the client
    if (shipmentDoc.client.toString() !== client) {
      throw new ApiError('Shipment does not belong to this client', 400);
    }
  }

  // Create invoice
  const invoice = await Invoice.create({
    client,
    shipment,
    items,
    tax: tax || 0,
    dueDate,
    notes,
    status: 'draft',
  });

  await invoice.populate('client shipment');

  new ApiResponse(201, { invoice }, 'Invoice created successfully').send(res.status(201));
});

/**
 * @desc    Update invoice
 * @route   PUT /api/invoices/:id
 * @access  Private (invoices:write)
 */
exports.updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError('Invoice not found', 404);
  }

  // Cannot update paid or cancelled invoices
  if (['paid', 'cancelled'].includes(invoice.status)) {
    throw new ApiError(`Cannot update ${invoice.status} invoice`, 400);
  }

  const { items, tax, notes, dueDate } = req.body;

  // Update fields
  if (items) invoice.items = items;
  if (tax !== undefined) invoice.tax = tax;
  if (notes !== undefined) invoice.notes = notes;
  if (dueDate) invoice.dueDate = dueDate;

  await invoice.save();
  await invoice.populate('client shipment');

  new ApiResponse(200, { invoice }, 'Invoice updated successfully').send(res);
});

/**
 * @desc    Mark invoice as paid
 * @route   PUT /api/invoices/:id/pay
 * @access  Private (invoices:write)
 */
exports.markInvoiceAsPaid = asyncHandler(async (req, res) => {
  const { paymentDate, paymentMethod } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError('Invoice not found', 404);
  }

  if (invoice.status === 'paid') {
    throw new ApiError('Invoice is already paid', 400);
  }

  if (invoice.status === 'cancelled') {
    throw new ApiError('Cannot mark cancelled invoice as paid', 400);
  }

  invoice.status = 'paid';
  invoice.paidDate = paymentDate || Date.now();
  invoice.paymentMethod = paymentMethod;

  await invoice.save();

  new ApiResponse(200, { invoice }, 'Invoice marked as paid successfully').send(res);
});

/**
 * @desc    Cancel invoice
 * @route   PUT /api/invoices/:id/cancel
 * @access  Private (invoices:write)
 */
exports.cancelInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError('Invoice not found', 404);
  }

  if (invoice.status === 'paid') {
    throw new ApiError('Cannot cancel paid invoice', 400);
  }

  if (invoice.status === 'cancelled') {
    throw new ApiError('Invoice is already cancelled', 400);
  }

  invoice.status = 'cancelled';
  await invoice.save();

  new ApiResponse(200, { invoice }, 'Invoice cancelled successfully').send(res);
});

/**
 * @desc    Get invoice statistics
 * @route   GET /api/invoices/stats
 * @access  Private (invoices:read)
 */
exports.getInvoiceStats = asyncHandler(async (req, res) => {
  const query = {};

  // If user has only invoices:read:own, filter by client
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('invoices:read'))
  ) {
    if (!req.user.clientId) {
      throw new ApiError('Client ID not found for user', 403);
    }
    query.client = req.user.clientId;
  }

  const totalInvoices = await Invoice.countDocuments(query);
  const pendingInvoices = await Invoice.countDocuments({
    ...query,
    status: 'pending',
  });
  const paidInvoices = await Invoice.countDocuments({
    ...query,
    status: 'paid',
  });
  const overdueInvoices = await Invoice.countDocuments({
    ...query,
    status: 'overdue',
  });

  // Calculate total amounts
  const totalAmountResult = await Invoice.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const paidAmountResult = await Invoice.aggregate([
    { $match: { ...query, status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const stats = {
    count: {
      total: totalInvoices,
      pending: pendingInvoices,
      paid: paidInvoices,
      overdue: overdueInvoices,
    },
    amount: {
      total: totalAmountResult[0]?.total || 0,
      paid: paidAmountResult[0]?.total || 0,
      pending:
        (totalAmountResult[0]?.total || 0) - (paidAmountResult[0]?.total || 0),
    },
  };

  new ApiResponse(200, { stats }, 'Invoice stats fetched successfully').send(res);
});