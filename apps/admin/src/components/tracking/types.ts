export interface TrackingStatus {
  value: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  mapsToShipmentStatus?: string;
}

export interface TrackingUpdate {
  _id: string;
  shipmentId?: string;
  shipment?: any;
  status: string;
  location: {
    name: string;
    city?: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  } | string;
  description: string;
  timestamp: string | Date;
  isPublic?: boolean;
  attachments?: string[];
  metadata?: Record<string, any>;
  createdBy?: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface TrackingUpdateFormData {
  status: string;
  locationName: string;
  locationCity: string;
  locationCountry: string;
  description: string;
  timestamp: string;
  isPublic: boolean;
  attachments: File[];
  notes: string;
}

export interface Shipment {
  _id: string;
  shipmentId: string;
  trackingId: string;
  client: { companyName: string };
  origin: { city: string; country: string };
  destination: { city: string; country: string };
  status: string;
}
