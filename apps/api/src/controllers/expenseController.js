const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');

// Get all expenses with filtering and pagination
exports.getAllExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      startDate,
      endDate,
      search,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .populate('shipment', 'shipmentId trackingNumber')
        .populate('container', 'containerId containerNumber')
        .populate('supplier', 'supplierId name')
        .populate('createdBy', 'name email')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Expense.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message,
    });
  }
};

// Get single expense by ID
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('shipment', 'shipmentId trackingNumber')
      .populate('container', 'containerId containerNumber')
      .populate('supplier', 'supplierId name contactPerson')
      .populate('createdBy', 'name email')
      .lean();

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.json({
      success: true,
      data: { expense },
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expense',
      error: error.message,
    });
  }
};

// Create new expense
exports.createExpense = async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const expense = await Expense.create(expenseData);

    const populatedExpense = await Expense.findById(expense._id)
      .populate('shipment', 'shipmentId trackingNumber')
      .populate('container', 'containerId containerNumber')
      .populate('supplier', 'supplierId name')
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense: populatedExpense },
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message,
    });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      expense[key] = req.body[key];
    });

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id)
      .populate('shipment', 'shipmentId trackingNumber')
      .populate('container', 'containerId containerNumber')
      .populate('supplier', 'supplierId name')
      .populate('createdBy', 'name email')
      .lean();

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense: updatedExpense },
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message,
    });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message,
    });
  }
};

// Get expense statistics
exports.getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const [totalStats, categoryStats, statusStats] = await Promise.all([
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: '$amount' },
            count: { $sum: 1 },
            avgExpense: { $avg: '$amount' },
          },
        },
      ]),
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          total: totalStats[0] || { totalExpenses: 0, count: 0, avgExpense: 0 },
          byCategory: categoryStats,
          byStatus: statusStats,
        },
      },
    });
  } catch (error) {
    console.error('Get expense stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expense statistics',
      error: error.message,
    });
  }
};

// Get all expense categories
exports.getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.getActiveCategories();

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error('Get expense categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expense categories',
      error: error.message,
    });
  }
};

// Create new expense category
exports.createExpenseCategory = async (req, res) => {
  try {
    const { label } = req.body;

    // Create value from label (lowercase, replace spaces with underscores)
    const value = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const category = await ExpenseCategory.create({
      value,
      label,
      description: req.body.description,
      isSystem: false,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Expense category created successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Create expense category error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Failed to create expense category',
      error: error.message,
    });
  }
};

// Delete expense category (only non-system categories)
exports.deleteExpenseCategory = async (req, res) => {
  try {
    const category = await ExpenseCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (category.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete system categories',
      });
    }

    // Check if any expenses use this category
    const expenseCount = await Expense.countDocuments({ category: category.value });
    if (expenseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${expenseCount} expense(s) are using this category.`,
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete expense category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};
