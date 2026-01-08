const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
    },
    tradingName: {
      type: String,
      trim: true,
    },
    serviceTypes: {
      type: [String],
      required: [true, 'At least one service type is required'],
      enum: [
        'ocean_freight',
        'air_sea',
        'container',
        'port_ops',
        'warehouse',
        'customs',
        'ground',
        'express',
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
    banking: {
      bankName: String,
      swiftCode: String,
      accountName: String,
      accountNumber: String,
    },
    contracts: [
      {
        contractId: String,
        value: Number,
        startDate: Date,
        endDate: Date,
        status: {
          type: String,
          enum: ['active', 'pending', 'expired', 'cancelled'],
          default: 'pending',
        },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    paymentTerms: {
      type: String,
      enum: ['net_15', 'net_30', 'net_45', 'net_60', 'net_90', 'immediate', 'custom'],
      default: 'net_30',
    },
    tags: [String],
    notes: String,
    performanceMetrics: {
      totalShipments: {
        type: Number,
        default: 0,
      },
      activeContracts: {
        type: Number,
        default: 0,
      },
      onTimeRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
supplierSchema.index({ supplierId: 1 });
supplierSchema.index({ serviceTypes: 1 });
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