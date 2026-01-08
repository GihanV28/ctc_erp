'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, TrendingUp, Save } from 'lucide-react';
import type { Income, IncomeFormData, IncomeSource } from './types';
import { financialService, type IncomeSource as IncomeSourceType } from '@/services/financialService';

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (income: Income) => void;
  income: Income;
}

export default function EditIncomeModal({ isOpen, onClose, onSave, income }: EditIncomeModalProps) {
  const [formData, setFormData] = useState<IncomeFormData>({
    source: income.source,
    description: income.description,
    amount: income.amount.toString(),
    currency: income.currency,
    date: new Date(income.date).toISOString().split('T')[0],
    shipmentId: income.shipmentId || '',
    clientId: income.clientId || '',
    invoiceId: income.invoiceId || '',
    paymentMethod: income.paymentMethod,
    status: income.status,
    amountReceived: income.amountReceived?.toString() || '',
    dueDate: income.dueDate ? new Date(income.dueDate).toISOString().split('T')[0] : '',
    notes: income.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sources, setSources] = useState<IncomeSourceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSources();
      setFormData({
        source: income.source,
        description: income.description,
        amount: income.amount.toString(),
        currency: income.currency,
        date: new Date(income.date).toISOString().split('T')[0],
        shipmentId: income.shipmentId || '',
        clientId: income.clientId || '',
        invoiceId: income.invoiceId || '',
        paymentMethod: income.paymentMethod,
        status: income.status,
        amountReceived: income.amountReceived?.toString() || '',
        dueDate: income.dueDate ? new Date(income.dueDate).toISOString().split('T')[0] : '',
        notes: income.notes || ''
      });
    }
  }, [isOpen, income]);

  const loadSources = async () => {
    try {
      setLoadingSources(true);
      const data = await financialService.getIncomeSources();
      setSources(data);
    } catch (error) {
      console.error('Failed to load sources:', error);
    } finally {
      setLoadingSources(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.source) newErrors.source = 'Income source is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';

    if (formData.status === 'received' && !formData.amountReceived) {
      newErrors.amountReceived = 'Amount received is required for received status';
    }

    if (formData.status === 'pending' && !formData.dueDate) {
      newErrors.dueDate = 'Due date is required for pending payments';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        source: formData.source,
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        date: formData.date,
        shipmentId: formData.shipmentId || undefined,
        clientId: formData.clientId || undefined,
        invoiceId: formData.invoiceId || undefined,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        amountReceived: formData.amountReceived ? parseFloat(formData.amountReceived) : undefined,
        dueDate: formData.dueDate || undefined,
        notes: formData.notes || undefined,
      };

      const updatedIncome = await financialService.updateIncome(income._id, updateData);
      onSave(updatedIncome);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to update income');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Save className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Edit Income</h2>
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
                  Income Source <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as IncomeSource }))}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.source ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  disabled={loadingSources}
                >
                  <option value="">{loadingSources ? 'Loading...' : 'Select income source'}</option>
                  {sources.map(source => (
                    <option key={source._id} value={source.value}>{source.label}</option>
                  ))}
                </select>
                {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
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
                placeholder="Enter income description..."
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
                  <option value="Wire Transfer">Wire Transfer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
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
                  <option value="received">Received</option>
                  <option value="partially_paid">Partially Paid</option>
                </select>
              </div>

              {(formData.status === 'received' || formData.status === 'partially_paid') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Received {formData.status === 'received' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amountReceived}
                    onChange={(e) => setFormData(prev => ({ ...prev, amountReceived: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.amountReceived ? 'border-red-300' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="0.00"
                  />
                  {errors.amountReceived && <p className="mt-1 text-xs text-red-500">{errors.amountReceived}</p>}
                </div>
              )}

              {formData.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.dueDate ? 'border-red-300' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
                </div>
              )}
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
              disabled={loading}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
