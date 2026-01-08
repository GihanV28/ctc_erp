'use client';

import React from 'react';
import { X, Package, MapPin, Calendar, DollarSign, Ship, Plane, FileText } from 'lucide-react';
import { Shipment } from '@/services/shipmentService';

interface ViewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

export default function ViewShipmentModal({
  isOpen,
  onClose,
  shipment,
}: ViewShipmentModalProps) {
  if (!isOpen || !shipment) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-700',
      confirmed: 'bg-blue-100 text-blue-700',
      in_transit: 'bg-blue-100 text-blue-700',
      customs: 'bg-yellow-100 text-yellow-700',
      out_for_delivery: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      on_hold: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shipment Details</h2>
            <p className="text-sm text-gray-600 mt-1">Tracking: {shipment.trackingNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Status</label>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium inline-block ${getStatusColor(shipment.status)}`}>
                {shipment.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Shipment ID</label>
              <p className="text-gray-900 font-medium">{shipment.shipmentId}</p>
            </div>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Origin</h3>
              </div>
              <p className="text-gray-900 font-medium">{shipment.origin.port}</p>
              {shipment.origin.city && <p className="text-gray-600 text-sm">{shipment.origin.city}</p>}
              <p className="text-gray-600 text-sm">{shipment.origin.country}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Destination</h3>
              </div>
              <p className="text-gray-900 font-medium">{shipment.destination.port}</p>
              {shipment.destination.city && <p className="text-gray-600 text-sm">{shipment.destination.city}</p>}
              <p className="text-gray-600 text-sm">{shipment.destination.country}</p>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Cargo Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Description</label>
                <p className="text-gray-900">{shipment.cargo.description}</p>
              </div>
              {shipment.cargo.containerType && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Container Type</label>
                  <p className="text-gray-900">{shipment.cargo.containerType}</p>
                </div>
              )}
              {shipment.cargo.weight && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Weight</label>
                  <p className="text-gray-900">{shipment.cargo.weight} kg</p>
                </div>
              )}
              {shipment.cargo.volume && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Volume</label>
                  <p className="text-gray-900">{shipment.cargo.volume} m³</p>
                </div>
              )}
              {shipment.cargo.quantity && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Quantity</label>
                  <p className="text-gray-900">{shipment.cargo.quantity} items</p>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Booking Date
              </label>
              <p className="text-gray-900">{formatDate(shipment.dates.bookingDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Departure Date
              </label>
              <p className="text-gray-900">{formatDate(shipment.dates.departureDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Estimated Arrival
              </label>
              <p className="text-gray-900">{formatDate(shipment.dates.estimatedArrival)}</p>
            </div>
            {shipment.dates.actualArrival && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Actual Arrival
                </label>
                <p className="text-gray-900">{formatDate(shipment.dates.actualArrival)}</p>
              </div>
            )}
          </div>

          {/* Financial Information */}
          {shipment.totalCost && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Financial Information</h3>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Total Cost</label>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(shipment.totalCost, shipment.currency)}
                </p>
              </div>
            </div>
          )}

          {/* Supplier Information */}
          {shipment.supplier && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Supplier</label>
              <p className="text-gray-900 font-medium">{shipment.supplier.name}</p>
              <p className="text-gray-600 text-sm">ID: {shipment.supplier.supplierId}</p>
            </div>
          )}

          {/* Notes */}
          {shipment.notes && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </label>
              <p className="text-gray-900 bg-gray-50 rounded-lg p-4">{shipment.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
