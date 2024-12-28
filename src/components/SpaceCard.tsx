import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { CardMenu } from './ui/CardMenu';
import type { Space, SpaceType } from '../types/spaces';
import { CardStats } from './ui/CardStats';
import { CardThumbnail } from './ui/CardThumbnail';

interface SpaceCardProps extends Space {
  className?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  type?: SpaceType;
  isOwner?: boolean;
}

export function SpaceCard({
  title,
  description,
  author,
  thumbnail,
  likes,
  forks,
  views,
  tags,
  is_private,
  type = 'space',
  is_owner,
  onEdit,
  onDelete,
  className,
}: SpaceCardProps) {  
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="relative">
        <CardThumbnail type={type} thumbnail={thumbnail} />
        
        {is_private && (
          <div className="absolute top-2 left-2 bg-gray-900/75 text-white px-2 py-1 rounded-md flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span className="text-xs">Private</span>
          </div>
        )}
        
        {is_owner && (
          <div className="absolute top-2 right-2">
            <CardMenu onEdit={onEdit} onDelete={onDelete} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {author}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <CardStats likes={likes} forks={forks} views={views} />
        </div>
      </div>
    </div>
  );
}