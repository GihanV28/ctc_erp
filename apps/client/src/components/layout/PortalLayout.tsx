'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useProfilePhoto } from '@/context/ProfilePhotoContext';
import { profileApi } from '@/lib/profile';
import { Menu } from 'lucide-react';

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
  const { user } = useAuth();
  const { profilePhoto, userName, setUserName } = useProfilePhoto();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await profileApi.getProfile();
        const fullName = `${data.user.firstName} ${data.user.lastName}`;
        setUserName(fullName);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    // Only fetch if we don't have userName yet or user changed
    if (user && userName === 'User') {
      fetchUserData();
    }
  }, [user, userName, setUserName]);

  const getInitials = () => {
    const names = userName.split(' ');
    const first = names[0]?.charAt(0) || '';
    const last = names[1]?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        {(title || headerAction) && (
          <header className="bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between gap-4">
              {/* Hamburger Menu Button (Mobile Only) */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex-1 min-w-0">
                {title && (
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>

              {/* User Profile Display */}
              <div className="flex items-center gap-2 md:gap-3">
                <span className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-[120px] md:max-w-none">
                  {userName}
                </span>
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials()}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
