import React from 'react';

interface FleetUtilizationProps {
  data: {
    containersInUse: number;
    availableCapacity: number;
    maintenance: number;
  };
}

const FleetUtilization: React.FC<FleetUtilizationProps> = ({ data }) => {
  const utilizationData = [
    {
      label: 'Containers in Use',
      percentage: data.containersInUse,
      color: 'bg-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Available Capacity',
      percentage: data.availableCapacity,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Maintenance',
      percentage: data.maintenance,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Fleet Utilization
      </h2>

      <div className="space-y-6">
        {utilizationData.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {item.percentage}%
              </span>
            </div>

            <div className={`w-full h-3 rounded-full ${item.bgColor} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-500 ease-out`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetUtilization;
