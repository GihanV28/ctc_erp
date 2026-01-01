'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge } from '@/components/ui';
import AddContainerModal from '@/components/containers/AddContainerModal';
import { mockContainers } from '@/lib/mockData';
import {
  Box,
  Container as ContainerIcon,
  Wrench,
  Ship,
  Search,
  Download,
  Plus,
  MapPin,
} from 'lucide-react';
import { Container } from '@/types';

type TabType = 'all' | 'available' | 'in_use' | 'maintenance';

export default function ContainersPage() {
  const [containers, setContainers] = useState<Container[]>(mockContainers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);

  // Calculate stats
  const totalContainers = containers.length;
  const availableContainers = containers.filter(c => c.status === 'available').length;
  const inUseContainers = containers.filter(c => c.status === 'in_use').length;
  const maintenanceContainers = containers.filter(c => c.status === 'maintenance').length;

  // Filter containers based on search, tab, and filters
  const filteredContainers = containers.filter((container) => {
    const matchesSearch =
      searchQuery === '' ||
      container.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      container.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      container.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'all' || container.status === activeTab;

    const matchesStatus =
      statusFilter === 'all' || container.status === statusFilter;

    const matchesType =
      typeFilter === 'all' || container.type === typeFilter;

    return matchesSearch && matchesTab && matchesStatus && matchesType;
  });

  const handleAddContainer = (data: any) => {
    console.log('New container:', data);
    // Here you would typically call an API to create the container
  };

  const getStatusBadgeVariant = (status: string): 'purple' | 'success' | 'warning' => {
    switch (status) {
      case 'in_use':
        return 'purple';
      case 'available':
        return 'success';
      case 'maintenance':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getConditionBadgeVariant = (condition: string): 'success' | 'info' | 'warning' => {
    switch (condition) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
      case 'under_repair':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatType = (type: string) => {
    return type.split('_').map((word, index) =>
      index === 0 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <DashboardLayout
      title="Containers"
      subtitle="Manage your container fleet"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Containers"
            value={totalContainers}
            icon={ContainerIcon}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="Available"
            value={availableContainers}
            subtitle="Ready for use"
            icon={Box}
            variant="success"
          />

          <StatCard
            title="In Use"
            value={inUseContainers}
            subtitle="Currently shipping"
            icon={Ship}
          />

          <StatCard
            title="Maintenance"
            value={maintenanceContainers}
            subtitle="Under repair"
            icon={Wrench}
            variant="warning"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { key: 'all', label: 'All Containers' },
                { key: 'available', label: 'Available' },
                { key: 'in_use', label: 'In Use' },
                { key: 'maintenance', label: 'Maintenance' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`py-4 px-1 font-medium text-sm transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, type, or location..."
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
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              >
                <option value="all">All Types</option>
                <option value="20ft_standard">20ft Standard</option>
                <option value="20ft_high_cube">20ft High Cube</option>
                <option value="40ft_standard">40ft Standard</option>
                <option value="40ft_high_cube">40ft High Cube</option>
                <option value="40ft_refrigerated">40ft Refrigerated</option>
              </select>

              {/* Action Buttons */}
              <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                Export
              </Button>

              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsAddContainerModalOpen(true)}
              >
                Add Container
              </Button>
            </div>
          </div>
        </div>

        {/* Containers Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Container ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Shipment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Load
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContainers.map((container) => (
                  <tr
                    key={container.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {container.id}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatType(container.type)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(container.status)}>
                        {formatStatus(container.status)}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {container.location}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {container.shipmentId ? (
                        <span className="text-sm font-medium text-gray-900">
                          {container.shipmentId}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {container.capacity} m³
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {container.currentWeight.toLocaleString()} kg / {container.maxWeight.toLocaleString()} kg
                        </div>
                        <div className="text-gray-500">loaded</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getConditionBadgeVariant(container.condition)}>
                        {formatStatus(container.condition)}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredContainers.length === 0 && (
            <div className="text-center py-12">
              <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No containers found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredContainers.length > 0 && (
          <div className="text-sm text-gray-600 text-center">
            Showing {filteredContainers.length} of {containers.length} containers
          </div>
        )}
      </div>

      {/* Add Container Modal */}
      <AddContainerModal
        isOpen={isAddContainerModalOpen}
        onClose={() => setIsAddContainerModalOpen(false)}
        onSubmit={handleAddContainer}
      />
    </DashboardLayout>
  );
}
