import React from 'react';
import { Star, GitFork, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RepositoryHeaderProps {
  title: string;
  author: {
    username: string;
    displayName: string | null;
  };
  stats: {
    stars: number;
    forks: number;
    watchers: number;
  };
  buttons: Array<{
    icon: React.ElementType;
    label: string;
    count: number;
  }>;
}

export function RepositoryHeader({ 
  title, 
  author, 
  stats, 
  buttons = [
    { icon: Star, label: 'Star', count: stats.stars },
    { icon: GitFork, label: 'Fork', count: stats.forks },
    { icon: Eye, label: 'Watch', count: stats.watchers },
  ]
}: RepositoryHeaderProps) {

  return (
    <div className="border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">{author.username} /</span>
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {buttons.map(({ icon: Icon, label, count }) => (
              <button
                key={label}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md",
                  "border border-gray-300 dark:border-gray-600",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}