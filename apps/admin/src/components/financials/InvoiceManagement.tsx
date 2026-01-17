'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Download,
  FileText,
  Calendar,
  Building2,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { invoiceService, type Invoice } from '@/services/invoiceService';

interface InvoiceManagementProps {
  onViewInvoice?: (invoice: Invoice) => void;
}

export default function InvoiceManagement({ onViewInvoice }: InvoiceManagementProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    loadInvoices();
    loadStats();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getAll({ limit: 100 });
      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await invoiceService.getStats();
      setStats({
        total: statsData.count.total,
        paid: statsData.count.paid,
        pending: statsData.count.pending + statsData.count.overdue,
        totalAmount: statsData.amount.total,
        paidAmount: statsData.amount.paid,
        pendingAmount: statsData.amount.pending,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.shipment?.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-500'
    };
    const labels: Record<string, string> = {
      draft: 'Draft',
      sent: 'Sent',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled'
    };
    return (
      <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      setDownloadingId(invoice._id);
      await invoiceService.downloadPDF(invoice._id, invoice.invoiceNumber);
    } catch (error: any) {
      alert(error.message || 'Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = (invoice: Invoice) => {
    if (onViewInvoice) {
      onViewInvoice(invoice);
    } else {
      setViewingInvoice(invoice);
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    if (!confirm('Mark this invoice as paid?')) return;

    try {
      setActionLoading(invoice._id);
      const updated = await invoiceService.markAsPaid(invoice._id, {
        paymentMethod: 'Bank Transfer',
        paymentDate: new Date().toISOString(),
      });
      setInvoices(invoices.map(inv => inv._id === invoice._id ? updated : inv));
      loadStats();
    } catch (error: any) {
      alert(error.message || 'Failed to mark invoice as paid');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (invoice: Invoice) => {
    if (!confirm('Are you sure you want to cancel this invoice?')) return;

    try {
      setActionLoading(invoice._id);
      const updated = await invoiceService.cancel(invoice._id);
      setInvoices(invoices.map(inv => inv._id === invoice._id ? updated : inv));
      loadStats();
    } catch (error: any) {
      alert(error.message || 'Failed to cancel invoice');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`)) return;

    try {
      setActionLoading(invoice._id);
      await invoiceService.delete(invoice._id);
      setInvoices(invoices.filter(inv => inv._id !== invoice._id));
      loadStats();
    } catch (error: any) {
      alert(error.message || 'Failed to delete invoice');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleRowExpand = (invoiceId: string) => {
    setExpandedRow(expandedRow === invoiceId ? null : invoiceId);
  };

  return (
    <div>
      {/* Stats Summary - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-600 font-medium mb-1">Total Invoiced</p>
          <p className="text-lg sm:text-2xl font-bold text-blue-900">{formatCurrency(stats.totalAmount)}</p>
          <p className="text-xs text-blue-600 mt-1">{stats.total} invoices</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200">
          <p className="text-xs sm:text-sm text-green-600 font-medium mb-1">Paid</p>
          <p className="text-lg sm:text-2xl font-bold text-green-900">{formatCurrency(stats.paidAmount)}</p>
          <p className="text-xs text-green-600 mt-1">{stats.paid} invoices</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 sm:p-4 border border-yellow-200">
          <p className="text-xs sm:text-sm text-yellow-600 font-medium mb-1">Pending</p>
          <p className="text-lg sm:text-2xl font-bold text-yellow-900">{formatCurrency(stats.pendingAmount)}</p>
          <p className="text-xs text-yellow-600 mt-1">{stats.pending} invoices</p>
        </div>
      </div>

      {/* Header with Search and Filters - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={18} className="text-blue-600 sm:hidden" />
          <FileText size={20} className="text-blue-600 hidden sm:block" />
          Invoice Records
        </h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={loadInvoices}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-end sm:self-auto"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 lg:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Date
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} />
                    Client
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  <div className="flex items-center gap-1">
                    <Package size={14} />
                    Shipment
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Due Date
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign size={14} />
                    Amount
                  </div>
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={18} className="animate-spin" />
                      Loading invoices...
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(invoice.issueDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                          {invoice.client?.companyName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {invoice.client?.clientId || ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {invoice.shipment ? (
                        <div>
                          <p className="text-sm text-gray-900">{invoice.shipment.trackingNumber}</p>
                          <p className="text-xs text-gray-500">{invoice.shipment.shipmentId}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">
                        {formatDate(invoice.dueDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(invoice)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(invoice)}
                          disabled={downloadingId === invoice._id}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Download PDF"
                        >
                          {downloadingId === invoice._id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Download size={16} />
                          )}
                        </button>
                        {invoice.status === 'draft' || invoice.status === 'sent' ? (
                          <button
                            onClick={() => handleMarkAsPaid(invoice)}
                            disabled={actionLoading === invoice._id}
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as Paid"
                          >
                            {actionLoading === invoice._id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                          </button>
                        ) : null}
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' ? (
                          <button
                            onClick={() => handleCancel(invoice)}
                            disabled={actionLoading === invoice._id}
                            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Cancel Invoice"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : null}
                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => handleDelete(invoice)}
                            disabled={actionLoading === invoice._id}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Invoice"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Shown on mobile only */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw size={18} className="animate-spin" />
              Loading invoices...
            </div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
            No invoices found
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <div key={invoice._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Card Header - Always visible */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleRowExpand(invoice._id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {invoice.client?.companyName || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {getStatusBadge(invoice.status)}
                    {expandedRow === invoice._id ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatDate(invoice.issueDate)}</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(invoice.total)}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRow === invoice._id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Due Date</p>
                      <p className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Client ID</p>
                      <p className="font-medium text-gray-900">{invoice.client?.clientId || '-'}</p>
                    </div>
                    {invoice.shipment && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tracking #</p>
                          <p className="font-medium text-gray-900">{invoice.shipment.trackingNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Shipment ID</p>
                          <p className="font-medium text-gray-900">{invoice.shipment.shipmentId}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleView(invoice); }}
                      className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(invoice); }}
                      disabled={downloadingId === invoice._id}
                      className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {downloadingId === invoice._id ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      PDF
                    </button>
                    {invoice.status === 'draft' || invoice.status === 'sent' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkAsPaid(invoice); }}
                        disabled={actionLoading === invoice._id}
                        className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={14} />
                        Paid
                      </button>
                    ) : null}
                    {invoice.status !== 'paid' && invoice.status !== 'cancelled' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(invoice); }}
                        disabled={actionLoading === invoice._id}
                        className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Cancel
                      </button>
                    ) : null}
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(invoice); }}
                        disabled={actionLoading === invoice._id}
                        className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* View Invoice Modal - Responsive */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-black/50" onClick={() => setViewingInvoice(null)} />
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-2xl w-full mx-auto">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">Invoice Details</h2>
                </div>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="p-2 hover:bg-white/20 rounded-lg text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Invoice Number</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{viewingInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(viewingInvoice.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Issue Date</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{formatDate(viewingInvoice.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Due Date</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{formatDate(viewingInvoice.dueDate)}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Client Information</h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Company</p>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{viewingInvoice.client?.companyName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Client ID</p>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{viewingInvoice.client?.clientId || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {viewingInvoice.shipment && (
                  <div className="border-t border-gray-200 pt-4 mb-4 sm:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Shipment Information</h4>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Tracking Number</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{viewingInvoice.shipment.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Shipment ID</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{viewingInvoice.shipment.shipmentId}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Line Items</h4>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left px-2 sm:px-3 py-2 text-gray-600">Description</th>
                            <th className="text-center px-2 sm:px-3 py-2 text-gray-600">Qty</th>
                            <th className="text-right px-2 sm:px-3 py-2 text-gray-600 hidden sm:table-cell">Unit Price</th>
                            <th className="text-right px-2 sm:px-3 py-2 text-gray-600">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {viewingInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-2 sm:px-3 py-2 text-gray-900">{item.description}</td>
                              <td className="px-2 sm:px-3 py-2 text-center text-gray-600">{item.quantity}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-gray-600 hidden sm:table-cell">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-2 sm:px-3 py-2 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-end">
                    <div className="w-full sm:w-64 space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900">{formatCurrency(viewingInvoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Tax</span>
                        <span className="text-gray-900">{formatCurrency(viewingInvoice.tax)}</span>
                      </div>
                      <div className="flex justify-between text-base sm:text-lg font-semibold border-t border-gray-200 pt-2">
                        <span className="text-gray-900">Total</span>
                        <span className="text-blue-600">{formatCurrency(viewingInvoice.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {viewingInvoice.notes && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Notes</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{viewingInvoice.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(viewingInvoice)}
                  disabled={downloadingId === viewingInvoice._id}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  <Download size={16} className="sm:hidden" />
                  <Download size={18} className="hidden sm:block" />
                  {downloadingId === viewingInvoice._id ? 'Downloading...' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
