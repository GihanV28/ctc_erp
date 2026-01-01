import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Client } from '@/types';

interface TopPerformingClientsProps {
  clients: Pick<Client, 'id' | 'name' | 'shipmentsCount' | 'revenue'>[];
}

const TopPerformingClients: React.FC<TopPerformingClientsProps> = ({ clients }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Top Performing Clients
      </h2>

      <div className="space-y-4">
        {clients.map((client, index) => (
          <div
            key={client.id}
            className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-b-0 border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {index + 1}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {client.name}
                </p>
                <p className="text-xs text-gray-500">
                  {client.shipmentsCount} shipments
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-purple-600">
                {formatCurrency(client.revenue)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformingClients;
