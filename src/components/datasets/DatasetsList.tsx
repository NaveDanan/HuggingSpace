import React from 'react';
import { DatasetCard } from './DatasetCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorRetry } from '../ui/ErrorRetry';
import type { Dataset } from '../../types/datasets';

interface DatasetsListProps {
  datasets: Dataset[];
  loading: boolean;
  error: Error | null;
}

export function DatasetsList({ datasets, loading, error }: DatasetsListProps) {
  if (loading) {
    return <LoadingSpinner message="Loading datasets..." />;
  }

  if (error) {
    return <ErrorRetry message={error.message} onRetry={() => window.location.reload()} />;
  }

  if (!datasets.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No datasets found</p>
      </div>
    );
  }

  return (
    <DatasetCard dataset={datasets[0]} />
  );
}