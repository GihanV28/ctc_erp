'use client';

import React, { useState } from 'react';
import { Search, Package, MapPin, Calendar, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import { trackShipment, type ShipmentData, type TrackingUpdate } from '../../services/trackingService';
import { Button } from '../../components/ui/Button';
import Image from 'next/image';

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setShipmentData(null);
    setTrackingUpdates([]);

    const result = await trackShipment(trackingNumber.trim());

    setLoading(false);

    if (result.success && result.data) {
      setShipmentData(result.data.shipment);
      setTrackingUpdates(result.data.trackingUpdates);
    } else {
      setError(result.message);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'text-green-600 bg-green-50';
    if (statusLower.includes('transit') || statusLower.includes('picked')) return 'text-blue-600 bg-blue-50';
    if (statusLower.includes('pending')) return 'text-yellow-600 bg-yellow-50';
    if (statusLower.includes('cancelled')) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo/logo.png"
                alt="Ceylon Cargo Transport"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold text-gray-900">Ceylon Cargo Transport</h2>
                <p className="text-xs text-gray-600">Track Your Shipment</p>
              </div>
            </a>
            <a
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </a>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Shipment</h1>
            <p className="text-gray-600">Enter your tracking ID to view shipment details</p>
          </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g., CCT2026040)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="sm:w-auto"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Shipment Details */}
        {shipmentData && (
          <div className="space-y-6">
            {/* Shipment Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Shipment {shipmentData.shipmentId}
                  </h2>
                  <p className="text-gray-600">Tracking: {shipmentData.trackingNumber}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(shipmentData.status)}`}>
                  {shipmentData.status}
                </div>
              </div>

              {/* Origin and Destination */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Origin</h3>
                    <p className="text-gray-600">{shipmentData.origin.port || shipmentData.origin.name}</p>
                    <p className="text-gray-600">
                      {shipmentData.origin.city ? `${shipmentData.origin.city}, ` : ''}{shipmentData.origin.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Destination</h3>
                    <p className="text-gray-600">{shipmentData.destination.port || shipmentData.destination.name}</p>
                    <p className="text-gray-600">
                      {shipmentData.destination.city ? `${shipmentData.destination.city}, ` : ''}{shipmentData.destination.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Departure Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(shipmentData.dates.departureDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Arrival</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(shipmentData.dates.estimatedArrival)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking History */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h3>

              {trackingUpdates.length > 0 ? (
                <div className="space-y-4">
                  {trackingUpdates.map((update, index) => (
                    <div key={update._id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        >
                          {update.status.toLowerCase().includes('delivered') ? (
                            <CheckCircle className="h-6 w-6 text-white" />
                          ) : (
                            <Truck className="h-5 w-5 text-white" />
                          )}
                        </div>
                        {index < trackingUpdates.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 mt-2" style={{ minHeight: '40px' }} />
                        )}
                      </div>

                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getStatusColor(update.status)}`}>
                              {update.status}
                            </div>
                            <p className="text-gray-900 font-medium">{update.description}</p>
                            <p className="text-gray-600 text-sm mt-1">
                              {update.location?.name && `${update.location.name}`}
                              {update.location?.city && `, ${update.location.city}`}
                              {update.location?.country && `, ${update.location.country}`}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                            {formatDate(update.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No tracking updates available yet</p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
