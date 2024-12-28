import { useState, useCallback, useMemo } from 'react';
import type { DatasetFilters } from '../types/datasets';
import { supabase } from '../lib/supabase';
import { buildDatasetQuery } from '../utils/queryBuilders';

const initialFilters: DatasetFilters = {
  search: '',
  types: [],
  formats: [],
  sizes: [],
  sort: 'downloads',
};

export function useDatasetFilters() {
  const [filters, setFilters] = useState<DatasetFilters>(initialFilters);

  const query = useMemo(() => {
    return buildDatasetQuery(supabase, filters);
  }, [
    filters.search,
    filters.types.join(','),
    filters.formats.join(','),
    filters.sizes.join(','),
    filters.sort
  ]);

  const updateFilters = useCallback((newFilters: Partial<DatasetFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    setFilters: updateFilters,
    query
  };
}