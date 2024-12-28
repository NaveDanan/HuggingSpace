import React from 'react';
import { ModelCard } from '../models/ModelCard';
import type { Model } from '../../types/models';

interface ProfileModelsProps {
  models: Model[];
}

export function ProfileModels({ models }: ProfileModelsProps) {
  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No models yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
}