import React from 'react';
import { Star, GitFork, Eye } from 'lucide-react';
import { UserAvatar } from '../UserAvatar';
import type { Model } from '../../types/models';

interface ModelRepositoryHeaderProps {
  model: Model;
}

export function ModelRepositoryHeader({ model }: ModelRepositoryHeaderProps) {
  return (
    <div className="border-b bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar size="md" username={model.author} />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">{model.author} /</span>
              {model.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 
                           dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded 
                           hover:bg-gray-200 dark:hover:bg-gray-600">
              <Star className="w-3 h-3" />
              <span>{model.likes}</span>
            </button>

            <button className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 
                           dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded 
                           hover:bg-gray-200 dark:hover:bg-gray-600">
              <GitFork className="w-3 h-3" />
              <span>{model.forks}</span>
            </button>

            <div className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 
                        dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              <Eye className="w-3 h-3" />
              <span>{model.downloads}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}