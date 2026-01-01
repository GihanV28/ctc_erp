import api, { AuthResponse, LoginCredentials, RegisterData, User, getErrorMessage } from './api';

// Auth API endpoints
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, refreshToken, user } = response.data;

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getMe: async (): Promise<User> => {
    try {
      const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      return response.data.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
      const { token, refreshToken: newRefreshToken } = response.data;

      // Update stored tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

// Helper functions
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
