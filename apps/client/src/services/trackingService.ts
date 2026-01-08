import api, { ApiResponse, getErrorMessage } from '@/lib/api';
import axios from 'axios';

export interface Location {
  name: string;
  city?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TrackingUpdate {
  _id: string;
  shipment: string;
  status: string;
  location: Location;
  description: string;
  timestamp: Date;
  isPublic?: boolean;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  _id: string;
  shipmentId: string;
  trackingNumber: string;
  status: string;
  origin: {
    port: string;
    city: string;
    country: string;
  };
  destination: {
    port: string;
    city: string;
    country: string;
  };
  dates: {
    bookingDate?: Date;
    departureDate?: Date;
    estimatedArrival?: Date;
    actualArrival?: Date;
  };
  client?: {
    companyName: string;
  };
}

export interface PublicTrackingResponse {
  shipment: Shipment;
  trackingUpdates: TrackingUpdate[];
}

export interface CreateTrackingUpdateData {
  shipment: string;
  status: string;
  location: Location;
  description: string;
  timestamp?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const trackingService = {
  // Public tracking - no authentication required
  getPublicTracking: async (trackingNumber: string): Promise<PublicTrackingResponse> => {
    try {
      const response = await axios.get(`${API_URL}/tracking/public/${trackingNumber}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Tracking number not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch tracking information');
    }
  },

  // Authenticated methods
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
