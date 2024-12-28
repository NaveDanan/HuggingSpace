import React from 'react';
import { ModelCard } from '../models/ModelCard';
import type { Model } from '../../types/models';

interface ProfileDatasetsProps {
  datasets: Model[];
}

export function ProfileDatasets({ datasets }: ProfileDatasetsProps) {
  if (datasets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No datasets yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {datasets.map((dataset) => (
        <ModelCard key={dataset.id} model={dataset} />
      ))}
    </div>
  );
}