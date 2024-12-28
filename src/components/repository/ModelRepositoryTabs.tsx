import React from 'react';
import { Code, FileText, Users, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModelRepositoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwner?: boolean;
}

export function ModelRepositoryTabs({ activeTab, onTabChange, isOwner }: ModelRepositoryTabsProps) {
  const TABS = [
    { id: 'readme', label: 'README', icon: FileText },
    { id: 'code', label: 'Files & Versions', icon: Code },
    { id: 'community', label: 'Community', icon: Users },
    ...(isOwner ? [{ id: 'settings', label: 'Settings', icon: Settings }] : [])
  ];

  return (
    <div className="border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex -mb-px space-x-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}