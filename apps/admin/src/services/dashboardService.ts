import api, { ApiResponse, getErrorMessage } from '@/lib/api';
import { shipmentService, ShipmentStats } from './shipmentService';
import { invoiceService, InvoiceStats } from './invoiceService';
import { clientService } from './clientService';
import { containerService } from './containerService';

export interface DashboardStats {
  shipments: ShipmentStats;
  invoices: InvoiceStats;
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  clients: {
    total: number;
    active: number;
    inactive: number;
  };
  containers: {
    total: number;
    available: number;
    in_use: number;
    maintenance: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'shipment' | 'invoice' | 'client' | 'container';
  action: string;
  description: string;
  timestamp: Date;
  user?: string;
}

export const dashboardService = {
  // Get aggregated dashboard stats
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch all stats in parallel
      const [shipmentStats, invoiceStats, clientsResponse, containersResponse] = await Promise.all([
        shipmentService.getStats(),
        invoiceService.getStats(),
        clientService.getAll({ limit: 1000 }),
        containerService.getAll({ limit: 1000 }),
      ]);

      // Calculate client stats from response
      const clients = clientsResponse.data.clients || [];
      const clientStats = {
        total: clients.length,
        active: clients.filter((c: any) => c.status === 'active').length,
        inactive: clients.filter((c: any) => c.status !== 'active').length,
      };

      // Calculate container stats from response
      const containers = containersResponse.data.containers || [];
      const containerStats = {
        total: containers.length,
        available: containers.filter((c: any) => c.status === 'available').length,
        in_use: containers.filter((c: any) => c.status === 'in_use').length,
        maintenance: containers.filter((c: any) => c.status === 'maintenance').length,
      };

      return {
        shipments: shipmentStats,
        invoices: invoiceStats,
        revenue: {
          total: invoiceStats.amount.total,
          thisMonth: invoiceStats.amount.paid,
          lastMonth: 0, // Calculate from historical data if available
          growth: 0, // Calculate percentage growth
        },
        clients: clientStats,
        containers: containerStats,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    try {
      const response = await api.get<ApiResponse<{ activities: RecentActivity[] }>>('/dashboard/activity', {
        params: { limit },
      });
      return response.data.data!.activities;
    } catch (error) {
      // If endpoint doesn't exist, return empty array
      return [];
    }
  },

  // Get top performing clients
  getTopClients: async (limit: number = 5): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<{ clients: any[] }>>('/dashboard/top-clients', {
        params: { limit },
      });
      return response.data.data!.clients;
    } catch (error) {
      return [];
    }
  },
};
