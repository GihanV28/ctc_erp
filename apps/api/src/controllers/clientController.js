const Client = require('../models/Client');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all clients
 * @route   GET /api/clients
 * @access  Private (clients:read)
 */
exports.getAllClients = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { clientId: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
      { tradingName: { $regex: search, $options: 'i' } },
      { 'contactPerson.email': { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const clients = await Client.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Client.countDocuments(query);

  new ApiResponse(200, {
    clients,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }, 'Clients fetched successfully').send(res);
});

/**
 * @desc    Get single client
 * @route   GET /api/clients/:id
 * @access  Private (clients:read)
 */
exports.getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).populate('shipments');

  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  new ApiResponse(200, { client }, 'Client fetched successfully').send(res);
});

/**
 * @desc    Create new client
 * @route   POST /api/clients
 * @access  Private (clients:write)
 */
exports.createClient = asyncHandler(async (req, res) => {
  const {
    companyName,
    tradingName,
    industry,
    website,
    contactPerson,
    address,
    billingAddress,
    creditLimit,
    paymentTerms,
    taxId,
    registrationNumber,
    notes,
    tags,
    preferredCurrency,
  } = req.body;

  // Check if client with same email already exists
  const existingClient = await Client.findOne({
    'contactPerson.email': contactPerson.email,
  });
  if (existingClient) {
    throw new ApiError(400, 'Client with this email already exists');
  }

  const client = await Client.create({
    companyName,
    tradingName,
    industry,
    website,
    contactPerson,
    address,
    billingAddress,
    creditLimit,
    paymentTerms,
    taxId,
    registrationNumber,
    notes,
    tags,
    preferredCurrency,
    status: 'active',
  });

  new ApiResponse(201, { client }, 'Client created successfully').send(res.status(201));
});

/**
 * @desc    Update client
 * @route   PUT /api/clients/:id
 * @access  Private (clients:write)
 */
exports.updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  // Check if email is being changed and if it's already in use
  if (
    req.body.contactPerson?.email &&
    req.body.contactPerson.email !== client.contactPerson.email
  ) {
    const existingClient = await Client.findOne({
      'contactPerson.email': req.body.contactPerson.email,
    });
    if (existingClient) {
      throw new ApiError(400, 'Email already in use by another client');
    }
  }

  // Update fields
  const allowedUpdates = [
    'companyName',
    'tradingName',
    'industry',
    'website',
    'contactPerson',
    'address',
    'billingAddress',
    'status',
    'creditLimit',
    'currentBalance',
    'paymentTerms',
    'taxId',
    'registrationNumber',
    'notes',
    'tags',
    'preferredCurrency',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      client[field] = req.body[field];
    }
  });

  await client.save();

  new ApiResponse(200, { client }, 'Client updated successfully').send(res);
});

/**
 * @desc    Delete client
 * @route   DELETE /api/clients/:id
 * @access  Private (clients:write)
 */
exports.deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  // Check if client has any shipments
  const Shipment = require('../models/Shipment');
  const shipmentsCount = await Shipment.countDocuments({ client: client._id });
  if (shipmentsCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete client. ${shipmentsCount} shipment(s) are associated with this client`
    );
  }

  // Check if client has any users
  const usersCount = await User.countDocuments({ clientId: client._id });
  if (usersCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete client. ${usersCount} user(s) are associated with this client`
    );
  }

  await client.deleteOne();

  new ApiResponse(200, null, 'Client deleted successfully').send(res);
});

/**
 * @desc    Get client statistics
 * @route   GET /api/clients/:id/stats
 * @access  Private (clients:read)
 */
exports.getClientStats = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  const Shipment = require('../models/Shipment');
  const Invoice = require('../models/Invoice');

  // Get shipment statistics
  const totalShipments = await Shipment.countDocuments({ client: client._id });
  const activeShipments = await Shipment.countDocuments({
    client: client._id,
    status: { $nin: ['delivered', 'cancelled'] },
  });

  // Get invoice statistics
  const totalInvoices = await Invoice.countDocuments({ client: client._id });
  const pendingInvoices = await Invoice.countDocuments({
    client: client._id,
    status: 'pending',
  });

  const stats = {
    shipments: {
      total: totalShipments,
      active: activeShipments,
    },
    invoices: {
      total: totalInvoices,
      pending: pendingInvoices,
    },
    balance: {
      current: client.currentBalance,
      creditLimit: client.creditLimit,
      available: client.creditLimit - client.currentBalance,
    },
  };

  new ApiResponse(200, { stats }, 'Client stats fetched successfully').send(res);
});