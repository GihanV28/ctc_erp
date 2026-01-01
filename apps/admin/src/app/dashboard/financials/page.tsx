'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PieChart,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import ExpenseManagement from '@/components/financials/ExpenseManagement';
import IncomeManagement from '@/components/financials/IncomeManagement';
import ProfitAnalysis from '@/components/financials/ProfitAnalysis';
import type { Expense, Income, FinancialMetrics } from '@/components/financials/types';

// Mock data
const mockExpenses: Expense[] = [
  {
    _id: '1',
    category: 'fuel',
    description: 'Vessel fuel for SHIP-001-2024',
    amount: 15000,
    currency: 'USD',
    date: '2024-11-15T00:00:00Z',
    shipmentId: 'SHIP-001-2024',
    paymentMethod: 'Bank Transfer',
    status: 'paid',
    createdBy: 'admin',
    createdAt: '2024-11-15T10:00:00Z'
  },
  {
    _id: '2',
    category: 'port_fees',
    description: 'Port of Shanghai handling charges',
    amount: 3500,
    currency: 'USD',
    date: '2024-11-18T00:00:00Z',
    paymentMethod: 'Credit Card',
    status: 'paid',
    createdBy: 'admin',
    createdAt: '2024-11-18T14:30:00Z'
  },
  {
    _id: '3',
    category: 'container_maintenance',
    description: 'Quarterly container inspection and repairs',
    amount: 8200,
    currency: 'USD',
    date: '2024-11-20T00:00:00Z',
    containerId: 'CONT-001',
    paymentMethod: 'Bank Transfer',
    status: 'pending',
    createdBy: 'admin',
    createdAt: '2024-11-20T09:15:00Z'
  }
];

const mockIncome: Income[] = [
  {
    _id: '1',
    source: 'freight_charges',
    description: 'Freight charges for SHIP-001-2024',
    amount: 45000,
    currency: 'USD',
    date: '2024-11-16T00:00:00Z',
    shipmentId: 'SHIP-001-2024',
    clientId: 'CLT-002',
    invoiceId: 'INV-001',
    paymentMethod: 'Bank Transfer',
    status: 'received',
    amountReceived: 45000,
    createdBy: 'admin',
    createdAt: '2024-11-16T11:00:00Z'
  },
  {
    _id: '2',
    source: 'handling_fees',
    description: 'Container handling and loading charges',
    amount: 5000,
    currency: 'USD',
    date: '2024-11-19T00:00:00Z',
    clientId: 'CLT-003',
    paymentMethod: 'Credit Card',
    status: 'received',
    amountReceived: 5000,
    createdBy: 'admin',
    createdAt: '2024-11-19T15:45:00Z'
  },
  {
    _id: '3',
    source: 'freight_charges',
    description: 'Freight charges for SHIP-002-2024',
    amount: 38000,
    currency: 'USD',
    date: '2024-11-22T00:00:00Z',
    shipmentId: 'SHIP-002-2024',
    clientId: 'CLT-004',
    invoiceId: 'INV-002',
    paymentMethod: 'Bank Transfer',
    status: 'pending',
    dueDate: '2024-12-22T00:00:00Z',
    createdBy: 'admin',
    createdAt: '2024-11-22T10:30:00Z'
  }
];

type TabType = 'overview' | 'expenses' | 'income' | 'analysis';

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [income, setIncome] = useState<Income[]>(mockIncome);
  const [dateRange, setDateRange] = useState('this_month');

  // Calculate metrics
  const totalExpenses = expenses
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = income
    .filter(i => i.status === 'received')
    .reduce((sum, i) => sum + (i.amountReceived || i.amount), 0);

  const pendingExpenses = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingIncome = income
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

  const metrics: FinancialMetrics = {
    totalRevenue: totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    roi,
    averageRevenuePerShipment: totalIncome / (income.filter(i => i.shipmentId).length || 1),
    operatingExpenses: totalExpenses,
    outstandingReceivables: pendingIncome,
    outstandingPayables: pendingExpenses
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <DashboardLayout title="Financial Management" subtitle="Track expenses, income, and business profitability">
      <div className="w-full">
        <div className="mb-8">
          <div className="flex items-center justify-end gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                <Download size={18} />
                Export Report
              </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold mb-2">{formatCurrency(metrics.totalRevenue)}</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={14} />
              <span>+12.5% from last month</span>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingDown size={24} />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold mb-2">{formatCurrency(metrics.totalExpenses)}</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={14} />
              <span>+8.3% from last month</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">Net Profit</p>
            <p className="text-3xl font-bold mb-2">{formatCurrency(metrics.netProfit)}</p>
            <div className="flex items-center gap-2 text-sm">
              <span>Margin: {formatPercentage(metrics.profitMargin)}</span>
            </div>
          </div>

          {/* ROI */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <PieChart size={24} />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">Return on Investment</p>
            <p className="text-3xl font-bold mb-2">{formatPercentage(metrics.roi)}</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={14} />
              <span>Excellent performance</span>
            </div>
          </div>
        </div>

        {/* Additional Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Outstanding Receivables */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending Receivables</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatCurrency(metrics.outstandingReceivables)}
            </p>
            <p className="text-xs text-gray-500">
              {income.filter(i => i.status === 'pending').length} pending invoices
            </p>
          </div>

          {/* Outstanding Payables */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending Payables</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatCurrency(metrics.outstandingPayables)}
            </p>
            <p className="text-xs text-gray-500">
              {expenses.filter(e => e.status === 'pending').length} unpaid expenses
            </p>
          </div>

          {/* Avg Revenue per Shipment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Avg Revenue/Shipment</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatCurrency(metrics.averageRevenuePerShipment)}
            </p>
            <p className="text-xs text-gray-500">Based on completed shipments</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'overview'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChart size={20} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'expenses'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingDown size={20} />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'income'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp size={20} />
              Income
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'analysis'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar size={20} />
              Analysis & Reports
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <ProfitAnalysis
                expenses={expenses}
                income={income}
                metrics={metrics}
              />
            )}
            {activeTab === 'expenses' && (
              <ExpenseManagement
                expenses={expenses}
                onExpensesChange={setExpenses}
              />
            )}
            {activeTab === 'income' && (
              <IncomeManagement
                income={income}
                onIncomeChange={setIncome}
              />
            )}
            {activeTab === 'analysis' && (
              <ProfitAnalysis
                expenses={expenses}
                income={income}
                metrics={metrics}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
