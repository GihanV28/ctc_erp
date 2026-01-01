const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      unique: true,
      uppercase: true,
    },
    trackingNumber: {
      type: String,
      unique: true,
      uppercase: true,
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
    cargo: {
      description: {
        type: String,
        required: true,
      },
      weight: Number, // kg
      volume: Number, // m³
      quantity: Number,
      containerType: String, // Type of container used
    },
    dates: {
      bookingDate: Date,
      departureDate: Date,
      estimatedArrival: Date,
      actualArrival: Date,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
shipmentSchema.index({ shipmentId: 1 });
shipmentSchema.index({ trackingNumber: 1 });
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
  if (this.shipmentId && this.trackingNumber) return next();

  try {
    // Generate shipment ID (SHP-001)
    if (!this.shipmentId) {
      const lastShipment = await this.constructor
        .findOne({}, { shipmentId: 1 })
        .sort({ shipmentId: -1 })
        .limit(1);

      let nextNumber = 1;
      if (lastShipment && lastShipment.shipmentId) {
        const parts = lastShipment.shipmentId.split('-');
        nextNumber = parseInt(parts[1]) + 1;
      }

      this.shipmentId = `SHP-${String(nextNumber).padStart(3, '0')}`;
    }

    // Generate tracking number (CCT + year + sequential number)
    if (!this.trackingNumber) {
      const year = new Date().getFullYear();
      const lastTracking = await this.constructor
        .findOne({ trackingNumber: new RegExp(`^CCT${year}`) })
        .sort({ trackingNumber: -1 })
        .limit(1);

      let nextNumber = 1;
      if (lastTracking && lastTracking.trackingNumber) {
        nextNumber = parseInt(lastTracking.trackingNumber.slice(-3)) + 1;
      }

      this.trackingNumber = `CCT${year}${String(nextNumber).padStart(3, '0')}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;