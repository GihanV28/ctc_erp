'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { Badge } from '@/components/ui';
import { Shipment } from '@/services/shipmentService';
import { MapPin, Calendar, Package, DollarSign, Truck, FileText } from 'lucide-react';

interface ViewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
}

const ViewShipmentModal: React.FC<ViewShipmentModalProps> = ({
  isOpen,
  onClose,
  shipment,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shipment Details"
      description={`View details for ${shipment.shipmentId}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{shipment.shipmentId}</h3>
            <p className="text-sm text-gray-600">Tracking: {shipment.trackingNumber}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(shipment.status)}`}>
            {formatStatus(shipment.status)}
          </div>
        </div>

        {/* Client Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-600" />
            Client Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Client ID</p>
                <p className="text-sm font-medium text-gray-900">{shipment.client.clientId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company Name</p>
                <p className="text-sm font-medium text-gray-900">{shipment.client.companyName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            Route Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-2">Origin</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{shipment.origin.port}</p>
                  {shipment.origin.city && (
                    <p className="text-sm text-gray-600">{shipment.origin.city}, {shipment.origin.country}</p>
                  )}
                  {!shipment.origin.city && (
                    <p className="text-sm text-gray-600">{shipment.origin.country}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Destination</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{shipment.destination.port}</p>
                  {shipment.destination.city && (
                    <p className="text-sm text-gray-600">{shipment.destination.city}, {shipment.destination.country}</p>
                  )}
                  {!shipment.destination.city && (
                    <p className="text-sm text-gray-600">{shipment.destination.country}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            Schedule
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Booking Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(shipment.dates.bookingDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Departure Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(shipment.dates.departureDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Est. Arrival</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(shipment.dates.estimatedArrival)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-600" />
            Cargo Details
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm font-medium text-gray-900">{shipment.cargo.description}</p>
              </div>
              {shipment.cargo.weight && (
                <div>
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-medium text-gray-900">{shipment.cargo.weight.toLocaleString()} kg</p>
                </div>
              )}
              {shipment.cargo.volume && (
                <div>
                  <p className="text-xs text-gray-500">Volume</p>
                  <p className="text-sm font-medium text-gray-900">{shipment.cargo.volume} m³</p>
                </div>
              )}
              {shipment.cargo.quantity && (
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="text-sm font-medium text-gray-900">{shipment.cargo.quantity} units</p>
                </div>
              )}
              {shipment.cargo.containerType && (
                <div>
                  <p className="text-xs text-gray-500">Container Type</p>
                  <p className="text-sm font-medium text-gray-900">{shipment.cargo.containerType}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Information */}
        {shipment.totalCost && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Financial Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total Cost</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipment.currency || 'USD'} {shipment.totalCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supplier Information */}
        {shipment.supplier && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-purple-600" />
              Supplier Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Supplier ID</p>
                  <p className="text-sm font-medium text-gray-900">{shipment.supplier.supplierId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Supplier Name</p>
                  <p className="text-sm font-medium text-gray-900">{shipment.supplier.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {shipment.notes && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Additional Notes
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{shipment.notes}</p>
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <p>Created: {formatDate(shipment.createdAt)}</p>
            </div>
            <div className="text-right">
              <p>Last Updated: {formatDate(shipment.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewShipmentModal;
