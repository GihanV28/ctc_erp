'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  DollarSign,
  Calendar,
  TrendingDown,
  FileText,
  Download
} from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import type { Expense } from './types';

interface ExpenseManagementProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
}

const expenseCategoryLabels: Record<string, string> = {
  fuel: 'Fuel & Energy',
  port_fees: 'Port Fees',
  customs_duties: 'Customs & Duties',
  handling_charges: 'Handling Charges',
  container_maintenance: 'Container Maintenance',
  insurance: 'Insurance',
  staff_salaries: 'Staff Salaries',
  office_expenses: 'Office Expenses',
  vehicle_maintenance: 'Vehicle Maintenance',
  marketing: 'Marketing',
  technology: 'Technology & Software',
  other: 'Other Expenses'
};

export default function ExpenseManagement({ expenses, onExpensesChange }: ExpenseManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const paidExpenses = filteredExpenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

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

  const handleAddExpense = (newExpense: Expense) => {
    onExpensesChange([newExpense, ...expenses]);
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      onExpensesChange(expenses.filter(e => e._id !== id));
    }
  };

  return (
    <div>
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-600 font-medium mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-red-600 mt-1">{filteredExpenses.length} transactions</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(paidExpenses)}</p>
          <p className="text-xs text-green-600 mt-1">
            {filteredExpenses.filter(e => e.status === 'paid').length} completed
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-amber-600 font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-900">{formatCurrency(pendingExpenses)}</p>
          <p className="text-xs text-amber-600 mt-1">
            {filteredExpenses.filter(e => e.status === 'pending').length} awaiting payment
          </p>
        </div>
      </div>

      {/* Header with Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Expense Records</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(expenseCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(expense.date)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                    {expense.invoiceNumber && (
                      <p className="text-xs text-gray-500 mt-1">Invoice: {expense.invoiceNumber}</p>
                    )}
                    {expense.shipmentId && (
                      <p className="text-xs text-blue-600 mt-1">Shipment: {expense.shipmentId}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {expenseCategoryLabels[expense.category]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <TrendingDown size={14} className="text-red-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    expense.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : expense.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No expenses found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Add your first expense
            </button>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExpense}
      />
    </div>
  );
}
