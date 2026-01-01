import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Package,
  Box,
  CheckCircle2,
  UserPlus,
  Wrench,
} from 'lucide-react';
import { RecentActivity as Activity } from '@/types';

interface RecentActivityProps {
  activities: Activity[];
}

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    package: <Package className="h-5 w-5" />,
    box: <Box className="h-5 w-5" />,
    'check-circle': <CheckCircle2 className="h-5 w-5" />,
    'user-plus': <UserPlus className="h-5 w-5" />,
    wrench: <Wrench className="h-5 w-5" />,
  };
  return icons[iconName] || <Package className="h-5 w-5" />;
};

const getIconColor = (type: string) => {
  const colors: Record<string, string> = {
    shipment: 'bg-purple-100 text-purple-600',
    container: 'bg-blue-100 text-blue-600',
    client: 'bg-orange-100 text-orange-600',
    system: 'bg-gray-100 text-gray-600',
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-b-0 border-gray-100"
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(
                activity.type
              )}`}
            >
              {getIcon(activity.icon || 'package')}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500">{activity.description}</p>
            </div>

            <div className="flex-shrink-0 text-xs text-gray-500">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
