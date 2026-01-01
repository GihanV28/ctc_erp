# Backend Complete Code - Part 3: Controllers & Routes

This is Part 3 of the complete backend reference, containing remaining controllers, all routes, and server integration.

---

## 6. REMAINING CONTROLLERS

### 6.1 Role Controller
**File**: `apps/api/src/controllers/roleController.js`

```javascript
const Role = require('../models/Role');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Private (roles:read)
 */
exports.getAllRoles = asyncHandler(async (req, res) => {
  const { userType, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  if (userType) query.userType = userType;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { displayName: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const roles = await Role.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userCount'); // Virtual field

  const total = await Role.countDocuments(query);

  res.json(
    new ApiResponse(200, 'Roles fetched successfully', {
      roles,
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
 * @desc    Get single role
 * @route   GET /api/roles/:id
 * @access  Private (roles:read)
 */
exports.getRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id).populate('userCount');

  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  res.json(new ApiResponse(200, 'Role fetched successfully', { role }));
});

/**
 * @desc    Create new role
 * @route   POST /api/roles
 * @access  Private (roles:write)
 */
exports.createRole = asyncHandler(async (req, res) => {
  const { name, displayName, description, userType, permissions } = req.body;

  // Check if role already exists
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    throw new ApiError(400, 'Role with this name already exists');
  }

  const role = await Role.create({
    name,
    displayName,
    description,
    userType,
    permissions,
    isSystem: false,
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Role created successfully', { role }));
});

/**
 * @desc    Update role
 * @route   PUT /api/roles/:id
 * @access  Private (roles:write)
 */
exports.updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // Prevent updating system roles
  if (role.isSystem) {
    throw new ApiError(403, 'Cannot modify system role');
  }

  const { displayName, description, permissions } = req.body;

  // Update fields
  if (displayName) role.displayName = displayName;
  if (description !== undefined) role.description = description;
  if (permissions) role.permissions = permissions;

  await role.save();

  res.json(new ApiResponse(200, 'Role updated successfully', { role }));
});

/**
 * @desc    Delete role
 * @route   DELETE /api/roles/:id
 * @access  Private (roles:write)
 */
exports.deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // Prevent deleting system roles
  if (role.isSystem) {
    throw new ApiError(403, 'Cannot delete system role');
  }

  // Check if role is assigned to any users
  const usersWithRole = await User.countDocuments({ role: role._id });
  if (usersWithRole > 0) {
    throw new ApiError(
      400,
      `Cannot delete role. ${usersWithRole} user(s) are assigned to this role`
    );
  }

  await role.deleteOne();

  res.json(new ApiResponse(200, 'Role deleted successfully'));
});

/**
 * @desc    Get all available permissions
 * @route   GET /api/roles/permissions
 * @access  Private (roles:read)
 */
exports.getAllPermissions = asyncHandler(async (req, res) => {
  const permissions = Role.getAllPermissions();

  res.json(
    new ApiResponse(200, 'Permissions fetched successfully', { permissions })
  );
});
```

---

### 6.2 Client Controller
**File**: `apps/api/src/controllers/clientController.js`

```javascript
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

  res.json(
    new ApiResponse(200, 'Clients fetched successfully', {
      clients,
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
 * @desc    Get single client
 * @route   GET /api/clients/:id
 * @access  Private (clients:read)
 */
exports.getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).populate('shipments');

  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  res.json(new ApiResponse(200, 'Client fetched successfully', { client }));
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

  res
    .status(201)
    .json(new ApiResponse(201, 'Client created successfully', { client }));
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

  res.json(new ApiResponse(200, 'Client updated successfully', { client }));
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

  res.json(new ApiResponse(200, 'Client deleted successfully'));
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

  res.json(new ApiResponse(200, 'Client stats fetched successfully', { stats }));
});
```

---

### 6.3 Container Controller
**File**: `apps/api/src/controllers/containerController.js`

