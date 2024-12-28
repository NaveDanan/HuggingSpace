import { useState, useCallback, useMemo } from 'react';
import type { SpaceFilters } from '../types/spaces';
import { supabase } from '../lib/supabase';
import { buildSpaceQuery } from '../utils/queryBuilders';

interface UseSpaceFiltersOptions {
  featured?: boolean;
  limit?: number;
}

const initialFilters: SpaceFilters = {
  search: '',
  categories: [],
  frameworks: [],
  sort: 'recent',
};

export function useSpaceFilters(options: UseSpaceFiltersOptions = {}) {
  const [filters, setFilters] = useState<SpaceFilters>(initialFilters);

  const query = useMemo(() => {
    return buildSpaceQuery(supabase, filters, options);
  }, [
    filters.search,
    filters.categories.join(','),
    filters.frameworks.join(','),
    filters.sort,
    options.featured,
    options.limit
  ]);

  const updateFilters = useCallback((newFilters: Partial<SpaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    setFilters: updateFilters,
    query
  };
}