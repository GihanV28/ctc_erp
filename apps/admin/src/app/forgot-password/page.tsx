'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { Mail, ArrowLeft } from 'lucide-react';
import { ForgotPasswordFormData } from '@/types';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof ForgotPasswordFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ForgotPasswordFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      // Redirect to email sent page
      router.push('/forgot-password/sent');
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            Enter your email address that you have used for the account and we'll send you an email with instructions to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={<Mail className="h-5 w-5" />}
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Send email
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
