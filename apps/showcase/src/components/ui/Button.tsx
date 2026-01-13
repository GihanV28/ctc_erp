import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800',
      secondary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700',
      outline: 'border-2 border-violet-600 text-violet-600 hover:bg-violet-50 active:bg-violet-100',
      ghost: 'text-violet-600 hover:bg-violet-50 active:bg-violet-100'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
      md: 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
      lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
      xl: 'px-8 py-4 text-lg sm:px-10 sm:py-5 sm:text-xl'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
