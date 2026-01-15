'use client';

import React from 'react';
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

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Check if user is super admin
  const isSuperAdmin = user?.role?.name === 'super_admin';

  // Helper function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    // Super admins have all permissions
    if (isSuperAdmin) return true;
    return user.role.permissions?.includes(permission) || false;
  };

  // Filter nav items based on user role and permissions
  // Only filter after loading is complete to prevent flickering
  const visibleNavItems = navItems.filter(item => {
    // Super admin only items
    if (item.superAdminOnly) {
      return loading || isSuperAdmin;
    }

    // Permission-based items
    if (item.requiredPermission) {
      return loading || isSuperAdmin || hasPermission(item.requiredPermission);
    }

    // Default: show item
    return true;
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 flex flex-col z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center justify-center">
          <img
            src="/images/logo/logo.png"
            alt="Ceylon Cargo Transport"
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
