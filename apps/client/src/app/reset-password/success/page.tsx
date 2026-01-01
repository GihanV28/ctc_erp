'use client';

import React from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function ResetPasswordSuccessPage() {
  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 flex items-center justify-center">
              <CheckCircle className="w-24 h-24 text-purple-600" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-purple-600 mb-4">Success!</h2>
          <p className="text-gray-700 text-base mb-8">
            Your password has been reset successfully!
            <br />
            Please login again!
          </p>

          <Link href="/login">
            <Button variant="primary" className="rounded-full px-12 py-3">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
