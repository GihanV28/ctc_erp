'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import Button from '@/components/ui/Button';
import {
  Search,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  Info,
  RotateCcw
} from 'lucide-react';
import { mockUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const trackingData = {
  orderId: '3354654654526',
  orderDate: 'Feb 16, 2023',
  lateDelivery: 'May 16, 2023',
  currentStatus: 2, // 0: Order Confirmed, 1: Shipped, 2: Out For Delivery, 3: Delivered
  timeline: [
    { status: 'Order Confirmed', date: 'Wed, 11th Jan', completed: true },
    { status: 'Shipped', date: 'Wed, 11th Jan', completed: true },
    { status: 'Out For Delivery', date: 'Wed, 11th Jan', completed: true },
    { status: 'Delivered', date: 'Wed, 11th Jan', completed: false },
  ],
  items: [
    {
      id: 1,
      name: 'Machinery Parts',
      hsCode: '31',
      qty: 2,
      unit: 'cartons',
      price: 2599.00,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Electronics Components',
      hsCode: '21',
      qty: 1,
      unit: 'carton',
      price: 2599.00,
      quantity: 1,
      address: '847 Jewess Bridge Apt, London, UK',
      phone: '474-769-3910',
    },
  ],
  costs: {
    discount: { amount: 8109.00, percentage: 20 },
    delivery1: 0.00,
    delivery2: 271.90,
    tax1: 0.00,
    tax2: 0.00,
    total: 0.00,
  },
  origin: {
    location: 'Colombo, Sri Lanka',
    port: 'Port of Colombo',
  },
  destination: {
    location: 'London, UK',
    port: 'London Gateway, UK',
  },
  estimatedDelivery: 'Nov 10, 2024',
};

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('3354654654526');

  const handleTrack = () => {
    console.log('Tracking:', trackingId);
  };

  return (
    <PortalLayout
      title="Track Shipment"
      subtitle="Enter your tracking ID to view shipment details"
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
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="3354654654526"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button variant="primary" onClick={handleTrack} className="px-8">
              Track Order
            </Button>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <h2 className="text-3xl font-bold text-gray-900">{trackingData.orderId}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Order date: {trackingData.orderDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Calendar className="w-4 h-4" />
                  Late delivery: {trackingData.lateDelivery}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Invoice
              </Button>
              <Button variant="primary" size="sm">
                Track Order
              </Button>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {trackingData.timeline.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  {/* Circle */}
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-4 z-10',
                      step.completed
                        ? 'bg-purple-600 border-purple-600'
                        : 'bg-gray-300 border-gray-300'
                    )}
                  />

                  {/* Label */}
                  <div className="text-center mt-3">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        step.completed ? 'text-green-600' : 'text-gray-400'
                      )}
                    >
                      {step.status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                  </div>

                  {/* Line to next step */}
                  {index < trackingData.timeline.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-3 left-1/2 h-1 w-full -z-0',
                        step.completed && trackingData.timeline[index + 1].completed
                          ? 'bg-purple-600'
                          : 'bg-gray-300'
                      )}
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipment Summary and Costs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipment Summary */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Shipment Summary</h3>

            <div className="space-y-4">
              {trackingData.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          HS Code: {item.hsCode} | Qty: {item.qty} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>

                    {item.address && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p className="font-medium">Address:</p>
                        <p>{item.address}</p>
                        <p>{item.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Need Help */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Need Help</h4>
              <div className="space-y-2 mb-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Order Issues
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Info className="w-4 h-4 text-blue-500" />
                  Delivery Info
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <RotateCcw className="w-4 h-4 text-gray-500" />
                  Returns
                </button>
              </div>
              <Button variant="primary" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>

          {/* Delivery Costs */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-gray-900">
                  ${trackingData.costs.discount.amount.toFixed(2)} ({trackingData.costs.discount.percentage}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-900">${trackingData.costs.delivery1.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-900">+${trackingData.costs.delivery2.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${trackingData.costs.tax1.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${trackingData.costs.tax2.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${trackingData.costs.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Shipment Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Origin */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Origin</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{trackingData.origin.location}</p>
                  <p className="text-sm text-gray-600">{trackingData.origin.port}</p>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Destination</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{trackingData.destination.location}</p>
                  <p className="text-sm text-gray-600">{trackingData.destination.port}</p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Estimated Delivery</p>
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{trackingData.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