```javascript
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
  if (containerType) query.containerType = containerType;
  if (search) {
    query.$or = [
      { containerNumber: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const containers = await Container.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Container.countDocuments(query);

  res.json(
    new ApiResponse(200, 'Containers fetched successfully', {
      containers,
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
 * @desc    Get single container
 * @route   GET /api/containers/:id
 * @access  Private (containers:read)
 */
exports.getContainer = asyncHandler(async (req, res) => {
  const container = await Container.findById(req.params.id);

  if (!container) {
    throw new ApiError(404, 'Container not found');
  }

  res.json(
    new ApiResponse(200, 'Container fetched successfully', { container })
  );
});

/**
 * @desc    Create new container
 * @route   POST /api/containers
 * @access  Private (containers:write)
 */
exports.createContainer = asyncHandler(async (req, res) => {
  const {
    containerNumber,
    containerType,
    registrationNumber,
    manufacturer,
    yearOfManufacture,
    owner,
    notes,
    tags,
  } = req.body;

  // Check if container number already exists
  const existingContainer = await Container.findOne({ containerNumber });
  if (existingContainer) {
    throw new ApiError(400, 'Container with this number already exists');
  }

  const container = await Container.create({
    containerNumber,
    containerType,
    registrationNumber,
    manufacturer,
    yearOfManufacture,
    owner,
    notes,
    tags,
    status: 'available',
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Container created successfully', { container }));
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
    'containerType',
    'registrationNumber',
    'manufacturer',
    'yearOfManufacture',
    'owner',
    'status',
    'lastInspectionDate',
    'nextInspectionDate',
    'notes',
    'tags',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      container[field] = req.body[field];
    }
  });

  await container.save();

  res.json(
    new ApiResponse(200, 'Container updated successfully', { container })
  );
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

  res.json(new ApiResponse(200, 'Container deleted successfully'));
});

/**
 * @desc    Get available containers
 * @route   GET /api/containers/available
 * @access  Private (containers:read)
 */
exports.getAvailableContainers = asyncHandler(async (req, res) => {
  const { containerType } = req.query;

  const query = { status: 'available' };
  if (containerType) query.containerType = containerType;

  const containers = await Container.find(query).sort({ containerNumber: 1 });

  res.json(
    new ApiResponse(200, 'Available containers fetched successfully', {
      containers,
    })
  );
});
```

---

### 6.4 Supplier Controller
**File**: `apps/api/src/controllers/supplierController.js`

```javascript
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
  if (serviceType) query.serviceTypes = serviceType;
  if (search) {
    query.$or = [
      { supplierId: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
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

  res.json(
    new ApiResponse(200, 'Suppliers fetched successfully', {
      suppliers,
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
 * @desc    Get single supplier
 * @route   GET /api/suppliers/:id
 * @access  Private (suppliers:read)
 */
exports.getSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  res.json(
    new ApiResponse(200, 'Supplier fetched successfully', { supplier })
  );
});

/**
 * @desc    Create new supplier
 * @route   POST /api/suppliers
 * @access  Private (suppliers:write)
 */
exports.createSupplier = asyncHandler(async (req, res) => {
  const {
    companyName,
    serviceTypes,
    contactPerson,
    address,
    certifications,
    paymentTerms,
    taxId,
    registrationNumber,
    notes,
    tags,
  } = req.body;

  // Check if supplier with same email already exists
  const existingSupplier = await Supplier.findOne({
    'contactPerson.email': contactPerson.email,
  });
  if (existingSupplier) {
    throw new ApiError(400, 'Supplier with this email already exists');
  }

  const supplier = await Supplier.create({
    companyName,
    serviceTypes,
    contactPerson,
    address,
    certifications,
    paymentTerms,
    taxId,
    registrationNumber,
    notes,
    tags,
    status: 'active',
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Supplier created successfully', { supplier }));
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
    'companyName',
    'serviceTypes',
    'contactPerson',
    'address',
    'status',
    'certifications',
    'paymentTerms',
    'taxId',
    'registrationNumber',
    'notes',
    'tags',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      supplier[field] = req.body[field];
    }
  });

  await supplier.save();

  res.json(
    new ApiResponse(200, 'Supplier updated successfully', { supplier })
  );
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

  res.json(new ApiResponse(200, 'Supplier deleted successfully'));
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
    serviceTypes: serviceType,
  }).sort({ companyName: 1 });

  res.json(
    new ApiResponse(200, 'Suppliers fetched successfully', { suppliers })
  );
});
```

---

### 6.5 Shipment Controller
**File**: `apps/api/src/controllers/shipmentController.js`

