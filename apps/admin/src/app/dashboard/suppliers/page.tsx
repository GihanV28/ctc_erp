'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge, Avatar } from '@/components/ui';
import AddSupplierModal from '@/components/suppliers/AddSupplierModal';
import { supplierService, Supplier } from '@/services/supplierService';
import { useAuth } from '@/context/AuthContext';
import {
  Truck,
  CheckCircle2,
  FileText,
  TrendingUp,
  Search,
  Download,
  Plus,
  MapPin,
  Mail,
  Phone,
  Star,
  Ship,
  Plane,
  Box,
  Anchor,
  Warehouse,
  FileCheck,
  Zap,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
  Eye,
} from 'lucide-react';

type TabType = 'all' | 'active' | 'inactive' | 'top';
type ServiceType = 'ocean_freight' | 'air_sea' | 'container' | 'port_ops' | 'warehouse' | 'customs' | 'ground' | 'express';

const serviceTypeIcons: Record<ServiceType, React.ReactNode> = {
  ocean_freight: <Ship className="h-4 w-4" />,
  air_sea: <Plane className="h-4 w-4" />,
  container: <Box className="h-4 w-4" />,
  port_ops: <Anchor className="h-4 w-4" />,
  warehouse: <Warehouse className="h-4 w-4" />,
  customs: <FileCheck className="h-4 w-4" />,
  ground: <Truck className="h-4 w-4" />,
  express: <Zap className="h-4 w-4" />,
};

const serviceTypeLabels: Record<ServiceType, string> = {
  ocean_freight: 'Ocean Freight',
  air_sea: 'Air & Sea Freight',
  container: 'Container Leasing',
  port_ops: 'Port Operations',
  warehouse: 'Warehousing',
  customs: 'Customs Clearance',
  ground: 'Ground Transport',
  express: 'Express Shipping',
};

