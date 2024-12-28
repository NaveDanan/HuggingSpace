import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../lib/utils';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  username?: string;
  src?: string;
}

export function UserAvatar({ size = 'sm', username, src }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-24 h-24'
  };

  if (!src) {
    return (
      <div className={cn(
        sizeClasses[size],
        "rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
      )}>
        <User className={cn(
          "text-gray-500 dark:text-gray-400",
          size === 'xl' ? 'w-12 h-12' : 'w-1/2 h-1/2'
        )} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={username || 'User avatar'}
      className={cn(sizeClasses[size], "rounded-full object-cover")}
    />
  );
}