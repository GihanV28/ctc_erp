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
import { ServiceType, SupplierStatus } from '@/types';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSupplierFormData) => void;
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
  companyName: string;
  tradingName: string;
  serviceType: ServiceType;
  status: SupplierStatus;
  rating: number;
  paymentTerms: string;
  tags: string[];
  notes: string;

  // Contact
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Contracts
  contracts: ContractData[];

  // Banking
  bankName: string;
  swiftCode: string;
  accountName: string;
  accountNumber: string;
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
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [currentTag, setCurrentTag] = useState('');

  const [formData, setFormData] = useState<NewSupplierFormData>({
    companyName: '',
    tradingName: '',
    serviceType: 'ocean_freight',
    status: 'active',
    rating: 0,
    paymentTerms: 'net_30',
    tags: [],
    notes: '',
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    contracts: [],
    bankName: '',
    swiftCode: '',
    accountName: '',
    accountNumber: '',
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceTypeChange = (type: ServiceType) => {
    setFormData({ ...formData, serviceType: type });
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

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
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

    if (!validate()) {
      // Switch to the tab with errors
      if (errors.companyName || errors.serviceType) {
        setActiveTab('basic');
      } else if (errors.firstName || errors.lastName || errors.email || errors.phone || errors.city || errors.country) {
        setActiveTab('contact');
      }
      return;
    }

    setLoading(true);

    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
      onClose();
      // Reset form
      setFormData({
        companyName: '',
        tradingName: '',
        serviceType: 'ocean_freight',
        status: 'active',
        rating: 0,
        paymentTerms: 'net_30',
        tags: [],
        notes: '',
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        contracts: [],
        bankName: '',
        swiftCode: '',
        accountName: '',
        accountNumber: '',
      });
      setActiveTab('basic');
    }, 1000);
  };

  const getStepNumber = () => {
    const tabs: TabType[] = ['basic', 'contact', 'contracts', 'banking'];
    return tabs.indexOf(activeTab) + 1;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Supplier"
      description="Enter supplier details"
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
                  name="companyName"
                  placeholder="e.g., Maritime Shipping"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                />
                <Input
                  label="Trading Name"
                  name="tradingName"
                  placeholder="e.g., MSL"
                  value={formData.tradingName}
                  onChange={handleChange}
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {serviceTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleServiceTypeChange(option.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        formData.serviceType === option.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
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
                      className={`px-6 py-2.5 rounded-lg border-2 transition-all capitalize ${
                        formData.status === status
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
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
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name *"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Position"
                    name="position"
                    placeholder="Account Manager"
                    value={formData.position}
                    onChange={handleChange}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Phone *"
                    type="tel"
                    name="phone"
                    placeholder="+1 555-0123"
                    leftIcon={<Phone className="h-4 w-4" />}
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
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
                    name="street"
                    placeholder="123 Main St"
                    value={formData.street}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City *"
                      name="city"
                      placeholder="Miami"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                    />
                    <Input
                      label="State"
                      name="state"
                      placeholder="Florida"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Postal Code"
                      name="postalCode"
                      placeholder="33101"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                    <Input
                      label="Country *"
                      name="country"
                      placeholder="USA"
                      value={formData.country}
                      onChange={handleChange}
                      error={errors.country}
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
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
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
                          className="text-red-600 hover:text-red-700"
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
                    name="bankName"
                    placeholder="Bank of America"
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                  <Input
                    label="SWIFT Code"
                    name="swiftCode"
                    placeholder="BOFAUS3N"
                    value={formData.swiftCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Account Name"
                    name="accountName"
                    placeholder="Company name"
                    value={formData.accountName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Account Number"
                    name="accountNumber"
                    placeholder="1234567890"
                    value={formData.accountNumber}
                    onChange={handleChange}
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              leftIcon={<Building2 className="h-4 w-4" />}
            >
              Add Supplier
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddSupplierModal;
