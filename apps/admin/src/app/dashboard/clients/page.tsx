'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Badge, Avatar } from '@/components/ui';
import AddClientModal from '@/components/clients/AddClientModal';
import { clientService, Client, CreateClientData } from '@/services/clientService';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
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
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
} from 'lucide-react';

type TabType = 'all' | 'active' | 'inactive' | 'suspended';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  // Check if user is Super Admin (has wildcard permission)
  const isSuperAdmin = user?.role?.permissions?.some((p: string) => p === '*') || false;

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getAll({ limit: 1000 });
      setClients(response.data.clients || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalBalance = clients.reduce((sum, c) => sum + (c.currentBalance || 0), 0);
  const totalShipments = clients.reduce((sum, c) => sum + (c.shipments?.length || 0), 0);

  // Filter clients based on search and tab
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchQuery === '' ||
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.tradingName && client.tradingName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      client.contactPerson.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${client.contactPerson.firstName} ${client.contactPerson.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      client.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const handleAddClient = async (data: CreateClientData) => {
    try {
      await clientService.create(data);
      await fetchClients(); // Refresh the list
    } catch (error: any) {
      throw error; // Let the modal handle the error display
    }
  };

  const handleEditClient = async (data: CreateClientData) => {
    if (!editingClient) return;

    try {
      await clientService.update(editingClient._id, data);
      await fetchClients(); // Refresh the list
      setEditingClient(null);
    } catch (error: any) {
      throw error; // Let the modal handle the error display
    }
  };

  const handleSubmit = async (data: CreateClientData) => {
    if (modalMode === 'view') return; // No submission in view mode
    if (modalMode === 'edit') return handleEditClient(data);
    return handleAddClient(data);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingClientId(clientId);
      await clientService.delete(clientId);
      await fetchClients(); // Refresh the list
    } catch (error: any) {
      alert(error.message || 'Failed to delete client');
    } finally {
      setDeletingClientId(null);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingClient(null);
    setIsAddClientModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setModalMode('edit');
    setEditingClient(client);
    setIsAddClientModalOpen(true);
  };

  const openViewModal = (client: Client) => {
    setModalMode('view');
    setEditingClient(client);
    setIsAddClientModalOpen(true);
  };

  const closeModal = () => {
    setIsAddClientModalOpen(false);
    setEditingClient(null);
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'error' => {
    if (status === 'active') return 'success';
    if (status === 'suspended') return 'error';
    return 'warning';
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <DashboardLayout
      title="Clients"
      subtitle="Manage your client relationships"
    >
      <div className="space-y-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Error Loading Clients</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchClients}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clients"
            value={loading ? '-' : totalClients}
            icon={Users}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="Active Clients"
            value={loading ? '-' : activeClients}
            subtitle={!loading && totalClients > 0 ? `${((activeClients / totalClients) * 100).toFixed(1)}% of total` : undefined}
            icon={UserCheck}
            variant="success"
          />

          <StatCard
            title="Total Balance"
            value={loading ? '-' : formatCurrency(totalBalance)}
            subtitle="Current outstanding"
            icon={DollarSign}
          />

          <StatCard
            title="Total Shipments"
            value={loading ? '-' : totalShipments}
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
                { key: 'suspended', label: 'Suspended' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  disabled={loading}
                  className={`py-4 px-1 font-medium text-sm transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    placeholder="Search by company name, client ID, contact name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                leftIcon={<Download className="h-4 w-4" />}
                disabled={loading || clients.length === 0}
              >
                Export
              </Button>

              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={openAddModal}
                disabled={loading}
              >
                Add Client
              </Button>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading clients...</span>
            </div>
          ) : (
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
                      Balance
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
                  {filteredClients.map((client) => (
                    <tr
                      key={client._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={client.companyName} size="md" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {client.companyName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {client.clientId}
                            </div>
                            {client.tradingName && (
                              <div className="text-xs text-gray-400 italic">
                                {client.tradingName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.contactPerson.firstName} {client.contactPerson.lastName}
                        </div>
                        {client.contactPerson.position && (
                          <div className="text-xs text-gray-500">
                            {client.contactPerson.position}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {client.contactPerson.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {client.contactPerson.phone}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            {client.address.city}, {client.address.country}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {client.shipments?.length || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(client.currentBalance || 0)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(client.status)}>
                          {formatStatus(client.status)}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isSuperAdmin ? (
                            <>
                              <button
                                onClick={() => openViewModal(client)}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(client)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client._id)}
                                disabled={deletingClientId === client._id}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingClientId === client._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openViewModal(client)}
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
          {!loading && filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchQuery || activeTab !== 'all'
                  ? 'No clients found'
                  : 'No clients yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery || activeTab !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first client'}
              </p>
              {!searchQuery && activeTab === 'all' && (
                <Button
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={openAddModal}
                  className="mt-4"
                >
                  Add Client
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && filteredClients.length > 0 && (
          <div className="text-sm text-gray-600 text-center">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        )}
      </div>

      {/* Add/Edit/View Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        client={editingClient}
        mode={modalMode}
      />
    </DashboardLayout>
  );
}
