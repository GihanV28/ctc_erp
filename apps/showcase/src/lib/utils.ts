import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ContactFormData } from '../types';

// Class name merger for Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Smooth scroll to section
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // Height of navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
  }
  return phone;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Handle form submission - sends to backend API
export const submitContactForm = async (data: Partial<ContactFormData> & { name: string; email: string; message: string }): Promise<{ success: boolean; message: string }> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cct.ceylongrp.com';

  try {
    const response = await fetch(`${apiUrl}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.service ? `Inquiry about ${data.service}` : 'General Inquiry',
        category: data.service || 'general',
        message: `${data.message}${data.company ? `\n\nCompany: ${data.company}` : ''}${data.phone ? `\nPhone: ${data.phone}` : ''}`,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: result.message || 'Thank you for contacting us! We will get back to you within 24 hours.'
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to send message. Please try again.'
      };
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again later.'
    };
  }
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if element is in viewport
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Generate tracking URL
export const generateTrackingUrl = (trackingId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'https://client.cct.ceylongrp.com';
  return `${baseUrl}/track?id=${encodeURIComponent(trackingId)}`;
};
