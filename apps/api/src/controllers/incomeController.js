const Income = require('../models/Income');
const IncomeSource = require('../models/IncomeSource');

// Get all income with filtering and pagination
exports.getAllIncome = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      source,
      status,
      startDate,
      endDate,
      search,
    } = req.query;

    const query = {};

    if (source) query.source = source;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { invoiceId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [incomeRecords, total] = await Promise.all([
      Income.find(query)
        .populate('shipment', 'shipmentId trackingNumber')
        .populate('client', 'clientId companyName contactPerson')
        .populate('invoice', 'invoiceNumber')
        .populate('createdBy', 'name email')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Income.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        income: incomeRecords,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve income records',
      error: error.message,
    });
  }
};

// Get single income by ID
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id)
      .populate('shipment', 'shipmentId trackingNumber')
      .populate('client', 'clientId companyName contactPerson')
      .populate('invoice', 'invoiceNumber totalAmount')
      .populate('createdBy', 'name email')
      .lean();

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    res.json({
      success: true,
      data: { income },
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve income record',
      error: error.message,
    });
  }
};

// Create new income
exports.createIncome = async (req, res) => {
  try {
    const incomeData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const income = await Income.create(incomeData);

    const populatedIncome = await Income.findById(income._id)
      .populate('shipment', 'shipmentId trackingNumber')
      .populate('client', 'clientId companyName')
      .populate('invoice', 'invoiceNumber')
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Income record created successfully',
      data: { income: populatedIncome },
    });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create income record',
      error: error.message,
    });
  }
};

// Update income
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      income[key] = req.body[key];
    });

    await income.save();

    const updatedIncome = await Income.findById(income._id)
      .populate('shipment', 'shipmentId trackingNumber')
      .populate('client', 'clientId companyName')
      .populate('invoice', 'invoiceNumber')
      .populate('createdBy', 'name email')
      .lean();

    res.json({
      success: true,
      message: 'Income record updated successfully',
      data: { income: updatedIncome },
    });
  } catch (error) {
    console.error('Update income error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update income record',
      error: error.message,
    });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    await income.deleteOne();

    res.json({
      success: true,
      message: 'Income record deleted successfully',
    });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete income record',
      error: error.message,
    });
  }
};

// Get income statistics
exports.getIncomeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const [totalStats, sourceStats, statusStats, receivables] = await Promise.all([
      Income.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: '$amount' },
            totalReceived: { $sum: '$amountReceived' },
            count: { $sum: 1 },
            avgIncome: { $avg: '$amount' },
          },
        },
      ]),
      Income.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$source',
            total: { $sum: '$amountReceived' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
      Income.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            total: { $sum: '$amount' },
            totalReceived: { $sum: '$amountReceived' },
            count: { $sum: 1 },
          },
        },
      ]),
      Income.aggregate([
        {
          $match: {
            status: { $in: ['pending', 'partially_paid'] },
          },
        },
        {
          $group: {
            _id: null,
            totalOutstanding: {
              $sum: {
                $subtract: ['$amount', { $ifNull: ['$amountReceived', 0] }],
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          total: totalStats[0] || { totalIncome: 0, totalReceived: 0, count: 0, avgIncome: 0 },
          bySource: sourceStats,
          byStatus: statusStats,
          outstandingReceivables: receivables[0] || { totalOutstanding: 0, count: 0 },
        },
      },
    });
  } catch (error) {
    console.error('Get income stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve income statistics',
      error: error.message,
    });
  }
};

// Record payment for income
exports.recordPayment = async (req, res) => {
  try {
    const { amountReceived } = req.body;
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    if (!amountReceived || amountReceived <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required',
      });
    }

    await income.recordPartialPayment(parseFloat(amountReceived));

    const updatedIncome = await Income.findById(income._id)
      .populate('shipment', 'shipmentId trackingNumber')
      .populate('client', 'clientId companyName')
      .populate('invoice', 'invoiceNumber')
      .populate('createdBy', 'name email')
      .lean();

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: { income: updatedIncome },
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message,
    });
  }
};

// Get all income sources
exports.getIncomeSources = async (req, res) => {
  try {
    const sources = await IncomeSource.getActiveSources();

    res.json({
      success: true,
      data: { sources },
    });
  } catch (error) {
    console.error('Get income sources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve income sources',
      error: error.message,
    });
  }
};

// Create new income source
exports.createIncomeSource = async (req, res) => {
  try {
    const { label } = req.body;

    // Create value from label (lowercase, replace spaces with underscores)
    const value = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const source = await IncomeSource.create({
      value,
      label,
      description: req.body.description,
      isSystem: false,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Income source created successfully',
      data: { source },
    });
  } catch (error) {
    console.error('Create income source error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A source with this name already exists',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Failed to create income source',
      error: error.message,
    });
  }
};

// Delete income source (only non-system sources)
exports.deleteIncomeSource = async (req, res) => {
  try {
    const source = await IncomeSource.findById(req.params.id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found',
      });
    }

    if (source.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete system sources',
      });
    }

    // Check if any income records use this source
    const incomeCount = await Income.countDocuments({ source: source.value });
    if (incomeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete source. ${incomeCount} income record(s) are using this source.`,
      });
    }

    await source.deleteOne();

    res.json({
      success: true,
      message: 'Source deleted successfully',
    });
  } catch (error) {
    console.error('Delete income source error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete source',
      error: error.message,
    });
  }
};
