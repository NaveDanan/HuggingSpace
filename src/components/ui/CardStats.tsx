import React from 'react';
import { Heart, GitFork, Eye } from 'lucide-react';

interface CardStatsProps {
  likes: number;
  forks: number;
  views: number;
}

export function CardStats({ likes, forks, views }: CardStatsProps) {
  return (
    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
      <span className="flex items-center gap-1">
        <Heart className="w-4 h-4" />
        {likes}
      </span>
      <span className="flex items-center gap-1">
        <GitFork className="w-4 h-4" />
        {forks}
      </span>
      <span className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        {views}
      </span>
    </div>
  );
}