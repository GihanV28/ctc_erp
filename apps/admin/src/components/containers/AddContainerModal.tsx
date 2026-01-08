'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { Box, MapPin, Calendar } from 'lucide-react';
import { ContainerType, ContainerCondition } from '@/types';

interface AddContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewContainerFormData) => void;
}

interface NewContainerFormData {
  containerNumber: string;
  type: ContainerType;
  status: 'available' | 'in_use' | 'maintenance';
  condition: ContainerCondition;
  locationName: string;
  city: string;
  country: string;
  volume: number;
  maxWeight: number;
  manufacturingDate: string;
  nextMaintenance: string;
  notes?: string;
}

const containerCapacities: Record<ContainerType, { volume: number; maxWeight: number }> = {
  '20ft_standard': { volume: 33.2, maxWeight: 21750 },
  '20ft_high_cube': { volume: 37.4, maxWeight: 21600 },
  '40ft_standard': { volume: 67.5, maxWeight: 26680 },
  '40ft_high_cube': { volume: 67.7, maxWeight: 28580 },
  '40ft_refrigerated': { volume: 67.3, maxWeight: 26580 },
};

const AddContainerModal: React.FC<AddContainerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Generate container number based on current timestamp
  const generateContainerNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format: CCTU + YYMMDD + HHMMSS = CCTU241225143022
    return `CCTU${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const [formData, setFormData] = useState<NewContainerFormData>({
    containerNumber: generateContainerNumber(),
    type: '40ft_standard',
    status: 'available',
    condition: 'good',
    locationName: '',
    city: '',
    country: '',
    volume: 67.5,
    maxWeight: 26680,
    manufacturingDate: '',
    nextMaintenance: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewContainerFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    // Auto-fill capacity when container type changes
    if (name === 'type') {
      const capacity = containerCapacities[value as ContainerType];
      updatedData = {
        ...updatedData,
        volume: capacity.volume,
        maxWeight: capacity.maxWeight,
      };
    }

    setFormData(updatedData);

    // Clear error for this field
    if (errors[name as keyof NewContainerFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewContainerFormData, string>> = {};

    if (!formData.containerNumber.trim()) newErrors.containerNumber = 'Container number is required';
    if (!formData.locationName.trim()) newErrors.locationName = 'Location/Port name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.manufacturingDate) newErrors.manufacturingDate = 'Manufacturing date is required';

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
      // Reset form with new container number
      setFormData({
        containerNumber: generateContainerNumber(),
        type: '40ft_standard',
        status: 'available',
        condition: 'good',
        locationName: '',
        city: '',
        country: '',
        volume: 67.5,
        maxWeight: 26680,
        manufacturingDate: '',
        nextMaintenance: '',
        notes: '',
      });
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Container"
      description="Register a new container to your fleet"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Container Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Container Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="containerNumber"
              placeholder="e.g., CCTU241225143022"
              value={formData.containerNumber}
              onChange={handleChange}
              className={`flex-1 px-4 py-2.5 rounded-lg border ${
                errors.containerNumber
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
              } focus:ring-2 focus:outline-none transition-all`}
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, containerNumber: generateContainerNumber() })}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all whitespace-nowrap"
              title="Generate new container number"
            >
              🔄 Regenerate
            </button>
          </div>
          {errors.containerNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.containerNumber}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Auto-generated based on current date and time. You can edit or regenerate.</p>
        </div>

        {/* Row 1: Container Type and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Container Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            >
              <option value="20ft_standard">20ft Standard</option>
              <option value="20ft_high_cube">20ft High Cube</option>
              <option value="40ft_standard">40ft Standard</option>
              <option value="40ft_high_cube">40ft High Cube</option>
              <option value="40ft_refrigerated">40ft Refrigerated</option>
            </select>
          </div>

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
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Condition
          </label>
          <div className="flex gap-3">
            {(['excellent', 'good', 'fair', 'under_repair'] as ContainerCondition[]).map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setFormData({ ...formData, condition: cond })}
                className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all ${
                  formData.condition === cond
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {cond.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Location/Port Name *"
              name="locationName"
              placeholder="e.g., Colombo Port"
              value={formData.locationName}
              onChange={handleChange}
              error={errors.locationName}
            />

            <Input
              label="City *"
              name="city"
              placeholder="e.g., Colombo"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />

            <Input
              label="Country *"
              name="country"
              placeholder="e.g., Sri Lanka"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
            />
          </div>
        </div>

        {/* Capacity Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Capacity <span className="text-gray-500 text-xs">(auto-filled)</span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Volume (m³)"
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              disabled
              className="bg-gray-50"
            />

            <Input
              label="Max Weight (kg)"
              type="number"
              name="maxWeight"
              value={formData.maxWeight}
              onChange={handleChange}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Dates Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Dates
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Manufacturing Date *"
              type="date"
              name="manufacturingDate"
              value={formData.manufacturingDate}
              onChange={handleChange}
              error={errors.manufacturingDate}
            />

            <Input
              label="Next Maintenance"
              type="date"
              name="nextMaintenance"
              value={formData.nextMaintenance}
              onChange={handleChange}
            />
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
            leftIcon={<Box className="h-4 w-4" />}
          >
            Add Container
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContainerModal;
