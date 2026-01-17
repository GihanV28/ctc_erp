'use client';

import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile - Full dark background */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden flex flex-col">
        {/* Decorative elements */}
        <div className="absolute top-10 left-5 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-5 w-52 h-52 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>

        {/* Logo at top */}
        <div className="relative z-10 flex items-center justify-center pt-10 pb-32 sm:pt-12 sm:pb-8">
          <img
            src="/images/logo/logo.png"
            alt="Ceylon Cargo Transport"
            className="h-14 sm:h-16 w-auto"
          />
        </div>

        {/* Form card - centered */}
        <div className="relative z-10 flex-1 flex items-start sm:items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      {/* Desktop Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

        {/* Logo and branding */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/images/logo/logo.png"
              alt="Ceylon Cargo Transport"
              className="h-24 w-auto"
            />
          </div>

          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Your trusted partner in global logistics and cargo management solutions
          </p>
        </div>
      </div>

      {/* Desktop Right Side - Form (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
