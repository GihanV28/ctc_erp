'use client';

import React from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui';
import { CheckCircle2 } from 'lucide-react';

export default function EmailVerificationSuccessPage() {
  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-purple-600 mb-4">Success!</h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Your email has been verified successfully! Welcome to Ceylon Cargo Transport!
        </p>

        <Link href="/dashboard">
          <Button variant="primary" size="lg" className="w-full">
            Go to Home
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
