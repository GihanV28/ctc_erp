const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema(
  {
    containerId: {
      type: String,
      unique: true,
      uppercase: true,
    },
    containerNumber: {
      type: String,
      required: [true, 'Container number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Container type is required'],
      enum: [
        '20ft_standard',
        '40ft_standard',
        '40ft_high_cube',
        '20ft_high_cube',
        '40ft_refrigerated',
        '20ft_refrigerated',
      ],
    },
    status: {
      type: String,
      enum: ['available', 'in_use', 'maintenance', 'damaged'],
      default: 'available',
    },
    location: String,
    currentShipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good',
    },
    lastInspectionDate: Date,
    purchaseDate: Date,
    purchasePrice: Number,
  },
  {
    timestamps: true,
  }
);

// Indexes
containerSchema.index({ containerId: 1 });
containerSchema.index({ containerNumber: 1 });
containerSchema.index({ status: 1 });
containerSchema.index({ type: 1 });

// Auto-generate container ID
containerSchema.pre('save', async function (next) {
  if (this.containerId) return next();

  try {
    const lastContainer = await this.constructor
      .findOne({}, { containerId: 1 })
      .sort({ containerId: -1 })
      .limit(1);

    let nextNumber = 1;
    if (lastContainer && lastContainer.containerId) {
      const parts = lastContainer.containerId.split('-');
      nextNumber = parseInt(parts[1]) + 1;
    }

    this.containerId = `CNT-${String(nextNumber).padStart(3, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;