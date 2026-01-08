import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';

export interface Shipment {
  _id: string;
  shipmentId: string;
  trackingNumber: string;
  client: {
    _id: string;
    clientId: string;
    companyName: string;
  };
  origin: {
    port: string;
    city?: string;
    country: string;
  };
  destination: {
    port: string;
    city?: string;
    country: string;
  };
  status: 'pending' | 'confirmed' | 'in_transit' | 'customs' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'on_hold';
  cargo: {
    description: string;
    weight?: number;
    volume?: number;
    quantity?: number;
    containerType?: string;
  };
  dates: {
    bookingDate?: Date;
    departureDate?: Date;
    estimatedArrival?: Date;
    actualArrival?: Date;
  };
  supplier?: {
    _id: string;
    supplierId: string;
    name: string;
  };
  totalCost?: number;
  currency?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShipmentData {
  client: string;
  origin: {
    port: string;
    city?: string;
    country: string;
  };
  destination: {
    port: string;
    city?: string;
    country: string;
  };
  cargo: {
    description: string;
    weight?: number;
    volume?: number;
    quantity?: number;
    containerType?: string;
  };
  dates?: {
    bookingDate?: string;
    departureDate?: string;
    estimatedArrival?: string;
  };
  supplier?: string;
  totalCost?: number;
  currency?: string;
  notes?: string;
}

export interface ShipmentStats {
  total: number;
  active: number;
  delivered: number;
  delayed: number;
}

export const shipmentService = {
  // Get all shipments
  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Shipment>> => {
    try {
      const response = await api.get<PaginatedResponse<Shipment>>('/shipments', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get single shipment
  getById: async (id: string): Promise<Shipment> => {
    try {
      const response = await api.get<ApiResponse<{ shipment: Shipment }>>(`/shipments/${id}`);
      return response.data.data!.shipment;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create shipment
  create: async (data: CreateShipmentData): Promise<Shipment> => {
    try {
      const response = await api.post<ApiResponse<{ shipment: Shipment }>>('/shipments', data);
      return response.data.data!.shipment;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update shipment
  update: async (id: string, data: Partial<CreateShipmentData>): Promise<Shipment> => {
    try {
      const response = await api.put<ApiResponse<{ shipment: Shipment }>>(`/shipments/${id}`, data);
      return response.data.data!.shipment;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Cancel shipment
  cancel: async (id: string): Promise<Shipment> => {
    try {
      const response = await api.put<ApiResponse<{ shipment: Shipment }>>(`/shipments/${id}/cancel`);
      return response.data.data!.shipment;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete shipment
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/shipments/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get shipment stats
  getStats: async (): Promise<ShipmentStats> => {
    try {
      const response = await api.get<ApiResponse<{ stats: ShipmentStats }>>('/shipments/stats');
      return response.data.data!.stats;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get active clients for dropdown
  getActiveClients: async (): Promise<Array<{ _id: string; clientId: string; companyName: string; contactPerson: any }>> => {
    try {
      const response = await api.get<ApiResponse<{ clients: any[] }>>('/clients/active/list');
      return response.data.data!.clients;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get available containers for dropdown
  getAvailableContainers: async (): Promise<Array<{ _id: string; containerId: string; containerNumber: string; type: string; condition: string; location?: string }>> => {
    try {
      const response = await api.get<ApiResponse<{ containers: any[] }>>('/containers/available/list');
      return response.data.data!.containers;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
