'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, User, Phone, Building, MapPin, AlertCircle } from 'lucide-react';
import api, { getErrorMessage } from '@/lib/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  city: string;
  country: string;
  street: string;
  state: string;
  postalCode: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    city: '',
    country: '',
    street: '',
    state: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'submit', string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await api.post('/auth/register-client', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        companyName: formData.companyName || `${formData.firstName} ${formData.lastName}`,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      });

      // Registration successful
      router.push('/login?registered=true');
    } catch (error: any) {
      setErrors({
        submit: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join Ceylon Cargo Transport today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name *"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                leftIcon={<User className="h-5 w-5" />}
              />
              <Input
                label="Last Name *"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                leftIcon={<User className="h-5 w-5" />}
              />
            </div>

            <Input
              label="Email *"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail className="h-5 w-5" />}
            />

            <Input
              label="Phone Number *"
              type="tel"
              name="phone"
              placeholder="+94 71 234 5678"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              leftIcon={<Phone className="h-5 w-5" />}
            />
          </div>

          {/* Company Information (Optional) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Company Information (Optional)
            </h3>

            <Input
              label="Company Name"
              name="companyName"
              placeholder="Leave empty if individual"
              value={formData.companyName}
              onChange={handleChange}
              leftIcon={<Building className="h-5 w-5" />}
              helperText="Optional - leave blank if you're registering as an individual"
            />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Address
            </h3>

            <Input
              label="Street Address"
              name="street"
              placeholder="123 Main Street"
              value={formData.street}
              onChange={handleChange}
              leftIcon={<MapPin className="h-5 w-5" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City *"
                name="city"
                placeholder="Colombo"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
              />
              <Input
                label="State/Province"
                name="state"
                placeholder="Western Province"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                name="postalCode"
                placeholder="00100"
                value={formData.postalCode}
                onChange={handleChange}
              />
              <Input
                label="Country *"
                name="country"
                placeholder="Sri Lanka"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Security
            </h3>

            <Input
              label="Password *"
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={<Lock className="h-5 w-5" />}
            />
            <Input
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              leftIcon={<Lock className="h-5 w-5" />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
