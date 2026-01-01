import React from 'react';
import { cn } from '../../lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full'
    };

    return (
      <div
        ref={ref}
        className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'white' | 'gray' | 'purple' | 'gradient';
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, background = 'white', paddingY = 'lg', children, ...props }, ref) => {
    const backgroundClasses = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      purple: 'bg-violet-600',
      gradient: 'bg-gradient-to-br from-violet-600 to-purple-700'
    };

    const paddingClasses = {
      sm: 'py-12',
      md: 'py-16',
      lg: 'py-20',
      xl: 'py-24'
    };

    return (
      <section
        ref={ref}
        className={cn(backgroundClasses[background], paddingClasses[paddingY], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
