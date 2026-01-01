'use client';

import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import { CheckCircle } from 'lucide-react';

export default function VerifyEmailSentPage() {
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
          <h2 className="text-4xl font-bold text-purple-600 mb-4">Email sent!</h2>
          <p className="text-gray-700 text-base">
            A email has been sent to your email@domain.com. Please check and
            <br />
            verify your email!
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
