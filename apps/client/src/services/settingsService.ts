import api, { ApiResponse, getErrorMessage } from '@/lib/api';

export interface NotificationPreferences {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  shipmentUpdates?: boolean;
  invoiceAlerts?: boolean;
  systemUpdates?: boolean;
  newsletter?: boolean;
}

export interface SystemPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface ActivityLog {
  lastLogin?: Date;
  lastLoginIP?: string;
  accountCreated: Date;
  lastUpdated: Date;
}

export const settingsService = {
  // Change password
  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
    try {
      await api.put('/settings/password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get notification preferences
  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    try {
      const response = await api.get<ApiResponse<{ notificationPreferences: NotificationPreferences }>>('/settings/notifications');
      return response.data.data!.notificationPreferences;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: NotificationPreferences): Promise<NotificationPreferences> => {
    try {
      const response = await api.put<ApiResponse<{ notificationPreferences: NotificationPreferences }>>('/settings/notifications', preferences);
      return response.data.data!.notificationPreferences;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get system preferences
  getSystemPreferences: async (): Promise<SystemPreferences> => {
    try {
      const response = await api.get<ApiResponse<{ systemPreferences: SystemPreferences }>>('/settings/preferences');
      return response.data.data!.systemPreferences;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update system preferences
  updateSystemPreferences: async (preferences: SystemPreferences): Promise<SystemPreferences> => {
    try {
      const response = await api.put<ApiResponse<{ systemPreferences: SystemPreferences }>>('/settings/preferences', preferences);
      return response.data.data!.systemPreferences;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Toggle Two-Factor Authentication
  toggleTwoFactor: async (enabled: boolean): Promise<boolean> => {
    try {
      const response = await api.put<ApiResponse<{ twoFactorEnabled: boolean }>>('/settings/2fa', { enabled });
      return response.data.data!.twoFactorEnabled;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get activity log
  getActivityLog: async (): Promise<ActivityLog> => {
    try {
      const response = await api.get<ApiResponse<{ activityLog: ActivityLog }>>('/settings/activity-log');
      return response.data.data!.activityLog;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Download user data
  downloadUserData: async (): Promise<any> => {
    try {
      const response = await api.get('/settings/download-data');
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Deactivate account
  deactivateAccount: async (): Promise<void> => {
    try {
      await api.put('/settings/account/deactivate');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete account
  deleteAccount: async (password: string): Promise<void> => {
    try {
      await api.delete('/settings/account', { data: { password } });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
};