```javascript
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
      { trackingId: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const shipments = await Shipment.find(query)
    .populate('client', 'clientId companyName contactPerson')
    .populate('container', 'containerNumber containerType')
    .populate('suppliers.supplier', 'supplierId companyName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Shipment.countDocuments(query);

  res.json(
    new ApiResponse(200, 'Shipments fetched successfully', {
      shipments,
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
 * @desc    Get single shipment
 * @route   GET /api/shipments/:id
 * @access  Private (shipments:read OR shipments:read:own)
 */
exports.getShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id)
    .populate('client', 'clientId companyName contactPerson address')
    .populate('container', 'containerNumber containerType capacity')
    .populate('suppliers.supplier', 'supplierId companyName contactPerson')
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
    container,
    cargoDescription,
    cargoWeight,
    cargoVolume,
    origin,
    destination,
    estimatedDeparture,
    estimatedArrival,
    suppliers,
    transportMode,
    notes,
    tags,
  } = req.body;

  // Verify client exists
  const Client = require('../models/Client');
  const clientDoc = await Client.findById(client);
  if (!clientDoc) {
    throw new ApiError(404, 'Client not found');
  }

  // Verify container exists and is available
  const containerDoc = await Container.findById(container);
  if (!containerDoc) {
    throw new ApiError(404, 'Container not found');
  }
  if (containerDoc.status !== 'available') {
    throw new ApiError(400, 'Container is not available');
  }

  // Create shipment
  const shipment = await Shipment.create({
    client,
    container,
    cargoDescription,
    cargoWeight,
    cargoVolume,
    origin,
    destination,
    estimatedDeparture,
    estimatedArrival,
    suppliers,
    transportMode,
    notes,
    tags,
    status: 'pending',
  });

  // Update container status
  containerDoc.status = 'in_use';
  await containerDoc.save();

  // Populate fields before returning
  await shipment.populate('client container suppliers.supplier');

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

  // If container is being changed
  if (req.body.container && req.body.container !== shipment.container.toString()) {
    // Make old container available
    await Container.findByIdAndUpdate(shipment.container, {
      status: 'available',
    });

    // Verify new container is available
    const newContainer = await Container.findById(req.body.container);
    if (!newContainer) {
      throw new ApiError(404, 'New container not found');
    }
    if (newContainer.status !== 'available') {
      throw new ApiError(400, 'New container is not available');
    }

    // Update new container status
    newContainer.status = 'in_use';
    await newContainer.save();
  }

  // Update fields
  const allowedUpdates = [
    'container',
    'cargoDescription',
    'cargoWeight',
    'cargoVolume',
    'origin',
    'destination',
    'estimatedDeparture',
    'estimatedArrival',
    'actualDeparture',
    'actualArrival',
    'suppliers',
    'transportMode',
    'status',
    'notes',
    'tags',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      shipment[field] = req.body[field];
    }
  });

  await shipment.save();
  await shipment.populate('client container suppliers.supplier');

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

  // Make container available again
  await Container.findByIdAndUpdate(shipment.container, {
    status: 'available',
  });

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
```

---

### 6.6 Tracking Controller
**File**: `apps/api/src/controllers/trackingController.js`

```javascript
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

  res.json(
    new ApiResponse(200, 'Tracking updates fetched successfully', {
      shipment: {
        _id: shipment._id,
        shipmentId: shipment.shipmentId,
        trackingId: shipment.trackingId,
        status: shipment.status,
      },
      trackingUpdates,
    })
  );
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

  res.json(
    new ApiResponse(200, 'Tracking information fetched successfully', {
      shipment,
      trackingUpdates,
    })
  );
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

  res.status(201).json(
    new ApiResponse(201, 'Tracking update created successfully', {
      trackingUpdate,
    })
  );
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

  res.json(
    new ApiResponse(200, 'Tracking update updated successfully', {
      trackingUpdate,
    })
  );
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

  res.json(new ApiResponse(200, 'Tracking update deleted successfully'));
});
```

---

### 6.7 Invoice Controller
**File**: `apps/api/src/controllers/invoiceController.js`

