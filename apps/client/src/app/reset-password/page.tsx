'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/reset-password/success');
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Enter the new Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              New password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder=""
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder=""
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full rounded-full py-3"
            >
              Reset password
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
