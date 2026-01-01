'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { CheckCircle } from 'lucide-react';

export default function VerifyMobilePage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all filled
      if (newOtp.every(digit => digit) && index === 5) {
        setTimeout(() => {
          router.push('/verify-mobile/success');
        }, 500);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
          <h2 className="text-4xl font-bold text-purple-600 mb-4">OTP sent!</h2>
          <p className="text-gray-700 text-base mb-8">
            A OTP has been sent to your mobile number. Please check and enter
            <br />
            your OTP here!
          </p>

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
