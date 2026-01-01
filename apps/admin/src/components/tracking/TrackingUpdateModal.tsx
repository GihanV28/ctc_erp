'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Package,
  Truck,
  Ship,
  Plane,
  CheckCircle,
  AlertCircle,
  X,
  Check,
  Upload,
  Trash2,
  Globe,
  Eye,
  EyeOff,
  Calendar,
  FileText
} from 'lucide-react';
import type { TrackingStatus, TrackingUpdateFormData, Shipment } from './types';

// Available tracking statuses
export const trackingStatuses: TrackingStatus[] = [
  {
    value: 'order_confirmed',
    label: 'Order Confirmed',
    description: 'Shipment order has been confirmed and processing started',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    value: 'picked_up',
    label: 'Picked Up',
    description: 'Cargo has been collected from origin',
    icon: Package,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    value: 'in_transit',
    label: 'In Transit',
    description: 'Shipment is on the way to destination',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    mapsToShipmentStatus: 'in_transit'
  },
  {
    value: 'at_origin_port',
    label: 'At Origin Port',
    description: 'Cargo arrived at origin port/terminal',
    icon: Ship,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  },
  {
    value: 'departed_origin',
    label: 'Departed Origin',
    description: 'Shipment has departed from origin port',
    icon: Plane,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    mapsToShipmentStatus: 'in_transit'
  },
  {
    value: 'at_sea',
    label: 'At Sea / In Air',
    description: 'Shipment is in transit via sea or air',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    value: 'arrived_destination_port',
    label: 'Arrived at Destination',
    description: 'Cargo arrived at destination port/terminal',
    icon: Ship,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    value: 'customs_clearance',
    label: 'Customs Clearance',
    description: 'Shipment is undergoing customs processing',
    icon: FileText,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    mapsToShipmentStatus: 'customs'
  },
  {
    value: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Shipment is out for final delivery',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    value: 'delivered',
    label: 'Delivered',
    description: 'Shipment has been successfully delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    mapsToShipmentStatus: 'delivered'
  },
  {
    value: 'delayed',
    label: 'Delayed',
    description: 'Shipment is experiencing delays',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    value: 'exception',
    label: 'Exception',
    description: 'An issue has occurred with the shipment',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
];

// Status Badge Component
const StatusBadge: React.FC<{ status: TrackingStatus }> = ({ status }) => {
  const Icon = status.icon;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor}`}>
      <Icon size={14} className={status.color} />
      <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
    </div>
  );
};

interface TrackingUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onSave: (data: TrackingUpdateFormData) => void;
}

export default function TrackingUpdateModal({
  isOpen,
  onClose,
  shipment,
  onSave
}: TrackingUpdateModalProps) {
  const [formData, setFormData] = useState<TrackingUpdateFormData>({
    status: '',
    locationName: '',
    locationCity: '',
    locationCountry: '',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16),
    isPublic: true,
    attachments: [],
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedStatusInfo, setSelectedStatusInfo] = useState<TrackingStatus | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: '',
        locationName: '',
        locationCity: '',
        locationCountry: '',
        description: '',
        timestamp: new Date().toISOString().slice(0, 16),
        isPublic: true,
        attachments: [],
        notes: ''
      });
      setErrors({});
      setSelectedStatusInfo(null);
    }
  }, [isOpen]);

  const handleStatusChange = (statusValue: string) => {
    const status = trackingStatuses.find(s => s.value === statusValue);
    setSelectedStatusInfo(status || null);
    setFormData(prev => ({
      ...prev,
      status: statusValue,
      description: status?.description || ''
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.locationName.trim()) {
      newErrors.locationName = 'Location name is required';
    }

    if (!formData.locationCountry.trim()) {
      newErrors.locationCountry = 'Country is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.timestamp) {
      newErrors.timestamp = 'Timestamp is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen || !shipment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Add Tracking Update</h2>
                <p className="text-sm text-purple-200">
                  {shipment.shipmentId} • {shipment.client.companyName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Shipment Info */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-gray-500">From:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {shipment.origin.city}, {shipment.origin.country}
                  </span>
                </div>
                <div className="text-gray-300">→</div>
                <div>
                  <span className="text-gray-500">To:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {shipment.destination.city}, {shipment.destination.country}
                  </span>
                </div>
              </div>
              <div className="text-gray-500">
                Tracking: <span className="font-mono text-gray-900">{shipment.trackingId}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Status Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tracking Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {trackingStatuses.map(status => {
                  const Icon = status.icon;
                  const isSelected = formData.status === status.value;
                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleStatusChange(status.value)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? `border-purple-500 ${status.bgColor}`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Icon size={18} className={isSelected ? status.color : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${isSelected ? status.color : 'text-gray-700'}`}>
                        {status.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.status && <p className="mt-2 text-sm text-red-500">{errors.status}</p>}

              {selectedStatusInfo && (
                <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-700">
                    <strong>Note:</strong> {selectedStatusInfo.description}
                    {selectedStatusInfo.mapsToShipmentStatus && (
                      <span className="ml-2 text-purple-500">
                        (Updates shipment status to: {selectedStatusInfo.mapsToShipmentStatus})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Location Fields */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Location <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Location/Facility Name</label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.locationName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Port of Los Angeles"
                  />
                  {errors.locationName && <p className="mt-1 text-xs text-red-500">{errors.locationName}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.locationCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationCity: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Los Angeles"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.locationCountry}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationCountry: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.locationCountry ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="USA"
                  />
                  {errors.locationCountry && <p className="mt-1 text-xs text-red-500">{errors.locationCountry}</p>}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Enter details about this tracking update..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Timestamp and Visibility */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={(e) => setFormData(prev => ({ ...prev, timestamp: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.timestamp ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                {errors.timestamp && <p className="mt-1 text-sm text-red-500">{errors.timestamp}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border-2 transition-all ${
                    formData.isPublic
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-gray-50 text-gray-600'
                  }`}
                >
                  {formData.isPublic ? (
                    <>
                      <Eye size={18} />
                      <span className="font-medium">Visible to Client</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={18} />
                      <span className="font-medium">Internal Only</span>
                    </>
                  )}
                </button>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.isPublic
                    ? 'Client can see this update in their portal'
                    : 'Only visible to admin users'
                  }
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="attachments"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Images, PDFs, Documents (Max 10MB each)
                  </span>
                </label>
              </div>

              {formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Trash2 size={14} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add internal notes (not visible to client)..."
              />
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              {selectedStatusInfo && (
                <StatusBadge status={selectedStatusInfo} />
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
              >
                <Check size={18} />
                Add Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
