import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';

export interface Supplier {
  _id: string;
  supplierId: string;
  name: string;
  serviceType: 'ocean_freight' | 'air_freight' | 'customs' | 'warehouse' | 'transport' | 'insurance';
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
  rating?: number;
  activeContracts?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierData {
  name: string;
  serviceType: 'ocean_freight' | 'air_freight' | 'customs' | 'warehouse' | 'transport' | 'insurance';
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
}

export const supplierService = {
  // Get all suppliers
  getAll: async (params?: {
    status?: string;
    serviceType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Supplier>> => {
    try {
      const response = await api.get<PaginatedResponse<Supplier>>('/suppliers', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get single supplier
  getById: async (id: string): Promise<Supplier> => {
    try {
      const response = await api.get<ApiResponse<{ supplier: Supplier }>>(`/suppliers/${id}`);
      return response.data.data!.supplier;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create supplier
  create: async (data: CreateSupplierData): Promise<Supplier> => {
    try {
      const response = await api.post<ApiResponse<{ supplier: Supplier }>>('/suppliers', data);
      return response.data.data!.supplier;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update supplier
  update: async (id: string, data: Partial<CreateSupplierData>): Promise<Supplier> => {
    try {
      const response = await api.put<ApiResponse<{ supplier: Supplier }>>(`/suppliers/${id}`, data);
      return response.data.data!.supplier;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete supplier
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/suppliers/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get suppliers by service type
  getByService: async (serviceType: string): Promise<Supplier[]> => {
    try {
      const response = await api.get<ApiResponse<{ suppliers: Supplier[] }>>(`/suppliers/by-service/${serviceType}`);
      return response.data.data!.suppliers;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
