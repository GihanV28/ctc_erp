'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import StatCard from '@/components/ui/StatCard';
import ActivityItem from '@/components/dashboard/ActivityItem';
import QuickLink from '@/components/dashboard/QuickLink';
import Button from '@/components/ui/Button';
import { Package, User, Mail } from 'lucide-react';
import { mockDashboardStats, mockRecentActivity, mockUser } from '@/lib/mockData';

export default function DashboardPage() {
  const [trackingId, setTrackingId] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle tracking logic
    console.log('Tracking:', trackingId);
  };

  return (
    <PortalLayout
      title="Dashboard"
      subtitle="Welcome back, here's your shipment overview"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{mockUser.name}</span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {mockUser.avatar}
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Shipments"
            value={mockDashboardStats.totalShipments}
            subtitle="All time"
            icon={Package}
            variant="purple"
          />
          <StatCard
            title="In Transit"
            value={mockDashboardStats.inTransit}
            subtitle="Active shipments"
            subtitleColor="text-purple-600"
          />
          <StatCard
            title="Delivered"
            value={mockDashboardStats.delivered}
            subtitle="Successfully completed"
            subtitleColor="text-green-600"
          />
          <StatCard
            title="Processing"
            value={mockDashboardStats.processing}
            subtitle="Being prepared"
            subtitleColor="text-orange-600"
          />
        </div>

        {/* Track Shipment Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CCT</h2>
          <p className="text-gray-600 mb-6">Track your shipment</p>

          <form onSubmit={handleTrack} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button type="submit" variant="primary" className="px-8 rounded-lg">
              Track
            </Button>
          </form>
        </div>

        {/* Recent Activity and Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {mockRecentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  shipmentId={activity.shipmentId}
                  date={activity.date}
                  location={activity.location}
                  status={activity.status}
                />
              ))}
            </div>
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
