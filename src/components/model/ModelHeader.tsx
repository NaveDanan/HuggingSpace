import React from 'react';
import { Star, Share2, GitFork, Flag } from 'lucide-react';
import { UserAvatar } from '../UserAvatar';

interface ModelHeaderProps {
  title: string;
  author: {
    username: string;
    displayName: string | null;
  };
  stats: {
    stars: number;
    forks: number;
  };
}

export function ModelHeader({ title, author, stats }: ModelHeaderProps) {
  return (
    <div className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-gray-600">{author.username} /</span>
              {title}
            </h1>
            <p className="text-gray-600">
              by {author.displayName || author.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 
                         text-white rounded-lg hover:bg-green-700">
            <Star className="w-4 h-4" />
            Star
            <span className="ml-1 px-2 py-0.5 bg-green-700 rounded-lg">
              {stats.stars}
            </span>
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 
                         text-gray-700 rounded-lg hover:bg-gray-200">
            <GitFork className="w-4 h-4" />
            Fork
            <span className="ml-1 px-2 py-0.5 bg-gray-200 rounded-lg">
              {stats.forks}
            </span>
          </button>

          <div className="flex-1" />

          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Share2 className="w-5 h-5" />
          </button>

          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}