'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useProfilePhoto } from '@/context/ProfilePhotoContext';
import { profileApi } from '@/lib/profile';

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

              {/* User Profile Display */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  {userName}
                </span>
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                    {getInitials()}
                  </div>
                )}
              </div>
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
