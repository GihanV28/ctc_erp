import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const baseStyles = 'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed';

    const statusStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : isFocused
      ? 'border-purple-500 focus:ring-purple-200'
      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200';

    const paddingStyles = cn(
      leftIcon && 'pl-11',
      (rightIcon || type === 'password') && 'pr-11'
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={cn(baseStyles, statusStyles, paddingStyles, className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {type === 'password' ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
