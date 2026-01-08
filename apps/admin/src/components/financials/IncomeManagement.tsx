'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, TrendingUp, Calendar, Edit2, Trash2, Eye, Download } from 'lucide-react';
import AddIncomeModal from './AddIncomeModal';
import ViewIncomeModal from './ViewIncomeModal';
import EditIncomeModal from './EditIncomeModal';
import type { Income } from './types';
import { financialService } from '@/services/financialService';

interface IncomeManagementProps {
  income: Income[];
  onIncomeChange: (income: Income[]) => void;
}

const incomeSourceLabels: Record<string, string> = {
  freight_charges: 'Freight Charges',
  handling_fees: 'Handling Fees',
  storage_fees: 'Storage Fees',
  documentation_fees: 'Documentation Fees',
  insurance_charges: 'Insurance Charges',
  late_payment_fees: 'Late Payment Fees',
  other_services: 'Other Services',
  other: 'Other Income'
};

export default function IncomeManagement({ income, onIncomeChange }: IncomeManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<Array<{value: string, label: string}>>([]);

  // Load income from backend
  useEffect(() => {
    loadIncome();
    loadSources();
  }, []);

  const loadIncome = async () => {
    try {
      setLoading(true);
      const response = await financialService.getAllIncome({ limit: 100 });
      onIncomeChange(response.data.income || []);
    } catch (error) {
      console.error('Failed to load income:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      const data = await financialService.getIncomeSources();
      setSources(data.map(src => ({ value: src.value, label: src.label })));
    } catch (error) {
      console.error('Failed to load sources:', error);
    }
  };

  const filteredIncome = income.filter(item =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  const receivedIncome = filteredIncome
    .filter(i => i.status === 'received')
    .reduce((sum, i) => sum + (i.amountReceived || i.amount), 0);
  const pendingIncome = filteredIncome
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSaveIncome = (newIncome: Income) => {
    onIncomeChange([newIncome, ...income]);
    setIsAddModalOpen(false);
  };

  const handleEditIncome = (updatedIncome: Income) => {
    onIncomeChange(income.map(i => i._id === updatedIncome._id ? updatedIncome : i));
    setIsEditModalOpen(false);
    setSelectedIncome(null);
  };

  const handleDeleteIncome = async (id: string) => {
    if (confirm('Are you sure you want to delete this income record?')) {
      try {
        await financialService.deleteIncome(id);
        onIncomeChange(income.filter(i => i._id !== id));
      } catch (error: any) {
        alert(error.message || 'Failed to delete income');
      }
    }
  };

  const handleViewIncome = (incomeRecord: Income) => {
    setSelectedIncome(incomeRecord);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (incomeRecord: Income) => {
    setSelectedIncome(incomeRecord);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-green-600 mt-1">{filteredIncome.length} transactions</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium mb-1">Received</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(receivedIncome)}</p>
          <p className="text-xs text-blue-600 mt-1">
            {filteredIncome.filter(i => i.status === 'received').length} completed
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-amber-600 font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-900">{formatCurrency(pendingIncome)}</p>
          <p className="text-xs text-amber-600 mt-1">
            {filteredIncome.filter(i => i.status === 'pending').length} awaiting payment
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Income Records</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus size={18} />
            Add Income
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search income records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-500 mt-4">Loading income records...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIncome.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDate(item.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                    {item.invoiceId && <p className="text-xs text-gray-500 mt-1">Invoice: {item.invoiceId}</p>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {sources.find(s => s.value === item.source)?.label || item.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'received'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewIncome(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteIncome(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredIncome.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No income records found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Add your first income record
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddIncomeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveIncome}
      />

      {selectedIncome && (
        <>
          <ViewIncomeModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedIncome(null);
            }}
            income={selectedIncome}
          />

          <EditIncomeModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedIncome(null);
            }}
            onSave={handleEditIncome}
            income={selectedIncome}
          />
        </>
      )}
    </div>
  );
}
