import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { handleSupabaseError } from '../utils/error';
import type { Commit } from '../types/repository';

export function useModelCommits(modelId: string) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    async function loadCommits() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from('model_commits')
          .select(`
            id,
            message,
            created_at,
            files,
            hash,
            profiles!inner (
              username,
              display_name
            )
          `)
          .eq('model_id', modelId)
          .order('created_at', { ascending: false })
          .throwOnError();

        if (err) {
          console.error('Error fetching commits:', err);
          throw err;
        }

        const formattedCommits = (data || []).map(commit => ({
          id: commit.hash,
          message: commit.message,
          author: commit.profiles.display_name || commit.profiles.username,
          date: commit.created_at,
          files: commit.files
        }));

        setCommits(formattedCommits);
      } catch (err) {
        console.error('Error loading commits:', err);
        setError(handleSupabaseError(err));
      } finally {
        setLoading(false);
      }
    }

    if (modelId) {
      loadCommits();
    }

    // Cleanup function
    return () => {
      setCommits([]);
      setLoading(false);
      setError(null);
    };
  }, [modelId]);

  const createCommit = async (message: string, files: string[]) => {
    if (!user) throw new Error('Must be logged in to create commits');
    if (!message || typeof message !== 'string') {
      throw new Error('Commit message is required');
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 3) {
      throw new Error('Commit message must be at least 3 characters');
    }

    const hash = await generateCommitHash(trimmedMessage, files);

    try {
      // Start a transaction to insert commit and file changes
      const { error: commitError } = await supabase
        .from('model_commits')
        .insert({
          model_id: modelId,
          author_id: user.id,
          message: trimmedMessage,
          files,
          hash
        });

      if (commitError) throw commitError;

      // Reload commits after creating new one
      const { data, error: loadError } = await supabase
        .from('model_commits')
        .select(`
          id,
          message,
          created_at,
          files,
          hash,
          profiles!inner (
            username,
            display_name
          )
        `)
        .eq('model_id', modelId)
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;

      const formattedCommits: Commit[] = (data || []).map(commit => ({
        id: commit.hash,
        message: commit.message,
        author: commit.profiles.display_name || commit.profiles.username,
        date: commit.created_at,
        files: commit.files
      }));

      setCommits(formattedCommits);

    } catch (err) {
      console.error('Error creating commit:', err);
      throw handleSupabaseError(err);
    }
  };

  return {
    commits,
    loading,
    error,
    createCommit
  };
}

// Helper to generate a commit hash
async function generateCommitHash(message: string, files: string[]): Promise<string> {
  const data = JSON.stringify({ message, files, timestamp: Date.now() });
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}