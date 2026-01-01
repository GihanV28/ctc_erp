'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui';
import { CheckCircle2, Smartphone } from 'lucide-react';

export default function VerifyMobilePage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or first empty input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to success page
      router.push('/verify-mobile/success');
    }, 1500);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    // Show toast or message that OTP has been resent
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-purple-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Smartphone className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-purple-600 mb-4">OTP sent!</h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          A OTP has been sent to your mobile number. Please check and enter your OTP here!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!isComplete}
            className="w-full"
          >
            Verify OTP
          </Button>

          <button
            type="button"
            onClick={handleResend}
            className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Didn't receive the OTP? Resend
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