```javascript
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
      throw new ApiError(403, 'Client ID not found for user');
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
    .populate('shipment', 'shipmentId trackingId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Invoice.countDocuments(query);

  res.json(
    new ApiResponse(200, 'Invoices fetched successfully', {
      invoices,
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
 * @desc    Get single invoice
 * @route   GET /api/invoices/:id
 * @access  Private (invoices:read OR invoices:read:own)
 */
exports.getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('client', 'clientId companyName contactPerson address')
    .populate('shipment', 'shipmentId trackingId origin destination');

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  // Check if user can access this invoice
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('invoices:read'))
  ) {
    if (invoice.client._id.toString() !== req.user.clientId.toString()) {
      throw new ApiError(403, 'You can only view your own invoices');
    }
  }

  res.json(new ApiResponse(200, 'Invoice fetched successfully', { invoice }));
});

/**
 * @desc    Create new invoice
 * @route   POST /api/invoices
 * @access  Private (invoices:write)
 */
exports.createInvoice = asyncHandler(async (req, res) => {
  const { client, shipment, items, taxRate, discount, notes } = req.body;

  // Verify client exists
  const clientDoc = await Client.findById(client);
  if (!clientDoc) {
    throw new ApiError(404, 'Client not found');
  }

  // Verify shipment exists if provided
  if (shipment) {
    const shipmentDoc = await Shipment.findById(shipment);
    if (!shipmentDoc) {
      throw new ApiError(404, 'Shipment not found');
    }

    // Verify shipment belongs to the client
    if (shipmentDoc.client.toString() !== client) {
      throw new ApiError(400, 'Shipment does not belong to this client');
    }
  }

  // Create invoice
  const invoice = await Invoice.create({
    client,
    shipment,
    items,
    taxRate: taxRate || 0,
    discount: discount || 0,
    notes,
    status: 'pending',
    issuedBy: req.user._id,
  });

  // Update client balance
  clientDoc.currentBalance += invoice.totalAmount;
  await clientDoc.save();

  await invoice.populate('client shipment');

  res
    .status(201)
    .json(new ApiResponse(201, 'Invoice created successfully', { invoice }));
});

/**
 * @desc    Update invoice
 * @route   PUT /api/invoices/:id
 * @access  Private (invoices:write)
 */
exports.updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  // Cannot update paid or cancelled invoices
  if (['paid', 'cancelled'].includes(invoice.status)) {
    throw new ApiError(400, `Cannot update ${invoice.status} invoice`);
  }

  const { items, taxRate, discount, notes, dueDate } = req.body;

  // Store old total for balance adjustment
  const oldTotal = invoice.totalAmount;

  // Update fields
  if (items) invoice.items = items;
  if (taxRate !== undefined) invoice.taxRate = taxRate;
  if (discount !== undefined) invoice.discount = discount;
  if (notes !== undefined) invoice.notes = notes;
  if (dueDate) invoice.dueDate = dueDate;

  await invoice.save();

  // Update client balance if total changed
  if (invoice.totalAmount !== oldTotal) {
    const difference = invoice.totalAmount - oldTotal;
    await Client.findByIdAndUpdate(invoice.client, {
      $inc: { currentBalance: difference },
    });
  }

  await invoice.populate('client shipment');

  res.json(new ApiResponse(200, 'Invoice updated successfully', { invoice }));
});

/**
 * @desc    Mark invoice as paid
 * @route   PUT /api/invoices/:id/pay
 * @access  Private (invoices:write)
 */
exports.markInvoiceAsPaid = asyncHandler(async (req, res) => {
  const { paymentDate, paymentMethod, paymentReference } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  if (invoice.status === 'paid') {
    throw new ApiError(400, 'Invoice is already paid');
  }

  if (invoice.status === 'cancelled') {
    throw new ApiError(400, 'Cannot mark cancelled invoice as paid');
  }

  invoice.status = 'paid';
  invoice.paidDate = paymentDate || Date.now();
  invoice.paymentMethod = paymentMethod;
  invoice.paymentReference = paymentReference;

  await invoice.save();

  // Update client balance
  await Client.findByIdAndUpdate(invoice.client, {
    $inc: { currentBalance: -invoice.totalAmount },
  });

  res.json(
    new ApiResponse(200, 'Invoice marked as paid successfully', { invoice })
  );
});

/**
 * @desc    Cancel invoice
 * @route   PUT /api/invoices/:id/cancel
 * @access  Private (invoices:write)
 */
exports.cancelInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  if (invoice.status === 'paid') {
    throw new ApiError(400, 'Cannot cancel paid invoice');
  }

  if (invoice.status === 'cancelled') {
    throw new ApiError(400, 'Invoice is already cancelled');
  }

  const oldTotal = invoice.totalAmount;
  invoice.status = 'cancelled';
  await invoice.save();

  // Update client balance
  await Client.findByIdAndUpdate(invoice.client, {
    $inc: { currentBalance: -oldTotal },
  });

  res.json(new ApiResponse(200, 'Invoice cancelled successfully', { invoice }));
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
      throw new ApiError(403, 'Client ID not found for user');
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
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const paidAmountResult = await Invoice.aggregate([
    { $match: { ...query, status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
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

  res.json(
    new ApiResponse(200, 'Invoice stats fetched successfully', { stats })
  );
});
```

---

### 6.8 Support Ticket Controller
**File**: `apps/api/src/controllers/supportController.js`

```javascript
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
    throw new ApiError(404, 'Support ticket not found');
  }

  // Check if user can access this ticket
  if (
    req.user.userType === 'client' &&
    !(await req.user.hasPermission('support:read'))
  ) {
    if (ticket.createdBy._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only view your own support tickets');
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
      throw new ApiError(404, 'Shipment not found');
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
    throw new ApiError(404, 'Support ticket not found');
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
    throw new ApiError(404, 'Support ticket not found');
  }

  // Check if user can access this ticket
  if (
    req.user.userType === 'client' &&
    ticket.createdBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'You can only add messages to your own tickets');
  }

  // Clients cannot send internal messages
  if (isInternal && req.user.userType === 'client') {
    throw new ApiError(403, 'You cannot send internal messages');
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
    throw new ApiError(404, 'Support ticket not found');
  }

  if (ticket.status === 'closed') {
    throw new ApiError(400, 'Ticket is already closed');
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
```

