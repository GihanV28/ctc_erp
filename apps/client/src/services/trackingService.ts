import api, { ApiResponse, getErrorMessage } from '@/lib/api';

export interface TrackingUpdate {
  _id: string;
  shipment: string;
  status: string;
  location: string;
  description: string;
  timestamp: Date;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTrackingUpdateData {
  shipment: string;
  status: string;
  location: string;
  description: string;
  timestamp?: string;
}

export const trackingService = {
  getByShipment: async (shipmentId: string): Promise<TrackingUpdate[]> => {
    try {
      const response = await api.get<ApiResponse<{ updates: TrackingUpdate[] }>>(`/tracking/shipment/${shipmentId}`);
      return response.data.data!.updates;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getByTrackingNumber: async (trackingNumber: string): Promise<{
    shipment: any;
    updates: TrackingUpdate[];
  }> => {
    try {
      const response = await api.get<ApiResponse<{ shipment: any; updates: TrackingUpdate[] }>>(`/tracking/${trackingNumber}`);
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  create: async (data: CreateTrackingUpdateData): Promise<TrackingUpdate> => {
    try {
      const response = await api.post<ApiResponse<{ update: TrackingUpdate }>>('/tracking', data);
      return response.data.data!.update;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  update: async (id: string, data: Partial<CreateTrackingUpdateData>): Promise<TrackingUpdate> => {
    try {
      const response = await api.put<ApiResponse<{ update: TrackingUpdate }>>(`/tracking/${id}`, data);
      return response.data.data!.update;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tracking/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
