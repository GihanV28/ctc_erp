import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-violet-100 text-violet-700 border-violet-200',
      secondary: 'bg-orange-100 text-orange-700 border-orange-200',
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-amber-100 text-amber-700 border-amber-200',
      info: 'bg-blue-100 text-blue-700 border-blue-200'
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium border',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