---

## 7. ROUTES

### 7.1 Auth Routes
**File**: `apps/api/src/routes/authRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/authValidators');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName, role]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', validate(registerValidator), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 */
router.post('/login', validate(loginValidator), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 */
router.post('/logout', auth, authController.logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 */
router.get('/me', auth, authController.getMe);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change password
 *     tags: [Authentication]
 */
router.put(
  '/change-password',
  auth,
  validate(changePasswordValidator),
  authController.changePassword
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordValidator),
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password/:token:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 */
router.post(
  '/reset-password/:token',
  validate(resetPasswordValidator),
  authController.resetPassword
);

module.exports = router;
```

---

### 7.2 User Routes
**File**: `apps/api/src/routes/userRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const {
  createUserValidator,
  updateUserValidator,
} = require('../validators/userValidators');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
router.get('/', hasPermission('users:read'), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 */
router.get('/:id', hasPermission('users:read'), userController.getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 */
router.post(
  '/',
  hasPermission('users:write'),
  validate(createUserValidator),
  userController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 */
router.put(
  '/:id',
  hasPermission('users:write'),
  validate(updateUserValidator),
  userController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
router.delete(
  '/:id',
  hasPermission('users:write'),
  userController.deleteUser
);

module.exports = router;
```

---

### 7.3 Role Routes
**File**: `apps/api/src/routes/roleRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/roles/permissions:
 *   get:
 *     summary: Get all available permissions
 *     tags: [Roles]
 */
router.get(
  '/permissions',
  hasPermission('roles:read'),
  roleController.getAllPermissions
);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 */
router.get('/', hasPermission('roles:read'), roleController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 */
router.get('/:id', hasPermission('roles:read'), roleController.getRole);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create new role
 *     tags: [Roles]
 */
router.post('/', hasPermission('roles:write'), roleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 */
router.put('/:id', hasPermission('roles:write'), roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 */
router.delete('/:id', hasPermission('roles:write'), roleController.deleteRole);

module.exports = router;
```

---

### 7.4 Client Routes
**File**: `apps/api/src/routes/clientRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 */
router.get('/', hasPermission('clients:read'), clientController.getAllClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 */
router.get('/:id', hasPermission('clients:read'), clientController.getClient);

/**
 * @swagger
 * /api/clients/{id}/stats:
 *   get:
 *     summary: Get client statistics
 *     tags: [Clients]
 */
router.get(
  '/:id/stats',
  hasPermission('clients:read'),
  clientController.getClientStats
);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create new client
 *     tags: [Clients]
 */
router.post('/', hasPermission('clients:write'), clientController.createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
 */
router.put(
  '/:id',
  hasPermission('clients:write'),
  clientController.updateClient
);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     tags: [Clients]
 */
router.delete(
  '/:id',
  hasPermission('clients:write'),
  clientController.deleteClient
);

module.exports = router;
```

---

### 7.5 Container Routes
**File**: `apps/api/src/routes/containerRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/containers/available:
 *   get:
 *     summary: Get available containers
 *     tags: [Containers]
 */
router.get(
  '/available',
  hasPermission('containers:read'),
  containerController.getAvailableContainers
);

/**
 * @swagger
 * /api/containers:
 *   get:
 *     summary: Get all containers
 *     tags: [Containers]
 */
router.get(
  '/',
  hasPermission('containers:read'),
  containerController.getAllContainers
);

/**
 * @swagger
 * /api/containers/{id}:
 *   get:
 *     summary: Get container by ID
 *     tags: [Containers]
 */
router.get(
  '/:id',
  hasPermission('containers:read'),
  containerController.getContainer
);

/**
 * @swagger
 * /api/containers:
 *   post:
 *     summary: Create new container
 *     tags: [Containers]
 */
router.post(
  '/',
  hasPermission('containers:write'),
  containerController.createContainer
);

/**
 * @swagger
 * /api/containers/{id}:
 *   put:
 *     summary: Update container
 *     tags: [Containers]
 */
router.put(
  '/:id',
  hasPermission('containers:write'),
  containerController.updateContainer
);

/**
 * @swagger
 * /api/containers/{id}:
 *   delete:
 *     summary: Delete container
 *     tags: [Containers]
 */
router.delete(
  '/:id',
  hasPermission('containers:write'),
  containerController.deleteContainer
);

module.exports = router;
```

---

