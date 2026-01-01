'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge, Input } from '@/components/ui';
import NewShipmentModal from '@/components/shipments/NewShipmentModal';
import { mockShipments, mockDashboardStats } from '@/lib/mockData';
import { getStatusColor } from '@/lib/utils';
import {
  Package,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Ship,
  Search,
  Filter,
  Download,
  Plus,
  MapPin,
  Calendar,
  Eye,
} from 'lucide-react';
import { Shipment } from '@/types';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);

  const stats = mockDashboardStats;
  const totalShipments = stats.activeShipments + stats.completedShipments + stats.pendingActions;

  // Filter shipments based on search and status
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      searchQuery === '' ||
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleNewShipment = (data: any) => {
    console.log('New shipment:', data);
    // Here you would typically call an API to create the shipment
  };

  const getStatusBadgeVariant = (status: string): 'purple' | 'success' | 'warning' => {
    switch (status) {
      case 'in_transit':
        return 'purple';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'purple';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <DashboardLayout
      title="Shipments"
      subtitle="Manage and track all shipments"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Shipments"
            value={totalShipments.toLocaleString()}
            icon={Ship}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="In Transit"
            value={stats.activeShipments}
            subtitle={`${((stats.activeShipments / totalShipments) * 100).toFixed(1)}% of total`}
            icon={Package}
          />

          <StatCard
            title="Completed"
            value={stats.completedShipments}
            subtitle={`${((stats.completedShipments / totalShipments) * 100).toFixed(1)}% of total`}
            icon={CheckCircle2}
            variant="success"
          />

          <StatCard
            title="Pending"
            value={stats.pendingActions}
            subtitle="Needs attention"
            icon={AlertCircle}
            variant="warning"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, client, origin, or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Action Buttons */}
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>

            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsNewShipmentModalOpen(true)}
            >
              New Shipment
            </Button>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Container
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cargo Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {shipment.id}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {shipment.client.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900">{shipment.origin}</div>
                          <div className="text-gray-500 flex items-center gap-1">
                            → {shipment.destination}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900">
                            {shipment.departureDate.toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            {shipment.arrivalDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {shipment.containerId}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 font-medium">
                          {shipment.cargoType}
                        </div>
                        <div className="text-gray-500">
                          {shipment.weight.toLocaleString()} kg
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(shipment.status)}>
                        {formatStatus(shipment.status)}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredShipments.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No shipments found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredShipments.length > 0 && (
          <div className="text-sm text-gray-600 text-center">
            Showing {filteredShipments.length} of {shipments.length} shipments
          </div>
        )}
      </div>

      {/* New Shipment Modal */}
      <NewShipmentModal
        isOpen={isNewShipmentModalOpen}
        onClose={() => setIsNewShipmentModalOpen(false)}
        onSubmit={handleNewShipment}
      />
    </DashboardLayout>
  );
}
