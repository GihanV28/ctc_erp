'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import { Package, Plane, Ship, Eye, Download, Filter, Search } from 'lucide-react';
import { mockShipments, mockShipmentsStats, mockUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  in_transit: {
    label: 'In Transit',
    color: 'bg-blue-100 text-blue-700',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
  },
  processing: {
    label: 'Processing',
    color: 'bg-orange-100 text-orange-700',
  },
  pending: {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-700',
  },
  delayed: {
    label: 'Delayed',
    color: 'bg-red-100 text-red-700',
  },
};

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <PortalLayout
      title="My Shipments"
      subtitle="Track and manage all your shipments"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{mockUser.name}</span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {mockUser.avatar}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Shipments */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{mockShipmentsStats.total}</p>
                <p className="text-sm text-gray-600 mt-1">Total Shipments</p>
              </div>
            </div>
          </div>

          {/* In Transit */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Ship className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{mockShipmentsStats.inTransit}</p>
                <p className="text-sm text-gray-600 mt-1">In Transit</p>
              </div>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{mockShipmentsStats.delivered}</p>
                <p className="text-sm text-gray-600 mt-1">Delivered</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{mockShipmentsStats.pending}</p>
                <p className="text-sm text-gray-600 mt-1">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking ID, origin, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    ETA
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipment.trackingNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {shipment.container.type === 'Sea' ? (
                          <Ship className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Plane className="w-4 h-4 text-gray-500" />
                        )}
                        {shipment.container.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.origin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(shipment.departureDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(shipment.estimatedArrival)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.itemsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(shipment.value || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          statusConfig[shipment.status].color
                        )}
                      >
                        {statusConfig[shipment.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Download className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
