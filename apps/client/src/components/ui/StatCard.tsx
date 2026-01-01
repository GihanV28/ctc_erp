import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon?: LucideIcon;
  variant?: 'default' | 'purple';
  subtitleColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  subtitleColor = 'text-gray-600',
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 relative overflow-hidden',
        variant === 'purple'
          ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
          : 'bg-white border border-gray-200'
      )}
    >
      {/* Icon (for purple variant) */}
      {Icon && variant === 'purple' && (
        <div className="absolute right-4 top-4 opacity-20">
          <Icon className="w-20 h-20" strokeWidth={1.5} />
        </div>
      )}

      <div className="relative z-10">
        <p
          className={cn(
            'text-sm font-medium mb-2',
            variant === 'purple' ? 'text-purple-100' : 'text-gray-600'
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-4xl font-bold mb-2',
            variant === 'purple' ? 'text-white' : 'text-gray-900'
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            'text-sm font-medium',
            variant === 'purple' ? 'text-purple-100' : subtitleColor
          )}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
