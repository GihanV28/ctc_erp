'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import { Package, Plane, Ship, Eye, Filter, Search } from 'lucide-react';
import { shipmentService, Shipment } from '@/services/shipmentService';
import ViewShipmentModal from '@/components/shipments/ViewShipmentModal';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-700',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-700',
  },
  in_transit: {
    label: 'In Transit',
    color: 'bg-blue-100 text-blue-700',
  },
  customs: {
    label: 'Customs',
    color: 'bg-yellow-100 text-yellow-700',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-purple-100 text-purple-700',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
  },
  on_hold: {
    label: 'On Hold',
    color: 'bg-orange-100 text-orange-700',
  },
};

interface ShipmentStats {
  total: number;
  inTransit: number;
  delivered: number;
  pending: number;
}

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<ShipmentStats>({
    total: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentService.getAll();
      const shipmentsData = response.data?.shipments || [];
      setShipments(shipmentsData);

      // Calculate stats from fetched data
      const calculatedStats = {
        total: shipmentsData.length,
        inTransit: shipmentsData.filter(s => s.status === 'in_transit').length,
        delivered: shipmentsData.filter(s => s.status === 'delivered').length,
        pending: shipmentsData.filter(s => s.status === 'pending').length,
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShipment(null);
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContainerType = (containerType: string | undefined) => {
    if (!containerType) return 'Sea';
    // Check if it's an air freight container type
    const airTypes = ['air', 'Air'];
    return airTypes.some(type => containerType.toLowerCase().includes(type.toLowerCase())) ? 'Air' : 'Sea';
  };

  const filteredShipments = shipments.filter(shipment => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      shipment.trackingNumber.toLowerCase().includes(query) ||
      shipment.origin.port.toLowerCase().includes(query) ||
      shipment.destination.port.toLowerCase().includes(query) ||
      shipment.origin.country.toLowerCase().includes(query) ||
      shipment.destination.country.toLowerCase().includes(query)
    );
  });

  return (
    <PortalLayout
      title="My Shipments"
      subtitle="Track and manage all your shipments"
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Shipments */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600 mt-1">Total Shipments</p>
              </div>
            </div>
          </div>

          {/* In Transit */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Ship className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.inTransit}</p>
                <p className="text-sm text-gray-600 mt-1">In Transit</p>
              </div>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.delivered}</p>
                <p className="text-sm text-gray-600 mt-1">Delivered</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600 mt-1">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking ID, origin, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shipments...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredShipments.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search criteria' : 'You don\'t have any shipments yet'}
            </p>
          </div>
        )}

        {/* Shipments Table */}
        {!loading && filteredShipments.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Tracking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Origin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      ETA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => {
                    const containerType = getContainerType(shipment.cargo.containerType);
                    return (
                      <tr key={shipment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {shipment.trackingNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            {containerType === 'Sea' ? (
                              <Ship className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Plane className="w-4 h-4 text-gray-500" />
                            )}
                            {containerType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {shipment.origin.port}, {shipment.origin.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {shipment.destination.port}, {shipment.destination.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(shipment.dates.departureDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(shipment.dates.estimatedArrival)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {shipment.cargo.quantity || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(shipment.totalCost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium',
                              statusConfig[shipment.status]?.color || 'bg-gray-100 text-gray-700'
                            )}
                          >
                            {statusConfig[shipment.status]?.label || shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewShipment(shipment)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View Shipment Modal */}
      <ViewShipmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shipment={selectedShipment}
      />
    </PortalLayout>
  );
}
