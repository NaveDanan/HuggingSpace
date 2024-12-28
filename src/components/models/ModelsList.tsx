import React from 'react';
import { ModelCard } from './ModelCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorRetry } from '../ui/ErrorRetry';
import type { Model } from '../../types/models';

interface ModelsListProps {
  models: Model[];
  loading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function ModelsList({ models, loading, error, onRetry }: ModelsListProps) {
  if (loading) {
    return <LoadingSpinner message="Loading models..." />;
  }

  if (error) {
    return <ErrorRetry message={error.message} onRetry={onRetry || (() => window.location.reload())} />;
  }

  if (!models.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-gray-500 dark:text-gray-400">No models found</p>
      </div>
    );
  }

  return (
    <ModelCard model={models[0]} />
  );
}