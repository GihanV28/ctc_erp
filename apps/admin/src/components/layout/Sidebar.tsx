'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PackageSearch,
  Box,
  Users,
  Truck,
  FileText,
  Settings,
  LogOut,
  Shield,
  MapPin,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  superAdminOnly?: boolean;
  requiredPermission?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Team Management',
    href: '/dashboard/team',
    icon: <Shield className="h-5 w-5" />,
    superAdminOnly: true,
  },
  {
    label: 'Tracking Update',
    href: '/dashboard/tracking',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    label: 'Shipments',
    href: '/dashboard/shipments',
    icon: <PackageSearch className="h-5 w-5" />,
  },
  {
    label: 'Containers',
    href: '/dashboard/containers',
    icon: <Box className="h-5 w-5" />,
  },
  {
    label: 'Clients',
    href: '/dashboard/clients',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Suppliers',
    href: '/dashboard/suppliers',
    icon: <Truck className="h-5 w-5" />,
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: <FileText className="h-5 w-5" />,
    requiredPermission: 'reports:read',
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
    superAdminOnly: true,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onToggle }) => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user is super admin
  const isSuperAdmin = user?.role?.name === 'super_admin';

  // Helper function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    if (isSuperAdmin) return true;
    return user.role.permissions?.includes(permission) || false;
  };

  // Filter nav items based on user role and permissions
  const visibleNavItems = navItems.filter(item => {
    if (item.superAdminOnly) {
      return loading || isSuperAdmin;
    }
    if (item.requiredPermission) {
      return loading || isSuperAdmin || hasPermission(item.requiredPermission);
    }
    return true;
  });

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onToggle) onToggle();
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed at top left */}
      <button
        onClick={handleMobileMenuToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-gray-900 flex flex-col z-40 transition-transform duration-300 ease-in-out',
          // Desktop: always visible
          'lg:translate-x-0 lg:w-64',
          // Mobile/Tablet: slide in/out
          'w-72 sm:w-80',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center justify-center" onClick={handleLinkClick}>
            <img
              src="/images/logo/logo.png"
              alt="Ceylon Cargo Transport"
              className="h-10 sm:h-12 w-auto"
            />
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                {item.icon}
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t border-gray-800 flex-shrink-0">
          <Link
            href="/login"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm sm:text-base">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
