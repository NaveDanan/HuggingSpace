import { useState, useCallback, useMemo } from 'react';
import type { ModelFilters, SortOption } from '../types/models';
import { supabase } from '../lib/supabase';
import { buildModelQuery } from '../utils/queryBuilders';

const initialFilters: ModelFilters = {
  search: '',
  tasks: [],
  libraries: [],
  languages: [],
  sort: 'downloads' as SortOption,
};

export function useModelFilters() {
  const [filters, setFilters] = useState<ModelFilters>(initialFilters);

  const query = useMemo(() => {
    return buildModelQuery(supabase, filters);
  }, [
    filters.search,
    filters.tasks.join(','),
    filters.libraries.join(','),
    filters.languages.join(','),
    filters.sort
  ]);

  const updateFilters = useCallback((newFilters: Partial<ModelFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    setFilters: updateFilters,
    query
  };
}