import React from 'react';
import Link from 'next/link';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickLinkProps {
  title: string;
  href: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function QuickLink({
  title,
  href,
  icon: Icon,
  iconColor = 'text-purple-600',
}: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
    >
      <div className={cn('flex items-center justify-center', iconColor)}>
        <Icon className="w-5 h-5" />
      </div>

      <span className="flex-1 font-medium text-gray-900">{title}</span>

      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </Link>
  );
}
