'use client';

import React from 'react';
import Sidebar from './Sidebar';

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export default function PortalLayout({
  children,
  title,
  subtitle,
  headerAction,
}: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 flex flex-col min-h-screen">
        {/* Header */}
        {(title || headerAction) && (
          <header className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
              {headerAction && <div>{headerAction}</div>}
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
