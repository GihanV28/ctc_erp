'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import {
  Building2,
  User,
  FileText,
  CreditCard,
  Ship,
  Plane,
  Box,
  Anchor,
  Warehouse,
  FileCheck,
  Truck,
  Zap,
  Star,
  Plus,
  Trash2,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { Supplier } from '@/services/supplierService';

type ServiceType = 'ocean_freight' | 'air_sea' | 'container' | 'port_ops' | 'warehouse' | 'customs' | 'ground' | 'express';
type SupplierStatus = 'active' | 'inactive' | 'pending';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSupplierFormData) => void;
  editingSupplier?: Supplier | null;
  mode?: 'add' | 'edit' | 'view';
}

interface ContractData {
  id: string;
  contractId: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'expired' | 'terminated';
}

interface NewSupplierFormData {
  // Basic
  name: string;
  tradingName: string;
  serviceTypes: ServiceType[];
  status: SupplierStatus;
  rating: number;
  paymentTerms: string;
  tags: string[];
  notes: string;

  // Contact
  contactPerson: {
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  // Contracts
  contracts: ContractData[];

  // Banking
  banking: {
    bankName: string;
    swiftCode: string;
    accountName: string;
    accountNumber: string;
  };
}

type TabType = 'basic' | 'contact' | 'contracts' | 'banking';

const serviceTypeOptions: { value: ServiceType; label: string; icon: React.ReactNode }[] = [
  { value: 'ocean_freight', label: 'Ocean Freight', icon: <Ship className="h-6 w-6" /> },
  { value: 'air_sea', label: 'Air & Sea', icon: <Plane className="h-6 w-6" /> },
  { value: 'container', label: 'Container', icon: <Box className="h-6 w-6" /> },
  { value: 'port_ops', label: 'Port Ops', icon: <Anchor className="h-6 w-6" /> },
  { value: 'warehouse', label: 'Warehouse', icon: <Warehouse className="h-6 w-6" /> },
  { value: 'customs', label: 'Customs', icon: <FileCheck className="h-6 w-6" /> },
  { value: 'ground', label: 'Ground', icon: <Truck className="h-6 w-6" /> },
  { value: 'express', label: 'Express', icon: <Zap className="h-6 w-6" /> },
];

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingSupplier,
  mode = 'add',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [currentTag, setCurrentTag] = useState('');

