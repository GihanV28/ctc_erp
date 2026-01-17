'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortalLayout from '@/components/layout/PortalLayout';
import StatCard from '@/components/ui/StatCard';
import ActivityItem from '@/components/dashboard/ActivityItem';
import QuickLink from '@/components/dashboard/QuickLink';
import Button from '@/components/ui/Button';
import { Package, User, Mail, Loader2 } from 'lucide-react';
import { useProfilePhoto } from '@/context/ProfilePhotoContext';
import { shipmentService } from '@/services/shipmentService';
import type { Shipment } from '@/services/shipmentService';

interface DashboardStats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  processing: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { userName, profilePhoto } = useProfilePhoto();
  const [trackingId, setTrackingId] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    processing: 0,
  });
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch stats
      const statsData = await shipmentService.getStats();

      // Fetch recent shipments (limit to 4 for recent activity)
      const shipmentsData = await shipmentService.getAll({ page: 1, limit: 4 });

      setStats({
        totalShipments: statsData.total,
        inTransit: statsData.active,
        delivered: statsData.delivered,
        processing: statsData.delayed, // using 'delayed' as processing count
      });

      setRecentShipments(shipmentsData.data?.shipments || []);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      // Navigate to tracking page with the tracking number
      router.push(`/track?number=${encodeURIComponent(trackingId.trim())}`);
    }
  };

  const getInitials = () => {
    if (!userName || userName === 'User') return 'U';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <PortalLayout
      title="Dashboard"
      subtitle="Welcome back, here's your shipment overview"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{userName}</span>
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              {getInitials()}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Shipments"
            value={stats.totalShipments}
            subtitle="All time"
            icon={Package}
            variant="purple"
          />
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            subtitle="Active shipments"
            subtitleColor="text-purple-600"
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            subtitle="Successfully completed"
            subtitleColor="text-green-600"
          />
          <StatCard
            title="Processing"
            value={stats.processing}
            subtitle="Being prepared"
            subtitleColor="text-orange-600"
          />
        </div>

        {/* Track Shipment Section */}
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Welcome to CCT</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Track your shipment</p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
            />
            <Button type="submit" variant="primary" className="px-6 md:px-8 rounded-lg w-full sm:w-auto">
              Track
            </Button>
          </form>
        </div>

        {/* Recent Activity and Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : recentShipments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No shipments yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentShipments.map((shipment) => (
                  <ActivityItem
                    key={shipment._id}
                    shipmentId={shipment.shipmentId}
                    date={formatDate(shipment.dates.bookingDate || shipment.createdAt)}
                    location={`${shipment.origin.city || shipment.origin.port}, ${shipment.origin.country}`}
                    status={formatStatus(shipment.status)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <QuickLink
                title="View All Shipments"
                href="/shipments"
                icon={Package}
                iconColor="text-purple-600"
              />
              <QuickLink
                title="Update Profile"
                href="/profile"
                icon={User}
                iconColor="text-purple-600"
              />
              <QuickLink
                title="Contact Support"
                href="/support"
                icon={Mail}
                iconColor="text-purple-600"
              />
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
