import React from 'react';
import { Database, Box, FileText, Heart } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface ProfileStatsProps {
  profile: Profile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const stats = [
    { label: 'Models', value: profile.models_count || 0, icon: Database },
    { label: 'Datasets', value: profile.datasets_count || 0, icon: Box },
    { label: 'Spaces', value: profile.spaces_count || 0, icon: FileText },
    { label: 'Likes', value: profile.likes_count || 0, icon: Heart },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stats</h2>
      <div className="space-y-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}