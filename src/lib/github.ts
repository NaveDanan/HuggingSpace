import { supabase } from './supabase';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = `${window.location.origin}/settings/profile`;

export async function initiateGitHubOAuth() {
  const state = crypto.randomUUID();
  
  // Store state in localStorage for verification
  localStorage.setItem('github_oauth_state', state);
  
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'read:user user:email',
    state,
    allow_signup: 'false'
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

export async function handleGitHubCallback(code: string, state: string) {
  // Verify state
  const savedState = localStorage.getItem('github_oauth_state');
  if (!savedState || savedState !== state) {
    throw new Error('Invalid OAuth state');
  }
  
  // Clear state
  localStorage.removeItem('github_oauth_state');

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_REDIRECT_URI
    })
  });

  const tokenData = await tokenResponse.json();
  if (tokenData.error) {
    throw new Error(tokenData.error_description || 'Failed to get access token');
  }

  // Get user data from GitHub
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  const userData = await userResponse.json();
  if (userData.error) {
    throw new Error('Failed to get GitHub user data');
  }

  // Update profile with GitHub data
  const { error: updateError } = await supabase.rpc('handle_github_oauth_callback', {
    user_id: (await supabase.auth.getUser()).data.user?.id,
    gh_id: userData.id.toString(),
    gh_username: userData.login,
    gh_token: tokenData.access_token
  });

  if (updateError) {
    throw updateError;
  }

  return {
    username: userData.login,
    avatar_url: userData.avatar_url
  };
}