import api, { ApiResponse, PaginatedResponse, getErrorMessage } from '@/lib/api';
import type { Expense, Income } from '@/components/financials/types';

export interface ExpenseCategory {
  _id: string;
  value: string;
  label: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
}

export interface IncomeSource {
  _id: string;
  value: string;
  label: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
}

export interface CreateExpenseData {
  category: string;
  description: string;
  amount: number;
  currency?: string;
  date: string;
  shipmentId?: string;
  containerId?: string;
  supplierId?: string;
  paymentMethod: string;
  invoiceNumber?: string;
  status: 'pending' | 'paid' | 'overdue';
  notes?: string;
}

export interface CreateIncomeData {
  source: string;
  description: string;
  amount: number;
  currency?: string;
  date: string;
  shipmentId?: string;
  clientId?: string;
  invoiceId?: string;
  paymentMethod: string;
  status: 'pending' | 'received' | 'partially_paid';
  amountReceived?: number;
  dueDate?: string;
  notes?: string;
}

export interface FinancialStats {
  total: {
    totalExpenses?: number;
    totalIncome?: number;
    totalReceived?: number;
    count: number;
    avgExpense?: number;
    avgIncome?: number;
  };
  byCategory?: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  bySource?: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  byStatus: Array<{
    _id: string;
    total: number;
    totalReceived?: number;
    count: number;
  }>;
  outstandingReceivables?: {
    totalOutstanding: number;
    count: number;
  };
}

export const financialService = {
  // ===== EXPENSES =====

  // Get all expenses
  getAllExpenses: async (params?: {
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Expense>> => {
    try {
      const response = await api.get<PaginatedResponse<Expense>>('/expenses', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get single expense
  getExpenseById: async (id: string): Promise<Expense> => {
    try {
      const response = await api.get<ApiResponse<{ expense: Expense }>>(`/expenses/${id}`);
      return response.data.data!.expense;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create expense
  createExpense: async (data: CreateExpenseData): Promise<Expense> => {
    try {
      const response = await api.post<ApiResponse<{ expense: Expense }>>('/expenses', data);
      return response.data.data!.expense;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update expense
  updateExpense: async (id: string, data: Partial<CreateExpenseData>): Promise<Expense> => {
    try {
      const response = await api.put<ApiResponse<{ expense: Expense }>>(`/expenses/${id}`, data);
      return response.data.data!.expense;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    try {
      await api.delete(`/expenses/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get expense statistics
  getExpenseStats: async (params?: { startDate?: string; endDate?: string }): Promise<FinancialStats> => {
    try {
      const response = await api.get<ApiResponse<{ stats: FinancialStats }>>('/expenses/stats', { params });
      return response.data.data!.stats;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ===== EXPENSE CATEGORIES =====

  // Get all expense categories
  getExpenseCategories: async (): Promise<ExpenseCategory[]> => {
    try {
      const response = await api.get<ApiResponse<{ categories: ExpenseCategory[] }>>('/expenses/categories');
      return response.data.data!.categories;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create expense category
  createExpenseCategory: async (label: string, description?: string): Promise<ExpenseCategory> => {
    try {
      const response = await api.post<ApiResponse<{ category: ExpenseCategory }>>('/expenses/categories', {
        label,
        description,
      });
      return response.data.data!.category;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete expense category
  deleteExpenseCategory: async (id: string): Promise<void> => {
    try {
      await api.delete(`/expenses/categories/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ===== INCOME =====

  // Get all income
  getAllIncome: async (params?: {
    source?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Income>> => {
    try {
      const response = await api.get<PaginatedResponse<Income>>('/income', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get single income
  getIncomeById: async (id: string): Promise<Income> => {
    try {
      const response = await api.get<ApiResponse<{ income: Income }>>(`/income/${id}`);
      return response.data.data!.income;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create income
  createIncome: async (data: CreateIncomeData): Promise<Income> => {
    try {
      const response = await api.post<ApiResponse<{ income: Income }>>('/income', data);
      return response.data.data!.income;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update income
  updateIncome: async (id: string, data: Partial<CreateIncomeData>): Promise<Income> => {
    try {
      const response = await api.put<ApiResponse<{ income: Income }>>(`/income/${id}`, data);
      return response.data.data!.income;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete income
  deleteIncome: async (id: string): Promise<void> => {
    try {
      await api.delete(`/income/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Record payment
  recordPayment: async (id: string, amountReceived: number): Promise<Income> => {
    try {
      const response = await api.post<ApiResponse<{ income: Income }>>(`/income/${id}/payment`, {
        amountReceived,
      });
      return response.data.data!.income;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get income statistics
  getIncomeStats: async (params?: { startDate?: string; endDate?: string }): Promise<FinancialStats> => {
    try {
      const response = await api.get<ApiResponse<{ stats: FinancialStats }>>('/income/stats', { params });
      return response.data.data!.stats;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ===== INCOME SOURCES =====

  // Get all income sources
  getIncomeSources: async (): Promise<IncomeSource[]> => {
    try {
      const response = await api.get<ApiResponse<{ sources: IncomeSource[] }>>('/income/sources');
      return response.data.data!.sources;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create income source
  createIncomeSource: async (label: string, description?: string): Promise<IncomeSource> => {
    try {
      const response = await api.post<ApiResponse<{ source: IncomeSource }>>('/income/sources', {
        label,
        description,
      });
      return response.data.data!.source;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete income source
  deleteIncomeSource: async (id: string): Promise<void> => {
    try {
      await api.delete(`/income/sources/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
