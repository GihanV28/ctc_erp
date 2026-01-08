const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      // Format: CLT-001, CLT-002, etc. (Auto-generated in pre-save hook)
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    tradingName: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    contactPerson: {
      firstName: {
        type: String,
        required: [true, 'Contact person first name is required'],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, 'Contact person last name is required'],
        trim: true,
      },
      position: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Contact email is required'],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, 'Contact phone is required'],
        trim: true,
      },
      alternatePhone: String,
    },
    address: {
      street: String,
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: String,
      postalCode: String,
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      sameAsAddress: {
        type: Boolean,
        default: true,
      },
    },
    source: {
      type: String,
      enum: ['portal', 'direct', 'referral'],
      default: 'direct',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    paymentTerms: {
      type: Number, // Days
      enum: [15, 30, 45, 60, 90],
      default: 30,
    },
    taxId: String,
    registrationNumber: String,
    notes: String,
    tags: [String],
    preferredCurrency: {
      type: String,
      default: 'USD',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
clientSchema.index({ clientId: 1 }, { unique: true });
clientSchema.index({ 'contactPerson.email': 1 });
clientSchema.index({ status: 1 });

// Virtual for total shipments
clientSchema.virtual('shipments', {
  ref: 'Shipment',
  localField: '_id',
  foreignField: 'client',
});

// Auto-generate client ID
clientSchema.pre('save', async function (next) {
  if (this.clientId) return next();

  try {
    // Find the highest client ID
    const lastClient = await this.constructor
      .findOne({}, { clientId: 1 })
      .sort({ clientId: -1 })
      .limit(1);

    if (lastClient && lastClient.clientId) {
      const lastNumber = parseInt(lastClient.clientId.split('-')[1]);
      this.clientId = `CLT-${String(lastNumber + 1).padStart(3, '0')}`;
    } else {
      this.clientId = 'CLT-001';
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
