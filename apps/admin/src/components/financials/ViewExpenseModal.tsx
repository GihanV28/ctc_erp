'use client';

import React from 'react';
import { X, Calendar, DollarSign, FileText, Package, Truck, CreditCard } from 'lucide-react';
import type { Expense } from './types';

interface ViewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense;
}

export default function ViewExpenseModal({ isOpen, onClose, expense }: ViewExpenseModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: expense.currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Expense Details</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(expense.status)}`}>
                {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                Description
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">{expense.description}</p>
              </div>
            </div>

            {/* Date & Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Date
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{formatDate(expense.date)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  Payment Method
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{expense.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Invoice Number */}
            {expense.invoiceNumber && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Invoice Number</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{expense.invoiceNumber}</p>
                </div>
              </div>
            )}

            {/* Shipment/Container IDs */}
            {(expense.shipmentId || expense.containerId) && (
              <div className="grid grid-cols-2 gap-4">
                {expense.shipmentId && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-purple-600" />
                      Shipment
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">{expense.shipmentId}</p>
                    </div>
                  </div>
                )}
                {expense.containerId && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-purple-600" />
                      Container
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">{expense.containerId}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {expense.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{expense.notes}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <p>Created: {formatDate(expense.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p>Created by: {typeof expense.createdBy === 'string' ? expense.createdBy : expense.createdBy?.name || expense.createdBy?.email || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
