'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import Button from '@/components/ui/Button';
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Ship,
  Plane,
  Truck
} from 'lucide-react';
import { useProfilePhoto } from '@/context/ProfilePhotoContext';
import { cn } from '@/lib/utils';
import { trackingService, type PublicTrackingResponse, type TrackingUpdate } from '@/services/trackingService';

// Status label mapping
const statusLabels: Record<string, string> = {
  order_confirmed: 'Order Confirmed',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_origin_port: 'At Origin Port',
  departed_origin: 'Departed Origin',
  at_sea: 'At Sea',
  arrived_destination_port: 'Arrived at Destination Port',
  customs_clearance: 'Customs Clearance',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  delayed: 'Delayed',
  exception: 'Exception',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  on_hold: 'On Hold',
};

// Status icon mapping
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'at_sea':
    case 'departed_origin':
      return Ship;
    case 'at_origin_port':
    case 'arrived_destination_port':
      return Package;
    case 'out_for_delivery':
      return Truck;
    case 'delivered':
      return CheckCircle2;
    default:
      return Package;
  }
};

// Format location string
const formatLocation = (location: { name: string; city?: string; country: string }) => {
  const parts = [location.name];
  if (location.city) parts.push(location.city);
  parts.push(location.country);
  return parts.join(', ');
};

// Format date
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format time
const formatTime = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function TrackingPage() {
  const { profilePhoto, userName } = useProfilePhoto();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState<PublicTrackingResponse | null>(null);

  // Check for tracking number in URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const numberParam = params.get('number');
    if (numberParam) {
      setTrackingNumber(numberParam);
      // Auto-search when coming from dashboard
      handleTrackWithNumber(numberParam);
    }
  }, []);

  const handleTrackWithNumber = async (number: string) => {
    if (!number.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const data = await trackingService.getPublicTracking(number.trim());
      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tracking information');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async () => {
    handleTrackWithNumber(trackingNumber);
  };

  const getInitials = () => {
    if (!userName || userName === 'User') return 'U';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  return (
    <PortalLayout
      title="Track Shipment"
      subtitle="Enter your tracking ID to view shipment details"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{userName}</span>
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              {getInitials()}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter tracking number (e.g., CCT2026040)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleTrack}
              disabled={loading}
              className="px-6 md:px-8 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tracking...
                </>
              ) : (
                'Track Order'
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <>
            {/* Shipment Header */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200">
              <div className="mb-4 md:mb-6">
                <p className="text-sm text-gray-600 mb-1">Shipment ID</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{trackingData.shipment.shipmentId}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Tracking: {trackingData.shipment.trackingNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        trackingData.shipment.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : trackingData.shipment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : trackingData.shipment.status === 'on_hold'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      )}
                    >
                      {statusLabels[trackingData.shipment.status] || trackingData.shipment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipment Route */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Origin */}
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 font-medium">Origin</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm md:text-base text-gray-900">{trackingData.shipment.origin.port}</p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {trackingData.shipment.origin.city}, {trackingData.shipment.origin.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow - Hidden on mobile, vertical line on mobile */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="text-gray-300">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 font-medium">Destination</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm md:text-base text-gray-900">{trackingData.shipment.destination.port}</p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {trackingData.shipment.destination.city}, {trackingData.shipment.destination.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              {trackingData.shipment.dates && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                  {trackingData.shipment.dates.departureDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Departure Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(trackingData.shipment.dates.departureDate)}
                      </p>
                    </div>
                  )}
                  {trackingData.shipment.dates.estimatedArrival && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Arrival</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(trackingData.shipment.dates.estimatedArrival)}
                      </p>
                    </div>
                  )}
                  {trackingData.shipment.dates.actualArrival && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Actual Arrival</p>
                      <p className="text-sm font-medium text-green-700">
                        {formatDate(trackingData.shipment.dates.actualArrival)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Tracking History</h3>

              {trackingData.trackingUpdates.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No tracking updates available yet</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {trackingData.trackingUpdates.map((update, index) => {
                    const Icon = getStatusIcon(update.status);
                    const isLatest = index === 0;
                    const isLast = index === trackingData.trackingUpdates.length - 1;

                    return (
                      <div key={update._id} className="relative pb-8">
                        {/* Connecting Line */}
                        {!isLast && (
                          <span
                            className="absolute left-6 top-10 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}

                        <div className="relative flex items-start space-x-4">
                          {/* Icon */}
                          <div className="relative flex items-center justify-center">
                            <div
                              className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-full border-4',
                                isLatest
                                  ? 'border-purple-100 bg-purple-600'
                                  : 'border-gray-100 bg-gray-400'
                              )}
                            >
                              <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1 pt-1.5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={cn(
                                  'text-sm font-semibold',
                                  isLatest ? 'text-purple-700' : 'text-gray-900'
                                )}>
                                  {statusLabels[update.status] || update.status}
                                  {isLatest && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                      Latest
                                    </span>
                                  )}
                                </p>
                                <p className="mt-1 text-sm text-gray-700">{update.description}</p>
                                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {formatLocation(update.location)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(update.timestamp)} at {formatTime(update.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Initial State - No search yet */}
        {!trackingData && !error && !loading && (
          <div className="bg-white rounded-2xl p-12 border border-gray-200">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Shipment</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter your tracking number above to view real-time updates on your shipment's location and status.
              </p>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
