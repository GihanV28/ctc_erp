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