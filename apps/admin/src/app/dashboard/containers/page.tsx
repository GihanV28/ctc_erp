'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge } from '@/components/ui';
import AddContainerModal from '@/components/containers/AddContainerModal';
import EditContainerModal, { EditContainerFormData } from '@/components/containers/EditContainerModal';
import ViewContainerModal from '@/components/containers/ViewContainerModal';
import { containerService, Container, CreateContainerData } from '@/services/containerService';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Container as ContainerIcon,
  Wrench,
  Ship,
  Search,
  Download,
  Plus,
  MapPin,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';

type TabType = 'all' | 'available' | 'in_use' | 'maintenance';

export default function ContainersPage() {
  const { user } = useAuth();
  const [containers, setContainers] = useState<Container[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
    damaged: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Check if user has write permissions
  const hasWritePermission = () => {
    if (!user) return false;
    const permissions = user.role.permissions;
    return permissions.includes('*') || permissions.includes('containers:write');
  };

  // Fetch containers and stats
  const fetchContainers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        limit,
      };

      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.containerType = typeFilter;

      const response = await containerService.getAll(params);
      setContainers(response.data.containers || []);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch containers');
      console.error('Error fetching containers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await containerService.getStats();
      setStats({
        total: statsData.total,
        available: statsData.available,
        inUse: statsData.inUse,
        maintenance: statsData.maintenance,
        damaged: statsData.damaged,
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchContainers();
    fetchStats();
  }, [page, searchQuery, statusFilter, typeFilter]);

  // Filter containers based on active tab
  const displayedContainers = containers.filter((container) => {
    if (activeTab === 'all') return true;
    return container.status === activeTab;
  });

  const handleAddContainer = async (data: any) => {
    try {
      const createData: CreateContainerData = {
        containerNumber: data.containerNumber.toUpperCase().trim(),
        type: data.type,
        location: `${data.locationName}, ${data.city}, ${data.country}`,
        condition: data.condition,
        purchaseDate: data.manufacturingDate,
        purchasePrice: 0,
      };

      await containerService.create(createData);
      fetchContainers();
      fetchStats();
      setIsAddContainerModalOpen(false);
    } catch (err: any) {
      // Show user-friendly error message
      const errorMessage = err.message || 'Failed to create container';
      if (errorMessage.toLowerCase().includes('already exists')) {
        alert('This container number already exists. Please use a different number or regenerate.');
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleEditContainer = async (id: string, data: EditContainerFormData) => {
    try {
      await containerService.update(id, data);
      fetchContainers();
      fetchStats();
      setIsEditModalOpen(false);
      setSelectedContainer(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update container');
    }
  };

  const handleDeleteContainer = async (container: Container) => {
    if (!hasWritePermission()) {
      alert('You do not have permission to delete containers');
      return;
    }

    if (container.status === 'in_use') {
      alert('Cannot delete a container that is currently in use');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete container ${container.containerNumber}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await containerService.delete(container._id);
      fetchContainers();
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete container');
    }
  };

  const openViewModal = (container: Container) => {
    setSelectedContainer(container);
    setIsViewModalOpen(true);
  };

  const openEditModal = (container: Container) => {
    if (!hasWritePermission()) {
      alert('You do not have permission to edit containers');
      return;
    }
    setSelectedContainer(container);
    setIsEditModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string): 'purple' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'in_use':
        return 'purple';
      case 'available':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'damaged':
        return 'error';
      default:
        return 'success';
    }
  };

  const getConditionBadgeVariant = (condition: string): 'success' | 'info' | 'warning' | 'error' => {
    switch (condition) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
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

  // Get container capacity based on type
  const getContainerCapacity = (type: string): { volume: number; maxWeight: number } => {
    const capacities: Record<string, { volume: number; maxWeight: number }> = {
      '20ft_standard': { volume: 33.2, maxWeight: 21750 },
      '20ft_high_cube': { volume: 37.4, maxWeight: 21600 },
      '40ft_standard': { volume: 67.5, maxWeight: 26680 },
      '40ft_high_cube': { volume: 67.7, maxWeight: 28580 },
      '40ft_refrigerated': { volume: 67.3, maxWeight: 26580 },
      '20ft_refrigerated': { volume: 28.3, maxWeight: 21800 },
    };
    return capacities[type] || { volume: 0, maxWeight: 0 };
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
            value={stats.total}
            icon={ContainerIcon}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="Available"
            value={stats.available}
            subtitle="Ready for use"
            icon={Box}
            variant="success"
          />

          <StatCard
            title="In Use"
            value={stats.inUse}
            subtitle="Currently shipping"
            icon={Ship}
          />

          <StatCard
            title="Maintenance"
            value={stats.maintenance}
            subtitle="Under repair"
            icon={Wrench}
            variant="warning"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

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
                <option value="damaged">Damaged</option>
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
                <option value="20ft_refrigerated">20ft Refrigerated</option>
                <option value="40ft_standard">40ft Standard</option>
                <option value="40ft_high_cube">40ft High Cube</option>
                <option value="40ft_refrigerated">40ft Refrigerated</option>
              </select>

              {/* Action Buttons */}
              <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                Export
              </Button>

              {hasWritePermission() && (
                <Button
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsAddContainerModalOpen(true)}
                >
                  Add Container
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Containers Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading containers...</p>
            </div>
          ) : (
            <>
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
                        Condition
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayedContainers.map((container) => {
                      const capacity = getContainerCapacity(container.type);
                      return (
                        <tr
                          key={container._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {container.containerId}
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
                              {container.location || 'N/A'}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {container.currentShipment ? (
                              typeof container.currentShipment === 'object' ? (
                                <span className="text-sm font-medium text-purple-600">
                                  {container.currentShipment.shipmentId}
                                </span>
                              ) : (
                                <span className="text-sm font-medium text-purple-600">
                                  {container.currentShipment}
                                </span>
                              )
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="text-gray-900">{capacity.volume} m³</div>
                              <div className="text-gray-500">{capacity.maxWeight.toLocaleString()} kg</div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getConditionBadgeVariant(container.condition)}>
                              {formatStatus(container.condition)}
                            </Badge>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openViewModal(container)}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {hasWritePermission() && (
                                <>
                                  <button
                                    onClick={() => openEditModal(container)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Container"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteContainer(container)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Container"
                                    disabled={container.status === 'in_use'}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {displayedContainers.length === 0 && (
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
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddContainerModal
        isOpen={isAddContainerModalOpen}
        onClose={() => setIsAddContainerModalOpen(false)}
        onSubmit={handleAddContainer}
      />

      <EditContainerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedContainer(null);
        }}
        container={selectedContainer}
        onSubmit={handleEditContainer}
      />

      <ViewContainerModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedContainer(null);
        }}
        container={selectedContainer}
      />
    </DashboardLayout>
  );
}
