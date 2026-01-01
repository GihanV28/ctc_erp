'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
