import api from '@/lib/api';

export interface CompanyInfo {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  website: string;
  taxId: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  shipmentUpdates: boolean;
  invoiceAlerts: boolean;
  systemUpdates: boolean;
  newsletter: boolean;
}

export interface SystemPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  jobTitle?: string;
}

export const settingsService = {
  // Company Information
  async getCompanyInfo() {
    const response = await api.get('/settings/company');
    return response.data;
  },

  async updateCompanyInfo(data: CompanyInfo) {
    const response = await api.put('/settings/company', data);
    return response.data;
  },

  // User Profile
  async updateProfile(data: ProfileUpdate) {
    const response = await api.put('/settings/profile', data);
    return response.data;
  },

  async uploadProfilePhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.post('/settings/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProfilePhoto() {
    const response = await api.delete('/settings/profile/photo');
    return response.data;
  },

  // Notification Preferences
  async getNotifications() {
    const response = await api.get('/settings/notifications');
    return response.data;
  },

  async updateNotifications(data: NotificationPreferences) {
    const response = await api.put('/settings/notifications', data);
    return response.data;
  },

  // Security
  async changePassword(data: PasswordChange) {
    const response = await api.put('/settings/password', data);
    return response.data;
  },

  // System Preferences
  async getSystemPreferences() {
    const response = await api.get('/settings/system');
    return response.data;
  },

  async updateSystemPreferences(data: SystemPreferences) {
    const response = await api.put('/settings/system', data);
    return response.data;
  },

  // Data Export
  async exportData() {
    const response = await api.get('/settings/export');
    return response.data;
  },
};