  const getInitialFormData = (): NewSupplierFormData => {
    if (editingSupplier) {
      return {
        name: editingSupplier.name,
        tradingName: editingSupplier.tradingName || '',
        serviceTypes: editingSupplier.serviceTypes,
        status: editingSupplier.status,
        rating: editingSupplier.rating || 0,
        paymentTerms: editingSupplier.paymentTerms || 'net_30',
        tags: editingSupplier.tags || [],
        notes: editingSupplier.notes || '',
        contactPerson: {
          firstName: editingSupplier.contactPerson.firstName,
          lastName: editingSupplier.contactPerson.lastName,
          position: editingSupplier.contactPerson.position || '',
          email: editingSupplier.contactPerson.email,
          phone: editingSupplier.contactPerson.phone,
        },
        address: {
          street: editingSupplier.address.street || '',
          city: editingSupplier.address.city,
          state: editingSupplier.address.state || '',
          postalCode: editingSupplier.address.postalCode || '',
          country: editingSupplier.address.country,
        },
        contracts: editingSupplier.contracts?.map((c: any) => ({
          id: c._id || `contract-${Date.now()}`,
          contractId: c.contractId,
          value: c.value,
          startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
          endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '',
          status: c.status,
        })) || [],
        banking: {
          bankName: editingSupplier.banking?.bankName || '',
          swiftCode: editingSupplier.banking?.swiftCode || '',
          accountName: editingSupplier.banking?.accountName || '',
          accountNumber: editingSupplier.banking?.accountNumber || '',
        },
      };
    }
    return {
      name: '',
      tradingName: '',
      serviceTypes: ['ocean_freight'],
      status: 'pending',
      rating: 0,
      paymentTerms: 'net_30',
      tags: [],
      notes: '',
      contactPerson: {
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phone: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      contracts: [],
      banking: {
        bankName: '',
        swiftCode: '',
        accountName: '',
        accountNumber: '',
      },
    };
  };

  const [formData, setFormData] = useState<NewSupplierFormData>(getInitialFormData());

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens with editing supplier
  React.useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setActiveTab('basic');
      setErrors({});
    }
  }, [isOpen, editingSupplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.startsWith('contactPerson.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        contactPerson: { ...formData.contactPerson, [field]: value },
      });
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      });
    } else if (name.startsWith('banking.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        banking: { ...formData.banking, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceTypeToggle = (type: ServiceType) => {
    const currentTypes = formData.serviceTypes;
    if (currentTypes.includes(type)) {
      setFormData({ ...formData, serviceTypes: currentTypes.filter(t => t !== type) });
    } else {
      setFormData({ ...formData, serviceTypes: [...currentTypes, type] });
    }
  };

  const handleStatusChange = (status: SupplierStatus) => {
    setFormData({ ...formData, status });
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleAddContract = () => {
    const newContract: ContractData = {
      id: `contract-${Date.now()}`,
      contractId: `CNT-2024-${String(formData.contracts.length + 1).padStart(3, '0')}`,
      value: 0,
      startDate: '',
      endDate: '',
      status: 'pending',
    };
    setFormData({ ...formData, contracts: [...formData.contracts, newContract] });
  };

  const handleRemoveContract = (id: string) => {
    setFormData({ ...formData, contracts: formData.contracts.filter(c => c.id !== id) });
  };

  const handleContractChange = (id: string, field: keyof ContractData, value: any) => {
    setFormData({
      ...formData,
      contracts: formData.contracts.map(contract =>
        contract.id === id ? { ...contract, [field]: value } : contract
      ),
    });
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (formData.serviceTypes.length === 0) newErrors.serviceTypes = 'At least one service type is required';
    if (!formData.contactPerson.firstName.trim()) newErrors['contactPerson.firstName'] = 'First name is required';
    if (!formData.contactPerson.lastName.trim()) newErrors['contactPerson.lastName'] = 'Last name is required';
    if (!formData.contactPerson.email.trim()) {
      newErrors['contactPerson.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPerson.email)) {
      newErrors['contactPerson.email'] = 'Please enter a valid email address';
    }
    if (!formData.contactPerson.phone.trim()) newErrors['contactPerson.phone'] = 'Phone number is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Switch to the tab with errors
      if (errors.name || errors.serviceTypes) {
        setActiveTab('basic');
      } else if (Object.keys(errors).some(k => k.startsWith('contactPerson') || k.startsWith('address'))) {
        setActiveTab('contact');
      }
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepNumber = () => {
    const tabs: TabType[] = ['basic', 'contact', 'contracts', 'banking'];
    return tabs.indexOf(activeTab) + 1;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'View Supplier Details' : mode === 'edit' ? 'Edit Supplier' : 'Add New Supplier'}
      description={mode === 'view' ? 'Supplier information (read-only)' : mode === 'edit' ? 'Update supplier details' : 'Enter supplier details'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 'basic'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Basic
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 'contact'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="h-4 w-4" />
              Contact
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contracts')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 'contracts'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              Contracts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('banking')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 'banking'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Banking
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Basic Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Company Name *"
                  name="name"
                  placeholder="e.g., Maritime Shipping"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  disabled={mode === 'view'}
                />
                <Input
                  label="Trading Name"
                  name="tradingName"
                  placeholder="e.g., MSL"
                  value={formData.tradingName}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                />
              </div>

              {/* Service Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service Types <span className="text-red-500">*</span> (Select one or more)
                </label>
                {errors.serviceTypes && (
                  <p className="text-sm text-red-600 mb-2">{errors.serviceTypes}</p>
                )}
                <div className="grid grid-cols-4 gap-3">
                  {serviceTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleServiceTypeToggle(option.value)}
                      disabled={mode === 'view'}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        formData.serviceTypes.includes(option.value)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } ${mode === 'view' ? 'cursor-default opacity-75' : ''}`}
                    >
                      {option.icon}
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="flex gap-3">
                  {(['active', 'inactive', 'pending'] as SupplierStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      disabled={mode === 'view'}
                      className={`px-6 py-2.5 rounded-lg border-2 transition-all capitalize ${
                        formData.status === status
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } ${mode === 'view' ? 'cursor-default opacity-75' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      disabled={mode === 'view'}
                      className="transition-all"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                >
                  <option value="net_30">Net 30</option>
                  <option value="net_60">Net 60</option>
                  <option value="net_90">Net 90</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="advance">Advance Payment</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    disabled={mode === 'view'}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={mode === 'view'}
                    className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={mode === 'view'}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Notes..."
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">
                    Contact Person
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    label="First Name *"
                    name="contactPerson.firstName"
                    placeholder="John"
                    value={formData.contactPerson.firstName}
                    onChange={handleChange}
                    error={errors['contactPerson.firstName']}
                    disabled={mode === 'view'}
                  />
                  <Input
                    label="Last Name *"
                    name="contactPerson.lastName"
                    placeholder="Doe"
                    value={formData.contactPerson.lastName}
                    onChange={handleChange}
                    error={errors['contactPerson.lastName']}
                    disabled={mode === 'view'}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Position"
                    name="contactPerson.position"
                    placeholder="Account Manager"
                    value={formData.contactPerson.position}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    name="contactPerson.email"
                    placeholder="john@example.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                    value={formData.contactPerson.email}
                    onChange={handleChange}
                    error={errors['contactPerson.email']}
                    disabled={mode === 'view'}
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Phone *"
                    type="tel"
                    name="contactPerson.phone"
                    placeholder="+1 555-0123"
                    leftIcon={<Phone className="h-4 w-4" />}
                    value={formData.contactPerson.phone}
                    onChange={handleChange}
                    error={errors['contactPerson.phone']}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Street"
                    name="address.street"
                    placeholder="123 Main St"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City *"
                      name="address.city"
                      placeholder="Miami"
                      value={formData.address.city}
                      onChange={handleChange}
                      error={errors['address.city']}
                      disabled={mode === 'view'}
                    />
                    <Input
                      label="State"
                      name="address.state"
                      placeholder="Florida"
                      value={formData.address.state}
                      onChange={handleChange}
                      disabled={mode === 'view'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Postal Code"
                      name="address.postalCode"
                      placeholder="33101"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      disabled={mode === 'view'}
                    />
                    <Input
                      label="Country *"
                      name="address.country"
                      placeholder="USA"
                      value={formData.address.country}
                      onChange={handleChange}
                      error={errors['address.country']}
                      disabled={mode === 'view'}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contracts Tab */}
          {activeTab === 'contracts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Contracts</label>
                <button
                  type="button"
                  onClick={handleAddContract}
                  disabled={mode === 'view'}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Contract
                </button>
              </div>

              {formData.contracts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No contracts added yet. Click "Add Contract" to create one.
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.contracts.map((contract, index) => (
                    <div key={contract.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Contract #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveContract(contract.id)}
                          disabled={mode === 'view'}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Contract ID
                          </label>
                          <input
                            type="text"
                            value={contract.contractId}
                            onChange={(e) => handleContractChange(contract.id, 'contractId', e.target.value)}
                            disabled={mode === 'view'}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Value ($)
                          </label>
                          <input
                            type="number"
                            value={contract.value}
                            onChange={(e) => handleContractChange(contract.id, 'value', Number(e.target.value))}
                            disabled={mode === 'view'}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Start
                          </label>
                          <input
                            type="date"
                            value={contract.startDate}
                            onChange={(e) => handleContractChange(contract.id, 'startDate', e.target.value)}
                            disabled={mode === 'view'}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            End
                          </label>
                          <input
                            type="date"
                            value={contract.endDate}
                            onChange={(e) => handleContractChange(contract.id, 'endDate', e.target.value)}
                            disabled={mode === 'view'}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Status
                        </label>
                        <select
                          value={contract.status}
                          onChange={(e) => handleContractChange(contract.id, 'status', e.target.value)}
                          disabled={mode === 'view'}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                          <option value="terminated">Terminated</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Banking Tab */}
          {activeTab === 'banking' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">
                    Bank Details
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    name="banking.bankName"
                    placeholder="Bank of America"
                    value={formData.banking.bankName}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                  <Input
                    label="SWIFT Code"
                    name="banking.swiftCode"
                    placeholder="BOFAUS3N"
                    value={formData.banking.swiftCode}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Account Name"
                    name="banking.accountName"
                    placeholder="Company name"
                    value={formData.banking.accountName}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                  <Input
                    label="Account Number"
                    name="banking.accountNumber"
                    placeholder="1234567890"
                    value={formData.banking.accountNumber}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Banking info is encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Step {getStepNumber()} of 4
          </span>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                leftIcon={<Building2 className="h-4 w-4" />}
              >
                {mode === 'edit' ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddSupplierModal;
