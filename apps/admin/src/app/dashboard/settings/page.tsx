'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Building2,
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Save,
  Download,
  Trash2,
  Lock,
  Smartphone,
  Monitor,
  Upload,
  X,
  Pencil,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toggle from '@/components/ui/Toggle';
import { useRouter } from 'next/navigation';
import { settingsService } from '@/services/settingsService';

type TabType = 'company' | 'profile' | 'notifications' | 'security' | 'system';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Company Information state
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Ceylon Cargo Transport',
    registrationNumber: 'CCT-2024-001',
    email: 'info@ceyloncargo.lk',
    phone: '+94 11 234 5678',
    address: '123 Marine Drive, Fort, Colombo 01, Sri Lanka',
    website: 'www.ceyloncargo.lk',
    industry: 'Logistics & Transportation',
  });

  // User Profile state
  const [userProfile, setUserProfile] = useState({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@ceyloncargo.lk',
    phone: '+94 77 123 4567',
    role: 'Super Administrator',
    department: 'Management',
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    shipmentUpdates: true,
    newClientRegistration: true,
    containerMaintenance: true,
    financialReports: false,
    systemUpdates: true,
    emailDigest: true,
  });

  // Security state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // System preferences state
  const [systemPrefs, setSystemPrefs] = useState({
    language: 'English',
    timezone: 'Asia/Phnom_Penh (UTC+7:00)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'USD ($)',
  });

  // Check if user is super admin and load settings
  useEffect(() => {
    const loadSettings = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);

        // Check if user has super_admin role or wildcard permissions
        const hasAccess = parsedUser.role?.name === 'super_admin' ||
                         parsedUser.role?.permissions?.includes('*:*');

        if (!hasAccess) {
          router.push('/dashboard');
          return;
        }

        // Load settings data from backend
        try {
          const [companyResponse, notificationsResponse, systemResponse] = await Promise.all([
            settingsService.getCompanyInfo(),
            settingsService.getNotifications(),
            settingsService.getSystemPreferences()
          ]);

          // Update company info state
          if (companyResponse.data?.companyInfo) {
            const info = companyResponse.data.companyInfo;
            setCompanyInfo({
              name: info.companyName || 'Ceylon Cargo Transport',
              registrationNumber: info.taxId || 'CCT-2024-001',
              email: info.companyEmail || 'info@ceyloncargo.lk',
              phone: info.companyPhone || '+94 11 234 5678',
              address: info.companyAddress || '123 Marine Drive, Fort, Colombo 01, Sri Lanka',
              website: info.website || 'www.ceyloncargo.lk',
              industry: 'Logistics & Transportation',
            });
          }

          // Update user profile state
          setUserProfile({
            firstName: parsedUser.firstName || 'Super',
            lastName: parsedUser.lastName || 'Admin',
            email: parsedUser.email || 'admin@ceyloncargo.lk',
            phone: parsedUser.phone || '+94 77 123 4567',
            role: parsedUser.role?.displayName || 'Super Administrator',
            department: 'Management',
          });

          // Update notification preferences
          if (notificationsResponse.data?.notificationPreferences) {
            const prefs = notificationsResponse.data.notificationPreferences;
            setNotifications({
              shipmentUpdates: prefs.shipmentUpdates ?? true,
              newClientRegistration: true,
              containerMaintenance: true,
              financialReports: prefs.invoiceAlerts ?? false,
              systemUpdates: prefs.systemUpdates ?? true,
              emailDigest: prefs.newsletter ?? true,
            });
          }

          // Update system preferences
          if (systemResponse.data?.systemPreferences) {
            const sysprefs = systemResponse.data.systemPreferences;
            setSystemPrefs({
              language: sysprefs.language || 'English',
              timezone: sysprefs.timezone || 'Asia/Phnom_Penh (UTC+7:00)',
              dateFormat: sysprefs.dateFormat || 'DD/MM/YYYY',
              currency: sysprefs.currency || 'USD ($)',
            });
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
          // Continue with default values if loading fails
        }
      }
      setLoading(false);
    };

    loadSettings();
  }, [router]);

  const tabs = [
    { id: 'company', label: 'Company Information', icon: Building2 },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: SettingsIcon },
  ];

  const handleSaveCompanyInfo = async () => {
    try {
      setLoading(true);
      await settingsService.updateCompanyInfo({
        companyName: companyInfo.name,
        companyEmail: companyInfo.email,
        companyPhone: companyInfo.phone,
        companyAddress: companyInfo.address,
        website: companyInfo.website,
        taxId: companyInfo.registrationNumber,
      });
      alert('Company information saved successfully!');
    } catch (error: any) {
      console.error('Failed to save company info:', error);
      alert(error.response?.data?.message || 'Failed to save company information');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await settingsService.updateProfile({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
      });

      // Update local storage with new user data
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
      }

      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      await settingsService.updateNotifications({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        shipmentUpdates: notifications.shipmentUpdates,
        invoiceAlerts: notifications.financialReports,
        systemUpdates: notifications.systemUpdates,
        newsletter: notifications.emailDigest,
      });
      alert('Notification preferences saved successfully!');
    } catch (error: any) {
      console.error('Failed to save notifications:', error);
      alert(error.response?.data?.message || 'Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert('Please fill in all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await settingsService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });
      alert('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemPrefs = async () => {
    try {
      setLoading(true);
      await settingsService.updateSystemPreferences({
        language: systemPrefs.language,
        timezone: systemPrefs.timezone,
        dateFormat: systemPrefs.dateFormat,
        currency: systemPrefs.currency,
      });
      alert('System preferences saved successfully!');
    } catch (error: any) {
      console.error('Failed to save system preferences:', error);
      alert(error.response?.data?.message || 'Failed to save system preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await settingsService.exportData();

      // Create a blob and download
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ceylon-cargo-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Data exported successfully!');
    } catch (error: any) {
      console.error('Failed to export data:', error);
      alert(error.response?.data?.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  // Photo upload handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await settingsService.uploadProfilePhoto(file);

      // Update current user with new photo
      if (currentUser && response.data?.profilePhoto) {
        const updatedUser = { ...currentUser, profilePhoto: response.data.profilePhoto };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      setShowUploadModal(false);
      alert('Photo uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    try {
      setLoading(true);
      await settingsService.deleteProfilePhoto();

      // Update current user - remove profile photo
      if (currentUser) {
        const updatedUser = { ...currentUser, profilePhoto: null };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      alert('Profile picture deleted successfully!');
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete profile picture');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings" subtitle="Manage your account and system preferences">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and system preferences"
    >
      <div className="space-y-6">
        {/* Settings Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Company Information Tab */}
            {activeTab === 'company' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Company Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={companyInfo.name}
                      onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, name: e.target.value })
                      }
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Number
                    </label>
                    <Input
                      value={companyInfo.registrationNumber}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          registrationNumber: e.target.value,
                        })
                      }
                      placeholder="Registration Number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) =>
                          setCompanyInfo({ ...companyInfo, email: e.target.value })
                        }
                        placeholder="Email Address"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="tel"
                        value={companyInfo.phone}
                        onChange={(e) =>
                          setCompanyInfo({ ...companyInfo, phone: e.target.value })
                        }
                        placeholder="Phone Number"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        value={companyInfo.address}
                        onChange={(e) =>
                          setCompanyInfo({ ...companyInfo, address: e.target.value })
                        }
                        placeholder="Company Address"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={companyInfo.website}
                        onChange={(e) =>
                          setCompanyInfo({ ...companyInfo, website: e.target.value })
                        }
                        placeholder="Website URL"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={companyInfo.industry}
                        onChange={(e) =>
                          setCompanyInfo({ ...companyInfo, industry: e.target.value })
                        }
                        placeholder="Industry"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button onClick={handleSaveCompanyInfo} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* User Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  User Profile
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Photo with Edit/Delete Icons */}
                  <div className="flex flex-col items-center gap-4">
                    {currentUser?.profilePhoto ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${currentUser.profilePhoto}`}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-semibold">
                        {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                      </div>
                    )}

                    {/* Edit and Delete Icons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors"
                        title="Edit profile picture"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDeletePhoto}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        title="Delete profile picture"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input
                        value={userProfile.firstName}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, firstName: e.target.value })
                        }
                        placeholder="First Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        value={userProfile.lastName}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, lastName: e.target.value })
                        }
                        placeholder="Last Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, email: e.target.value })
                        }
                        placeholder="Email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, phone: e.target.value })
                        }
                        placeholder="Phone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <Input
                        value={userProfile.role}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, role: e.target.value })
                        }
                        placeholder="Role"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <Input
                        value={userProfile.department}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, department: e.target.value })
                        }
                        placeholder="Department"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Shipment Updates
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Receive notifications when shipment status changes
                      </p>
                    </div>
                    <Toggle
                      checked={notifications.shipmentUpdates}
                      onChange={(checked) =>
                        setNotifications({ ...notifications, shipmentUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        New Client Registration
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Get notified when a new client signs up
                      </p>
                    </div>
                    <Toggle
                      checked={notifications.newClientRegistration}
                      onChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newClientRegistration: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Container Maintenance Alerts
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Alerts when containers require maintenance
                      </p>
                    </div>
                    <Toggle
                      checked={notifications.containerMaintenance}
                      onChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          containerMaintenance: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Financial Reports
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Monthly financial summary reports
                      </p>
                    </div>
                    <Toggle
                      checked={notifications.financialReports}
                      onChange={(checked) =>
                        setNotifications({ ...notifications, financialReports: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        System Updates
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Information about system updates and maintenance
                      </p>
                    </div>
                    <Toggle
                      checked={notifications.systemUpdates}
                      onChange={(checked) =>
                        setNotifications({ ...notifications, systemUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Digest</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Daily summary of all activities via email
                      </p>
                    </div>
                    <Toggle
                      checked={notifications.emailDigest}
                      onChange={(checked) =>
                        setNotifications({ ...notifications, emailDigest: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button onClick={handleSaveNotifications} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Security Settings
                </h2>

                {/* Change Password Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords({ ...passwords, current: e.target.value })
                        }
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <Input
                          type="password"
                          value={passwords.new}
                          onChange={(e) =>
                            setPasswords({ ...passwords, new: e.target.value })
                          }
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          value={passwords.confirm}
                          onChange={(e) =>
                            setPasswords({ ...passwords, confirm: e.target.value })
                          }
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <Button onClick={handleUpdatePassword} className="gap-2">
                      <Lock className="w-4 h-4" />
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Two-Factor Authentication Section */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-start justify-between max-w-2xl">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Enable 2FA</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => alert('Enable 2FA feature coming soon!')}
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                {/* Active Sessions Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Active Sessions
                  </h3>

                  <div className="space-y-4 max-w-2xl">
                    {/* Current Session */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Monitor className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Current Session
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Chrome on Windows • Colombo, Sri Lanka
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Active Now
                      </span>
                    </div>

                    {/* Mobile Device */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Mobile Device
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Safari on iPhone • Last active 2 hours ago
                          </p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm font-medium hover:text-red-700">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  System Preferences
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={systemPrefs.language}
                      onChange={(e) =>
                        setSystemPrefs({ ...systemPrefs, language: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>English</option>
                      <option>Sinhala</option>
                      <option>Tamil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={systemPrefs.timezone}
                      onChange={(e) =>
                        setSystemPrefs({ ...systemPrefs, timezone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>Asia/Phnom_Penh (UTC+7:00)</option>
                      <option>Asia/Colombo (UTC+5:30)</option>
                      <option>Asia/Dubai (UTC+4:00)</option>
                      <option>Europe/London (UTC+0:00)</option>
                      <option>America/New_York (UTC-5:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={systemPrefs.dateFormat}
                      onChange={(e) =>
                        setSystemPrefs({ ...systemPrefs, dateFormat: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={systemPrefs.currency}
                      onChange={(e) =>
                        setSystemPrefs({ ...systemPrefs, currency: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>LKR (Rs)</option>
                    </select>
                  </div>
                </div>

                {/* Data & Privacy Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Data & Privacy
                  </h3>

                  <div className="space-y-4 max-w-2xl">
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="w-full justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export All Data
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button onClick={handleSaveSystemPrefs} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Upload Profile Picture</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  id="modal-photo-upload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="modal-photo-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-700">
                      {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </label>
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Use a square image for best results. Your photo will be displayed as a circle.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
