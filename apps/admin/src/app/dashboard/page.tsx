'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  FileText,
} from 'lucide-react';
import ExpenseManagement from '@/components/financials/ExpenseManagement';
import IncomeManagement from '@/components/financials/IncomeManagement';
import InvoiceManagement from '@/components/financials/InvoiceManagement';
import ProfitAnalysis from '@/components/financials/ProfitAnalysis';
import type { Expense, Income, FinancialMetrics } from '@/components/financials/types';
import { financialService } from '@/services/financialService';

type TabType = 'overview' | 'expenses' | 'income' | 'invoices';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [dateRange, setDateRange] = useState('this_month');
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch stats for KPI cards (lightweight)
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    pendingExpenses: 0,
    pendingIncome: 0,
    expenseCount: 0,
    incomeCount: 0,
    pendingExpenseCount: 0,
    pendingIncomeCount: 0,
  });

  // Load stats on mount (fast, for KPI cards)
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [expenseStats, incomeStats] = await Promise.all([
          financialService.getExpenseStats(),
          financialService.getIncomeStats(),
        ]);

        const paidExpenses = expenseStats.byStatus?.find((s: any) => s._id === 'paid');
        const pendingExpensesData = expenseStats.byStatus?.find((s: any) => s._id === 'pending');
        const receivedIncome = incomeStats.byStatus?.find((s: any) => s._id === 'received');
        const pendingIncomeData = incomeStats.byStatus?.find((s: any) => s._id === 'pending');

        setStats({
          totalExpenses: paidExpenses?.total || 0,
          totalIncome: receivedIncome?.totalReceived || receivedIncome?.total || 0,
          pendingExpenses: pendingExpensesData?.total || 0,
          pendingIncome: pendingIncomeData?.total || 0,
          expenseCount: expenseStats.total?.count || 0,
          incomeCount: incomeStats.total?.count || 0,
          pendingExpenseCount: pendingExpensesData?.count || 0,
          pendingIncomeCount: pendingIncomeData?.count || 0,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Load full data when needed (for overview tab or when switching to expenses/income)
  const loadFullData = useCallback(async () => {
    if (dataLoaded) return;

    try {
      const [expensesResponse, incomeResponse] = await Promise.all([
        financialService.getAllExpenses({ limit: 1000 }),
        financialService.getAllIncome({ limit: 1000 })
      ]);

      const fetchedExpenses = (expensesResponse.data as any).expenses || [];
      const fetchedIncome = (incomeResponse.data as any).income || [];

      setExpenses(fetchedExpenses);
      setIncome(fetchedIncome);
      setDataLoaded(true);
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    }
  }, [dataLoaded]);

  // Load full data when switching to tabs that need it
  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'expenses' || activeTab === 'income') {
      loadFullData();
    }
  }, [activeTab, loadFullData]);

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

  // Use stats for KPI cards (fast), calculate from data for detailed views
  const totalExpensesAmount = dataLoaded
    ? filteredExpenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0)
    : stats.totalExpenses;

  const totalIncomeAmount = dataLoaded
    ? filteredIncome.filter(i => i.status === 'received').reduce((sum, i) => sum + (i.amountReceived || i.amount), 0)
    : stats.totalIncome;

  const pendingExpensesAmount = dataLoaded
    ? filteredExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)
    : stats.pendingExpenses;

  const pendingIncomeAmount = dataLoaded
    ? filteredIncome.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
    : stats.pendingIncome;

  const netProfit = totalIncomeAmount - totalExpensesAmount;
  const profitMargin = totalIncomeAmount > 0 ? (netProfit / totalIncomeAmount) * 100 : 0;
  const roi = totalExpensesAmount > 0 ? (netProfit / totalExpensesAmount) * 100 : 0;

  const metrics: FinancialMetrics = {
    totalRevenue: totalIncomeAmount,
    totalExpenses: totalExpensesAmount,
    netProfit,
    profitMargin,
    roi,
    averageRevenuePerShipment: dataLoaded
      ? totalIncomeAmount / (filteredIncome.filter(i => i.shipmentId).length || 1)
      : 0,
    operatingExpenses: totalExpensesAmount,
    outstandingReceivables: pendingIncomeAmount,
    outstandingPayables: pendingExpensesAmount
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
        {/* Header Controls - Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base"
            >
              <Download size={18} />
              <span className="hidden xs:inline">Export Report</span>
              <span className="xs:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* KPI Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="sm:hidden" />
                <TrendingUp size={24} className="hidden sm:block" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full hidden sm:inline">This Month</span>
            </div>
            <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Total Revenue</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{formatCurrency(metrics.totalRevenue)}</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp size={14} />
              <span>+12.5% from last month</span>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingDown size={20} className="sm:hidden" />
                <TrendingDown size={24} className="hidden sm:block" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full hidden sm:inline">This Month</span>
            </div>
            <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Total Expenses</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{formatCurrency(metrics.totalExpenses)}</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp size={14} />
              <span>+8.3% from last month</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="sm:hidden" />
                <DollarSign size={24} className="hidden sm:block" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full hidden sm:inline">This Month</span>
            </div>
            <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Net Profit</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{formatCurrency(metrics.netProfit)}</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>Margin: {formatPercentage(metrics.profitMargin)}</span>
            </div>
          </div>

          {/* ROI */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <PieChart size={20} className="sm:hidden" />
                <PieChart size={24} className="hidden sm:block" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full hidden sm:inline">This Month</span>
            </div>
            <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Return on Investment</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{formatPercentage(metrics.roi)}</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp size={14} />
              <span className="hidden xs:inline">Excellent performance</span>
              <span className="xs:hidden">Excellent</span>
            </div>
          </div>
        </div>

        {/* Additional Metrics Cards - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Outstanding Receivables */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending Receivables</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {formatCurrency(metrics.outstandingReceivables)}
            </p>
            <p className="text-xs text-gray-500">
              {dataLoaded ? filteredIncome.filter(i => i.status === 'pending').length : stats.pendingIncomeCount} pending invoices
            </p>
          </div>

          {/* Outstanding Payables */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending Payables</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {formatCurrency(metrics.outstandingPayables)}
            </p>
            <p className="text-xs text-gray-500">
              {dataLoaded ? filteredExpenses.filter(e => e.status === 'pending').length : stats.pendingExpenseCount} unpaid expenses
            </p>
          </div>

          {/* Avg Revenue per Shipment */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Avg Revenue/Shipment</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {formatCurrency(metrics.averageRevenuePerShipment)}
            </p>
            <p className="text-xs text-gray-500">Based on completed shipments</p>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChart size={16} className="sm:hidden" />
              <PieChart size={20} className="hidden sm:block" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'expenses'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingDown size={16} className="sm:hidden" />
              <TrendingDown size={20} className="hidden sm:block" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'income'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp size={16} className="sm:hidden" />
              <TrendingUp size={20} className="hidden sm:block" />
              Income
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'invoices'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={16} className="sm:hidden" />
              <FileText size={20} className="hidden sm:block" />
              Invoices
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
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
            {activeTab === 'invoices' && (
              <InvoiceManagement />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
