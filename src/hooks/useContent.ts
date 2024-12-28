import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/error';
import { withRetry, checkConnection } from '../lib/supabase';
import type { Content } from '../types/models';

export function useContent(type: 'model' | 'dataset' | 'space', username: string, slug: string) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        setError(null);

        // Get the profile ID
        const { data: profile, error: profileError } = await withRetry(() => supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single(),
          5, 1000
        );

        if (profileError) {
          throw new Error('User profile not found');
        }

        // Get the content based on type
        const { data, error } = await withRetry(() => {
          const query = supabase
            .from(type === 'model' ? 'models' : 
                 type === 'dataset' ? 'datasets' : 'spaces')
            .select(`
              *,
              profiles!inner (username, display_name),
              ${type}_tags (tag)
            `)
            .eq('author_id', profile.id)
            .eq('id', slug)
            .single();
        
          return query;
        }, 5, 1000);

        if (error) {
          throw new Error('Content not found');
        }

        // Format tags based on content type
        const formattedContent = {
          ...data,
          space_tags: type === 'model' ? data.model_tags :
                     type === 'dataset' ? data.dataset_tags :
                     data.space_tags
        };

        setContent(formattedContent);
      } catch (err) {
        const error = handleSupabaseError(err);
        console.error('Error loading content:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (username && slug) {
      fetchContent();
    }
  }, [type, username, slug]);

  return { content, loading, error };
}