'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import { Search, Eye, Download, Printer } from 'lucide-react';
import { mockUser, mockInvoices } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const statusConfig = {
  paid: {
    label: 'Paid',
    color: 'bg-green-100 text-green-700',
  },
  pending: {
    label: 'Pending',
    color: 'bg-orange-100 text-orange-700',
  },
  overdue: {
    label: 'Overdue',
    color: 'bg-red-100 text-red-700',
  },
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <PortalLayout
      title="Reports & Invoices"
      subtitle="View and download your shipping invoices and reports"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{mockUser.name}</span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {mockUser.avatar}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {invoice.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          statusConfig[invoice.status].color
                        )}
                      >
                        {statusConfig[invoice.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/reports/${invoice.id}`}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </Link>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Download className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Printer className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
