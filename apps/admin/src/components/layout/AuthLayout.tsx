'use client';

import React from 'react';
import { Package } from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

        {/* Logo and branding */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
              <Package className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-5xl font-bold tracking-tight">
                <span className="text-white">C</span>
                <span className="text-purple-400">C</span>
                <span className="text-orange-400">T</span>
              </div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Ceylon Cargo
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">
              Transport
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Your trusted partner in global logistics and cargo management solutions
          </p>

          {/* Stats or features */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">1K+</div>
              <div className="text-sm text-gray-400">Shipments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99%</div>
              <div className="text-sm text-gray-400">On-Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-2xl font-bold">
              <span className="text-gray-900">C</span>
              <span className="text-purple-600">C</span>
              <span className="text-orange-500">T</span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
