import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';

export interface Invoice {
  _id: string;
  invoiceId: string;
  invoiceNumber: string;
  client: {
    _id: string;
    clientId: string;
    companyName: string;
  };
  shipment?: {
    _id: string;
    shipmentId: string;
    trackingNumber: string;
  };
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceData {
  client: string;
  shipment?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  tax?: number;
  dueDate: string;
  notes?: string;
}

export interface InvoiceStats {
  count: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
  };
  amount: {
    total: number;
    paid: number;
    pending: number;
  };
}

export const invoiceService = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Invoice>> => {
    try {
      const response = await api.get<PaginatedResponse<Invoice>>('/invoices', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getById: async (id: string): Promise<Invoice> => {
    try {
      const response = await api.get<ApiResponse<{ invoice: Invoice }>>(`/invoices/${id}`);
      return response.data.data!.invoice;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  create: async (data: CreateInvoiceData): Promise<Invoice> => {
    try {
      const response = await api.post<ApiResponse<{ invoice: Invoice }>>('/invoices', data);
      return response.data.data!.invoice;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  update: async (id: string, data: Partial<CreateInvoiceData>): Promise<Invoice> => {
    try {
      const response = await api.put<ApiResponse<{ invoice: Invoice }>>(`/invoices/${id}`, data);
      return response.data.data!.invoice;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  markAsPaid: async (id: string, paymentData: { paymentDate?: string; paymentMethod: string }): Promise<Invoice> => {
    try {
      const response = await api.put<ApiResponse<{ invoice: Invoice }>>(`/invoices/${id}/pay`, paymentData);
      return response.data.data!.invoice;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  cancel: async (id: string): Promise<Invoice> => {
    try {
      const response = await api.put<ApiResponse<{ invoice: Invoice }>>(`/invoices/${id}/cancel`);
      return response.data.data!.invoice;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getStats: async (): Promise<InvoiceStats> => {
    try {
      const response = await api.get<ApiResponse<{ stats: InvoiceStats }>>('/invoices/stats');
      return response.data.data!.stats;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
