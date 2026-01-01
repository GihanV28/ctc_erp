import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = 'gray', size = 'md', dot = false, children, ...props },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variants = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const dotColors = {
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[variant])} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
