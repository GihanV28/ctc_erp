'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Package,
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
  DollarSign,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
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
  },
  {
    label: 'Tracking Update',
    href: '/dashboard/tracking',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    label: 'Financials',
    href: '/dashboard/financials',
    icon: <DollarSign className="h-5 w-5" />,
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
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
            <Package className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              Ceylon
            </h1>
            <h2 className="text-white font-bold text-lg leading-tight">
              Cargo Transport
            </h2>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
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
      <div className="p-4 border-t border-gray-800">
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
