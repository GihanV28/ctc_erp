'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Package, MapPin, Search, Filter } from 'lucide-react';
import TrackingUpdateModal from '@/components/tracking/TrackingUpdateModal';
import TrackingHistory from '@/components/tracking/TrackingHistory';
import type { Shipment, TrackingUpdate, TrackingUpdateFormData } from '@/components/tracking/types';

// Mock shipment data
const mockShipments: Shipment[] = [
  {
    _id: '1',
    shipmentId: 'SHIP-001-2024',
    trackingId: '3354654654526',
    client: { companyName: 'Acme Corporation' },
    origin: { city: 'Shanghai', country: 'China' },
    destination: { city: 'Los Angeles', country: 'USA' },
    status: 'in_transit'
  },
  {
    _id: '2',
    shipmentId: 'SHIP-002-2024',
    trackingId: '3354654654527',
    client: { companyName: 'Global Traders Ltd' },
    origin: { city: 'Rotterdam', country: 'Netherlands' },
    destination: { city: 'New York', country: 'USA' },
    status: 'customs'
  },
  {
    _id: '3',
    shipmentId: 'SHIP-003-2024',
    trackingId: '3354654654528',
    client: { companyName: 'Tech Import Inc' },
    origin: { city: 'Hong Kong', country: 'China' },
    destination: { city: 'Singapore', country: 'Singapore' },
    status: 'pending'
  }
];

const mockUpdates: TrackingUpdate[] = [
  {
    _id: '1',
    shipmentId: '1',
    status: 'departed_origin',
    location: {
      name: 'Port of Shanghai',
      city: 'Shanghai',
      country: 'China'
    },
    description: 'Vessel has departed from Shanghai port. Expected transit time: 14 days.',
    timestamp: '2024-11-20T14:30:00Z',
    isPublic: true,
    createdBy: 'admin'
  },
  {
    _id: '2',
    shipmentId: '1',
    status: 'at_sea',
    location: {
      name: 'Pacific Ocean',
      city: '',
      country: 'International Waters'
    },
    description: 'Shipment is currently in transit across the Pacific Ocean.',
    timestamp: '2024-11-25T08:00:00Z',
    isPublic: true,
    createdBy: 'admin'
  }
];

export default function TrackingUpdatePage() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [updates, setUpdates] = useState<TrackingUpdate[]>(mockUpdates);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleOpenModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const handleSaveUpdate = (data: TrackingUpdateFormData) => {
    if (!selectedShipment) return;

    const newUpdate: TrackingUpdate = {
      _id: Date.now().toString(),
      shipmentId: selectedShipment._id,
      status: data.status,
      location: {
        name: data.locationName,
        city: data.locationCity,
        country: data.locationCountry
      },
      description: data.description,
      timestamp: new Date(data.timestamp).toISOString(),
      isPublic: data.isPublic,
      attachments: data.attachments.map(f => f.name),
      createdBy: 'admin'
    };

    setUpdates(prev => [newUpdate, ...prev]);
    setIsModalOpen(false);
    setSelectedShipment(null);
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch =
      shipment.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.client.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getShipmentUpdates = (shipmentId: string) => {
    return updates.filter(u => u.shipmentId === shipmentId);
  };

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
              <option value="in_transit">In Transit</option>
              <option value="customs">Customs</option>
              <option value="delivered">Delivered</option>
            </select>
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
              const lastUpdate = shipmentUpdates[0];

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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            shipment.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : shipment.status === 'in_transit'
                                ? 'bg-blue-100 text-blue-700'
                                : shipment.status === 'customs'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}>
                            {shipment.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {shipment.origin.city}, {shipment.origin.country} → {shipment.destination.city}, {shipment.destination.country}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Package size={12} />
                            {shipment.client.companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            Tracking: <span className="font-mono text-gray-900">{shipment.trackingId}</span>
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
                        {shipmentUpdates.slice(0, 2).map(update => (
                          <div key={update._id} className="flex items-start gap-2 text-sm">
                            <MapPin size={14} className="text-purple-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{update.location.name}</p>
                              <p className="text-gray-600 text-xs">{update.description}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(update.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
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

        {/* Tracking History for selected shipment */}
        {selectedShipment && (
          <TrackingHistory
            updates={getShipmentUpdates(selectedShipment._id)}
            onAddUpdate={() => handleOpenModal(selectedShipment)}
          />
        )}

        {/* All Updates Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Tracking Updates</h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete tracking history across all shipments
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
          shipment={selectedShipment}
          onSave={handleSaveUpdate}
        />
      </div>
    </DashboardLayout>
  );
}
