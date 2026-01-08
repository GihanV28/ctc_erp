import api, { ApiResponse, getErrorMessage } from '@/lib/api';

export interface Role {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  userType: 'admin' | 'client';
  permissions: string[];
  isSystem: boolean;
  userCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleData {
  name: string;
  displayName: string;
  description?: string;
  userType: 'admin' | 'client';
  permissions: string[];
}

export interface Permission {
  category: string;
  permissions: {
    key: string;
    label: string;
    description?: string;
  }[];
}

export const roleService = {
  getAll: async (): Promise<Role[]> => {
    try {
      const response = await api.get<ApiResponse<{ roles: Role[] }>>('/roles');
      return response.data.data!.roles;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getById: async (id: string): Promise<Role> => {
    try {
      const response = await api.get<ApiResponse<{ role: Role }>>(`/roles/${id}`);
      return response.data.data!.role;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  create: async (data: CreateRoleData): Promise<Role> => {
    try {
      const response = await api.post<ApiResponse<{ role: Role }>>('/roles', data);
      return response.data.data!.role;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  update: async (id: string, data: Partial<CreateRoleData>): Promise<Role> => {
    try {
      const response = await api.put<ApiResponse<{ role: Role }>>(`/roles/${id}`, data);
      return response.data.data!.role;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/roles/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getPermissions: async (): Promise<string[]> => {
    try {
      const response = await api.get<ApiResponse<{ permissions: string[] }>>('/roles/permissions');
      return response.data.data!.permissions;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
