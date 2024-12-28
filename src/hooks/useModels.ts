import { useState, useEffect, useCallback } from 'react';
import type { Model, ModelFilters } from '../types/models';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/error';
import { formatModelData } from '../utils/modelFormatters';
import { withRetry } from '../lib/supabase';

const initialFilters: ModelFilters = {
  search: '',
  tasks: [],
  libraries: [],
  languages: [],
  sort: 'downloads'
};

interface UseModelsOptions {
  featured?: boolean;
  limit?: number;
}

export function useModels(options: UseModelsOptions = {}) {
  const [models, setModels] = useState<Model[]>([]);
  const [filters, setFilters] = useState<ModelFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModels = useCallback(async () => {
    const { featured, limit } = options;
    try {
      setLoading(true);
      setError(null);

      const query = supabase
        .from('models')
        .select(`
          *,
          model_tags (tag),
          profiles!inner (username, display_name)
        `)
        .eq('is_private', false);

      // Apply search filter
      if (filters.search) {
        query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply task filters
      if (filters.tasks.length > 0) {
        query.in('task', filters.tasks.map(t => t.toLowerCase()));
      }

      // Apply library/framework filters
      if (filters.libraries.length > 0) {
        query.in('framework', filters.libraries.map(l => l.toLowerCase()));
      }

      // Apply language filters
      if (filters.languages.length > 0) {
        query.in('language', filters.languages.map(l => l.toLowerCase()));
      }

      // Apply featured filter
      if (featured) {
        query.eq('is_featured', true);
      }

      // Apply limit
      if (limit) {
        query.limit(limit);
      }

      // Apply sorting
      switch (filters.sort) {
        case 'downloads':
          query.order('views_count', { ascending: false });
          break;
        case 'updated':
          query.order('created_at', { ascending: false });
          break;
        case 'trending':
          query.order('likes_count', { ascending: false });
          break;
        case 'name':
          query.order('title');
          break;
      }

      const { data, error: err } = await withRetry(() => query);

      if (err) throw err;

      const formattedModels = data?.map(formatModelData) || [];
      setModels(formattedModels);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.sort,
    filters.tasks.join(','),
    filters.libraries.join(','),
    filters.languages.join(','),
  ]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { 
    models, 
    filters, 
    setFilters: useCallback((newFilters: Partial<ModelFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }, []), 
    loading, 
    error,
    refetch: fetchModels
  };
}