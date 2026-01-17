const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cct.ceylongrp.com';

export interface TrackingUpdate {
  _id: string;
  status: string;
  location: {
    name?: string;
    city?: string;
    country?: string;
  };
  description: string;
  timestamp: string;
}

export interface ShipmentData {
  _id: string;
  shipmentId: string;
  trackingNumber: string;
  status: string;
  origin: {
    port?: string;
    name?: string;
    city?: string;
    country: string;
  };
  destination: {
    port?: string;
    name?: string;
    city?: string;
    country: string;
  };
  dates: {
    departureDate: string;
    estimatedArrival: string;
  };
  client?: {
    companyName: string;
  };
}

export interface TrackingResponse {
  success: boolean;
  data?: {
    shipment: ShipmentData;
    trackingUpdates: TrackingUpdate[];
  };
  message: string;
}

export const trackShipment = async (trackingNumber: string): Promise<TrackingResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/tracking/public/${trackingNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: result.data,
        message: result.message || 'Tracking information retrieved successfully',
      };
    } else {
      return {
        success: false,
        message: result.message || 'Tracking number not found',
      };
    }
  } catch (error) {
    console.error('Tracking error:', error);
    return {
      success: false,
      message: 'Failed to fetch tracking information. Please try again later.',
    };
  }
};
