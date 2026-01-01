'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge, Avatar } from '@/components/ui';
import AddSupplierModal from '@/components/suppliers/AddSupplierModal';
import { mockSuppliers } from '@/lib/mockData';
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
} from 'lucide-react';
import { Supplier, ServiceType } from '@/types';

type TabType = 'all' | 'active' | 'inactive' | 'top';

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
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);

  // Calculate stats
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const totalContracts = suppliers.reduce((sum, s) => sum + s.activeContracts, 0);
  const avgOnTimeRate = 95; // This would come from actual data

  // Filter suppliers based on search, tab, and service filter
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      searchQuery === '' ||
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceTypeLabels[supplier.serviceType].toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && supplier.status === 'active') ||
      (activeTab === 'inactive' && supplier.status === 'inactive') ||
      (activeTab === 'top' && supplier.rating >= 4.7);

    const matchesService =
      serviceFilter === 'all' || supplier.serviceType === serviceFilter;

    return matchesSearch && matchesTab && matchesService;
  });

  // Sort top performers by rating
  const displaySuppliers = activeTab === 'top'
    ? [...filteredSuppliers].sort((a, b) => b.rating - a.rating)
    : filteredSuppliers;

  const handleAddSupplier = (data: any) => {
    console.log('New supplier:', data);
    // Here you would typically call an API to create the supplier
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

              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsAddSupplierModalOpen(true)}
              >
                Add Supplier
              </Button>
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                    Service Type
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
                    key={supplier.id}
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
                            {supplier.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {supplier.contactPerson}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {supplier.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {supplier.location}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-purple-600">
                          {serviceTypeIcons[supplier.serviceType]}
                        </div>
                        <span className="text-sm text-gray-900">
                          {serviceTypeLabels[supplier.serviceType]}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">
                          {supplier.shipmentsCount}
                        </div>
                        <div className="text-gray-600">
                          shipments
                        </div>
                        <div className="text-gray-600 mt-1">
                          {supplier.activeContracts} active
                        </div>
                        <div className="text-gray-600">
                          contracts
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderRating(supplier.rating)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(supplier.status)}>
                        {formatStatus(supplier.status)}
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

      {/* Add Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        onSubmit={handleAddSupplier}
      />
    </DashboardLayout>
  );
}
