'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Upload, MapPin, Pencil, Trash2 } from 'lucide-react';
import { profileApi, ProfileData, UpdateProfileData } from '@/lib/profile';
import { useAuth } from '@/context/AuthContext';
import { useProfilePhoto } from '@/context/ProfilePhotoContext';
import ProfilePictureModal from '@/components/profile/ProfilePictureModal';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profilePhoto, setProfilePhoto } = useProfilePhoto();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    preferredLanguage: '',

    // Company Information
    companyName: '',
    jobTitle: '',
    companyEmail: '',
    companyPhone: '',
    industry: '',
    website: '',
    taxId: '',

    // Billing Address
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: '',

    // Shipping Address
    sameAsBilling: true,
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: '',

    // Payment Information
    paymentMethod: '',
    creditLimit: '',
    specialInstructions: '',

    // Notification Preferences
    emailNotifications: true,
    smsNotifications: true,
    marketingCommunications: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setProfileData(data);

      // Populate form with fetched data
      setFormData({
        fullName: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        phone: data.user.phone || '',
        dateOfBirth: '',
        nationality: '',
        preferredLanguage: '',

        companyName: data.client?.companyName || '',
        jobTitle: data.client?.contactPerson?.jobTitle || '',
        companyEmail: data.client?.contactPerson?.email || '',
        companyPhone: data.client?.contactPerson?.phone || '',
        industry: data.client?.industry || '',
        website: data.client?.website || '',
        taxId: data.client?.taxId || '',

        billingStreet: data.client?.address?.street || data.client?.billingAddress?.street || '',
        billingCity: data.client?.address?.city || data.client?.billingAddress?.city || '',
        billingState: data.client?.address?.state || data.client?.billingAddress?.state || '',
        billingZip: data.client?.address?.postalCode || data.client?.billingAddress?.postalCode || '',
        billingCountry: data.client?.address?.country || data.client?.billingAddress?.country || '',

        sameAsBilling: data.client?.billingAddress?.sameAsAddress !== false,
        shippingStreet: '',
        shippingCity: '',
        shippingState: '',
        shippingZip: '',
        shippingCountry: '',

        paymentMethod: '',
        creditLimit: data.client?.creditLimit ? `$${data.client.creditLimit.toLocaleString()}` : '',
        specialInstructions: data.client?.notes || '',

        emailNotifications: true,
        smsNotifications: true,
        marketingCommunications: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      alert(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);

      alert('Profile picture uploaded successfully!');
    } catch (error: any) {
      console.error('Failed to upload photo:', error);
      alert(error.message || 'Failed to upload photo');
    }
  };

  const handlePhotoDelete = () => {
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      setProfilePhoto(null);
      alert('Profile picture removed successfully!');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Parse full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Parse credit limit (remove $ and commas)
      const creditLimit = formData.creditLimit
        ? parseFloat(formData.creditLimit.replace(/[$,]/g, ''))
        : 0;

      const updateData: UpdateProfileData = {
        firstName,
        lastName,
        phone: formData.phone,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone,
        industry: formData.industry,
        website: formData.website,
        taxId: formData.taxId,
        billingAddress: {
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          postalCode: formData.billingZip,
          country: formData.billingCountry,
        },
        creditLimit,
        specialInstructions: formData.specialInstructions,
        sameAsBilling: formData.sameAsBilling,
      };

      if (!formData.sameAsBilling) {
        updateData.shippingAddress = {
          street: formData.shippingStreet,
          city: formData.shippingCity,
          state: formData.shippingState,
          postalCode: formData.shippingZip,
          country: formData.shippingCountry,
        };
      }

      await profileApi.updateProfile(updateData);

      // Refresh profile data
      await fetchProfile();

      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout title="Profile" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </PortalLayout>
    );
  }

  const getInitials = () => {
    if (!profileData) return 'U';
    const first = profileData.user.firstName?.charAt(0) || '';
    const last = profileData.user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <PortalLayout
      title="Profile"
      subtitle="Manage your account information and preferences"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {profileData ? `${profileData.user.firstName} ${profileData.user.lastName}` : 'User'}
          </span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {getInitials()}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>

          <div className="flex items-start gap-6">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                {getInitials()}
              </div>
            )}

            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                Upload a professional photo. Recommended size: 400×400px. Maximum file size: 2MB.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-sm"
                  title="Edit profile picture"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {profilePhoto && (
                  <button
                    onClick={handlePhotoDelete}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                    title="Remove profile picture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Upload Modal */}
        <ProfilePictureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpload={handlePhotoUpload}
          currentPhoto={profilePhoto || undefined}
        />

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
              disabled
              helperText="Email cannot be changed"
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
              disabled
              helperText="Contact support to adjust credit limit"
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
          <Button variant="outline" size="lg" onClick={() => fetchProfile()}>
            Cancel
          </Button>
          <Button variant="primary" size="lg" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
