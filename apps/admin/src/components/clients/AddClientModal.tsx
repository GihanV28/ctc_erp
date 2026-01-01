'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { UserPlus, Building2, User, Mail, Phone, MapPin } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewClientFormData) => void;
}

interface NewClientFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  notes?: string;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<NewClientFormData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    status: 'active',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewClientFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name as keyof NewClientFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewClientFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

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
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        status: 'active',
        notes: '',
      });
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      description="Register a new client to your system"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Company Information
            </label>
          </div>

          <Input
            label="Company Name *"
            name="name"
            placeholder="e.g., Acme Corporation"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </div>

        {/* Contact Person */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Contact Person
            </label>
          </div>

          <Input
            label="Full Name *"
            name="contactPerson"
            placeholder="e.g., John Anderson"
            value={formData.contactPerson}
            onChange={handleChange}
            error={errors.contactPerson}
          />
        </div>

        {/* Contact Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Contact Details
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              name="email"
              placeholder="email@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Phone Number *"
              type="tel"
              name="phone"
              placeholder="+1 555-0123"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City *"
              name="city"
              placeholder="e.g., New York"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />

            <Input
              label="Country *"
              name="country"
              placeholder="e.g., USA"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
            />
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Additional notes about the client..."
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
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Add Client
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;
