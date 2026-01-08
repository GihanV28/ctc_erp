'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui';
import NewShipmentModal from '@/components/shipments/NewShipmentModal';
import ViewShipmentModal from '@/components/shipments/ViewShipmentModal';
import EditShipmentModal from '@/components/shipments/EditShipmentModal';
import { shipmentService, Shipment, CreateShipmentData } from '@/services/shipmentService';
import { EditShipmentFormData } from '@/components/shipments/EditShipmentModal';
import {
  Package,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Ship,
  Search,
  Download,
  Plus,
  MapPin,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Loader2,
} from 'lucide-react';

export default function ShipmentsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);
  const [viewShipment, setViewShipment] = useState<Shipment | null>(null);
  const [editShipment, setEditShipment] = useState<Shipment | null>(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchShipments();
      fetchStats();
    }
  }, [user, statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await shipmentService.getAll(params);
      setShipments(response.data?.shipments || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await shipmentService.getStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const hasWritePermission = () => {
    if (!user) return false;
    const permissions = user.role.permissions;
    return permissions.includes('*') || permissions.includes('shipments:write');
  };

  const handleAddShipment = async (data: CreateShipmentData) => {
    try {
      await shipmentService.create(data);
      fetchShipments();
      fetchStats();
      setIsNewShipmentModalOpen(false);
    } catch (err: any) {
      alert('Failed to create shipment: ' + err.message);
    }
  };

  const handleEditShipment = async (id: string, data: EditShipmentFormData) => {
    try {
      await shipmentService.update(id, data);
      fetchShipments();
      fetchStats();
      setEditShipment(null);
    } catch (err: any) {
      alert('Failed to update shipment: ' + err.message);
    }
  };

  const handleDeleteShipment = async (id: string, shipmentId: string) => {
    if (!confirm(`Are you sure you want to delete shipment ${shipmentId}? This action cannot be undone.`)) {
      return;
    }

    try {
      await shipmentService.delete(id);
      fetchShipments();
      fetchStats();
    } catch (err: any) {
      alert('Failed to delete shipment: ' + err.message);
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    if (searchQuery === '') return true;
    const query = searchQuery.toLowerCase();
    return (
      shipment.shipmentId.toLowerCase().includes(query) ||
      shipment.trackingNumber.toLowerCase().includes(query) ||
      shipment.client.companyName.toLowerCase().includes(query) ||
      shipment.origin.port.toLowerCase().includes(query) ||
      shipment.destination.port.toLowerCase().includes(query)
    );
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && !shipments.length) {
    return (
      <DashboardLayout title="Shipments" subtitle="Manage and track all shipments">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  const totalShipments = stats?.total || 0;

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
          />
          <StatCard
            title="In Transit"
            value={stats?.active || 0}
            subtitle={`${totalShipments ? ((stats?.active / totalShipments) * 100).toFixed(1) : 0}% of total`}
            icon={Package}
          />
          <StatCard
            title="Completed"
            value={stats?.delivered || 0}
            subtitle={`${totalShipments ? ((stats?.delivered / totalShipments) * 100).toFixed(1) : 0}% of total`}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Pending"
            value={stats?.delayed || 0}
            subtitle="Needs attention"
            icon={AlertCircle}
            variant="warning"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="customs">Customs</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="on_hold">On Hold</option>
            </select>

            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>

            {hasWritePermission() && (
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsNewShipmentModalOpen(true)}
              >
                New Shipment
              </Button>
            )}
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
                    key={shipment._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{shipment.shipmentId}</p>
                        <p className="text-xs text-gray-500">{shipment.trackingNumber}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{shipment.client.companyName}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900">{shipment.origin.port}, {shipment.origin.country}</div>
                          <div className="text-gray-500 flex items-center gap-1">
                            → {shipment.destination.port}, {shipment.destination.country}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900">{formatDate(shipment.dates.departureDate)}</div>
                          <div className="text-gray-500">{formatDate(shipment.dates.estimatedArrival)}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 font-medium">{shipment.cargo.description}</div>
                        {shipment.cargo.weight && (
                          <div className="text-gray-500">{shipment.cargo.weight.toLocaleString()} kg</div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(shipment.status)}`}>
                        {formatStatus(shipment.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewShipment(shipment)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {hasWritePermission() && (
                          <>
                            <button
                              onClick={() => setEditShipment(shipment)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit shipment"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteShipment(shipment._id, shipment.shipmentId)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete shipment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredShipments.length === 0 && (
              <div className="text-center py-12">
                <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No shipments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewShipmentModal
        isOpen={isNewShipmentModalOpen}
        onClose={() => setIsNewShipmentModalOpen(false)}
        onSubmit={handleAddShipment}
      />

      {viewShipment && (
        <ViewShipmentModal
          isOpen={true}
          onClose={() => setViewShipment(null)}
          shipment={viewShipment}
        />
      )}

      {editShipment && (
        <EditShipmentModal
          isOpen={true}
          onClose={() => setEditShipment(null)}
          onSubmit={handleEditShipment}
          shipment={editShipment}
        />
      )}
    </DashboardLayout>
  );
}