export default function SuppliersPage() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check if user is Super Admin (has wildcard permission)
  const isSuperAdmin = user?.role?.permissions?.some((p: string) => p === '*') || false;

  // Check if user has write permission
  const hasWritePermission = user?.role?.permissions?.some(
    (p: string) => p === '*' || p === 'suppliers:write'
  ) || false;

  // Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supplierService.getAll({ limit: 1000 });
      setSuppliers(response.data?.suppliers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const totalContracts = suppliers.reduce((sum, s) => sum + (s.performanceMetrics?.activeContracts || 0), 0);
  const avgOnTimeRate = suppliers.length > 0
    ? Math.round(suppliers.reduce((sum, s) => sum + (s.performanceMetrics?.onTimeRate || 0), 0) / suppliers.length)
    : 0;

  // Filter suppliers based on search, tab, and service filter
  const filteredSuppliers = suppliers.filter((supplier) => {
    const fullName = `${supplier.contactPerson.firstName} ${supplier.contactPerson.lastName}`;
    const location = `${supplier.address.city}, ${supplier.address.country}`;

    const matchesSearch =
      searchQuery === '' ||
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.supplierId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (supplier.tradingName && supplier.tradingName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.serviceTypes.some(st => serviceTypeLabels[st]?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && supplier.status === 'active') ||
      (activeTab === 'inactive' && supplier.status === 'inactive') ||
      (activeTab === 'top' && (supplier.rating || 0) >= 4.7);

    const matchesService =
      serviceFilter === 'all' || supplier.serviceTypes.includes(serviceFilter as ServiceType);

    return matchesSearch && matchesTab && matchesService;
  });

  // Sort top performers by rating
  const displaySuppliers = activeTab === 'top'
    ? [...filteredSuppliers].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : filteredSuppliers;

  const handleAddSupplier = async (data: any) => {
    try {
      await supplierService.create(data);
      await fetchSuppliers();
      setIsAddSupplierModalOpen(false);
    } catch (err: any) {
      console.error('Error creating supplier:', err);
      alert(err.message || 'Failed to create supplier');
    }
  };

  const handleEditSupplier = async (data: any) => {
    if (!editingSupplier) return;
    try {
      await supplierService.update(editingSupplier._id, data);
      await fetchSuppliers();
      setEditingSupplier(null);
      setIsAddSupplierModalOpen(false);
    } catch (err: any) {
      console.error('Error updating supplier:', err);
      alert(err.message || 'Failed to update supplier');
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      setDeletingId(id);
      await supplierService.delete(id);
      await fetchSuppliers();
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      alert(err.message || 'Failed to delete supplier');
    } finally {
      setDeletingId(null);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingSupplier(null);
    setIsAddSupplierModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setModalMode('edit');
    setEditingSupplier(supplier);
    setIsAddSupplierModalOpen(true);
  };

  const openViewModal = (supplier: Supplier) => {
    setModalMode('view');
    setEditingSupplier(supplier);
    setIsAddSupplierModalOpen(true);
  };

  const closeModal = () => {
    setEditingSupplier(null);
    setIsAddSupplierModalOpen(false);
  };

  const handleSubmit = async (data: any) => {
    if (modalMode === 'view') return; // No submission in view mode
    if (modalMode === 'edit') return handleEditSupplier(data);
    return handleAddSupplier(data);
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'info' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'pending':
        return 'info';
      default:
        return 'info';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Suppliers"
      subtitle="Manage your supplier network and partnerships"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Suppliers"
            value={totalSuppliers}
            icon={Truck}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="Active Suppliers"
            value={activeSuppliers}
            subtitle={`${Math.round((activeSuppliers / totalSuppliers) * 100)}% active`}
            icon={CheckCircle2}
            variant="success"
          />

          <StatCard
            title="Active Contracts"
            value={totalContracts}
            subtitle="Across all suppliers"
            icon={FileText}
          />

          <StatCard
            title="Avg On-Time Rate"
            value={`${avgOnTimeRate}%`}
            subtitle="Performance metric"
            icon={TrendingUp}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { key: 'all', label: 'All Suppliers' },
                { key: 'active', label: 'Active' },
                { key: 'inactive', label: 'Inactive' },
                { key: 'top', label: 'Top Performers' },
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
                    placeholder="Search by name, service type, contact, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Service Filter */}
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              >
                <option value="all">All Services</option>
                <option value="ocean_freight">Ocean Freight</option>
                <option value="air_sea">Air & Sea Freight</option>
                <option value="container">Container Leasing</option>
                <option value="port_ops">Port Operations</option>
                <option value="warehouse">Warehousing</option>
                <option value="customs">Customs Clearance</option>
                <option value="ground">Ground Transport</option>
                <option value="express">Express Shipping</option>
              </select>

              {/* Action Buttons */}
              <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                Export
              </Button>

              {hasWritePermission && (
                <Button
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={openAddModal}
                >
                  Add Supplier
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading suppliers</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={fetchSuppliers} variant="primary">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact Person
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Service Types
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rating
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
                  {displaySuppliers.map((supplier) => (
                    <tr
                      key={supplier._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={supplier.name} size="md" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {supplier.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {supplier.supplierId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {supplier.contactPerson.firstName} {supplier.contactPerson.lastName}
                        </div>
                        {supplier.contactPerson.position && (
                          <div className="text-xs text-gray-500">
                            {supplier.contactPerson.position}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {supplier.contactPerson.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {supplier.contactPerson.phone}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {supplier.address.city}, {supplier.address.country}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {supplier.serviceTypes.slice(0, 2).map((st) => (
                            <div key={st} className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                              {serviceTypeIcons[st]}
                              <span>{serviceTypeLabels[st]}</span>
                            </div>
                          ))}
                          {supplier.serviceTypes.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{supplier.serviceTypes.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {supplier.performanceMetrics?.totalShipments || 0}
                          </div>
                          <div className="text-gray-600">
                            shipments
                          </div>
                          <div className="text-gray-600 mt-1">
                            {supplier.performanceMetrics?.activeContracts || 0} active
                          </div>
                          <div className="text-gray-600">
                            contracts
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderRating(supplier.rating || 0)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(supplier.status)}>
                          {formatStatus(supplier.status)}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isSuperAdmin ? (
                            <>
                              <button
                                onClick={() => openViewModal(supplier)}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(supplier)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSupplier(supplier._id)}
                                disabled={deletingId === supplier._id}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === supplier._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openViewModal(supplier)}
                              className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {displaySuppliers.length === 0 && (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No suppliers found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {displaySuppliers.length > 0 && (
          <div className="text-sm text-gray-600 text-center">
            Showing {displaySuppliers.length} of {suppliers.length} suppliers
          </div>
        )}
      </div>

      {/* Add/Edit/View Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddSupplierModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingSupplier={editingSupplier}
        mode={modalMode}
      />
    </DashboardLayout>
  );
}