### 7.6 Supplier Routes
**File**: `apps/api/src/routes/supplierRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/suppliers/by-service/{serviceType}:
 *   get:
 *     summary: Get suppliers by service type
 *     tags: [Suppliers]
 */
router.get(
  '/by-service/:serviceType',
  hasPermission('suppliers:read'),
  supplierController.getSuppliersByService
);

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 */
router.get(
  '/',
  hasPermission('suppliers:read'),
  supplierController.getAllSuppliers
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 */
router.get(
  '/:id',
  hasPermission('suppliers:read'),
  supplierController.getSupplier
);

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create new supplier
 *     tags: [Suppliers]
 */
router.post(
  '/',
  hasPermission('suppliers:write'),
  supplierController.createSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update supplier
 *     tags: [Suppliers]
 */
router.put(
  '/:id',
  hasPermission('suppliers:write'),
  supplierController.updateSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete supplier
 *     tags: [Suppliers]
 */
router.delete(
  '/:id',
  hasPermission('suppliers:write'),
  supplierController.deleteSupplier
);

module.exports = router;
```

---

### 7.7 Shipment Routes
**File**: `apps/api/src/routes/shipmentRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/shipments/stats:
 *   get:
 *     summary: Get shipment statistics
 *     tags: [Shipments]
 */
router.get(
  '/stats',
  hasAnyPermission(['shipments:read', 'shipments:read:own']),
  shipmentController.getShipmentStats
);

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments
 *     tags: [Shipments]
 */
router.get(
  '/',
  hasAnyPermission(['shipments:read', 'shipments:read:own']),
  shipmentController.getAllShipments
);

/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipments]
 */
router.get(
  '/:id',
  hasAnyPermission(['shipments:read', 'shipments:read:own']),
  shipmentController.getShipment
);

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create new shipment
 *     tags: [Shipments]
 */
router.post(
  '/',
  hasPermission('shipments:write'),
  shipmentController.createShipment
);

/**
 * @swagger
 * /api/shipments/{id}:
 *   put:
 *     summary: Update shipment
 *     tags: [Shipments]
 */
router.put(
  '/:id',
  hasPermission('shipments:write'),
  shipmentController.updateShipment
);

/**
 * @swagger
 * /api/shipments/{id}/cancel:
 *   put:
 *     summary: Cancel shipment
 *     tags: [Shipments]
 */
router.put(
  '/:id/cancel',
  hasPermission('shipments:write'),
  shipmentController.cancelShipment
);

module.exports = router;
```

---

### 7.8 Tracking Routes
**File**: `apps/api/src/routes/trackingRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

/**
 * @swagger
 * /api/tracking/{trackingId}:
 *   get:
 *     summary: Get tracking by tracking ID (public)
 *     tags: [Tracking]
 */
router.get('/:trackingId', trackingController.getTrackingByTrackingId);

// All routes below require authentication
router.use(auth);

/**
 * @swagger
 * /api/tracking/shipment/{shipmentId}:
 *   get:
 *     summary: Get tracking updates for a shipment
 *     tags: [Tracking]
 */
router.get(
  '/shipment/:shipmentId',
  hasAnyPermission(['tracking:read', 'tracking:read:own']),
  trackingController.getShipmentTracking
);

/**
 * @swagger
 * /api/tracking:
 *   post:
 *     summary: Create tracking update
 *     tags: [Tracking]
 */
router.post(
  '/',
  hasPermission('tracking:write'),
  trackingController.createTrackingUpdate
);

/**
 * @swagger
 * /api/tracking/{id}:
 *   put:
 *     summary: Update tracking update
 *     tags: [Tracking]
 */
router.put(
  '/:id',
  hasPermission('tracking:write'),
  trackingController.updateTrackingUpdate
);

/**
 * @swagger
 * /api/tracking/{id}:
 *   delete:
 *     summary: Delete tracking update
 *     tags: [Tracking]
 */
router.delete(
  '/:id',
  hasPermission('tracking:write'),
  trackingController.deleteTrackingUpdate
);

module.exports = router;
```

---

### 7.9 Invoice Routes
**File**: `apps/api/src/routes/invoiceRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/invoices/stats:
 *   get:
 *     summary: Get invoice statistics
 *     tags: [Invoices]
 */
router.get(
  '/stats',
  hasAnyPermission(['invoices:read', 'invoices:read:own']),
  invoiceController.getInvoiceStats
);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 */
router.get(
  '/',
  hasAnyPermission(['invoices:read', 'invoices:read:own']),
  invoiceController.getAllInvoices
);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 */
router.get(
  '/:id',
  hasAnyPermission(['invoices:read', 'invoices:read:own']),
  invoiceController.getInvoice
);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create new invoice
 *     tags: [Invoices]
 */
router.post(
  '/',
  hasPermission('invoices:write'),
  invoiceController.createInvoice
);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [Invoices]
 */
router.put(
  '/:id',
  hasPermission('invoices:write'),
  invoiceController.updateInvoice
);

/**
 * @swagger
 * /api/invoices/{id}/pay:
 *   put:
 *     summary: Mark invoice as paid
 *     tags: [Invoices]
 */
router.put(
  '/:id/pay',
  hasPermission('invoices:write'),
  invoiceController.markInvoiceAsPaid
);

/**
 * @swagger
 * /api/invoices/{id}/cancel:
 *   put:
 *     summary: Cancel invoice
 *     tags: [Invoices]
 */
router.put(
  '/:id/cancel',
  hasPermission('invoices:write'),
  invoiceController.cancelInvoice
);

module.exports = router;
```

