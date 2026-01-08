'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { Shipment } from '@/services/shipmentService';
import { Package, MapPin, Calendar, Save } from 'lucide-react';

interface EditShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: EditShipmentFormData) => void;
  shipment: Shipment;
}

export interface EditShipmentFormData {
  status: string;
  origin: {
    port: string;
    city?: string;
    country: string;
  };
  destination: {
    port: string;
    city?: string;
    country: string;
  };
  cargo: {
    description: string;
    weight?: number;
    volume?: number;
    quantity?: number;
  };
  dates: {
    departureDate?: string;
    estimatedArrival?: string;
  };
  totalCost?: number;
  currency?: string;
  notes?: string;
}

const EditShipmentModal: React.FC<EditShipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  shipment,
}) => {
  const [formData, setFormData] = useState<EditShipmentFormData>({
    status: shipment.status,
    origin: { ...shipment.origin },
    destination: { ...shipment.destination },
    cargo: { ...shipment.cargo },
    dates: {
      departureDate: shipment.dates.departureDate ? new Date(shipment.dates.departureDate).toISOString().split('T')[0] : '',
      estimatedArrival: shipment.dates.estimatedArrival ? new Date(shipment.dates.estimatedArrival).toISOString().split('T')[0] : '',
    },
    totalCost: shipment.totalCost,
    currency: shipment.currency || 'USD',
    notes: shipment.notes || '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: shipment.status,
        origin: { ...shipment.origin },
        destination: { ...shipment.destination },
        cargo: { ...shipment.cargo },
        dates: {
          departureDate: shipment.dates.departureDate ? new Date(shipment.dates.departureDate).toISOString().split('T')[0] : '',
          estimatedArrival: shipment.dates.estimatedArrival ? new Date(shipment.dates.estimatedArrival).toISOString().split('T')[0] : '',
        },
        totalCost: shipment.totalCost,
        currency: shipment.currency || 'USD',
        notes: shipment.notes || '',
      });
      setErrors({});
    }
  }, [isOpen, shipment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'totalCost' ? parseFloat(value) || 0 : value,
      }));
    } else if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...(prev as any)[keys[0]],
          [keys[1]]: keys[0] === 'cargo' && (keys[1] === 'weight' || keys[1] === 'volume' || keys[1] === 'quantity')
            ? parseFloat(value) || undefined
            : value,
        },
      }));
    }

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: any = {};

    if (!formData.origin.port.trim()) newErrors['origin.port'] = 'Origin port is required';
    if (!formData.origin.country.trim()) newErrors['origin.country'] = 'Origin country is required';
    if (!formData.destination.port.trim()) newErrors['destination.port'] = 'Destination port is required';
    if (!formData.destination.country.trim()) newErrors['destination.country'] = 'Destination country is required';
    if (!formData.cargo.description.trim()) newErrors['cargo.description'] = 'Cargo description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(shipment._id, formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Shipment"
      description={`Update information for ${shipment.shipmentId}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipment ID - Read Only */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-purple-700 font-medium">Shipment ID</p>
              <p className="text-sm font-semibold text-purple-900">{shipment.shipmentId}</p>
            </div>
            <div>
              <p className="text-xs text-purple-700 font-medium">Tracking Number</p>
              <p className="text-sm font-semibold text-purple-900">{shipment.trackingNumber}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In Transit</option>
            <option value="customs">Customs</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        {/* Origin */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            Origin
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Port *"
              name="origin.port"
              placeholder="e.g., Shanghai Port"
              value={formData.origin.port}
              onChange={handleChange}
              error={errors['origin.port']}
            />
            <Input
              label="City"
              name="origin.city"
              placeholder="e.g., Shanghai"
              value={formData.origin.city || ''}
              onChange={handleChange}
            />
            <Input
              label="Country *"
              name="origin.country"
              placeholder="e.g., China"
              value={formData.origin.country}
              onChange={handleChange}
              error={errors['origin.country']}
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            Destination
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Port *"
              name="destination.port"
              placeholder="e.g., Los Angeles Port"
              value={formData.destination.port}
              onChange={handleChange}
              error={errors['destination.port']}
            />
            <Input
              label="City"
              name="destination.city"
              placeholder="e.g., Los Angeles"
              value={formData.destination.city || ''}
              onChange={handleChange}
            />
            <Input
              label="Country *"
              name="destination.country"
              placeholder="e.g., USA"
              value={formData.destination.country}
              onChange={handleChange}
              error={errors['destination.country']}
            />
          </div>
        </div>

        {/* Dates */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            Schedule
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Departure Date"
              type="date"
              name="dates.departureDate"
              value={formData.dates.departureDate || ''}
              onChange={handleChange}
            />
            <Input
              label="Estimated Arrival"
              type="date"
              name="dates.estimatedArrival"
              value={formData.dates.estimatedArrival || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Cargo Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-600" />
            Cargo Details
          </h4>
          <div className="space-y-4">
            <Input
              label="Description *"
              name="cargo.description"
              placeholder="e.g., Electronics, Machinery"
              value={formData.cargo.description}
              onChange={handleChange}
              error={errors['cargo.description']}
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                name="cargo.weight"
                placeholder="0"
                value={formData.cargo.weight || ''}
                onChange={handleChange}
              />
              <Input
                label="Volume (m³)"
                type="number"
                name="cargo.volume"
                placeholder="0"
                value={formData.cargo.volume || ''}
                onChange={handleChange}
              />
              <Input
                label="Quantity"
                type="number"
                name="cargo.quantity"
                placeholder="0"
                value={formData.cargo.quantity || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Financial */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Financial Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Cost"
              type="number"
              name="totalCost"
              placeholder="0"
              value={formData.totalCost || ''}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="LKR">LKR</option>
                <option value="INR">INR</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditShipmentModal;
