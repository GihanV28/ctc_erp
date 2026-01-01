'use client';

import React from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui';
import { CheckCircle2, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-purple-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Mail className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-purple-600 mb-4">Email sent!</h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          A email has been sent to your{' '}
          <span className="font-medium text-gray-900">email@domain.com</span>.
          Please check and verify your email!
        </p>

        <div className="space-y-3">
          <Link href="/verify-email/success">
            <Button variant="primary" size="lg" className="w-full">
              I've verified my email
            </Button>
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Didn't receive the email? Resend
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
