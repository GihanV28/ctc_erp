const mongoose = require('mongoose');

const incomeSourceSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    isSystem: {
      type: Boolean,
      default: false, // System sources cannot be deleted
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
incomeSourceSchema.index({ value: 1, isActive: 1 });
incomeSourceSchema.index({ isActive: 1, createdAt: -1 });

// Prevent deletion of system sources
incomeSourceSchema.pre('remove', function(next) {
  if (this.isSystem) {
    next(new Error('Cannot delete system income sources'));
  } else {
    next();
  }
});

// Static method to get all active sources
incomeSourceSchema.statics.getActiveSources = async function() {
  return this.find({ isActive: true }).sort({ label: 1 });
};

// Static method to initialize default sources
incomeSourceSchema.statics.initializeDefaultSources = async function() {
  const defaultSources = [
    { value: 'freight_charges', label: 'Freight Charges', isSystem: true },
    { value: 'handling_fees', label: 'Handling Fees', isSystem: true },
    { value: 'storage_fees', label: 'Storage Fees', isSystem: true },
    { value: 'documentation_fees', label: 'Documentation Fees', isSystem: true },
    { value: 'insurance_charges', label: 'Insurance Charges', isSystem: true },
    { value: 'late_payment_fees', label: 'Late Payment Fees', isSystem: true },
    { value: 'other_services', label: 'Other Services', isSystem: true },
    { value: 'other', label: 'Other Income', isSystem: true },
  ];

  for (const source of defaultSources) {
    await this.findOneAndUpdate(
      { value: source.value },
      source,
      { upsert: true, new: true }
    );
  }
};

const IncomeSource = mongoose.model('IncomeSource', incomeSourceSchema);

module.exports = IncomeSource;
