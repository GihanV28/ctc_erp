'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, PieChart, BarChart3 } from 'lucide-react';
import type { Expense, Income, FinancialMetrics, CategoryBreakdown } from './types';

interface ProfitAnalysisProps {
  expenses: Expense[];
  income: Income[];
  metrics: FinancialMetrics;
}

export default function ProfitAnalysis({ expenses, income, metrics }: ProfitAnalysisProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate expense breakdown by category
  const expenseBreakdown: CategoryBreakdown[] = [];
  const categoryTotals: Record<string, number> = {};

  expenses.filter(e => e.status === 'paid').forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  const totalCategoryExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  Object.entries(categoryTotals).forEach(([category, amount]) => {
    expenseBreakdown.push({
      category: category.replace('_', ' ').toUpperCase(),
      amount,
      percentage: (amount / totalCategoryExpenses) * 100,
      count: expenses.filter(e => e.category === category && e.status === 'paid').length
    });
  });

  expenseBreakdown.sort((a, b) => b.amount - a.amount);

  // Calculate income breakdown by source
  const incomeBreakdown: CategoryBreakdown[] = [];
  const sourceTotals: Record<string, number> = {};

  income.filter(i => i.status === 'received').forEach(item => {
    if (!sourceTotals[item.source]) {
      sourceTotals[item.source] = 0;
    }
    sourceTotals[item.source] += item.amountReceived || item.amount;
  });

  const totalSourceIncome = Object.values(sourceTotals).reduce((sum, val) => sum + val, 0);

  Object.entries(sourceTotals).forEach(([source, amount]) => {
    incomeBreakdown.push({
      category: source.replace('_', ' ').toUpperCase(),
      amount,
      percentage: (amount / totalSourceIncome) * 100,
      count: income.filter(i => i.source === source && i.status === 'received').length
    });
  });

  incomeBreakdown.sort((a, b) => b.amount - a.amount);

  const getBarWidth = (percentage: number) => `${percentage}%`;

  return (
    <div>
      {/* Financial Summary */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Profit Summary Card */}
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="text-purple-600" size={20} />
            Profit Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">{formatCurrency(metrics.totalRevenue)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-red-600">-{formatCurrency(metrics.totalExpenses)}</span>
            </div>
            <div className="flex items-center justify-between py-3 bg-purple-50 rounded-lg px-4">
              <span className="font-semibold text-gray-900">Net Profit</span>
              <span className={`font-bold text-xl ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(metrics.netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Card */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Percent className="text-blue-600" size={20} />
            Key Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Profit Margin</span>
              <span className="font-semibold text-blue-600">{metrics.profitMargin.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">ROI</span>
              <span className="font-semibold text-green-600">{metrics.roi.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Avg Revenue/Shipment</span>
              <span className="font-semibold text-purple-600">
                {formatCurrency(metrics.averageRevenuePerShipment)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="text-red-600" size={20} />
            Expense Breakdown
          </h3>
          <div className="space-y-3">
            {expenseBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                      style={{ width: getBarWidth(item.percentage) }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{item.percentage.toFixed(1)}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.count} transactions</p>
              </div>
            ))}
            {expenseBreakdown.length === 0 && (
              <p className="text-center text-gray-500 py-8">No expense data available</p>
            )}
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="text-green-600" size={20} />
            Income Breakdown
          </h3>
          <div className="space-y-3">
            {incomeBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{ width: getBarWidth(item.percentage) }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{item.percentage.toFixed(1)}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.count} transactions</p>
              </div>
            ))}
            {incomeBreakdown.length === 0 && (
              <p className="text-center text-gray-500 py-8">No income data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Outstanding Balances */}
      <div className="mt-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Balances</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-amber-700 mb-2">Accounts Receivable (Pending Income)</p>
            <p className="text-2xl font-bold text-amber-900">{formatCurrency(metrics.outstandingReceivables)}</p>
            <p className="text-xs text-amber-600 mt-1">
              {income.filter(i => i.status === 'pending').length} pending invoices
            </p>
          </div>
          <div>
            <p className="text-sm text-amber-700 mb-2">Accounts Payable (Pending Expenses)</p>
            <p className="text-2xl font-bold text-amber-900">{formatCurrency(metrics.outstandingPayables)}</p>
            <p className="text-xs text-amber-600 mt-1">
              {expenses.filter(e => e.status === 'pending').length} unpaid expenses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
