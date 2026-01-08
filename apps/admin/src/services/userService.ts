import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';
import { Role } from './roleService';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  userType: 'admin' | 'client';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  lastLogin?: Date;
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  userType: 'admin' | 'client';
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  clientId?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  clientId?: string;
}

export const userService = {
  getAll: async (params?: {
    userType?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    try {
      const response = await api.get<PaginatedResponse<User>>('/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
      return response.data.data!.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  create: async (data: CreateUserData): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<{ user: User }>>('/users', data);
      return response.data.data!.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  update: async (id: string, data: UpdateUserData): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}`, data);
      return response.data.data!.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  toggleStatus: async (id: string): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}/toggle-status`);
      return response.data.data!.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  updatePassword: async (id: string, password: string): Promise<void> => {
    try {
      await api.put(`/users/${id}/password`, { password });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
