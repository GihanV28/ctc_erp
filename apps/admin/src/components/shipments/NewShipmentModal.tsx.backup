'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { Package, MapPin, Calendar, Box, Scale } from 'lucide-react';

interface NewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewShipmentFormData) => void;
}

interface NewShipmentFormData {
  clientId: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  containerId: string;
  cargoType: string;
  weight: number;
  description?: string;
}

const NewShipmentModal: React.FC<NewShipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<NewShipmentFormData>({
    clientId: '',
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    containerId: '',
    cargoType: '',
    weight: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewShipmentFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'weight' ? parseFloat(value) || 0 : value,
    }));

    // Clear error for this field
    if (errors[name as keyof NewShipmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewShipmentFormData, string>> = {};

    if (!formData.clientId) newErrors.clientId = 'Client is required';
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
    if (!formData.containerId) newErrors.containerId = 'Container is required';
    if (!formData.cargoType.trim()) newErrors.cargoType = 'Cargo type is required';
    if (formData.weight <= 0) newErrors.weight = 'Weight must be greater than 0';

    // Validate dates
    if (formData.departureDate && formData.arrivalDate) {
      const departure = new Date(formData.departureDate);
      const arrival = new Date(formData.arrivalDate);
      if (arrival <= departure) {
        newErrors.arrivalDate = 'Arrival date must be after departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
      onClose();
      // Reset form
      setFormData({
        clientId: '',
        origin: '',
        destination: '',
        departureDate: '',
        arrivalDate: '',
        containerId: '',
        cargoType: '',
        weight: 0,
        description: '',
      });
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shipment"
      description="Enter the details for the new shipment"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Client and Container */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client *
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            >
              <option value="">Select client</option>
              <option value="CLT-001">Acme Corporation</option>
              <option value="CLT-002">Global Traders Ltd</option>
              <option value="CLT-003">Tech Import Co</option>
              <option value="CLT-004">Fashion Imports</option>
              <option value="CLT-005">Automotive Parts Inc</option>
              <option value="CLT-006">Medical Supplies Co</option>
            </select>
            {errors.clientId && (
              <p className="mt-1.5 text-sm text-red-600">{errors.clientId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Container *
            </label>
            <select
              name="containerId"
              value={formData.containerId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            >
              <option value="">Select container</option>
              <option value="CONT-459">CONT-459 (40ft Standard - Available)</option>
              <option value="CONT-462">CONT-462 (20ft High Cube - Available)</option>
            </select>
            {errors.containerId && (
              <p className="mt-1.5 text-sm text-red-600">{errors.containerId}</p>
            )}
          </div>
        </div>

        {/* Row 2: Origin and Destination */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Origin *"
            name="origin"
            placeholder="e.g., Shanghai, China"
            value={formData.origin}
            onChange={handleChange}
            error={errors.origin}
            leftIcon={<MapPin className="h-5 w-5" />}
          />

          <Input
            label="Destination *"
            name="destination"
            placeholder="e.g., Los Angeles, USA"
            value={formData.destination}
            onChange={handleChange}
            error={errors.destination}
            leftIcon={<MapPin className="h-5 w-5" />}
          />
        </div>

        {/* Row 3: Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Departure Date *"
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            error={errors.departureDate}
            leftIcon={<Calendar className="h-5 w-5" />}
          />

          <Input
            label="Arrival Date *"
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            error={errors.arrivalDate}
            leftIcon={<Calendar className="h-5 w-5" />}
          />
        </div>

        {/* Row 4: Cargo Details */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cargo Type *"
            name="cargoType"
            placeholder="e.g., Electronics, Machinery"
            value={formData.cargoType}
            onChange={handleChange}
            error={errors.cargoType}
            leftIcon={<Box className="h-5 w-5" />}
          />

          <Input
            label="Weight (kg) *"
            type="number"
            name="weight"
            placeholder="0"
            value={formData.weight || ''}
            onChange={handleChange}
            error={errors.weight}
            leftIcon={<Scale className="h-5 w-5" />}
          />
        </div>

        {/* Row 5: Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description (Optional)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Additional details about the shipment..."
            value={formData.description}
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
            leftIcon={<Package className="h-4 w-4" />}
          >
            Create Shipment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewShipmentModal;
