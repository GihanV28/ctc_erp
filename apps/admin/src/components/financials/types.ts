export interface Expense {
  _id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  date: string;
  shipmentId?: string;
  containerId?: string;
  supplierId?: string;
  paymentMethod: string;
  invoiceNumber?: string;
  status: 'pending' | 'paid' | 'overdue';
  attachments?: string[];
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'fuel'
  | 'port_fees'
  | 'customs_duties'
  | 'handling_charges'
  | 'container_maintenance'
  | 'insurance'
  | 'staff_salaries'
  | 'office_expenses'
  | 'vehicle_maintenance'
  | 'marketing'
  | 'technology'
  | 'other';

export interface Income {
  _id: string;
  source: IncomeSource;
  description: string;
  amount: number;
  currency: string;
  date: string;
  shipmentId?: string;
  clientId?: string;
  invoiceId?: string;
  paymentMethod: string;
  status: 'pending' | 'received' | 'partially_paid';
  amountReceived?: number;
  dueDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type IncomeSource =
  | 'freight_charges'
  | 'handling_fees'
  | 'storage_fees'
  | 'documentation_fees'
  | 'insurance_charges'
  | 'late_payment_fees'
  | 'other_services'
  | 'other';

export interface ExpenseFormData {
  category: ExpenseCategory | '';
  description: string;
  amount: string;
  currency: string;
  date: string;
  shipmentId: string;
  containerId: string;
  supplierId: string;
  paymentMethod: string;
  invoiceNumber: string;
  status: 'pending' | 'paid' | 'overdue';
  attachments: File[];
  notes: string;
}

export interface IncomeFormData {
  source: IncomeSource | '';
  description: string;
  amount: string;
  currency: string;
  date: string;
  shipmentId: string;
  clientId: string;
  invoiceId: string;
  paymentMethod: string;
  status: 'pending' | 'received' | 'partially_paid';
  amountReceived: string;
  dueDate: string;
  notes: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
  averageRevenuePerShipment: number;
  operatingExpenses: number;
  outstandingReceivables: number;
  outstandingPayables: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
