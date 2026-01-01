import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';

export interface Client {
  _id: string;
  clientId: string;
  companyName: string;
  tradingName?: string;
  industry?: string;
  website?: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    position?: string;
    email: string;
    phone: string;
  };
  address: {
    street?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  creditLimit?: number;
  currentBalance?: number;
  currency?: string;
  taxId?: string;
  registrationNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientData {
  companyName: string;
  tradingName?: string;
  industry?: string;
  website?: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    position?: string;
    email: string;
    phone: string;
  };
  address: {
    street?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  creditLimit?: number;
  currency?: string;
  taxId?: string;
  registrationNumber?: string;
}

export const clientService = {
  // Get all clients
  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Client>> => {
    try {
      const response = await api.get<PaginatedResponse<Client>>('/clients', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get single client
  getById: async (id: string): Promise<Client> => {
    try {
      const response = await api.get<ApiResponse<{ client: Client }>>(`/clients/${id}`);
      return response.data.data!.client;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create client
  create: async (data: CreateClientData): Promise<Client> => {
    try {
      const response = await api.post<ApiResponse<{ client: Client }>>('/clients', data);
      return response.data.data!.client;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update client
  update: async (id: string, data: Partial<CreateClientData>): Promise<Client> => {
    try {
      const response = await api.put<ApiResponse<{ client: Client }>>(`/clients/${id}`, data);
      return response.data.data!.client;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete client
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clients/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
