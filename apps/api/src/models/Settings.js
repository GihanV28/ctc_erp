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