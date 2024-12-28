import React from 'react';
import { Search, Database, Box, FileText } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: Profile;
}

export function ProfileTabs({ activeTab, onTabChange, profile }: ProfileTabsProps) {
  const tabs = [
    { id: 'spaces', label: 'Spaces', count: profile.spaces_count, icon: FileText },
    { id: 'models', label: 'Models', count: profile.models_count, icon: Database },
    { id: 'datasets', label: 'Datasets', count: profile.datasets_count, icon: Box },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <nav className="flex gap-6">
          {tabs.map(({ id, label, count, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`pb-3 px-1 relative ${
                activeTab === id
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
                {count > 0 && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </span>
              {activeTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </nav>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border-0 
                     rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}