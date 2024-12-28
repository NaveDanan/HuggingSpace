import React from 'react';
import { SpaceCard } from '../SpaceCard';
import type { Space } from '../../types/profile';

interface ProfileSpacesProps {
  spaces: Space[];
}

export function ProfileSpaces({ spaces }: ProfileSpacesProps) {
  if (spaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No spaces yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {spaces.map((space) => (
        <SpaceCard
          key={space.id}
          title={space.title}
          description={space.description}
          author={space.author}
          thumbnail={space.thumbnail_url}
          likes={space.likes_count}
          forks={space.forks_count}
          views={space.views_count}
          tags={space.tags}
        />
      ))}
    </div>
  );
}