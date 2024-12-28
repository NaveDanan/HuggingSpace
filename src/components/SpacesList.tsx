import React from 'react';
import { SpaceCard } from './SpaceCard';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorRetry } from './ui/ErrorRetry';
import { useSpaces } from '../hooks/useSpaces';

interface SpacesListProps {
  featured?: boolean;
  limit?: number;
}

export function SpacesList({ featured, limit }: SpacesListProps) {
  const { spaces, loading, error, refetch } = useSpaces({ 
    featured, 
    limit 
  });

  if (loading) {
    return <LoadingSpinner message="Loading spaces..." />;
  }

  if (error) {
    return <ErrorRetry message={error.message} onRetry={refetch} />;
  }

  if (!spaces.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          {featured ? 'No featured spaces found.' : 'No spaces found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((space) => (
        <SpaceCard key={space.id} {...space} />
      ))}
    </div>
  );
}