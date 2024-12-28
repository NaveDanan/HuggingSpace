import { useState, useEffect, useCallback } from 'react';
import type { Space } from '../types/spaces';
import { useSpaceFilters } from './useSpaceFilters';
import { formatSpaceData } from '../utils/spaceFormatters';
import { handleSupabaseError } from '../utils/error';
import { withRetry } from '../lib/supabase';

interface UseSpacesOptions {
  featured?: boolean;
  limit?: number;
}

export function useSpaces(options: UseSpacesOptions = {}) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { filters, setFilters, query } = useSpaceFilters(options);

  const fetchSpaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await withRetry(() => query
        .select(`
          *,
          space_tags (tag),
          profiles!inner (username, display_name),
          is_private
        `)
        .eq('is_private', false)
      );
      if (err) throw err;

      const formattedSpaces = data?.map(formatSpaceData) || [];
      setSpaces(formattedSpaces);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  return {
    spaces,
    filters,
    setFilters,
    loading,
    error,
    refetch: fetchSpaces
  };
}