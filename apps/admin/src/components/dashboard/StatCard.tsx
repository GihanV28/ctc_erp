import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'purple' | 'success' | 'warning' | 'info';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: 'bg-white border-gray-200',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-600',
    success: 'bg-white border-gray-200',
    warning: 'bg-white border-gray-200',
    info: 'bg-white border-gray-200',
  };

  const iconVariants = {
    default: 'bg-gray-100 text-gray-600',
    purple: 'bg-white/20 text-white',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-orange-100 text-orange-600',
    info: 'bg-blue-100 text-blue-600',
  };

  const subtitleColors = {
    default: 'text-gray-600',
    purple: 'text-purple-100',
    success: 'text-green-600',
    warning: 'text-orange-600',
    info: 'text-blue-600',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium mb-2',
              variant === 'purple' ? 'text-purple-100' : 'text-gray-600'
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          {subtitle && (
            <p className={cn('text-sm', subtitleColors[variant])}>
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={cn('p-3 rounded-lg', iconVariants[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {variant === 'purple' && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <text
              x="50"
              y="50"
              fontSize="80"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
            >
              $
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default StatCard;
