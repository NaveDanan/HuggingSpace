import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { handleSupabaseError } from '../utils/error';
import { withRetry } from '../lib/supabase';
import type { Profile, Space, Model, Dataset } from '../types/profile';

export function useProfile(username?: string) {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout: NodeJS.Timeout;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const profileQuery = username
          ? await withRetry(() => supabase.from('profiles').select('*').eq('username', username).single())
          : await withRetry(() => supabase.from('profiles').select('*').eq('id', user?.id).single());

        let { data: profileData, error: profileError } = profileQuery;

        if (!isMounted) return;

        if (profileError) {
          // Handle case where profile doesn't exist
          if ((profileError.code === 'PGRST116' || profileError.code === '406') && !username && user) {
            // Create new profile
            const newUsername = user.email ? user.email.split('@')[0] : `user_${Date.now()}`;
            const { data: newProfile, error: createError } = await withRetry(() =>
              supabase
                .from('profiles')
                .insert({ 
                  id: user.id, 
                  username: newUsername,
                  created_at: new Date().toISOString()
                })
                .select()
                .single()
            );

            if (createError) throw createError;
            if (!isMounted) return;
            profileData = newProfile;
          } else {
            throw profileError;
          }
        }

        if (!profileData) {
          throw new Error('Profile not found');
        }

        // Reset retry count on success
        retryCount = 0;

        // Fetch user's content (spaces, models, datasets)
        const { data: spaces, error: spacesError } = await withRetry(() => supabase
          .from('spaces')
          .select('*, space_tags (tag)')
          .eq('author_id', profileData.id)
          .or(
            `is_private.eq.false,author_id.eq.${user?.id}`
          )
          .order('created_at', { ascending: false })
        );

        const { data: models, error: modelsError } = await withRetry(() => supabase
          .from('models')
          .select('*, model_tags (tag)')
          .eq('author_id', profileData.id)
          .or(
            `is_private.eq.false,author_id.eq.${user?.id}`
          )
          .order('created_at', { ascending: false })
        );

        const { data: datasets, error: datasetsError } = await withRetry(() => supabase
          .from('datasets')
          .select('*, dataset_tags (tag)')
          .eq('author_id', profileData.id)
          .or(
            `is_private.eq.false,author_id.eq.${user?.id}`
          )
          .order('created_at', { ascending: false })
        );

        if (!isMounted) return;
        if (spacesError || modelsError || datasetsError) 
          throw spacesError || modelsError || datasetsError;

        // Format content data
        const formattedSpaces = spaces?.map(space => ({
            id: space.id,
            title: space.title,
            description: space.description,
            author: profileData.display_name || profileData.username,
            thumbnail_url: space.thumbnail_url,
            is_private: space.is_private,
            likes_count: space.likes_count,
            forks_count: space.forks_count,
            views_count: space.views_count,
            tags: space.space_tags.map(t => t.tag)
        })) || [];

        const formattedModels = models?.map(model => ({
          id: model.id,
          title: model.title,
          description: model.description,
          author: profileData.display_name || profileData.username,
          thumbnail_url: model.thumbnail_url,
          is_private: model.is_private,
          likes_count: model.likes_count,
          forks_count: model.forks_count,
          views_count: model.views_count,
          tags: model.model_tags.map(t => t.tag)
        })) || [];

        const formattedDatasets = datasets?.map(dataset => ({
          id: dataset.id,
          title: dataset.title,
          description: dataset.description,
          author: profileData.display_name || profileData.username,
          thumbnail_url: dataset.thumbnail_url,
          is_private: dataset.is_private,
          likes_count: dataset.likes_count,
          forks_count: dataset.forks_count,
          views_count: dataset.views_count,
          tags: dataset.dataset_tags.map(t => t.tag)
        })) || [];

        if (!isMounted) return;

        // Combine all data
        setProfile({
          ...profileData,
          is_current_user: user?.id === profileData.id,
          models_count: formattedModels.length,
          datasets_count: formattedDatasets.length,
          spaces_count: formattedSpaces.length,
          likes_count: 0,
          recent_spaces: formattedSpaces,
          recent_models: formattedModels,
          recent_datasets: formattedDatasets
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        if (isMounted) {
          setError(handleSupabaseError(err).message);
          
          // Retry with exponential backoff
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
            retryTimeout = setTimeout(loadProfile, delay);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (username || user) {
      loadProfile();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [username, user]);

  // Add GitHub OAuth callback handling
  useEffect(() => {
    const handleGitHubCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code && user) {
        try {
          const { data, error: updateError } = await supabase
            .from('profiles')
            .update({ 
              github_url: `https://github.com/${user.user_metadata?.user_name || ''}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single();

          if (updateError) throw updateError;
          
          // Clear the URL parameters
          window.history.replaceState({}, '', window.location.pathname);
          
          // Update local profile data
          if (data) {
            setProfile(prev => prev ? { ...prev, ...data } : data);
          }
        } catch (err) {
          console.error('Error updating GitHub connection:', err);
          setError('Failed to connect GitHub account');
        }
      }
    };

    handleGitHubCallback();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure organizations is a valid array
      const organizations = Array.isArray(updates.organizations) 
        ? updates.organizations.filter(org => org.name && org.role)
        : [];
      
      // Ensure interests is a valid array
      const interests = Array.isArray(updates.interests)
        ? updates.interests.slice(0, 10) // Limit to 10 interests
        : [];

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          organizations,
          interests
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Optimistically update local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...updates,
          organizations,
          interests
        };
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      throw handleSupabaseError(err);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
}