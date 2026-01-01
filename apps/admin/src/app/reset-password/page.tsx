'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { Lock } from 'lucide-react';
import { ResetPasswordFormData } from '@/types';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof ResetPasswordFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
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
      // Redirect to success page
      router.push('/reset-password/success');
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Enter the new Password
          </h2>
          <p className="text-gray-600">
            Create a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="New password"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            leftIcon={<Lock className="h-5 w-5" />}
            autoComplete="new-password"
          />

          <Input
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<Lock className="h-5 w-5" />}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Reset password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
