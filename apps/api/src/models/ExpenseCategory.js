const mongoose = require('mongoose');

const expenseCategorySchema = new mongoose.Schema(
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
      default: false, // System categories cannot be deleted
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
expenseCategorySchema.index({ value: 1, isActive: 1 });
expenseCategorySchema.index({ isActive: 1, createdAt: -1 });

// Prevent deletion of system categories
expenseCategorySchema.pre('remove', function(next) {
  if (this.isSystem) {
    next(new Error('Cannot delete system categories'));
  } else {
    next();
  }
});

// Static method to get all active categories
expenseCategorySchema.statics.getActiveCategories = async function() {
  return this.find({ isActive: true }).sort({ label: 1 });
};

// Static method to initialize default categories
expenseCategorySchema.statics.initializeDefaultCategories = async function() {
  const defaultCategories = [
    { value: 'fuel', label: 'Fuel & Energy', isSystem: true },
    { value: 'port_fees', label: 'Port Fees', isSystem: true },
    { value: 'customs_duties', label: 'Customs & Duties', isSystem: true },
    { value: 'handling_charges', label: 'Handling Charges', isSystem: true },
    { value: 'container_maintenance', label: 'Container Maintenance', isSystem: true },
    { value: 'insurance', label: 'Insurance', isSystem: true },
    { value: 'staff_salaries', label: 'Staff Salaries', isSystem: true },
    { value: 'office_expenses', label: 'Office Expenses', isSystem: true },
    { value: 'vehicle_maintenance', label: 'Vehicle Maintenance', isSystem: true },
    { value: 'marketing', label: 'Marketing', isSystem: true },
    { value: 'technology', label: 'Technology & Software', isSystem: true },
    { value: 'other', label: 'Other Expenses', isSystem: true },
  ];

  for (const category of defaultCategories) {
    await this.findOneAndUpdate(
      { value: category.value },
      category,
      { upsert: true, new: true }
    );
  }
};

const ExpenseCategory = mongoose.model('ExpenseCategory', expenseCategorySchema);

module.exports = ExpenseCategory;
