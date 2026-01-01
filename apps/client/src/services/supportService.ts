import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';

export interface SupportTicket {
  _id: string;
  ticketId: string;
  client: {
    _id: string;
    clientId: string;
    companyName: string;
  };
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'general' | 'billing' | 'technical' | 'shipping' | 'other';
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupportTicketData {
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'general' | 'billing' | 'technical' | 'shipping' | 'other';
}

export const supportService = {
  getAll: async (params?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<SupportTicket>> => {
    try {
      const response = await api.get<PaginatedResponse<SupportTicket>>('/support', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getById: async (id: string): Promise<SupportTicket> => {
    try {
      const response = await api.get<ApiResponse<{ ticket: SupportTicket }>>(`/support/${id}`);
      return response.data.data!.ticket;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  create: async (data: CreateSupportTicketData): Promise<SupportTicket> => {
    try {
      const response = await api.post<ApiResponse<{ ticket: SupportTicket }>>('/support', data);
      return response.data.data!.ticket;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  update: async (id: string, data: Partial<CreateSupportTicketData> & {
    status?: string;
    assignedTo?: string;
  }): Promise<SupportTicket> => {
    try {
      const response = await api.put<ApiResponse<{ ticket: SupportTicket }>>(`/support/${id}`, data);
      return response.data.data!.ticket;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  close: async (id: string): Promise<SupportTicket> => {
    try {
      const response = await api.put<ApiResponse<{ ticket: SupportTicket }>>(`/support/${id}/close`);
      return response.data.data!.ticket;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
