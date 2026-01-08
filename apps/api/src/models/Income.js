const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    shipmentId: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    clientId: {
      type: String,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    invoiceId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'Wire Transfer', 'Other'],
      default: 'Bank Transfer',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'received', 'partially_paid'],
      default: 'pending',
      index: true,
    },
    amountReceived: {
      type: Number,
      min: 0,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
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

// Indexes for performance
incomeSchema.index({ date: -1, status: 1 });
incomeSchema.index({ source: 1, date: -1 });
incomeSchema.index({ createdBy: 1, date: -1 });
incomeSchema.index({ dueDate: 1, status: 1 });

// Virtuals
incomeSchema.virtual('isReceived').get(function() {
  return this.status === 'received';
});

incomeSchema.virtual('isPending').get(function() {
  return this.status === 'pending';
});

incomeSchema.virtual('balanceDue').get(function() {
  return this.amount - (this.amountReceived || 0);
});

incomeSchema.virtual('isOverdue').get(function() {
  if (this.status === 'received') return false;
  if (!this.dueDate) return false;
  return new Date() > new Date(this.dueDate);
});

// Methods
incomeSchema.methods.markAsReceived = function(amountReceived) {
  this.status = 'received';
  this.amountReceived = amountReceived || this.amount;
  return this.save();
};

incomeSchema.methods.recordPartialPayment = function(amount) {
  this.amountReceived = (this.amountReceived || 0) + amount;
  if (this.amountReceived >= this.amount) {
    this.status = 'received';
  } else {
    this.status = 'partially_paid';
  }
  return this.save();
};

// Static methods
incomeSchema.statics.getTotalBySource = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        status: 'received',
      },
    },
    {
      $group: {
        _id: '$source',
        total: { $sum: '$amountReceived' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

incomeSchema.statics.getTotalByStatus = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        totalReceived: { $sum: '$amountReceived' },
        count: { $sum: 1 },
      },
    },
  ]);
};

incomeSchema.statics.getMonthlyIncome = async function(year) {
  return this.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
        status: 'received',
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
        total: { $sum: '$amountReceived' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);
};

incomeSchema.statics.getOutstandingReceivables = async function() {
  return this.aggregate([
    {
      $match: {
        status: { $in: ['pending', 'partially_paid'] },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: {
            $subtract: ['$amount', { $ifNull: ['$amountReceived', 0] }],
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
