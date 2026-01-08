import api, { ApiResponse, getErrorMessage } from '@/lib/api';

export interface TrackingUpdate {
  _id: string;
  shipment: any;
  status: string;
  location: {
    name: string;
    city?: string;
    country: string;
  } | string; // Can be string for display purposes
  description: string;
  timestamp: Date;
  isPublic?: boolean;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ActiveShipment {
  _id: string;
  shipmentId: string;
  trackingNumber: string;
  client: {
    _id: string;
    clientId: string;
    companyName: string;
  };
  supplier?: {
    _id: string;
    supplierId: string;
    name: string;
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
  status: string;
  cargo: any;
  dates: any;
  lastUpdate?: {
    status: string;
    timestamp: Date;
    location: {
      name: string;
      city?: string;
      country: string;
    };
  } | null;
  createdAt: Date;
}

export interface CreateTrackingUpdateData {
  shipment: string;
  status: string;
  location: {
    name: string;
    city?: string;
    country: string;
  };
  description: string;
  timestamp?: string;
  isPublic?: boolean;
  notifyClient?: boolean;
}

export const trackingService = {
  // Get active shipments for tracking page
  getActiveShipments: async (): Promise<ActiveShipment[]> => {
    try {
      const response = await api.get<ApiResponse<{ shipments: ActiveShipment[] }>>('/tracking/active-shipments');
      return response.data.data!.shipments;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get all tracking updates across shipments
  getAllTrackingUpdates: async (params?: {
    limit?: number;
    shipmentStatus?: string;
    days?: number;
  }): Promise<TrackingUpdate[]> => {
    try {
      const response = await api.get<ApiResponse<{ trackingUpdates: TrackingUpdate[] }>>(
        '/tracking/all',
        { params }
      );
      return response.data.data!.trackingUpdates;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get tracking updates for a specific shipment
  getByShipment: async (shipmentId: string): Promise<{
    shipment: any;
    trackingUpdates: TrackingUpdate[];
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        shipment: any;
        trackingUpdates: TrackingUpdate[];
      }>>(`/tracking/shipment/${shipmentId}`);
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get tracking by tracking number (public)
  getByTrackingNumber: async (trackingNumber: string): Promise<{
    shipment: any;
    trackingUpdates: TrackingUpdate[];
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        shipment: any;
        trackingUpdates: TrackingUpdate[];
      }>>(`/tracking/public/${trackingNumber}`);
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create new tracking update
  create: async (data: CreateTrackingUpdateData): Promise<TrackingUpdate> => {
    try {
      const response = await api.post<ApiResponse<{ trackingUpdate: TrackingUpdate }>>('/tracking', data);
      return response.data.data!.trackingUpdate;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update tracking update
  update: async (id: string, data: Partial<CreateTrackingUpdateData>): Promise<TrackingUpdate> => {
    try {
      const response = await api.put<ApiResponse<{ trackingUpdate: TrackingUpdate }>>(`/tracking/${id}`, data);
      return response.data.data!.trackingUpdate;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete tracking update
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tracking/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
