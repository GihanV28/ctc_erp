'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorClasses = [
  'bg-purple-500 text-white',
  'bg-blue-500 text-white',
  'bg-green-500 text-white',
  'bg-orange-500 text-white',
  'bg-pink-500 text-white',
  'bg-indigo-500 text-white',
  'bg-teal-500 text-white',
  'bg-red-500 text-white',
];

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className }) => {
  // Extract initials from name
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate consistent color based on name
  const getColorClass = (fullName: string): string => {
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorClasses[Math.abs(hash) % colorClasses.length];
  };

  const initials = getInitials(name);
  const colorClass = getColorClass(name);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
