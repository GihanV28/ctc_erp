const Supplier = require('../models/Supplier');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private (suppliers:read)
 */
exports.getAllSuppliers = asyncHandler(async (req, res) => {
  const { status, serviceType, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  if (status) query.status = status;
  if (serviceType) query.serviceType = serviceType;
  if (search) {
    query.$or = [
      { supplierId: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
      { 'contactPerson.email': { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const suppliers = await Supplier.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Supplier.countDocuments(query);

  new ApiResponse(200, {
    suppliers,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }, 'Suppliers fetched successfully').send(res);
});

/**
 * @desc    Get single supplier
 * @route   GET /api/suppliers/:id
 * @access  Private (suppliers:read)
 */
exports.getSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  new ApiResponse(200, { supplier }, 'Supplier fetched successfully').send(res);
});

/**
 * @desc    Create new supplier
 * @route   POST /api/suppliers
 * @access  Private (suppliers:write)
 */
exports.createSupplier = asyncHandler(async (req, res) => {
  const {
    name,
    serviceType,
    contactPerson,
    address,
  } = req.body;

  // Check if supplier with same email already exists
  const existingSupplier = await Supplier.findOne({
    'contactPerson.email': contactPerson.email,
  });
  if (existingSupplier) {
    throw new ApiError(400, 'Supplier with this email already exists');
  }

  const supplier = await Supplier.create({
    name,
    serviceType,
    contactPerson,
    address,
    status: 'active',
  });

  new ApiResponse(201, { supplier }, 'Supplier created successfully').send(res.status(201));
});

/**
 * @desc    Update supplier
 * @route   PUT /api/suppliers/:id
 * @access  Private (suppliers:write)
 */
exports.updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  // Check if email is being changed and if it's already in use
  if (
    req.body.contactPerson?.email &&
    req.body.contactPerson.email !== supplier.contactPerson.email
  ) {
    const existingSupplier = await Supplier.findOne({
      'contactPerson.email': req.body.contactPerson.email,
    });
    if (existingSupplier) {
      throw new ApiError(400, 'Email already in use by another supplier');
    }
  }

  // Update fields
  const allowedUpdates = [
    'name',
    'serviceType',
    'contactPerson',
    'address',
    'status',
    'rating',
    'activeContracts',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      supplier[field] = req.body[field];
    }
  });

  await supplier.save();

  new ApiResponse(200, { supplier }, 'Supplier updated successfully').send(res);
});

/**
 * @desc    Delete supplier
 * @route   DELETE /api/suppliers/:id
 * @access  Private (suppliers:write)
 */
exports.deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  // Check if supplier is associated with any shipments
  const Shipment = require('../models/Shipment');
  const shipmentsCount = await Shipment.countDocuments({
    'suppliers.supplier': supplier._id,
  });
  if (shipmentsCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete supplier. ${shipmentsCount} shipment(s) are associated with this supplier`
    );
  }

  await supplier.deleteOne();

  new ApiResponse(200, null, 'Supplier deleted successfully').send(res);
});

/**
 * @desc    Get active suppliers by service type
 * @route   GET /api/suppliers/by-service/:serviceType
 * @access  Private (suppliers:read)
 */
exports.getSuppliersByService = asyncHandler(async (req, res) => {
  const { serviceType } = req.params;

  const suppliers = await Supplier.find({
    status: 'active',
    serviceType: serviceType,
  }).sort({ name: 1 });

  new ApiResponse(200, { suppliers }, 'Suppliers fetched successfully').send(res);
});