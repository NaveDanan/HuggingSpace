import React from 'react';
import { SpaceCard } from '../SpaceCard';
import { Loader } from 'lucide-react';
import type { Space } from '../../types/profile';

interface SpacesListProps {
  spaces: Space[];
  loading: boolean;
  error: Error | null;
}

export function SpacesList({ spaces, loading, error }: SpacesListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading spaces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!spaces.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No spaces found
        </p>
      </div>
    );
  }

  return (
    <SpaceCard {...spaces[0]} />
  );
}