'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PieChart,
  Download,
} from 'lucide-react';
import ExpenseManagement from '@/components/financials/ExpenseManagement';
import IncomeManagement from '@/components/financials/IncomeManagement';
import ProfitAnalysis from '@/components/financials/ProfitAnalysis';
import type { Expense, Income, FinancialMetrics } from '@/components/financials/types';
import { financialService } from '@/services/financialService';

type TabType = 'overview' | 'expenses' | 'income';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [dateRange, setDateRange] = useState('this_month');
  const [loading, setLoading] = useState(true);

  // Fetch real data from backend
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);

        const [expensesResponse, incomeResponse] = await Promise.all([
          financialService.getAllExpenses({ limit: 1000 }),
          financialService.getAllIncome({ limit: 1000 })
        ]);

        const fetchedExpenses = (expensesResponse.data as any).expenses || [];
        const fetchedIncome = (incomeResponse.data as any).income || [];

        setExpenses(fetchedExpenses);
        setIncome(fetchedIncome);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // Filter data based on date range
  const getDateRangeFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case 'today':
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        return { start: today, end: todayEnd };

      case 'this_week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(now);
        weekEnd.setHours(23, 59, 59, 999);
        return { start: weekStart, end: weekEnd };

      case 'this_month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        const monthEnd = new Date(now);
        monthEnd.setHours(23, 59, 59, 999);
        return { start: monthStart, end: monthEnd };

      case 'last_month':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        lastMonthStart.setHours(0, 0, 0, 0);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        lastMonthEnd.setHours(23, 59, 59, 999);
        return { start: lastMonthStart, end: lastMonthEnd };

      case 'this_quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
        quarterStart.setHours(0, 0, 0, 0);
        const quarterEnd = new Date(now);
        quarterEnd.setHours(23, 59, 59, 999);
        return { start: quarterStart, end: quarterEnd };

      case 'this_year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        yearStart.setHours(0, 0, 0, 0);
        const yearEnd = new Date(now);
        yearEnd.setHours(23, 59, 59, 999);
        return { start: yearStart, end: yearEnd };

      default:
        return null;
    }
  };

  const filterByDateRange = (items: any[]) => {
    const range = getDateRangeFilter();
    if (!range) return items;

    return items.filter(item => {
      const itemDate = new Date(item.date);
      // Normalize to start of day for comparison
      const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const rangeStartOnly = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate());
      const rangeEndOnly = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate());

      return itemDateOnly >= rangeStartOnly && itemDateOnly <= rangeEndOnly;
    });
  };

  // Apply date filters
  const filteredExpenses = filterByDateRange(expenses);
  const filteredIncome = filterByDateRange(income);

  // Calculate metrics using filtered data
  const totalExpenses = filteredExpenses
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = filteredIncome
    .filter(i => i.status === 'received')
    .reduce((sum, i) => sum + (i.amountReceived || i.amount), 0);

  const pendingExpenses = filteredExpenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingIncome = filteredIncome
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
    averageRevenuePerShipment: totalIncome / (filteredIncome.filter(i => i.shipmentId).length || 1),
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

  if (loading) {
    return (
      <DashboardLayout title="Overview" subtitle="Welcome back, here's what's happening today">
        <div className="w-full flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading financial data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overview" subtitle="Welcome back, here's what's happening today">
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
              </select>
              <button
                onClick={() => router.push('/dashboard/reports')}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
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
              {filteredIncome.filter(i => i.status === 'pending').length} pending invoices
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
              {filteredExpenses.filter(e => e.status === 'pending').length} unpaid expenses
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
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <ProfitAnalysis
                expenses={filteredExpenses}
                income={filteredIncome}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
