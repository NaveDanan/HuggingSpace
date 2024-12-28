import { useState, useCallback, useEffect } from 'react';
import { initiateGitHubOAuth, handleGitHubCallback } from '../lib/github';
import { useLocation } from 'react-router-dom';

export function useGitHubAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      handleGitHubCallback(code, state)
        .catch(err => {
          console.error('GitHub OAuth error:', err);
          setError(err.message);
        })
        .finally(() => {
          setIsConnecting(false);
          // Clean up URL
          window.history.replaceState({}, '', location.pathname);
        });
    }
  }, [location]);

  const connectGitHub = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await initiateGitHubOAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to GitHub');
      setIsConnecting(false);
    }
  }, []);

  return {
    connectGitHub,
    isConnecting,
    error
  };
}