'use client';

import { useState, useEffect } from 'react';
import { X, FileText, FileSpreadsheet, Table, Settings, Calendar } from 'lucide-react';
import { reportService, ReportConfiguration } from '@/services/reportService';

interface ConfigureReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  reportName: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onGenerate: (config: ReportConfig) => void;
}

export interface ReportConfig {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
  includeSummary?: boolean;
  groupBy?: string;
  status?: string;
  client?: string;
  supplier?: string;
  containerType?: string;
  metrics?: string[];
  includeRatings?: boolean;
}

const formatIcons = {
  pdf: FileText,
  excel: FileSpreadsheet,
  csv: Table,
};

const formatLabels = {
  pdf: 'PDF Document',
  excel: 'Excel Spreadsheet',
  csv: 'CSV File',
};

export default function ConfigureReportModal({
  isOpen,
  onClose,
  reportType,
  reportName,
  dateRange,
  onGenerate,
}: ConfigureReportModalProps) {
  const [config, setConfig] = useState<ReportConfig>({
    format: 'pdf',
    includeCharts: true,
    includeSummary: true,
  });
  const [configuration, setConfiguration] = useState<ReportConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Fetch configuration options when modal opens
  useEffect(() => {
    if (isOpen && reportType) {
      fetchConfiguration();
    }
  }, [isOpen, reportType]);

  const fetchConfiguration = async () => {
    try {
      setLoading(true);
      const config = await reportService.configureReport({ type: reportType });
      setConfiguration(config);
    } catch (error) {
      console.error('Failed to fetch report configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (format: 'pdf' | 'excel' | 'csv') => {
    setConfig((prev) => ({ ...prev, format }));
  };

  const handleCheckboxChange = (field: keyof ReportConfig) => {
    setConfig((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSelectChange = (field: keyof ReportConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: keyof ReportConfig, value: string) => {
    const currentValues = (config[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setConfig((prev) => ({ ...prev, [field]: newValues }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerate(config);
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Configure Report</h2>
              <p className="text-sm text-gray-500">{reportName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Date Range Display */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Report Period</span>
            </div>
            <p className="text-sm text-gray-600">
              {dateRange.startDate ? new Date(dateRange.startDate).toLocaleDateString() : 'Not set'}{' '}
              -{' '}
              {dateRange.endDate ? new Date(dateRange.endDate).toLocaleDateString() : 'Not set'}
            </p>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {configuration?.formats.map((format) => {
                const Icon = formatIcons[format as keyof typeof formatIcons];
                return (
                  <button
                    key={format}
                    onClick={() => handleFormatChange(format as 'pdf' | 'excel' | 'csv')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      config.format === format
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        config.format === format ? 'text-purple-600' : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        config.format === format ? 'text-purple-600' : 'text-gray-600'
                      }`}
                    >
                      {formatLabels[format as keyof typeof formatLabels]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Options */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading options...</p>
            </div>
          ) : (
            configuration?.filters && configuration.filters.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Options
                </label>
                <div className="space-y-3">
                  {configuration.filters.map((filter) => {
                    if (filter.type === 'boolean') {
                      return (
                        <label
                          key={filter.name}
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!config[filter.name as keyof ReportConfig]}
                            onChange={() => handleCheckboxChange(filter.name as keyof ReportConfig)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">
                            {filter.name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                          </span>
                        </label>
                      );
                    }

                    if (filter.type === 'select' && filter.options) {
                      return (
                        <div key={filter.name}>
                          <label className="block text-sm text-gray-700 mb-1">
                            {filter.name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                          </label>
                          <select
                            value={(config[filter.name as keyof ReportConfig] as string) || ''}
                            onChange={(e) =>
                              handleSelectChange(filter.name as keyof ReportConfig, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">All</option>
                            {filter.options.map((option) => (
                              <option key={option} value={option}>
                                {option.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    if (filter.type === 'multiselect' && filter.options) {
                      return (
                        <div key={filter.name}>
                          <label className="block text-sm text-gray-700 mb-2">
                            {filter.name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                          </label>
                          <div className="space-y-2">
                            {filter.options.map((option) => (
                              <label
                                key={option}
                                className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={(config[filter.name as keyof ReportConfig] as string[])?.includes(
                                    option
                                  )}
                                  onChange={() =>
                                    handleMultiSelectChange(filter.name as keyof ReportConfig, option)
                                  }
                                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {option.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={generating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating || !dateRange.startDate || !dateRange.endDate}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
