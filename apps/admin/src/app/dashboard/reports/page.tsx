'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge } from '@/components/ui';
import { mockReports, mockRecentReports } from '@/lib/mockData';
import {
  FileText,
  Calendar,
  HardDrive,
  Download,
  Mail,
  Printer,
  Settings,
  Package,
  DollarSign,
  Users,
  Box,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { Report, RecentReport, ReportType, ReportFormat } from '@/types';
import Link from 'next/link';

const reportIcons: Record<ReportType, React.ReactNode> = {
  shipment: <Package className="h-6 w-6" />,
  financial: <DollarSign className="h-6 w-6" />,
  client_performance: <Users className="h-6 w-6" />,
  container_utilization: <Box className="h-6 w-6" />,
  performance_analytics: <TrendingUp className="h-6 w-6" />,
  supplier_performance: <Truck className="h-6 w-6" />,
};

const reportColors: Record<ReportType, string> = {
  shipment: 'bg-purple-100 text-purple-600',
  financial: 'bg-green-100 text-green-600',
  client_performance: 'bg-blue-100 text-blue-600',
  container_utilization: 'bg-orange-100 text-orange-600',
  performance_analytics: 'bg-pink-100 text-pink-600',
  supplier_performance: 'bg-indigo-100 text-indigo-600',
};

const formatBadgeColors: Record<ReportFormat, string> = {
  pdf: 'bg-red-100 text-red-700',
  excel: 'bg-green-100 text-green-700',
  csv: 'bg-blue-100 text-blue-700',
  powerpoint: 'bg-orange-100 text-orange-700',
};

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports);
  const [recentReports] = useState<RecentReport[]>(mockRecentReports);
  const [dateRange, setDateRange] = useState('');

  const handleGenerateReport = (reportId: string) => {
    console.log('Generating report:', reportId);
    // Here you would typically call an API to generate the report
  };

  const handleDownload = (reportId: string) => {
    console.log('Downloading report:', reportId);
  };

  const handleEmail = (reportId: string) => {
    console.log('Emailing report:', reportId);
  };

  const handlePrint = (reportId: string) => {
    console.log('Printing report:', reportId);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Generate and download comprehensive business reports"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Reports"
            value="1,248"
            icon={FileText}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="This Month"
            value={127}
            subtitle="18% increase"
            icon={Calendar}
          />

          <StatCard
            title="Scheduled Reports"
            value={24}
            subtitle="Auto-generated"
            icon={Calendar}
          />

          <StatCard
            title="Storage Used"
            value="14.2 GB"
            subtitle="of 100 GB"
            icon={HardDrive}
          />
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Generate New Report */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${reportColors[report.type]}`}>
                    {reportIcons[report.type]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-500">Formats:</span>
                      {report.supportedFormats.map((format) => (
                        <span
                          key={format}
                          className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase"
                        >
                          {format}
                        </span>
                      ))}
                    </div>

                    {report.lastGenerated && (
                      <p className="text-xs text-gray-500 mb-4">
                        Last: {formatDate(report.lastGenerated)}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Download className="h-4 w-4" />}
                        onClick={() => handleGenerateReport(report.id)}
                        className="flex-1"
                      >
                        Generate
                      </Button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => console.log('Settings for', report.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            <Link
              href="/dashboard/reports/history"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Generated By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {report.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 capitalize">
                          {report.type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {report.generatedBy}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {formatDate(report.date)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {report.size}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium uppercase ${
                            formatBadgeColors[report.format]
                          }`}
                        >
                          {report.format}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(report.id)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEmail(report.id)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrint(report.id)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
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
      </div>
    </DashboardLayout>
  );
}
