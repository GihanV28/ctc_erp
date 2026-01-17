'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Title section - with left padding on mobile for hamburger menu */}
        <div className="pl-12 lg:pl-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-0.5 sm:mt-1 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
              {subtitle}
            </p>
          )}
        </div>

        {/* User Info */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            {/* Hide name on mobile, show on sm+ */}
            <div className="text-right hidden sm:block">
              <span className="text-sm font-medium text-gray-700 block">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </span>
              <span className="text-xs text-gray-500">
                {user?.role?.name || 'Admin'}
              </span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-semibold shadow-md overflow-hidden text-sm sm:text-base">
              {user?.profilePhoto ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.profilePhoto}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* Show user name in dropdown on mobile */}
              <div className="sm:hidden px-4 py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 block">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.role?.name || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
