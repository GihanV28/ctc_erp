'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Remove loading screen after fade animation
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  const currentYear = new Date().getFullYear();

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Main Logo - Center */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative w-48 h-48 md:w-64 md:h-64 animate-pulse">
          <Image
            src="/images/logo/logo.png"
            alt="Ceylon Cargo Transport"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Loading Animation */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Bottom Section - Powered By & Copyright */}
      <div className={`pb-0 flex flex-col items-center gap-3 ${montserrat.className}`}>
        {/* Powered By */}
        <p className="text-sm text-gray-400 font-medium tracking-wide">Powered by</p>
      </div>
      <div className={`pb-6 flex flex-col items-center gap-3 ${montserrat.className}`}>
        {/* The Canva Box Logo */}
        <div className="relative" style={{ marginTop: '-20px', width: '260px', height: '80px' }}>
          <Image
            src="/images/logo/tcb.png"
            alt="The Canva Box"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 mt-2">
          © {currentYear} Ceylon Cargo Transport. All rights reserved.
        </p>
      </div>
    </div>
  );
}
