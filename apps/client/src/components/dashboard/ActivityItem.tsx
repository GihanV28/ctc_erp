import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  shipmentId: string;
  date: string;
  location: string;
  status: 'In Transit' | 'Delivered' | 'Processing';
}

const statusConfig = {
  'In Transit': {
    color: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  'Delivered': {
    color: 'bg-green-100 text-green-700',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  'Processing': {
    color: 'bg-orange-100 text-orange-700',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
};

export default function ActivityItem({
  shipmentId,
  date,
  location,
  status,
}: ActivityItemProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', config.iconBg)}>
        <Package className={cn('w-6 h-6', config.iconColor)} />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{shipmentId}</h4>
        <p className="text-sm text-gray-600">{date}</p>
        <p className="text-xs text-gray-500">{location}</p>
      </div>

      <span className={cn('px-3 py-1 rounded-full text-xs font-medium', config.color)}>
        {status}
      </span>
    </div>
  );
}
