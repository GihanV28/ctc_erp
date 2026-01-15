'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Check, DollarSign, Plus, Trash2 } from 'lucide-react';
import type { Expense, ExpenseFormData, ExpenseCategory } from './types';
import { financialService, type ExpenseCategory as ExpenseCategoryType } from '@/services/financialService';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

const getInitialFormData = (): ExpenseFormData => ({
  category: '',
  description: '',
  amount: '',
  currency: 'USD',
  date: new Date().toISOString().split('T')[0],
  shipmentId: '',
  containerId: '',
  supplierId: '',
  paymentMethod: 'Bank Transfer',
  invoiceNumber: '',
  status: 'pending',
  attachments: [],
  notes: ''
});

export default function AddExpenseModal({ isOpen, onClose, onSave }: AddExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(getInitialFormData());

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<ExpenseCategoryType[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Reset modal state when opening
  const resetModalState = useCallback(() => {
    setFormData(getInitialFormData());
    setErrors({});
    setShowAddCategory(false);
    setNewCategoryName('');
    setIsCategoryDropdownOpen(false);
  }, []);

  // Load categories and reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetModalState();
      loadCategories();
    }
  }, [isOpen, resetModalState]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await financialService.getExpenseCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setCreatingCategory(true);
      const newCategory = await financialService.createExpenseCategory(newCategoryName.trim());
      setCategories([...categories, newCategory]);
      setFormData(prev => ({ ...prev, category: newCategory.value as ExpenseCategory }));
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (error: any) {
      alert(error.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryValue: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setDeletingCategoryId(categoryId);
      await financialService.deleteExpenseCategory(categoryId);
      setCategories(categories.filter(cat => cat._id !== categoryId));
      // Clear selection if deleted category was selected
      if (formData.category === categoryValue) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete category');
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const expenseData = {
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        date: formData.date,
        shipmentId: formData.shipmentId || undefined,
        containerId: formData.containerId || undefined,
        supplierId: formData.supplierId || undefined,
        paymentMethod: formData.paymentMethod,
        invoiceNumber: formData.invoiceNumber || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
      };

      const createdExpense = await financialService.createExpense(expenseData);
      onSave(createdExpense);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to create expense');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Add New Expense</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                {!showAddCategory ? (
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.category ? 'border-red-300' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-left flex items-center justify-between`}
                      disabled={loadingCategories}
                    >
                      <span className={formData.category ? 'text-gray-900' : 'text-gray-500'}>
                        {loadingCategories
                          ? 'Loading categories...'
                          : formData.category
                            ? categories.find(c => c.value === formData.category)?.label || formData.category
                            : 'Select category'}
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isCategoryDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {categories.map(cat => (
                          <div
                            key={cat._id}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer group"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, category: cat.value as ExpenseCategory }));
                              setIsCategoryDropdownOpen(false);
                            }}
                          >
                            <span className={formData.category === cat.value ? 'text-purple-600 font-medium' : 'text-gray-700'}>
                              {cat.label}
                            </span>
                            {!cat.isSystem && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCategory(cat._id, cat.value, e)}
                                disabled={deletingCategoryId === cat._id}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                title="Delete category"
                              >
                                {deletingCategoryId === cat._id ? (
                                  <span className="text-xs">...</span>
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                        <div
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-purple-50 cursor-pointer text-purple-600 font-medium border-t border-gray-100"
                          onClick={() => {
                            setShowAddCategory(true);
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          <Plus size={16} />
                          Add New Category
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={creatingCategory}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      disabled={creatingCategory}
                      className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {creatingCategory ? (
                        <span>...</span>
                      ) : (
                        <Check size={18} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.description ? 'border-red-300' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Enter expense description..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.amount ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="0.00"
                />
                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="INV-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional notes..."
              />
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
            >
              <Check size={18} />
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
