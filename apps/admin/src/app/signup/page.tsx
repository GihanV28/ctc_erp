'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { SignUpFormData } from '@/types';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.mobile && !/^\+?[\d\s\-()]+$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to email verification page
      router.push('/verify-email');
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h2>
          <p className="text-gray-600">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              leftIcon={<User className="h-5 w-5" />}
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              leftIcon={<User className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail className="h-5 w-5" />}
              autoComplete="email"
            />

            <Input
              label="Mobile (Optional)"
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
              leftIcon={<Phone className="h-5 w-5" />}
              autoComplete="tel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={<Lock className="h-5 w-5" />}
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              leftIcon={<Lock className="h-5 w-5" />}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Sign up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
