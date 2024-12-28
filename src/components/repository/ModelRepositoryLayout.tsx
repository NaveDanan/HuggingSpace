import React from 'react';
import { ModelRepositoryHeader } from './ModelRepositoryHeader';
import { ModelRepositoryTabs } from './ModelRepositoryTabs';
import { ModelRepositoryContent } from './ModelRepositoryContent';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Model } from '../../types/models';

interface ModelRepositoryLayoutProps {
  model: Model;
  loading?: boolean;
  error?: Error | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ModelRepositoryLayout({ model, loading, error, activeTab, onTabChange }: ModelRepositoryLayoutProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Loading model..." />
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error?.message || 'Model not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ModelRepositoryHeader model={model} />
      <ModelRepositoryTabs 
        activeTab={activeTab} 
        onTabChange={onTabChange}
        isOwner={model.is_owner} 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ModelRepositoryContent model={model} activeTab={activeTab} />
      </div>
    </div>
  );
}