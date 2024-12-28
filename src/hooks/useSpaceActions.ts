import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';

export function useSpaceActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthContext();

  const deleteSpace = async (spaceId: string, authorId: string) => {
    if (!user) {
      throw new Error('You must be logged in to delete content');
    }

    // Check if user is authorized to delete
    if (user.id !== authorId) {
      throw new Error('You are not authorized to delete this content');
    }

    try {
      setLoading(true);
      setError(null);

      // Delete the space (tags will be deleted automatically due to CASCADE)
      const { error: spaceError } = await supabase
        .from('spaces')
        .delete()
        .eq('id', spaceId)
        .eq('author_id', authorId); // Extra safety check

      if (spaceError) throw spaceError;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete content');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteSpace,
    loading,
    error
  };
}