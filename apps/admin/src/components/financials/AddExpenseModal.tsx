'use client';

import React, { useState } from 'react';
import { X, Check, DollarSign, Calendar, FileText, Upload } from 'lucide-react';
import type { Expense, ExpenseFormData, ExpenseCategory } from './types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: 'fuel', label: 'Fuel & Energy' },
  { value: 'port_fees', label: 'Port Fees' },
  { value: 'customs_duties', label: 'Customs & Duties' },
  { value: 'handling_charges', label: 'Handling Charges' },
  { value: 'container_maintenance', label: 'Container Maintenance' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'staff_salaries', label: 'Staff Salaries' },
  { value: 'office_expenses', label: 'Office Expenses' },
  { value: 'vehicle_maintenance', label: 'Vehicle Maintenance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'technology', label: 'Technology & Software' },
  { value: 'other', label: 'Other Expenses' }
];

export default function AddExpenseModal({ isOpen, onClose, onSave }: AddExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newExpense: Expense = {
      _id: Date.now().toString(),
      category: formData.category as ExpenseCategory,
      description: formData.description,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: new Date(formData.date).toISOString(),
      shipmentId: formData.shipmentId || undefined,
      containerId: formData.containerId || undefined,
      supplierId: formData.supplierId || undefined,
      paymentMethod: formData.paymentMethod,
      invoiceNumber: formData.invoiceNumber || undefined,
      status: formData.status,
      notes: formData.notes || undefined,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    onSave(newExpense);
    setFormData({
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
    setErrors({});
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
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.category ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">Select category</option>
                  {expenseCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
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
