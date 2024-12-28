import React from 'react';
import { SpaceCard } from '../SpaceCard';
import type { Profile } from '../../types/profile';

interface ProfileContentProps {
  profile: Profile;
}

export function ProfileContent({ profile }: ProfileContentProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.recent_spaces?.map((space) => (
            <SpaceCard
              key={space.id}
              title={space.title}
              description={space.description}
              author={profile.display_name || profile.username}
              thumbnail={space.thumbnail_url}
              likes={space.likes_count}
              forks={space.forks_count}
              views={space.views_count}
              tags={space.tags}
            />
          ))}
        </div>
      </section>
    </div>
  );
}