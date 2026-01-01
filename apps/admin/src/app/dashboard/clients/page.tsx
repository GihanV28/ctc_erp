'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge, Avatar } from '@/components/ui';
import AddClientModal from '@/components/clients/AddClientModal';
import { mockClients } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  UserCheck,
  DollarSign,
  Package,
  Search,
  Download,
  Plus,
  MapPin,
  Mail,
  Phone,
  Star,
} from 'lucide-react';
import { Client } from '@/types';

type TabType = 'all' | 'active' | 'inactive' | 'top';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Calculate stats
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.revenue, 0);
  const totalShipments = clients.reduce((sum, c) => sum + c.shipmentsCount, 0);

  // Filter clients based on search and tab
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchQuery === '' ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && client.status === 'active') ||
      (activeTab === 'inactive' && client.status === 'inactive') ||
      (activeTab === 'top' && client.rating >= 4.5);

    return matchesSearch && matchesTab;
  });

  // Sort top clients by revenue
  const displayClients = activeTab === 'top'
    ? [...filteredClients].sort((a, b) => b.revenue - a.revenue)
    : filteredClients;

  const handleAddClient = (data: any) => {
    console.log('New client:', data);
    // Here you would typically call an API to create the client
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'warning' => {
    return status === 'active' ? 'success' : 'warning';
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
      title="Clients"
      subtitle="Manage your client relationships"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clients"
            value={totalClients}
            icon={Users}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="Active Clients"
            value={activeClients}
            subtitle={`${((activeClients / totalClients) * 100).toFixed(1)}% of total`}
            
            icon={UserCheck}
            variant="success"
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="All time earnings"
            icon={DollarSign}
          />

          <StatCard
            title="Active Shipments"
            value={totalShipments}
            subtitle="From all clients"
            icon={Package}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { key: 'all', label: 'All Clients' },
                { key: 'active', label: 'Active' },
                { key: 'inactive', label: 'Inactive' },
                { key: 'top', label: 'Top Clients' },
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
                    placeholder="Search by name, contact, email, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                Export
              </Button>

              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsAddClientModalOpen(true)}
              >
                Add Client
              </Button>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
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
                    Shipments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Revenue
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
                {displayClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={client.name} size="md" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {client.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {client.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-900">
                          {client.contactPerson}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {client.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {client.location}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {client.shipmentsCount}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(client.revenue)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderRating(client.rating)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(client.status)}>
                        {formatStatus(client.status)}
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
          {displayClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No clients found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {displayClients.length > 0 && (
          <div className="text-sm text-gray-600 text-center">
            Showing {displayClients.length} of {clients.length} clients
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSubmit={handleAddClient}
      />
    </DashboardLayout>
  );
}
