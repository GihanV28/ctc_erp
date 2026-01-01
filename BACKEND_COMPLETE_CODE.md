# Ceylon Cargo Transport - Complete Backend Code Reference

**Complete code for Week 1-2: Backend Development**

Use this document to create all backend files. Each section shows the exact file path and complete code.

---

## 📁 **Folder Structure**

```
apps/api/
├── server.js (updated)
├── .env (configuration)
└── src/
    ├── config/
    │   ├── database.js ✅ (already created)
    │   ├── constants.js
    │   └── swagger.js
    ├── models/
    │   ├── Role.js ✅ (already created)
    │   ├── User.js ✅ (already created)
    │   ├── Client.js ✅ (already created)
    │   ├── Container.js
    │   ├── Supplier.js
    │   ├── Shipment.js
    │   ├── TrackingUpdate.js
    │   ├── Invoice.js
    │   ├── SupportTicket.js
    │   └── Settings.js
    ├── middleware/
    │   ├── auth.js
    │   ├── rbac.js
    │   ├── errorHandler.js
    │   └── validate.js
    ├── utils/
    │   ├── jwt.js
    │   ├── ApiError.js
    │   ├── ApiResponse.js
    │   └── asyncHandler.js
    ├── services/
    │   └── emailService.js
    ├── validators/
    │   ├── authValidators.js
    │   └── userValidators.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── roleController.js
    │   ├── clientController.js
    │   ├── containerController.js
    │   ├── supplierController.js
    │   ├── shipmentController.js
    │   └── trackingController.js
    └── routes/
        ├── auth.routes.js
        ├── user.routes.js
        ├── role.routes.js
        ├── client.routes.js
        ├── container.routes.js
        ├── supplier.routes.js
        ├── shipment.routes.js
        └── tracking.routes.js
```

---

## 🗄️ **DATABASE MODELS** (Remaining 7 models)

### **File:** `src/models/Container.js`

