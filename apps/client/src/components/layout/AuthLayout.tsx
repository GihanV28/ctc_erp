'use client';

import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      {/* Left Side - Black with Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-center items-center relative">
        {/* CCT Logo */}
        <div className="flex items-center gap-6">
          {/* Logo Mark */}
          <div className="relative">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" className="relative z-10">
              {/* Purple "CCT" letters styled as container shape */}
              <g>
                {/* Left C */}
                <path d="M 15 35 L 15 95 L 30 95 L 30 80 L 45 80 L 45 95 L 60 95 L 60 60 L 45 60 L 45 35 Z" fill="#9333ea"/>
                <rect x="28" y="35" width="20" height="15" fill="white"/>
                <rect x="28" y="80" width="20" height="15" fill="white"/>
                
                {/* Middle C */}
                <path d="M 55 35 L 55 95 L 70 95 L 70 80 L 85 80 L 85 95 L 100 95 L 100 60 L 85 60 L 85 35 Z" fill="#9333ea"/>
                <rect x="68" y="35" width="20" height="15" fill="white"/>
                <rect x="68" y="80" width="20" height="15" fill="white"/>
                
                {/* Right C */}
                <path d="M 95 35 L 95 95 L 110 95 L 110 80 L 125 80 L 125 95 L 140 95 L 140 60 L 125 60 L 125 35 Z" fill="#9333ea"/>
                <rect x="108" y="35" width="20" height="15" fill="white"/>
                <rect x="108" y="80" width="20" height="15" fill="white"/>
              </g>
            </svg>
            
            {/* Orange Box Accent */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-orange-500 rounded"></div>
            </div>
          </div>

          {/* Text */}
          <div className="text-left">
            <h1 className="text-white font-bold text-4xl leading-tight tracking-wide">
              Ceylon<br/>
              Cargo<br/>
              Transport
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side - White Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
