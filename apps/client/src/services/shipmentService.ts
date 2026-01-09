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

  // Get shipment stats
  getStats: async (): Promise<ShipmentStats> => {
    try {
      const response = await api.get<ApiResponse<ShipmentStats>>('/shipments/stats');
      // Handle both response formats: { stats: {...} } or direct stats object
      const data = response.data.data;
      if (data && 'stats' in data) {
        return (data as any).stats;
      }
      return data as ShipmentStats;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
