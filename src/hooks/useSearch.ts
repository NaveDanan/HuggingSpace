import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/error';
import type { SearchResult } from '../types/search';

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchSpaces = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('spaces')
          .select(`
            id,
            title,
            description,
            profiles!inner (
              username,
              display_name
            ),
            space_tags!inner (
              tag
            )
          `)
          .textSearch('title', query)
          .eq('is_private', false) // Only search public content
          .limit(5);

        if (error) throw error;

        const searchResults: SearchResult[] = data?.map(space => ({
          id: space.id,
          type: space.space_tags.find(t => ['model', 'dataset', 'space'].includes(t.tag))?.tag || 'space',
          title: space.title,
          description: space.description,
          author: space.profiles.display_name || space.profiles.username,
        })) || [];

        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', handleSupabaseError(err));
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchSpaces, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading };
}