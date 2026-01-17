const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      unique: true,
      uppercase: true,
    },
    invoiceNumber: {
      type: String,
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
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: String,
    paidDate: Date,
    notes: String,
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

// Auto-generate invoice ID and number
invoiceSchema.pre('save', async function (next) {
  if (this.invoiceId && this.invoiceNumber) return next();

  try {
    // Generate invoice ID (INV-001)
    if (!this.invoiceId) {
      const lastInvoice = await this.constructor
        .findOne({}, { invoiceId: 1 })
        .sort({ invoiceId: -1 })
        .limit(1);

      let nextNumber = 1;
      if (lastInvoice && lastInvoice.invoiceId) {
        const parts = lastInvoice.invoiceId.split('-');
        nextNumber = parseInt(parts[1]) + 1;
      }

      this.invoiceId = `INV-${String(nextNumber).padStart(3, '0')}`;
    }

    // Generate invoice number (CCT-INV-2024-0001)
    if (!this.invoiceNumber) {
      const year = new Date().getFullYear();
      const lastInvoiceNum = await this.constructor
        .findOne({ invoiceNumber: new RegExp(`^CCT-INV-${year}`) })
        .sort({ invoiceNumber: -1 })
        .limit(1);

      let nextNumber = 1;
      if (lastInvoiceNum && lastInvoiceNum.invoiceNumber) {
        const parts = lastInvoiceNum.invoiceNumber.split('-');
        nextNumber = parseInt(parts[3]) + 1;
      }

      this.invoiceNumber = `CCT-INV-${year}-${String(nextNumber).padStart(4, '0')}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Calculate totals
invoiceSchema.pre('save', function (next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);

  // Calculate total
  this.total = this.subtotal + this.tax;

  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;