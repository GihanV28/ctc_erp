'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import TopPerformingClients from '@/components/dashboard/TopPerformingClients';
import FleetUtilization from '@/components/dashboard/FleetUtilization';
import { formatCurrency } from '@/lib/utils';
import { dashboardService } from '@/services/dashboardService';
import { mockRecentActivity, mockTopClients, mockFleetUtilization } from '@/lib/mockData';
import {
  DollarSign,
  Package,
  Users,
  Box,
  TrendingUp,
  Container,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔵 Starting to fetch dashboard stats...');
        const dashboardStats = await dashboardService.getStats();
        console.log('✅ Dashboard stats fetched successfully:', dashboardStats);
        setStats(dashboardStats);
      } catch (err: any) {
        console.error('❌ DASHBOARD ERROR:', err);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error response:', err.response);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Overview" subtitle="Welcome back, here's what's happening today">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !stats) {
    return (
      <DashboardLayout title="Overview" subtitle="Welcome back, here's what's happening today">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load dashboard data. Please try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalContainers = stats.containers.total || (stats.containers.available + stats.containers.in_use + stats.containers.maintenance);
  const totalShipments = stats.shipments.total;

  return (
    <DashboardLayout
      title="Overview"
      subtitle="Welcome back, here's what's happening today"
    >
      <div className="space-y-6">
        {/* Top Row - Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.invoices.amount.total)}
            icon={DollarSign}
            variant="purple"
            className="relative overflow-hidden"
          />

          <StatCard
            title="Active Shipments"
            value={stats.shipments.active}
            subtitle={`${totalShipments > 0 ? ((stats.shipments.active / totalShipments) * 100).toFixed(1) : 0}% of total`}
            icon={Package}
          />

          <StatCard
            title="Total Clients"
            value={stats.clients.total}
            subtitle={`${stats.clients.active} active`}
            icon={Users}
          />

          <StatCard
            title="Containers in Use"
            value={stats.containers.in_use}
            subtitle={`of ${totalContainers} total`}
            icon={Box}
          />
        </div>

        {/* Second Row - Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Completed Shipments"
            value={stats.shipments.delivered}
            subtitle={`${totalShipments > 0 ? ((stats.shipments.delivered / totalShipments) * 100).toFixed(1) : 0}% completion rate`}
            icon={Package}
            variant="success"
          />

          <StatCard
            title="Available Containers"
            value={stats.containers.available}
            subtitle="Ready for deployment"
            icon={Container}
            variant="info"
          />

          <StatCard
            title="Pending Invoices"
            value={stats.invoices.count.pending}
            subtitle={`${formatCurrency(stats.invoices.amount.pending)} pending`}
            icon={AlertCircle}
            variant="warning"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity activities={mockRecentActivity} />
          </div>

          <div>
            <TopPerformingClients clients={mockTopClients} />
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FleetUtilization data={mockFleetUtilization} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
