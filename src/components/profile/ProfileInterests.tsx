import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface ProfileInterestsProps {
  profile: Profile;
}

export function ProfileInterests({ profile }: ProfileInterestsProps) {
  if (!profile.interests?.length) {
    return (
      <div>
        <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
          <Sparkles className="w-4 h-4" />
          <h2 className="font-medium">AI & ML interests</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No interests added yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
        <Sparkles className="w-4 h-4" />
        <h2 className="font-medium">AI & ML interests</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.interests.map((interest) => (
          <span
            key={interest}
            className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/50 
                     text-blue-700 dark:text-blue-300 rounded-full"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}