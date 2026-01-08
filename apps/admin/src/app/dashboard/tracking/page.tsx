'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Package, MapPin, Search, Loader2 } from 'lucide-react';
import TrackingUpdateModal from '@/components/tracking/TrackingUpdateModal';
import TrackingHistory from '@/components/tracking/TrackingHistory';
import type { TrackingUpdateFormData } from '@/components/tracking/types';
import { trackingService, type ActiveShipment, type TrackingUpdate } from '@/services/trackingService';

export default function TrackingUpdatePage() {
  const [shipments, setShipments] = useState<ActiveShipment[]>([]);
  const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ActiveShipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch shipments and updates on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [shipmentsData, updatesData] = await Promise.all([
        trackingService.getActiveShipments(),
        // Get tracking updates for delivered shipments from last 30 days
        trackingService.getAllTrackingUpdates({
          shipmentStatus: 'delivered',
          days: 30,
          limit: 50
        })
      ]);

      setShipments(shipmentsData);
      setUpdates(updatesData);
    } catch (err: any) {
      console.error('Error fetching tracking data:', err);
      setError(err.message || 'Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (shipment: ActiveShipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const handleSaveUpdate = async (data: TrackingUpdateFormData) => {
    if (!selectedShipment) return;

    try {
      setSaving(true);

      // Create tracking update via API
      const newUpdate = await trackingService.create({
        shipment: selectedShipment._id,
        status: data.status,
        location: {
          name: data.locationName,
          city: data.locationCity,
          country: data.locationCountry
        },
        description: data.description,
        timestamp: data.timestamp,
        isPublic: data.isPublic,
        notifyClient: false // Can be made configurable
      });

      // Refresh data to get latest updates and shipment status
      await fetchData();

      setIsModalOpen(false);
      setSelectedShipment(null);
    } catch (err: any) {
      console.error('Error creating tracking update:', err);
      alert(`Failed to create tracking update: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch =
      shipment.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.client.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getShipmentUpdates = (shipmentId: string) => {
    return updates.filter(u => u.shipment?._id === shipmentId || u.shipment === shipmentId);
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'in_transit':
        return 'bg-blue-100 text-blue-700';
      case 'customs':
        return 'bg-amber-100 text-amber-700';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-700';
      case 'on_hold':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Shipment Tracking Management" subtitle="Add and manage tracking updates for all shipments">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Shipment Tracking Management" subtitle="Add and manage tracking updates for all shipments">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Shipment Tracking Management" subtitle="Add and manage tracking updates for all shipments">
      <div className="w-full">

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by shipment ID, tracking number, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="customs">Customs</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="on_hold">On Hold</option>
            </select>
            <button
              onClick={fetchData}
              className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Active Shipments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Shipments</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="p-4 space-y-3">
            {filteredShipments.map(shipment => {
              const shipmentUpdates = getShipmentUpdates(shipment._id);
              const lastUpdate = shipment.lastUpdate || shipmentUpdates[0];

              return (
                <div
                  key={shipment._id}
                  className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{shipment.shipmentId}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                            {formatStatus(shipment.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {shipment.origin.city || shipment.origin.port}, {shipment.origin.country} → {shipment.destination.city || shipment.destination.port}, {shipment.destination.country}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Package size={12} />
                            {shipment.client.companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            Tracking: <span className="font-mono text-gray-900">{shipment.trackingNumber}</span>
                          </span>
                          {lastUpdate && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              Last update: {new Date(lastUpdate.timestamp).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenModal(shipment)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      <MapPin size={18} />
                      Add Update
                    </button>
                  </div>

                  {/* Show recent updates */}
                  {shipmentUpdates.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-2">RECENT UPDATES ({shipmentUpdates.length})</p>
                      <div className="space-y-2">
                        {shipmentUpdates.slice(0, 2).map(update => {
                          const locationText = typeof update.location === 'string'
                            ? update.location
                            : `${update.location.name}, ${update.location.city ? update.location.city + ', ' : ''}${update.location.country}`;

                          return (
                            <div key={update._id} className="flex items-start gap-2 text-sm">
                              <MapPin size={14} className="text-purple-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-gray-900 font-medium">{locationText}</p>
                                <p className="text-gray-600 text-xs">{update.description}</p>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(update.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredShipments.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No shipments found</p>
              </div>
            )}
          </div>
        </div>

        {/* Delivered Shipments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Delivered Shipments - Last 30 Days</h2>
            <p className="text-sm text-gray-500 mt-1">
              {updates.length} tracking update{updates.length !== 1 ? 's' : ''} for delivered shipments in the past month
            </p>
          </div>

          <TrackingHistory
            updates={updates}
          />
        </div>

        {/* Modal */}
        <TrackingUpdateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedShipment(null);
          }}
          shipment={selectedShipment as any}
          onSave={handleSaveUpdate}
          isSaving={saving}
        />
      </div>
    </DashboardLayout>
  );
}
