import api, { getErrorMessage } from './api';

export interface ProfileData {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    userType: 'admin' | 'client';
    role: any;
    status: string;
  };
  client?: {
    _id: string;
    companyName: string;
    contactPerson: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      jobTitle?: string;
    };
    email?: string;
    phone?: string;
    website?: string;
    taxId?: string;
    industry?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      sameAsAddress?: boolean;
    };
    paymentTerms?: number;
    creditLimit?: number;
    preferredCurrency?: string;
    notes?: string;
    tags?: string[];
    source?: string;
  };
}

export interface UpdateProfileData {
  // User fields
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  preferredLanguage?: string;

  // Client fields
  companyName?: string;
  jobTitle?: string;
  companyEmail?: string;
  companyPhone?: string;
  industry?: string;
  website?: string;
  taxId?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  creditLimit?: number;
  specialInstructions?: string;
  sameAsBilling?: boolean;
}

// Profile API
export const profileApi = {
  // Get current user's profile
  getProfile: async (): Promise<ProfileData> => {
    try {
      const response = await api.get<{ success: boolean; data: ProfileData }>('/profile');
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update current user's profile
  updateProfile: async (data: UpdateProfileData): Promise<ProfileData> => {
    try {
      const response = await api.put<{ success: boolean; data: ProfileData }>('/profile', data);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
