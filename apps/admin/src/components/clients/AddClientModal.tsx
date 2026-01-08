'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@/components/ui';
import { Client, CreateClientData } from '@/services/clientService';
import { X } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientData) => Promise<void>;
  client?: Client | null;
  mode?: 'add' | 'edit' | 'view';
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client,
  mode = 'add',
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sameAsAddress, setSameAsAddress] = useState(true);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<CreateClientData>({
    companyName: '',
    tradingName: '',
    industry: '',
    website: '',
    contactPerson: {
      firstName: '',
      lastName: '',
      position: '',
      email: '',
      phone: '',
      alternatePhone: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      sameAsAddress: true,
    },
    status: 'active',
    creditLimit: 0,
    paymentTerms: 30,
    taxId: '',
    registrationNumber: '',
    notes: '',
    tags: [],
    preferredCurrency: 'USD',
  });

  // Load client data when in edit or view mode
  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && client) {
      setFormData({
        companyName: client.companyName || '',
        tradingName: client.tradingName || '',
        industry: client.industry || '',
        website: client.website || '',
        contactPerson: {
          firstName: client.contactPerson?.firstName || '',
          lastName: client.contactPerson?.lastName || '',
          position: client.contactPerson?.position || '',
          email: client.contactPerson?.email || '',
          phone: client.contactPerson?.phone || '',
          alternatePhone: client.contactPerson?.alternatePhone || '',
        },
        address: {
          street: client.address?.street || '',
          city: client.address?.city || '',
          state: client.address?.state || '',
          postalCode: client.address?.postalCode || '',
          country: client.address?.country || '',
        },
        billingAddress: {
          street: client.billingAddress?.street || '',
          city: client.billingAddress?.city || '',
          state: client.billingAddress?.state || '',
          postalCode: client.billingAddress?.postalCode || '',
          country: client.billingAddress?.country || '',
          sameAsAddress: client.billingAddress?.sameAsAddress ?? true,
        },
        status: client.status || 'active',
        creditLimit: client.creditLimit || 0,
        paymentTerms: client.paymentTerms || 30,
        taxId: client.taxId || '',
        registrationNumber: client.registrationNumber || '',
        notes: client.notes || '',
        tags: client.tags || [],
        preferredCurrency: client.preferredCurrency || 'USD',
      });
      setSameAsAddress(client.billingAddress?.sameAsAddress ?? true);
    } else if (mode === 'add') {
      // Reset form when switching to add mode
      resetForm();
    }
  }, [mode, client, isOpen]);

  const resetForm = () => {
    setFormData({
      companyName: '',
      tradingName: '',
      industry: '',
      website: '',
      contactPerson: {
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phone: '',
        alternatePhone: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        sameAsAddress: true,
      },
      status: 'active',
      creditLimit: 0,
      paymentTerms: 30,
      taxId: '',
      registrationNumber: '',
      notes: '',
      tags: [],
      preferredCurrency: 'USD',
    });
    setSameAsAddress(true);
    setTagInput('');
    setErrors({});
  };

  const handleInputChange = (
    field: string,
    value: string | number,
    nested?: string
  ) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: {
          ...(prev[nested as keyof CreateClientData] as any),
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSameAsAddressChange = (checked: boolean) => {
    setSameAsAddress(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...formData.address,
          sameAsAddress: true,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          sameAsAddress: false,
        },
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactPerson.firstName.trim()) {
      newErrors.contactFirstName = 'First name is required';
    }

    if (!formData.contactPerson.lastName.trim()) {
      newErrors.contactLastName = 'Last name is required';
    }

    if (!formData.contactPerson.email.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPerson.email)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    if (!formData.contactPerson.phone.trim()) {
      newErrors.contactPhone = 'Phone is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.addressCity = 'City is required';
    }

    if (!formData.address.country.trim()) {
      newErrors.addressCountry = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // Update sameAsAddress flag
      const submitData = {
        ...formData,
        billingAddress: {
          ...formData.billingAddress,
          sameAsAddress,
        },
      };

      await onSubmit(submitData);
      resetForm();
      onClose();
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Failed to save client. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'view' ? 'View Client Details' : mode === 'edit' ? 'Edit Client' : 'Add New Client'}
      description={
        mode === 'view'
          ? 'Client information (read-only)'
          : mode === 'edit'
          ? 'Update client information'
          : 'Enter the details of the new client'
      }
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              error={errors.companyName}
              placeholder="ABC Corporation"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Trading Name"
              value={formData.tradingName}
              onChange={(e) => handleInputChange('tradingName', e.target.value)}
              placeholder="ABC Corp"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="e.g., Manufacturing, Retail"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              disabled={loading || mode === 'view'}
            />
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Person
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              value={formData.contactPerson.firstName}
              onChange={(e) =>
                handleInputChange('firstName', e.target.value, 'contactPerson')
              }
              error={errors.contactFirstName}
              placeholder="John"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Last Name *"
              value={formData.contactPerson.lastName}
              onChange={(e) =>
                handleInputChange('lastName', e.target.value, 'contactPerson')
              }
              error={errors.contactLastName}
              placeholder="Doe"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Position"
              value={formData.contactPerson.position}
              onChange={(e) =>
                handleInputChange('position', e.target.value, 'contactPerson')
              }
              placeholder="CEO, Manager, etc."
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Email *"
              type="email"
              value={formData.contactPerson.email}
              onChange={(e) =>
                handleInputChange('email', e.target.value, 'contactPerson')
              }
              error={errors.contactEmail}
              placeholder="john@example.com"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Phone *"
              type="tel"
              value={formData.contactPerson.phone}
              onChange={(e) =>
                handleInputChange('phone', e.target.value, 'contactPerson')
              }
              error={errors.contactPhone}
              placeholder="+1 234 567 8900"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Alternate Phone"
              type="tel"
              value={formData.contactPerson.alternatePhone}
              onChange={(e) =>
                handleInputChange('alternatePhone', e.target.value, 'contactPerson')
              }
              placeholder="+1 234 567 8901"
              disabled={loading || mode === 'view'}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Street"
                value={formData.address.street}
                onChange={(e) =>
                  handleInputChange('street', e.target.value, 'address')
                }
                placeholder="123 Main St"
                disabled={loading || mode === 'view'}
              />
            </div>
            <Input
              label="City *"
              value={formData.address.city}
              onChange={(e) =>
                handleInputChange('city', e.target.value, 'address')
              }
              error={errors.addressCity}
              placeholder="New York"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="State/Province"
              value={formData.address.state}
              onChange={(e) =>
                handleInputChange('state', e.target.value, 'address')
              }
              placeholder="NY"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Postal Code"
              value={formData.address.postalCode}
              onChange={(e) =>
                handleInputChange('postalCode', e.target.value, 'address')
              }
              placeholder="10001"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Country *"
              value={formData.address.country}
              onChange={(e) =>
                handleInputChange('country', e.target.value, 'address')
              }
              error={errors.addressCountry}
              placeholder="USA"
              disabled={loading || mode === 'view'}
            />
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Billing Address
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsAddress}
                onChange={(e) => handleSameAsAddressChange(e.target.checked)}
                disabled={loading || mode === 'view'}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Same as address</span>
            </label>
          </div>
          {!sameAsAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Street"
                  value={formData.billingAddress?.street || ''}
                  onChange={(e) =>
                    handleInputChange('street', e.target.value, 'billingAddress')
                  }
                  placeholder="123 Billing St"
                  disabled={loading || mode === 'view'}
                />
              </div>
              <Input
                label="City"
                value={formData.billingAddress?.city || ''}
                onChange={(e) =>
                  handleInputChange('city', e.target.value, 'billingAddress')
                }
                placeholder="New York"
                disabled={loading || mode === 'view'}
              />
              <Input
                label="State/Province"
                value={formData.billingAddress?.state || ''}
                onChange={(e) =>
                  handleInputChange('state', e.target.value, 'billingAddress')
                }
                placeholder="NY"
                disabled={loading || mode === 'view'}
              />
              <Input
                label="Postal Code"
                value={formData.billingAddress?.postalCode || ''}
                onChange={(e) =>
                  handleInputChange('postalCode', e.target.value, 'billingAddress')
                }
                placeholder="10001"
                disabled={loading || mode === 'view'}
              />
              <Input
                label="Country"
                value={formData.billingAddress?.country || ''}
                onChange={(e) =>
                  handleInputChange('country', e.target.value, 'billingAddress')
                }
                placeholder="USA"
                disabled={loading || mode === 'view'}
              />
            </div>
          )}
        </div>

        {/* Financial Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Financial Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange('status', e.target.value as any)
                }
                disabled={loading || mode === 'view'}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <Input
              label="Credit Limit"
              type="number"
              min="0"
              step="0.01"
              value={formData.creditLimit}
              onChange={(e) =>
                handleInputChange('creditLimit', parseFloat(e.target.value) || 0)
              }
              placeholder="10000"
              disabled={loading || mode === 'view'}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Payment Terms (Days)
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) =>
                  handleInputChange('paymentTerms', parseInt(e.target.value) as any)
                }
                disabled={loading || mode === 'view'}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              >
                <option value={15}>15 Days</option>
                <option value={30}>30 Days</option>
                <option value={45}>45 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
              </select>
            </div>
            <Input
              label="Preferred Currency"
              value={formData.preferredCurrency}
              onChange={(e) =>
                handleInputChange('preferredCurrency', e.target.value)
              }
              placeholder="USD"
              disabled={loading || mode === 'view'}
            />
          </div>
        </div>

        {/* Registration Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Registration Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax ID"
              value={formData.taxId}
              onChange={(e) => handleInputChange('taxId', e.target.value)}
              placeholder="XX-XXXXXXX"
              disabled={loading || mode === 'view'}
            />
            <Input
              label="Registration Number"
              value={formData.registrationNumber}
              onChange={(e) =>
                handleInputChange('registrationNumber', e.target.value)
              }
              placeholder="REG-XXXXXX"
              disabled={loading || mode === 'view'}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                disabled={loading || mode === 'view'}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={loading || !tagInput.trim() || mode === 'view'}
                variant="outline"
              >
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={loading || mode === 'view'}
                      className="hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes about the client..."
            disabled={loading || mode === 'view'}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button type="submit" variant="primary" disabled={loading}>
              {loading
                ? mode === 'edit'
                  ? 'Updating...'
                  : 'Creating...'
                : mode === 'edit'
                ? 'Update Client'
                : 'Create Client'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;
