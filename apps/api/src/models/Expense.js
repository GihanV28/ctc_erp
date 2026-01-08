const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    category: {
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
    container: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Container',
    },
    containerId: {
      type: String,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    supplierId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'Wire Transfer', 'Other'],
      default: 'Bank Transfer',
    },
    invoiceNumber: {
      type: String,
      sparse: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending',
      index: true,
    },
    attachments: [{
      type: String,
    }],
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
expenseSchema.index({ date: -1, status: 1 });
expenseSchema.index({ category: 1, date: -1 });
expenseSchema.index({ createdBy: 1, date: -1 });

// Virtual for total calculation helpers
expenseSchema.virtual('isPaid').get(function() {
  return this.status === 'paid';
});

expenseSchema.virtual('isPending').get(function() {
  return this.status === 'pending';
});

// Methods
expenseSchema.methods.markAsPaid = function() {
  this.status = 'paid';
  return this.save();
};

expenseSchema.methods.markAsOverdue = function() {
  this.status = 'overdue';
  return this.save();
};

// Static methods
expenseSchema.statics.getTotalByCategory = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        status: 'paid',
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

expenseSchema.statics.getTotalByStatus = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
};

expenseSchema.statics.getMonthlyExpenses = async function(year) {
  return this.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
        status: 'paid',
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);
};

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
