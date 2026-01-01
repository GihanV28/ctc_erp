import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with proper formatting
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Generate random ID with prefix
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}${randomStr}`.toUpperCase();
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-amber-100 text-amber-800',
    in_transit: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    delayed: 'bg-red-100 text-red-800',
    available: 'bg-green-100 text-green-800',
    in_use: 'bg-purple-100 text-purple-800',
    maintenance: 'bg-orange-100 text-orange-800',
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    under_repair: 'bg-orange-100 text-orange-800',
  };

  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
