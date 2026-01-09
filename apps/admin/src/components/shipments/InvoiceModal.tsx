'use client';

import { useState, useEffect } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { shipmentService, InvoicePreview } from '@/services/shipmentService';

interface InvoiceModalProps {
  shipmentId: string;
  shipmentNumber: string;
  onClose: () => void;
}

export default function InvoiceModal({ shipmentId, shipmentNumber, onClose }: InvoiceModalProps) {
  const [invoice, setInvoice] = useState<InvoicePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoicePreview();
  }, [shipmentId]);

  const fetchInvoicePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shipmentService.previewInvoice(shipmentId);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await shipmentService.downloadInvoicePDF(shipmentId, shipmentNumber);
    } catch (err: any) {
      setError(err.message || 'Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600">
          <h2 className="text-xl font-bold text-white">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : invoice ? (
            <div className="bg-white">
              {/* Invoice Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-purple-700 mb-2">INVOICE</h1>
                <div className="text-sm text-gray-600">
                  <p><span className="font-semibold">Invoice Number:</span> {invoice.invoiceNumber}</p>
                  <p><span className="font-semibold">Date:</span> {formatDate(invoice.date)}</p>
                </div>
              </div>

              {/* Billed To Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Billed To:</h3>
                <div className="text-sm text-gray-700">
                  {invoice.billedTo.name && <p>{invoice.billedTo.name}</p>}
                  {invoice.billedTo.company && <p>{invoice.billedTo.company}</p>}
                  {invoice.billedTo.address && <p>{invoice.billedTo.address}</p>}
                  {invoice.billedTo.city && (
                    <p>
                      {[invoice.billedTo.city, invoice.billedTo.state, invoice.billedTo.postalCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                  {invoice.billedTo.country && <p>{invoice.billedTo.country}</p>}
                </div>
              </div>

              {/* Shipment Details */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">Shipment Details</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Order ID:</span>
                    <span className="ml-2 text-gray-600">{invoice.shipmentDetails.orderId}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Date:</span>
                    <span className="ml-2 text-gray-600">{formatDate(invoice.date)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Tracking ID:</span>
                    <span className="ml-2 text-gray-600">{invoice.shipmentDetails.trackingId}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Container No.:</span>
                    <span className="ml-2 text-gray-600">{invoice.shipmentDetails.containerNo}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Origin after Port:</span>
                    <span className="ml-2 text-gray-600">{invoice.shipmentDetails.origin}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Destination Port:</span>
                    <span className="ml-2 text-gray-600">{invoice.shipmentDetails.destination}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Estimated:</span>
                    <span className="ml-2 text-gray-600">
                      {formatDate(invoice.shipmentDetails.estimatedDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Summary Table */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">Payment Summary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Description
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          HS
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Qty
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Cartons
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Net Weight
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Gross Weight
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Dimensions
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Freight
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                          Customs
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.description}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.hs}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.qty}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.cartons}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.netWeight} kg
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.grossWeight} kg
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.dimensions}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            ${item.freight}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-300">
                            {item.customs > 0 ? `$${item.customs}` : '0'}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700">
                            ${item.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900">${invoice.summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-gray-700">Duties/Tax (9%)</span>
                    <span className="text-gray-900">${invoice.summary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-base font-bold border-t border-gray-300 mt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${invoice.summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {invoice.notes && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Note:</h3>
                  <p className="text-xs text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading || !invoice}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
