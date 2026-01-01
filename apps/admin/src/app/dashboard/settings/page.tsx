'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toggle from '@/components/ui/Toggle';

type TabType = 'company' | 'profile' | 'notifications' | 'security' | 'system';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('company');

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
    timezone: 'Asia/Colombo (UTC+5:30)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'LKR (Rs)',
  });

  const tabs = [
    { id: 'company', label: 'Company Information', icon: Building2 },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: SettingsIcon },
  ];

  const handleSaveCompanyInfo = () => {
    alert('Company information saved successfully!');
  };

  const handleSaveProfile = () => {
    alert('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    alert('Notification preferences saved successfully!');
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert('Please fill in all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }
    alert('Password updated successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleSaveSystemPrefs = () => {
    alert('System preferences saved successfully!');
  };

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
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-semibold">
                      SA
                    </div>
                    <button className="text-purple-600 text-sm font-medium mt-3 hover:text-purple-700">
                      Change Photo
                    </button>
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
                      <option>LKR (Rs)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
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
                      onClick={() => alert('Exporting all data...')}
                      className="w-full justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export All Data
                    </Button>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="text-sm font-medium text-red-900 mb-2">
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-700 mb-3">
                        Once you delete your account, there is no going back. Please be
                        certain.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (
                            confirm(
                              'Are you sure you want to delete your account? This action cannot be undone.'
                            )
                          ) {
                            alert('Account deletion request submitted');
                          }
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50 gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </div>
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
    </DashboardLayout>
  );
}
