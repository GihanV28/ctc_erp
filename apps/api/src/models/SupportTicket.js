const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['general', 'shipment', 'billing', 'technical', 'complaint'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
      default: 'open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedShipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        isInternal: {
          type: Boolean,
          default: false, // Internal notes vs customer-facing
        },
        attachments: [
          {
            filename: String,
            url: String,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolution: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
supportTicketSchema.index({ ticketNumber: 1 });
supportTicketSchema.index({ client: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ priority: 1 });

// Auto-generate ticket number
supportTicketSchema.pre('save', async function (next) {
  if (!this.isNew || this.ticketNumber) return next();

  try {
    const year = new Date().getFullYear();

    const lastTicket = await this.constructor
      .findOne({ ticketNumber: new RegExp(`^TKT-${year}`) })
      .sort({ ticketNumber: -1 })
      .limit(1);

    let nextNumber = 1;
    if (lastTicket && lastTicket.ticketNumber) {
      const parts = lastTicket.ticketNumber.split('-');
      nextNumber = parseInt(parts[2]) + 1;
    }

    this.ticketNumber = `TKT-${year}-${String(nextNumber).padStart(5, '0')}`;

    next();
  } catch (error) {
    next(error);
  }
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;