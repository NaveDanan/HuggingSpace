import React from 'react';
import { ModelRepositoryHeader } from './ModelRepositoryHeader';
import { ModelRepositoryTabs } from './ModelRepositoryTabs';
import { ModelRepositoryContent } from './ModelRepositoryContent';
import type { Model } from '../../types/models';

interface ModelRepositoryLayoutProps {
  model: Model;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function RepositoryLayout({ model, activeTab, onTabChange }: ModelRepositoryLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ModelRepositoryHeader model={model} />
      <ModelRepositoryTabs activeTab={activeTab} onTabChange={onTabChange} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ModelRepositoryContent model={model} activeTab={activeTab} />
      </div>
    </div>
  );
}