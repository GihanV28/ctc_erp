'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      // Redirect is handled by AuthContext
    } catch (error: any) {
      setApiError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
          <p className="text-gray-600">
            Welcome back! Please enter your credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
          )}

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
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<Lock className="h-5 w-5" />}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                Remember me?
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Forgot Password
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
