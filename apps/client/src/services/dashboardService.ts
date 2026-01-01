import api, { ApiResponse, getErrorMessage } from '@/lib/api';
import { shipmentService, ShipmentStats } from './shipmentService';
import { invoiceService, InvoiceStats } from './invoiceService';

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
      const [shipmentStats, invoiceStats] = await Promise.all([
        shipmentService.getStats(),
        invoiceService.getStats(),
      ]);

      // Get additional stats from API
      const [clientsResponse, containersResponse] = await Promise.all([
        api.get<ApiResponse<{ stats: any }>>('/clients/stats'),
        api.get<ApiResponse<{ stats: any }>>('/containers/stats'),
      ]);

      return {
        shipments: shipmentStats,
        invoices: invoiceStats,
        revenue: {
          total: invoiceStats.amount.total,
          thisMonth: invoiceStats.amount.paid,
          lastMonth: 0, // Calculate from historical data if available
          growth: 0, // Calculate percentage growth
        },
        clients: clientsResponse.data.data?.stats || { total: 0, active: 0, inactive: 0 },
        containers: containersResponse.data.data?.stats || { total: 0, available: 0, in_use: 0, maintenance: 0 },
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
