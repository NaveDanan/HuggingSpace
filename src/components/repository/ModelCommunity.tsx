import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import type { Model } from '../../types/models';

interface ModelCommunityProps {
  model: Model;
}

export function ModelCommunity({ model }: ModelCommunityProps) {
  return (
    <div className="space-y-6">
      {/* Discussions Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Discussions
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            New Discussion
          </button>
        </div>

        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No discussions yet. Start a new discussion!
        </div>
      </div>

      {/* Contributors Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Users className="w-5 h-5" />
          Contributors
        </h2>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div>
            <p className="font-medium">{model.author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
          </div>
        </div>
      </div>
    </div>
  );
}