\`\`\`javascript
const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema(
  {
    containerNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow null for new containers
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Container type is required'],
      enum: [
        '20ft Standard',
        '40ft Standard',
        '40ft High Cube',
        '20ft High Cube',
        '40ft Refrigerated',
        '20ft Refrigerated',
      ],
    },
    status: {
      type: String,
      enum: ['available', 'in_use', 'maintenance', 'retired'],
      default: 'available',
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'under_repair'],
      default: 'good',
    },
    location: {
      name: {
        type: String,
        required: [true, 'Location name is required'],
      },
      city: String,
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    capacity: {
      volume: {
        type: Number, // in m³
        required: true,
      },
      maxWeight: {
        type: Number, // in kg
        required: true,
      },
    },
    manufacturingDate: Date,
    lastInspectionDate: Date,
    nextMaintenanceDate: Date,
    currentShipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
containerSchema.index({ containerNumber: 1 });
containerSchema.index({ status: 1 });
containerSchema.index({ type: 1 });

// Auto-set capacity based on type
containerSchema.pre('save', function (next) {
  if (this.isModified('type')) {
    const capacities = {
      '20ft Standard': { volume: 33.2, maxWeight: 21750 },
      '40ft Standard': { volume: 67.5, maxWeight: 26680 },
      '40ft High Cube': { volume: 76.3, maxWeight: 28580 },
      '20ft High Cube': { volume: 37.4, maxWeight: 21600 },
      '40ft Refrigerated': { volume: 67.3, maxWeight: 26580 },
      '20ft Refrigerated': { volume: 28.3, maxWeight: 21520 },
    };

    if (capacities[this.type]) {
      this.capacity = capacities[this.type];
    }
  }
  next();
});

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;
\`\`\`

---

### **File:** `src/models/Supplier.js`

\`\`\`javascript
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    tradingName: String,
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: [
        'ocean_freight',
        'air_sea_freight',
        'container_leasing',
        'port_operations',
        'warehousing',
        'customs_clearance',
        'ground_transport',
        'express_shipping',
      ],
    },
    contactPerson: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      position: String,
      email: {
        type: String,
        required: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    address: {
      street: String,
      city: {
        type: String,
        required: true,
      },
      state: String,
      postalCode: String,
      country: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    paymentTerms: {
      type: Number, // Days
      enum: [15, 30, 45, 60, 90],
      default: 30,
    },
    bankDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      swiftCode: String,
    },
    contracts: [
      {
        contractId: String,
        startDate: Date,
        endDate: Date,
        value: Number,
        status: {
          type: String,
          enum: ['active', 'pending', 'expired', 'terminated'],
          default: 'pending',
        },
      },
    ],
    notes: String,
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes
supplierSchema.index({ supplierId: 1 });
supplierSchema.index({ serviceType: 1 });
supplierSchema.index({ status: 1 });

// Auto-generate supplier ID
supplierSchema.pre('save', async function (next) {
  if (!this.isNew || this.supplierId) return next();

  try {
    const lastSupplier = await this.constructor
      .findOne({}, { supplierId: 1 })
      .sort({ supplierId: -1 })
      .limit(1);

    if (lastSupplier && lastSupplier.supplierId) {
      const lastNumber = parseInt(lastSupplier.supplierId.split('-')[1]);
      this.supplierId = `SUP-${String(lastNumber + 1).padStart(3, '0')}`;
    } else {
      this.supplierId = 'SUP-001';
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
\`\`\`

---

### **File:** `src/models/Shipment.js`

\`\`\`javascript
const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required'],
    },
    origin: {
      port: {
        type: String,
        required: true,
      },
      city: String,
      country: {
        type: String,
        required: true,
      },
      address: String,
    },
    destination: {
      port: {
        type: String,
        required: true,
      },
      city: String,
      country: {
        type: String,
        required: true,
      },
      address: String,
    },
    shipmentType: {
      type: String,
      enum: ['ocean', 'air', 'ground'],
      default: 'ocean',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'in_transit',
        'customs',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'on_hold',
      ],
      default: 'pending',
    },
    containers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Container',
      },
    ],
    cargo: {
      description: {
        type: String,
        required: true,
      },
      weight: Number, // kg
      volume: Number, // m³
      quantity: Number,
      hsCode: String, // Harmonized System Code
      value: Number, // USD
    },
    dates: {
      estimatedDeparture: Date,
      actualDeparture: Date,
      estimatedArrival: Date,
      actualArrival: Date,
      deliveryDate: Date,
    },
    carrier: {
      name: String,
      vessel: String,
      voyageNumber: String,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    pricing: {
      oceanFreight: Number,
      localCharges: Number,
      customsFees: Number,
      insurance: Number,
      otherFees: Number,
      total: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    documents: [
      {
        name: String,
        type: String, // bill_of_lading, invoice, packing_list, etc.
        url: String,
        uploadedAt: Date,
      },
    ],
    notes: String,
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
shipmentSchema.index({ shipmentId: 1 });
shipmentSchema.index({ trackingId: 1 });
shipmentSchema.index({ client: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ 'dates.estimatedArrival': 1 });

// Virtual for tracking updates
shipmentSchema.virtual('trackingUpdates', {
  ref: 'TrackingUpdate',
  localField: '_id',
  foreignField: 'shipment',
  options: { sort: { timestamp: -1 } },
});

// Auto-generate shipment and tracking IDs
shipmentSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    // Generate shipment ID (SHIP-001-2024)
    const year = new Date().getFullYear();
    const lastShipment = await this.constructor
      .findOne({ shipmentId: new RegExp(`^SHIP-.*-${year}$`) })
      .sort({ shipmentId: -1 })
      .limit(1);

    let nextNumber = 1;
    if (lastShipment && lastShipment.shipmentId) {
      const parts = lastShipment.shipmentId.split('-');
      nextNumber = parseInt(parts[1]) + 1;
    }

    this.shipmentId = `SHIP-${String(nextNumber).padStart(3, '0')}-${year}`;

    // Generate tracking ID (random 13-digit number)
    this.trackingId = Math.floor(3000000000000 + Math.random() * 7000000000000).toString();

    next();
  } catch (error) {
    next(error);
  }
});

// Calculate total pricing
shipmentSchema.pre('save', function (next) {
  if (this.pricing) {
    this.pricing.total =
      (this.pricing.oceanFreight || 0) +
      (this.pricing.localCharges || 0) +
      (this.pricing.customsFees || 0) +
      (this.pricing.insurance || 0) +
      (this.pricing.otherFees || 0);
  }
  next();
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
\`\`\`

---

### **File:** `src/models/TrackingUpdate.js`

\`\`\`javascript
const mongoose = require('mongoose');

const trackingUpdateSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      required: [true, 'Shipment is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: [
        'order_confirmed',
        'picked_up',
        'in_transit',
        'at_origin_port',
        'departed_origin',
        'at_sea',
        'arrived_destination_port',
        'customs_clearance',
        'out_for_delivery',
        'delivered',
        'delayed',
        'exception',
      ],
    },
    location: {
      name: {
        type: String,
        required: [true, 'Location name is required'],
      },
      city: String,
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      default: Date.now,
    },
    isPublic: {
      type: Boolean,
      default: true, // Visible to client
    },
    attachments: [
      {
        filename: String,
        url: String,
        size: Number,
        mimeType: String,
      },
    ],
    metadata: {
      temperature: Number, // For refrigerated containers
      humidity: Number,
      customsStatus: String,
      delayReason: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
trackingUpdateSchema.index({ shipment: 1, timestamp: -1 });
trackingUpdateSchema.index({ status: 1 });
trackingUpdateSchema.index({ isPublic: 1 });

// Update shipment status when tracking update is created
trackingUpdateSchema.post('save', async function () {
  const Shipment = mongoose.model('Shipment');

  // Map tracking status to shipment status
  const statusMap = {
    order_confirmed: 'confirmed',
    picked_up: 'in_transit',
    in_transit: 'in_transit',
    at_origin_port: 'in_transit',
    departed_origin: 'in_transit',
    at_sea: 'in_transit',
    arrived_destination_port: 'customs',
    customs_clearance: 'customs',
    out_for_delivery: 'out_for_delivery',
    delivered: 'delivered',
    delayed: 'in_transit',
    exception: 'on_hold',
  };

  const newStatus = statusMap[this.status];
  if (newStatus) {
    await Shipment.findByIdAndUpdate(this.shipment, { status: newStatus });
  }
});

const TrackingUpdate = mongoose.model('TrackingUpdate', trackingUpdateSchema);

module.exports = TrackingUpdate;
\`\`\`

---

### **File:** `src/models/Invoice.js`

\`\`\`javascript
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required'],
    },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      rate: {
        type: Number,
        default: 0, // Percentage
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentDetails: {
      method: String, // bank_transfer, credit_card, cash, etc.
      transactionId: String,
      paidDate: Date,
      paidAmount: Number,
    },
    notes: String,
    terms: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ client: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dueDate: 1 });

// Auto-generate invoice number
invoiceSchema.pre('save', async function (next) {
  if (!this.isNew || this.invoiceNumber) return next();

  try {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    const lastInvoice = await this.constructor
      .findOne({ invoiceNumber: new RegExp(`^INV-${year}${month}`) })
      .sort({ invoiceNumber: -1 })
      .limit(1);

    let nextNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      nextNumber = parseInt(parts[2]) + 1;
    }

    this.invoiceNumber = `INV-${year}${month}-${String(nextNumber).padStart(4, '0')}`;

    next();
  } catch (error) {
    next(error);
  }
});

// Calculate totals
invoiceSchema.pre('save', function (next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);

  // Calculate tax
  this.tax.amount = (this.subtotal * this.tax.rate) / 100;

  // Calculate total
  this.total = this.subtotal + this.tax.amount - this.discount;

  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
\`\`\`

---

### **File:** `src/models/SupportTicket.js`

\`\`\`javascript
const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['general', 'shipment', 'billing', 'technical', 'complaint'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
      default: 'open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedShipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        isInternal: {
          type: Boolean,
          default: false, // Internal notes vs customer-facing
        },
        attachments: [
          {
            filename: String,
            url: String,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolution: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
supportTicketSchema.index({ ticketNumber: 1 });
supportTicketSchema.index({ client: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ priority: 1 });

// Auto-generate ticket number
supportTicketSchema.pre('save', async function (next) {
  if (!this.isNew || this.ticketNumber) return next();

  try {
    const year = new Date().getFullYear();

    const lastTicket = await this.constructor
      .findOne({ ticketNumber: new RegExp(`^TKT-${year}`) })
      .sort({ ticketNumber: -1 })
      .limit(1);

    let nextNumber = 1;
    if (lastTicket && lastTicket.ticketNumber) {
      const parts = lastTicket.ticketNumber.split('-');
      nextNumber = parseInt(parts[2]) + 1;
    }

    this.ticketNumber = `TKT-${year}-${String(nextNumber).padStart(5, '0')}`;

    next();
  } catch (error) {
    next(error);
  }
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
\`\`\`

---

### **File:** `src/models/Settings.js`

\`\`\`javascript
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    value: mongoose.Schema.Types.Mixed, // Can be any type
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'object', 'array'],
      required: true,
    },
    category: {
      type: String,
      enum: ['general', 'email', 'notification', 'billing', 'security'],
      default: 'general',
    },
    description: String,
    isPublic: {
      type: Boolean,
      default: false, // Can clients see this setting?
    },
  },
  {
    timestamps: true,
  }
);

// Index
settingsSchema.index({ key: 1 }, { unique: true });
settingsSchema.index({ category: 1 });

// Static method to get setting value
settingsSchema.statics.get = async function (key) {
  const setting = await this.findOne({ key: key.toUpperCase() });
  return setting ? setting.value : null;
};

// Static method to set setting value
settingsSchema.statics.set = async function (key, value, type) {
  const setting = await this.findOneAndUpdate(
    { key: key.toUpperCase() },
    { value, type: type || typeof value },
    { upsert: true, new: true }
  );
  return setting;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
\`\`\`

---

## 🛡️ **MIDDLEWARE**

### **File:** `src/middleware/auth.js`

\`\`\`javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new ApiError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).populate('role').select('+password');

    if (!user) {
      return next(new ApiError('User no longer exists', 401));
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(new ApiError('Your account is not active', 403));
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new ApiError('Password recently changed. Please log in again', 401));
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError('Token expired', 401));
    }
    return next(new ApiError('Not authorized to access this route', 401));
  }
});

// Restrict to specific user types
exports.restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return next(
        new ApiError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Check if user owns the resource (for clients)
exports.ownsResource = (resourceField = 'client') => {
  return async (req, res, next) => {
    // Admins can access any resource
    if (req.user.userType === 'admin') {
      return next();
    }

    // Clients can only access their own resources
    const resource = req.params.id
      ? await req.model.findById(req.params.id)
      : null;

    if (!resource) {
      return next(new ApiError('Resource not found', 404));
    }

    // Check if the resource belongs to the client
    const resourceClientId = resource[resourceField]?.toString();
    const userClientId = req.user.clientId?.toString();

    if (resourceClientId !== userClientId) {
      return next(
        new ApiError('You do not have permission to access this resource', 403)
      );
    }

    next();
  };
};
\`\`\`

---

### **File:** `src/middleware/rbac.js`

\`\`\`javascript
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Check if user has specific permission
exports.hasPermission = (...permissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }

    // Populate role if not already populated
    if (!req.user.role.permissions) {
      await req.user.populate('role');
    }

    // Check each required permission
    for (const permission of permissions) {
      const hasPermission = await req.user.hasPermission(permission);

      if (!hasPermission) {
        return next(
          new ApiError(`You do not have permission: ${permission}`, 403)
        );
      }
    }

    next();
  });
};

// Check if user has ANY of the permissions
exports.hasAnyPermission = (...permissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }

    // Populate role if not already populated
    if (!req.user.role.permissions) {
      await req.user.populate('role');
    }

    // Check if user has any of the required permissions
    for (const permission of permissions) {
      const hasPermission = await req.user.hasPermission(permission);
      if (hasPermission) {
        return next(); // User has at least one permission
      }
    }

    return next(
      new ApiError('You do not have any of the required permissions', 403)
    );
  });
};
\`\`\`

---

**[CONTINUED IN NEXT MESSAGE - FILE TOO LARGE]**

This is Part 1 of the complete backend code. I'm creating a comprehensive reference document. Should I continue with Part 2 (error handlers, utilities, controllers, routes)?
