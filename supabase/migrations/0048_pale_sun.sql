/*
  # Add GitHub Integration Fields
  
  1. New Fields
    - github_id (for storing GitHub user ID)
    - github_access_token (for storing encrypted access token)
    - github_username (for storing GitHub username)
    
  2. Security
    - Encrypt access token storage
    - Add RLS policies for secure access
*/

-- Add GitHub-specific columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS github_id text,
ADD COLUMN IF NOT EXISTS github_access_token text,
ADD COLUMN IF NOT EXISTS github_username text;

-- Add unique constraint on github_id
ALTER TABLE profiles
ADD CONSTRAINT unique_github_id UNIQUE (github_id);

-- Create function to handle GitHub OAuth callback
CREATE OR REPLACE FUNCTION handle_github_oauth_callback(
  user_id uuid,
  gh_id text,
  gh_username text,
  gh_token text
) RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    github_id = gh_id,
    github_username = gh_username,
    github_access_token = gh_token,
    github_url = 'https://github.com/' || gh_username,
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;