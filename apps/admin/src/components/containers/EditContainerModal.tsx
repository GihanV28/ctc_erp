'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { Container } from '@/services/containerService';
import { Box, Save } from 'lucide-react';

interface EditContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  container: Container | null;
  onSubmit: (id: string, data: EditContainerFormData) => Promise<void>;
}

export interface EditContainerFormData {
  containerNumber: string;
  type: '20ft_standard' | '40ft_standard' | '40ft_high_cube' | '20ft_high_cube' | '40ft_refrigerated' | '20ft_refrigerated';
  status: 'available' | 'in_use' | 'maintenance' | 'damaged';
  location?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastInspectionDate?: string;
  purchaseDate?: string;
  purchasePrice?: number;
}

const EditContainerModal: React.FC<EditContainerModalProps> = ({
  isOpen,
  onClose,
  container,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EditContainerFormData>({
    containerNumber: '',
    type: '40ft_standard',
    status: 'available',
    location: '',
    condition: 'good',
    lastInspectionDate: '',
    purchaseDate: '',
    purchasePrice: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EditContainerFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  // Populate form when container changes
  useEffect(() => {
    if (container) {
      setFormData({
        containerNumber: container.containerNumber,
        type: container.type,
        status: container.status,
        location: container.location || '',
        condition: container.condition,
        lastInspectionDate: container.lastInspectionDate
          ? new Date(container.lastInspectionDate).toISOString().split('T')[0]
          : '',
        purchaseDate: container.purchaseDate
          ? new Date(container.purchaseDate).toISOString().split('T')[0]
          : '',
        purchasePrice: container.purchasePrice || 0,
      });
    }
  }, [container]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'purchasePrice' ? parseFloat(value) || 0 : value,
    }));

    // Clear error for this field
    if (errors[name as keyof EditContainerFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EditContainerFormData, string>> = {};

    // No validation needed - container number cannot be changed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !container) return;

    setLoading(true);

    try {
      await onSubmit(container._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating container:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!container) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Container"
      description={`Update information for ${container.containerId}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Container Number - Read Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Container Number
          </label>
          <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700">
            {formData.containerNumber}
          </div>
          <p className="mt-1 text-xs text-gray-500">Container number cannot be changed once created</p>
        </div>

        {/* Type and Status */}
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
              <option value="20ft_refrigerated">20ft Refrigerated</option>
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
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <Input
          label="Location"
          name="location"
          placeholder="e.g., Colombo Port"
          value={formData.location}
          onChange={handleChange}
        />

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Condition <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {(['excellent', 'good', 'fair', 'poor'] as const).map((cond) => (
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
                {cond.charAt(0).toUpperCase() + cond.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Last Inspection Date"
            type="date"
            name="lastInspectionDate"
            value={formData.lastInspectionDate}
            onChange={handleChange}
          />

          <Input
            label="Purchase Date"
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
          />
        </div>

        {/* Purchase Price */}
        <Input
          label="Purchase Price (USD)"
          type="number"
          name="purchasePrice"
          placeholder="e.g., 4500"
          value={formData.purchasePrice}
          onChange={handleChange}
          min="0"
          step="0.01"
        />

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

export default EditContainerModal;
