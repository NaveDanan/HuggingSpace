import React from 'react';
import { ModelReadme } from './ModelReadme';
import { ModelFiles } from './ModelFiles';
import { ModelCommunity } from './ModelCommunity';
import { ModelSettings } from './ModelSettings';
import type { Model } from '../../types/models';

interface ModelRepositoryContentProps {
  model: Model;
  activeTab: string;
}

export function ModelRepositoryContent({ model, activeTab }: ModelRepositoryContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {activeTab === 'readme' && <ModelReadme model={model} />}
        {activeTab === 'code' && <ModelFiles model={model} />}
        {activeTab === 'community' && <ModelCommunity model={model} />}
        {activeTab === 'settings' && model.is_owner && <ModelSettings model={model} />}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <p className="text-gray-600 dark:text-gray-400">{model.description}</p>
          
          <div className="mt-4 space-y-2">
            {model.tags.map(tag => (
              <span key={tag} className="inline-block px-2 py-1 mr-2 text-sm 
                                     bg-gray-100 dark:bg-gray-700 
                                     text-gray-700 dark:text-gray-300 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}