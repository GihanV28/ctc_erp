'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/forgot-password/sent');
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Reset Password</h2>
          <p className="text-sm text-gray-600">
            Enter your email address that you have used for the account and we'll
            send you an email with instructions to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full rounded-full py-3"
          >
            Send email
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
