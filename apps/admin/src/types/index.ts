/**
 * Type definitions for Ceylon Cargo Transport Admin Panel
 */

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Shipment Types
export type ShipmentStatus = 'pending' | 'in_transit' | 'completed' | 'delayed';

export interface Shipment {
  id: string;
  clientId: string;
  client: Client;
  origin: string;
  destination: string;
  departureDate: Date;
  arrivalDate: Date;
  containerId: string;
  container: Container;
  cargoType: string;
  weight: number;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt?: Date;
}

// Container Types
export type ContainerType =
  | '20ft_standard'
  | '20ft_high_cube'
  | '40ft_standard'
  | '40ft_high_cube'
  | '40ft_refrigerated';

export type ContainerStatus = 'available' | 'in_use' | 'maintenance';

export type ContainerCondition = 'excellent' | 'good' | 'fair' | 'under_repair';

export interface Container {
  id: string;
  type: ContainerType;
  status: ContainerStatus;
  location: string;
  shipmentId?: string;
  capacity: number;
  maxWeight: number;
  currentWeight: number;
  condition: ContainerCondition;
  createdAt: Date;
  updatedAt?: Date;
}

// Client Types
export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  shipmentsCount: number;
  revenue: number;
  rating: number;
  status: ClientStatus;
  createdAt: Date;
  updatedAt?: Date;
}

// Supplier Types
export type SupplierStatus = 'active' | 'inactive' | 'pending';

export type ServiceType =
  | 'ocean_freight'
  | 'air_sea'
  | 'container'
  | 'port_ops'
  | 'warehouse'
  | 'customs'
  | 'ground'
  | 'express';

export interface Supplier {
  id: string;
  name: string;
  tradingName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  serviceType: ServiceType;
  shipmentsCount: number;
  activeContracts: number;
  rating: number;
  status: SupplierStatus;
  performance?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SupplierContract {
  id: string;
  contractId: string;
  value: number;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'expired' | 'terminated';
}

export interface BankDetails {
  bankName: string;
  swiftCode: string;
  accountName: string;
  accountNumber: string;
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  activeShipments: number;
  totalClients: number;
  containersInUse: number;
  completedShipments: number;
  availableContainers: number;
  pendingActions: number;
}

export interface RecentActivity {
  id: string;
  type: 'shipment' | 'container' | 'client' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
}

// Report Types
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'powerpoint';

export type ReportType =
  | 'shipment'
  | 'financial'
  | 'client_performance'
  | 'container_utilization'
  | 'performance_analytics'
  | 'supplier_performance';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  supportedFormats: ReportFormat[];
  lastGenerated?: Date;
  generatedBy?: string;
  size?: string;
  format?: ReportFormat;
}

export interface RecentReport {
  id: string;
  name: string;
  type: ReportType;
  generatedBy: string;
  date: Date;
  size: string;
  format: ReportFormat;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface OTPFormData {
  otp: string;
}
