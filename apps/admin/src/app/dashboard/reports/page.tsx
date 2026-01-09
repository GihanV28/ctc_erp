'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge } from '@/components/ui';
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
  Search,
  Trash2,
} from 'lucide-react';
import { ReportType, ReportFormat } from '@/types';
import Link from 'next/link';
import { reportService, Report as ApiReport, ReportStats } from '@/services/reportService';
import ConfigureReportModal, { ReportConfig } from '@/components/reports/ConfigureReportModal';

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

// Report templates for generation
const reportTemplates = [
  {
    id: 'shipment',
    name: 'Shipment Report',
    description: 'Detailed analysis of shipments, status, and delivery performance',
    type: 'shipment' as ReportType,
    supportedFormats: ['pdf', 'excel', 'csv'] as ReportFormat[],
  },
  {
    id: 'financial',
    name: 'Financial Report',
    description: 'Income, expenses, and profit/loss analysis',
    type: 'financial' as ReportType,
    supportedFormats: ['pdf', 'excel', 'csv'] as ReportFormat[],
  },
  {
    id: 'client_performance',
    name: 'Client Performance',
    description: 'Client activity, revenue, and satisfaction metrics',
    type: 'client_performance' as ReportType,
    supportedFormats: ['pdf', 'excel', 'csv'] as ReportFormat[],
  },
  {
    id: 'container_utilization',
    name: 'Container Utilization',
    description: 'Container usage rates and availability analysis',
    type: 'container_utilization' as ReportType,
    supportedFormats: ['pdf', 'excel', 'csv'] as ReportFormat[],
  },
  {
    id: 'performance_analytics',
    name: 'Performance Analytics',
    description: 'KPIs, trends, and operational efficiency metrics',
    type: 'performance_analytics' as ReportType,
    supportedFormats: ['pdf', 'excel', 'csv'] as ReportFormat[],
  },
  {
    id: 'supplier_performance',
    name: 'Supplier Performance',
    description: 'Supplier ratings, delivery times, and contract compliance',
    type: 'supplier_performance' as ReportType,
    supportedFormats: ['pdf', 'excel', 'csv'] as ReportFormat[],
  },
];

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [recentReports, setRecentReports] = useState<ApiReport[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [selectedReportName, setSelectedReportName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Load cached date range from localStorage on mount
  useEffect(() => {
    const cachedDateRange = localStorage.getItem('reportDateRange');
    if (cachedDateRange) {
      try {
        const parsed = JSON.parse(cachedDateRange);
        setDateRange(parsed);
      } catch (error) {
        console.error('Failed to parse cached date range:', error);
      }
    }
  }, []);

  // Cache date range to localStorage whenever it changes
  useEffect(() => {
    if (dateRange.startDate || dateRange.endDate) {
      localStorage.setItem('reportDateRange', JSON.stringify(dateRange));
    }
  }, [dateRange]);

  // Fetch stats and recent reports on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, reportsData] = await Promise.all([
        reportService.getStats(),
        reportService.getAllReports({ page: 1, limit: 10 }),
      ]);
      setStats(statsData);
      setRecentReports(reportsData.reports);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigClick = (reportId: string, reportName: string) => {
    setSelectedReportType(reportId);
    setSelectedReportName(reportName);
    setShowConfigModal(true);
  };

  const handleGenerateReport = async (config: ReportConfig) => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Please select a date range first');
      return;
    }

    try {
      setGenerating(true);
      await reportService.generateReport({
        type: selectedReportType,
        format: config.format,
        dateRange,
        filters: config,
      });

      // Refresh recent reports
      await fetchData();
      setShowConfigModal(false);
      alert('Report generated successfully!');
    } catch (error: any) {
      console.error('Failed to generate report:', error);
      alert(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report: ApiReport) => {
    try {
      const blob = await reportService.downloadReport(report._id);
      const extension = report.format === 'excel' ? 'xlsx' : report.format;
      reportService.triggerDownload(blob, `${report.name}.${extension}`);
    } catch (error: any) {
      console.error('Failed to download report:', error);
      alert(error.response?.data?.message || 'Failed to download report');
    }
  };

  const handleEmail = async (report: ApiReport) => {
    const email = prompt('Enter recipient email address:');
    if (!email) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      await reportService.emailReport(report._id, [email]);
      alert('Report sent successfully!');
    } catch (error: any) {
      console.error('Failed to email report:', error);
      alert(error.response?.data?.message || 'Failed to send report via email');
    }
  };

  const handlePrint = async (report: ApiReport) => {
    try {
      await reportService.triggerPrint(report._id);
    } catch (error: any) {
      console.error('Failed to print report:', error);
      alert(error.response?.data?.message || 'Failed to print report');
    }
  };

  const handleDelete = async (report: ApiReport) => {
    if (!confirm(`Are you sure you want to delete "${report.name}"?`)) {
      return;
    }

    try {
      await reportService.deleteReport(report._id);
      await fetchData();
      alert('Report deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete report:', error);
      alert(error.response?.data?.message || 'Failed to delete report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter report templates based on search
  const filteredTemplates = reportTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value={loading ? '...' : stats?.totalReports.toString() || '0'}
            icon={FileText}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="This Month"
            value={loading ? '...' : stats?.thisMonth || 0}
            icon={Calendar}
          />

          <StatCard
            title="Scheduled Reports"
            value={loading ? '...' : stats?.scheduledReports || 0}
            subtitle="Not implemented yet"
            icon={Calendar}
          />

          <StatCard
            title="Storage Used"
            value={loading ? '...' : stats?.storageUsed || '0 GB'}
            icon={HardDrive}
          />
        </div>

        {/* Search and Date Range Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Bar */}
            <div className="lg:col-span-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by report type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="lg:col-span-6 flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <label className="text-sm font-medium whitespace-nowrap">
                  Date Range:
                </label>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Generate New Report */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Generate New Report
            {searchQuery && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTemplates.length} results)
              </span>
            )}
          </h2>
          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-purple-200 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${reportColors[template.type]} flex-shrink-0`}>
                      {reportIcons[template.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{template.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-xs text-gray-500 font-medium">Formats:</span>
                    {template.supportedFormats.map((format) => (
                      <span
                        key={format}
                        className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 uppercase font-medium"
                      >
                        {format}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Settings className="h-4 w-4" />}
                      onClick={() => handleConfigClick(template.id, template.name)}
                      className="w-full justify-center"
                      disabled={!dateRange.startDate || !dateRange.endDate}
                    >
                      Configure & Generate
                    </Button>

                    {!dateRange.startDate || !dateRange.endDate && (
                      <p className="text-xs text-orange-600 mt-2 text-center">
                        Please select a date range first
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading reports...</p>
              </div>
            ) : recentReports.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reports generated yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Generate your first report using the templates above
                </p>
              </div>
            ) : (
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
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentReports.map((report) => (
                      <tr
                        key={report._id}
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
                            {report.type.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {report.generatedBy?.firstName} {report.generatedBy?.lastName}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {formatDate(report.createdAt)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {report.fileSize || 'N/A'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium uppercase ${
                              formatBadgeColors[report.format as ReportFormat]
                            }`}
                          >
                            {report.format}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              report.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : report.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {report.status === 'completed' && (
                              <>
                                <button
                                  onClick={() => handleDownload(report)}
                                  className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEmail(report)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Email"
                                >
                                  <Mail className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handlePrint(report)}
                                  className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                                  title="Print"
                                >
                                  <Printer className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(report)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Modal */}
        <ConfigureReportModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          reportType={selectedReportType}
          reportName={selectedReportName}
          dateRange={dateRange}
          onGenerate={handleGenerateReport}
        />
      </div>
    </DashboardLayout>
  );
}
