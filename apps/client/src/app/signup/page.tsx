'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
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
      router.push('/verify-email');
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder=""
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder=""
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mobile (Optional)
              </label>
              <input
                type="tel"
                name="mobile"
                placeholder=""
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirm password
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
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full rounded-full py-3"
            >
              Sign up
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-700"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
