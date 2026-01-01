'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Upload, MapPin } from 'lucide-react';
import { mockUser } from '@/lib/mockData';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: 'John Doe',
    email: 'john.doe@acmecorp.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '',
    nationality: '',
    preferredLanguage: '',

    // Company Information
    companyName: 'Acme Corporation',
    jobTitle: 'Logistics Manager',
    companyEmail: 'info@acmecorp.com',
    companyPhone: '+1 (555) 987-6543',
    industry: '',
    website: 'www.acmecorp.com',
    taxId: 'US-123456789',

    // Billing Address
    billingStreet: '',
    billingCity: 'New York',
    billingState: 'NY',
    billingZip: '10001',
    billingCountry: '',

    // Shipping Address
    sameAsBilling: false,
    shippingStreet: '',
    shippingCity: 'Brooklyn',
    shippingState: 'NY',
    shippingZip: '11201',
    shippingCountry: '',

    // Payment Information
    paymentMethod: '',
    creditLimit: '$50,000',
    specialInstructions: '',

    // Notification Preferences
    emailNotifications: true,
    smsNotifications: true,
    marketingCommunications: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    // Handle save logic
  };

  return (
    <PortalLayout
      title="Profile"
      subtitle="Manage your account information and preferences"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{mockUser.name}</span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {mockUser.avatar}
          </div>
        </div>
      }
    >
      <div className="max-w-5xl space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>

          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
              JD
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                Upload a professional photo. Recommended size: 400x400px. Maximum file size: 2MB.
              </p>

              <div className="flex gap-3">
                <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
                  Upload New Photo
                </Button>
                <Button variant="danger" size="sm">
                  Remove Photo
                </Button>
              </div>

              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-3">
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />

            <Input
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            />

            <Input
              label="Preferred Language"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Company Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />

            <Input
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
            />

            <Input
              label="Company Email"
              name="companyEmail"
              type="email"
              value={formData.companyEmail}
              onChange={handleChange}
            />

            <Input
              label="Company Phone"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
            />

            <Input
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
            />

            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <Input
                label="Tax ID / VAT Number"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Billing Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                name="billingStreet"
                value={formData.billingStreet}
                onChange={handleChange}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <Input
              label="City"
              name="billingCity"
              value={formData.billingCity}
              onChange={handleChange}
            />

            <Input
              label="State / Province"
              name="billingState"
              value={formData.billingState}
              onChange={handleChange}
            />

            <Input
              label="ZIP / Postal Code"
              name="billingZip"
              value={formData.billingZip}
              onChange={handleChange}
            />

            <Input
              label="Country"
              name="billingCountry"
              value={formData.billingCountry}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                name="sameAsBilling"
                checked={formData.sameAsBilling}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              Same as billing address
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                name="shippingStreet"
                value={formData.shippingStreet}
                onChange={handleChange}
                leftIcon={<MapPin className="w-4 h-4" />}
                disabled={formData.sameAsBilling}
              />
            </div>

            <Input
              label="City"
              name="shippingCity"
              value={formData.shippingCity}
              onChange={handleChange}
              disabled={formData.sameAsBilling}
            />

            <Input
              label="State / Province"
              name="shippingState"
              value={formData.shippingState}
              onChange={handleChange}
              disabled={formData.sameAsBilling}
            />

            <Input
              label="ZIP / Postal Code"
              name="shippingZip"
              value={formData.shippingZip}
              onChange={handleChange}
              disabled={formData.sameAsBilling}
            />

            <Input
              label="Country"
              name="shippingCountry"
              value={formData.shippingCountry}
              onChange={handleChange}
              disabled={formData.sameAsBilling}
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            />

            <Input
              label="Credit Limit"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Special Instructions / Notes
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Enter any special delivery instructions or notes..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <label className="block font-medium text-gray-900">Email Notifications</label>
                <p className="text-sm text-gray-600">Receive updates about your shipments via email</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <label className="block font-medium text-gray-900">SMS Notifications</label>
                <p className="text-sm text-gray-600">Get text messages for important shipment updates</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="marketingCommunications"
                checked={formData.marketingCommunications}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <label className="block font-medium text-gray-900">Marketing Communications</label>
                <p className="text-sm text-gray-600">Receive promotional offers and company news</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" size="lg">
            Cancel
          </Button>
          <Button variant="primary" size="lg" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