---

### 7.10 Support Routes
**File**: `apps/api/src/routes/supportRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { auth } = require('../middleware/auth');
const { hasPermission, hasAnyPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/support/stats:
 *   get:
 *     summary: Get support ticket statistics
 *     tags: [Support]
 */
router.get(
  '/stats',
  hasAnyPermission(['support:read', 'support:read:own']),
  supportController.getTicketStats
);

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Get all support tickets
 *     tags: [Support]
 */
router.get(
  '/',
  hasAnyPermission(['support:read', 'support:read:own']),
  supportController.getAllTickets
);

/**
 * @swagger
 * /api/support/{id}:
 *   get:
 *     summary: Get support ticket by ID
 *     tags: [Support]
 */
router.get(
  '/:id',
  hasAnyPermission(['support:read', 'support:read:own']),
  supportController.getTicket
);

/**
 * @swagger
 * /api/support:
 *   post:
 *     summary: Create new support ticket
 *     tags: [Support]
 */
router.post('/', supportController.createTicket);

/**
 * @swagger
 * /api/support/{id}:
 *   put:
 *     summary: Update support ticket
 *     tags: [Support]
 */
router.put(
  '/:id',
  hasPermission('support:write'),
  supportController.updateTicket
);

/**
 * @swagger
 * /api/support/{id}/messages:
 *   post:
 *     summary: Add message to support ticket
 *     tags: [Support]
 */
router.post('/:id/messages', supportController.addMessage);

/**
 * @swagger
 * /api/support/{id}/close:
 *   put:
 *     summary: Close support ticket
 *     tags: [Support]
 */
router.put(
  '/:id/close',
  hasPermission('support:write'),
  supportController.closeTicket
);

module.exports = router;
```

---

## 8. SERVER INTEGRATION & SWAGGER

### 8.1 Swagger Configuration
**File**: `apps/api/src/config/swagger.js`

```javascript
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ceylon Cargo Transport API',
      version: '1.0.0',
      description: 'Comprehensive logistics management system API',
      contact: {
        name: 'CCT Support',
        email: 'info.cct@ceylongrp.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.cct.ceylongrp.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
```

---

### 8.2 Complete server.js with All Routes
**File**: `apps/api/server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./src/config/database');
const swaggerSpec = require('./src/config/swagger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// ===== DATABASE CONNECTION =====
connectDB();

// ===== SWAGGER DOCUMENTATION =====
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Ceylon Cargo Transport API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===== API ROUTES =====
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/roles', require('./src/routes/roleRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));
app.use('/api/containers', require('./src/routes/containerRoutes'));
app.use('/api/suppliers', require('./src/routes/supplierRoutes'));
app.use('/api/shipments', require('./src/routes/shipmentRoutes'));
app.use('/api/tracking', require('./src/routes/trackingRoutes'));
app.use('/api/invoices', require('./src/routes/invoiceRoutes'));
app.use('/api/support', require('./src/routes/supportRoutes'));

// ===== 404 HANDLER =====
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use(errorHandler);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
============================================
  Ceylon Cargo Transport API Server
============================================
  Status: Running
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  URL: http://localhost:${PORT}
  API Docs: http://localhost:${PORT}/api-docs
============================================
  `);
});

// ===== UNHANDLED REJECTION HANDLER =====
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});
```

---

## 9. ENVIRONMENT VARIABLES

**File**: `apps/api/.env.example`

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cct_database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Email Configuration (Namecheap Private Email)
EMAIL_HOST=mail.privateemail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=info.cct@ceylongrp.com
EMAIL_PASS=your-email-password
EMAIL_FROM=Ceylon Cargo Transport <info.cct@ceylongrp.com>

# Frontend URLs (for email links)
ADMIN_URL=http://localhost:3000
CLIENT_URL=http://localhost:3001

# Production URLs
# ADMIN_URL=https://admin.cct.ceylongrp.com
# CLIENT_URL=https://client.cct.ceylongrp.com
```

**Note**: Copy this to `apps/api/.env` and fill in your actual values.

