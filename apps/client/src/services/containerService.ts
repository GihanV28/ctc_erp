import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';

export interface Container {
  _id: string;
  containerId: string;
  containerNumber: string;
  type: '20ft_standard' | '40ft_standard' | '40ft_high_cube' | '20ft_high_cube' | '40ft_refrigerated' | '20ft_refrigerated';
  status: 'available' | 'in_use' | 'maintenance' | 'damaged';
  location?: string;
  currentShipment?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastInspectionDate?: Date;
  purchaseDate?: Date;
  purchasePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContainerData {
  containerNumber: string;
  type: '20ft_standard' | '40ft_standard' | '40ft_high_cube' | '20ft_high_cube' | '40ft_refrigerated' | '20ft_refrigerated';
  location?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  purchaseDate?: string;
  purchasePrice?: number;
}

export const containerService = {
  // Get all containers
  getAll: async (params?: {
    status?: string;
    containerType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Container>> => {
    try {
      const response = await api.get<PaginatedResponse<Container>>('/containers', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get single container
  getById: async (id: string): Promise<Container> => {
    try {
      const response = await api.get<ApiResponse<{ container: Container }>>(`/containers/${id}`);
      return response.data.data!.container;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create container
  create: async (data: CreateContainerData): Promise<Container> => {
    try {
      const response = await api.post<ApiResponse<{ container: Container }>>('/containers', data);
      return response.data.data!.container;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update container
  update: async (id: string, data: Partial<CreateContainerData>): Promise<Container> => {
    try {
      const response = await api.put<ApiResponse<{ container: Container }>>(`/containers/${id}`, data);
      return response.data.data!.container;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete container
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/containers/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get available containers
  getAvailable: async (containerType?: string): Promise<Container[]> => {
    try {
      const response = await api.get<ApiResponse<{ containers: Container[] }>>('/containers/available', {
        params: { containerType },
      });
      return response.data.data!.containers;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
