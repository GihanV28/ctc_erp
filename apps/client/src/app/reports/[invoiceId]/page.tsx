'use client';

import React from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { mockUser, mockInvoices } from '@/lib/mockData';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function InvoicePage({ params }: { params: { invoiceId: string } }) {
  const invoice = mockInvoices.find((inv) => inv.id === params.invoiceId);

  if (!invoice) {
    return (
      <PortalLayout
        title="Invoice Not Found"
        subtitle="The requested invoice could not be found"
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Invoice not found</p>
          <Link href="/reports" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
            Back to Reports
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <PortalLayout
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
        {/* Back Button and Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/reports"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Reports</span>
            </Link>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>

        {/* Invoice Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Billed To:</p>
              <h3 className="text-lg font-semibold text-gray-900">{invoice.billedTo.name}</h3>
              <p className="text-sm text-gray-600">{invoice.billedTo.address}</p>
              <p className="text-sm text-gray-600">{invoice.billedTo.date}</p>
            </div>

            {/* Barcode */}
            <div className="text-right">
              <svg
                width="200"
                height="60"
                viewBox="0 0 200 60"
                className="mb-2"
              >
                {/* Simple barcode representation */}
                {[...Array(30)].map((_, i) => (
                  <rect
                    key={i}
                    x={i * 6 + 10}
                    y="10"
                    width={Math.random() > 0.5 ? 3 : 2}
                    height="40"
                    fill="black"
                  />
                ))}
              </svg>
              <p className="text-xs text-gray-500">9334 5678 90125 345</p>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipment Details</h3>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-2">Order ID:</p>
                <p className="text-sm font-medium text-gray-900">{invoice.shipmentDetails.orderDate}</p>
                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p>Order:</p>
                  <p>Tracking ID: {invoice.shipmentDetails.trackingId}</p>
                  <p>Order ID: {invoice.shipmentDetails.orderId}</p>
                  <p>Container No: {invoice.shipmentDetails.containerNo}</p>
                  <p>Origin after Port</p>
                  <p>Destination Port: {invoice.shipmentDetails.destinationPort}</p>
                  <p>Estimated: {invoice.shipmentDetails.estimatedDate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">{invoice.recipient.name}</p>
                <p className="text-sm font-medium text-gray-900">ABC Logistics</p>
                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p>{invoice.recipient.address}</p>
                  <p>{invoice.recipient.city}</p>
                  <p>{invoice.recipient.country}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">From</p>
                <p className="text-sm font-medium text-gray-900">{invoice.from.name}</p>
                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p>{invoice.from.address}</p>
                  <p>{invoice.from.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Table */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      HS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Cartons
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Net Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Gross Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Dimensions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Freight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Customs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.hsCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.qty}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.cartons}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.netWeight}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.grossWeight}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.dimensions}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">${item.freight.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.customs}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-4">
              <div className="w-64 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Duties/Tax(5%)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(invoice.dutiesTax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Note</h4>
            <p className="text-sm text-gray-600">{invoice.note}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button variant="primary" className="gap-2">
              Contact Support
            </Button>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
