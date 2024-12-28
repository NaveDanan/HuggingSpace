import { useState, useEffect, useCallback } from 'react';
import type { Dataset, DatasetFilters } from '../types/datasets';
import { useDatasetFilters } from './useDatasetFilters';
import { formatDatasetData } from '../utils/datasetFormatters';
import { handleSupabaseError } from '../utils/error';
import { useAuthContext } from '../contexts/AuthContext';
import { withRetry } from '../lib/supabase';

export function useDatasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthContext();
  const { filters, setFilters, query } = useDatasetFilters();

  const fetchDatasets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await withRetry(() => query
        .select(`
          *,
          dataset_tags (tag),
          profiles!inner (username, display_name),
          is_private
        `)
        .eq('is_private', false)
      );
      if (err) throw err;

      const formattedDatasets = data?.map(formatDatasetData) || [];
      setDatasets(formattedDatasets);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  return {
    datasets,
    filters,
    setFilters,
    loading,
    error,
    refetch: fetchDatasets
  };
}