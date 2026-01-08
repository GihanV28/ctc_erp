'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { Badge } from '@/components/ui';
import { Container } from '@/services/containerService';
import {
  Box,
  MapPin,
  Calendar,
  DollarSign,
  Ship,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface ViewContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  container: Container | null;
}

const ViewContainerModal: React.FC<ViewContainerModalProps> = ({
  isOpen,
  onClose,
  container,
}) => {
  if (!container) return null;

  const getStatusBadgeVariant = (status: string): 'purple' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'in_use':
        return 'purple';
      case 'available':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'damaged':
        return 'danger';
      default:
        return 'success';
    }
  };

  const getConditionBadgeVariant = (condition: string): 'success' | 'info' | 'warning' | 'danger' => {
    switch (condition) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'danger';
      default:
        return 'info';
    }
  };

  const formatType = (type: string) => {
    return type.split('_').map((word, index) =>
      index === 0 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Get container capacity based on type
  const getContainerCapacity = (type: string): { volume: number; maxWeight: number } => {
    const capacities: Record<string, { volume: number; maxWeight: number }> = {
      '20ft_standard': { volume: 33.2, maxWeight: 21750 },
      '20ft_high_cube': { volume: 37.4, maxWeight: 21600 },
      '40ft_standard': { volume: 67.5, maxWeight: 26680 },
      '40ft_high_cube': { volume: 67.7, maxWeight: 28580 },
      '40ft_refrigerated': { volume: 67.3, maxWeight: 26580 },
      '20ft_refrigerated': { volume: 28.3, maxWeight: 21800 },
    };
    return capacities[type] || { volume: 0, maxWeight: 0 };
  };

  const capacity = getContainerCapacity(container.type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Container Details"
      description={`Viewing information for ${container.containerNumber}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Container ID</p>
              <h3 className="text-2xl font-bold text-gray-900">{container.containerId}</h3>
            </div>
            <Box className="h-12 w-12 text-purple-600" />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Badge variant={getStatusBadgeVariant(container.status)}>
              {formatStatus(container.status)}
            </Badge>
            <Badge variant={getConditionBadgeVariant(container.condition)}>
              Condition: {formatStatus(container.condition)}
            </Badge>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Box className="h-4 w-4 text-gray-500" />
            Basic Information
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Container Number</p>
              <p className="text-sm font-semibold text-gray-900">{container.containerNumber}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm font-semibold text-gray-900">{formatType(container.type)}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        {container.location && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Current Location
            </h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-900">{container.location}</p>
            </div>
          </div>
        )}

        {/* Shipment Information */}
        {container.currentShipment && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Ship className="h-4 w-4 text-gray-500" />
              Current Shipment
            </h4>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-semibold text-purple-900">
                  Assigned to shipment: {container.currentShipment}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Capacity Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Box className="h-4 w-4 text-gray-500" />
            Capacity Specifications
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Volume</p>
              <p className="text-sm font-semibold text-gray-900">{capacity.volume} m³</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Max Weight</p>
              <p className="text-sm font-semibold text-gray-900">{capacity.maxWeight.toLocaleString()} kg</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Important Dates
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {container.purchaseDate && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Purchase Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {format(new Date(container.purchaseDate), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
            {container.lastInspectionDate && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Last Inspection</p>
                <p className="text-sm font-semibold text-gray-900">
                  {format(new Date(container.lastInspectionDate), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Information */}
        {container.purchasePrice && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              Financial Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Purchase Price</p>
              <p className="text-sm font-semibold text-gray-900">
                ${container.purchasePrice.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* System Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">System Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Created</p>
              <p className="text-sm text-gray-900">
                {format(new Date(container.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900">
                {format(new Date(container.updatedAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewContainerModal;