---

## 10. DATABASE SEED SCRIPT

**File**: `apps/api/src/scripts/seedDatabase.js`

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Role = require('../models/Role');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing roles and users...');
    await Role.deleteMany({});
    await User.deleteMany({});

    // ===== CREATE ROLES =====
    console.log('📝 Creating roles...');

    const superAdminRole = await Role.create({
      name: 'super_admin',
      displayName: 'Super Administrator',
      description: 'Full system access with all permissions',
      userType: 'admin',
      isSystem: true,
      permissions: ['*'], // Wildcard - all permissions
    });

    const adminRole = await Role.create({
      name: 'admin',
      displayName: 'Administrator',
      description: 'Administrative access with most permissions',
      userType: 'admin',
      isSystem: true,
      permissions: [
        'users:read',
        'users:write',
        'roles:read',
        'shipments:read',
        'shipments:write',
        'containers:read',
        'containers:write',
        'clients:read',
        'clients:write',
        'suppliers:read',
        'suppliers:write',
        'tracking:read',
        'tracking:write',
        'reports:read',
        'reports:write',
        'invoices:read',
        'invoices:write',
        'support:read',
        'support:write',
        'settings:read',
        'settings:write',
      ],
    });

    const operationsManagerRole = await Role.create({
      name: 'operations_manager',
      displayName: 'Operations Manager',
      description: 'Manage shipments, containers, and tracking',
      userType: 'admin',
      isSystem: true,
      permissions: [
        'shipments:read',
        'shipments:write',
        'containers:read',
        'containers:write',
        'suppliers:read',
        'tracking:read',
        'tracking:write',
        'clients:read',
        'support:read',
        'support:write',
      ],
    });

    const clientUserRole = await Role.create({
      name: 'client_user',
      displayName: 'Client User',
      description: 'Client portal access with limited permissions',
      userType: 'client',
      isSystem: true,
      permissions: [
        'shipments:read:own',
        'tracking:read:own',
        'invoices:read:own',
        'support:read:own',
        'support:write',
        'profile:read',
        'profile:write',
      ],
    });

    console.log('✅ Roles created successfully');

    // ===== CREATE SUPER ADMIN USER =====
    console.log('👤 Creating super admin user...');

    const superAdminUser = await User.create({
      email: 'admin@cct.ceylongrp.com',
      password: 'Admin@123456', // Will be hashed by pre-save hook
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+94771234567',
      role: superAdminRole._id,
      userType: 'admin',
      status: 'active',
      emailVerified: true,
    });

    console.log('✅ Super admin user created successfully');
    console.log('\n========================================');
    console.log('🎉 Database seed completed!');
    console.log('========================================');
    console.log('\n📋 Created Roles:');
    console.log(`  - ${superAdminRole.displayName} (${superAdminRole.name})`);
    console.log(`  - ${adminRole.displayName} (${adminRole.name})`);
    console.log(
      `  - ${operationsManagerRole.displayName} (${operationsManagerRole.name})`
    );
    console.log(`  - ${clientUserRole.displayName} (${clientUserRole.name})`);
    console.log('\n👤 Super Admin Credentials:');
    console.log('   Email: admin@cct.ceylongrp.com');
    console.log('   Password: Admin@123456');
    console.log('\n⚠️  Please change the password after first login!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
```

---

## 11. RUN THE SEED SCRIPT

Add this script to `apps/api/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "seed": "node src/scripts/seedDatabase.js"
  }
}
```

Then run:
```bash
cd apps/api
npm run seed
```

---

## 12. TESTING THE API

After starting the server (`npm run dev` in `apps/api`), you can:

1. **Access Swagger Documentation**: http://localhost:5000/api-docs

2. **Test Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cct.ceylongrp.com",
    "password": "Admin@123456"
  }'
```

3. **Test Protected Route**:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 13. NEXT STEPS

1. ✅ Copy all controller files to `apps/api/src/controllers/`
2. ✅ Copy all route files to `apps/api/src/routes/`
3. ✅ Copy `swagger.js` to `apps/api/src/config/`
4. ✅ Update `server.js` with all routes
5. ✅ Create `.env` file from `.env.example`
6. ✅ Run seed script: `npm run seed`
7. ✅ Start server: `npm run dev`
8. ✅ Test API with Swagger at http://localhost:5000/api-docs

---

🎉 **BACKEND WEEK 1-2 COMPLETE!** 🎉

You now have a fully functional backend with:
- ✅ 10 Database models with auto-ID generation
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ 50+ API endpoints
- ✅ Email service integration
- ✅ Swagger documentation
- ✅ Error handling
- ✅ Request validation

Ready to proceed to Week 3-4 (Frontend Integration) when you're ready!
