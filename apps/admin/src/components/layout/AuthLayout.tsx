'use client';

import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
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

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img
              src="/images/logo/logo.png"
              alt="Ceylon Cargo Transport"
              className="h-14 w-auto"
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
