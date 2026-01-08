'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, TrendingUp } from 'lucide-react';
import type { Income, IncomeFormData, IncomeSource } from './types';
import { financialService, type IncomeSource as IncomeSourceType } from '@/services/financialService';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (income: Income) => void;
}

export default function AddIncomeModal({ isOpen, onClose, onSave }: AddIncomeModalProps) {
  const [formData, setFormData] = useState<IncomeFormData>({
    source: '',
    description: '',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    shipmentId: '',
    clientId: '',
    invoiceId: '',
    paymentMethod: 'Bank Transfer',
    status: 'pending',
    amountReceived: '',
    dueDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sources, setSources] = useState<IncomeSourceType[]>([]);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [loadingSources, setLoadingSources] = useState(false);
  const [creatingSource, setCreatingSource] = useState(false);

  // Load sources on mount
  useEffect(() => {
    if (isOpen) {
      loadSources();
    }
  }, [isOpen]);

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

  const handleAddNewSource = async () => {
    if (!newSourceName.trim()) {
      alert('Please enter a source name');
      return;
    }

    try {
      setCreatingSource(true);
      const newSource = await financialService.createIncomeSource(newSourceName.trim());
      setSources([...sources, newSource]);
      setFormData(prev => ({ ...prev, source: newSource.value as IncomeSource }));
      setNewSourceName('');
      setShowAddSource(false);
    } catch (error: any) {
      alert(error.message || 'Failed to create source');
    } finally {
      setCreatingSource(false);
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
      const incomeData = {
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

      const createdIncome = await financialService.createIncome(incomeData);
      onSave(createdIncome);

      // Reset form
      setFormData({
        source: '',
        description: '',
        amount: '',
        currency: 'USD',
        date: new Date().toISOString().split('T')[0],
        shipmentId: '',
        clientId: '',
        invoiceId: '',
        paymentMethod: 'Bank Transfer',
        status: 'pending',
        amountReceived: '',
        dueDate: '',
        notes: ''
      });
      setErrors({});
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to create income');
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
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Add New Income</h2>
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
                {!showAddSource ? (
                  <div className="relative">
                    <select
                      value={formData.source}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '__ADD_NEW__') {
                          setShowAddSource(true);
                        } else {
                          setFormData(prev => ({ ...prev, source: value as IncomeSource }));
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.source ? 'border-red-300' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      disabled={loadingSources}
                    >
                      <option value="">
                        {loadingSources ? 'Loading sources...' : 'Select income source'}
                      </option>
                      {sources.map(source => (
                        <option key={source._id} value={source.value}>{source.label}</option>
                      ))}
                      <option value="__ADD_NEW__" className="font-semibold text-green-600">
                        + Add New Source
                      </option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                      placeholder="Enter source name"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={creatingSource}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewSource}
                      disabled={creatingSource}
                      className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {creatingSource ? (
                        <span>...</span>
                      ) : (
                        <Check size={18} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddSource(false);
                        setNewSourceName('');
                      }}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
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

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipment ID
                </label>
                <input
                  type="text"
                  value={formData.shipmentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, shipmentId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="SHIP-001-2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={formData.clientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="CLT-002"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice ID
                </label>
                <input
                  type="text"
                  value={formData.invoiceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="INV-001"
                />
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
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
            >
              <Check size={18} />
              Add Income
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
