/*
  # Fix model commits and file changes validation

  1. Changes
    - Add better validation for commit messages
    - Improve file change tracking
    - Fix RLS policies
    - Add proper error handling

  2. Security
    - Ensure proper access control
    - Add validation for file paths and messages
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view model file changes" ON model_file_changes;
DROP POLICY IF EXISTS "Model owners can manage file changes" ON model_file_changes;

-- Create simplified policies with better access control
CREATE POLICY "Model file changes are viewable by everyone"
  ON model_file_changes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM model_commits mc
      JOIN models m ON mc.model_id = m.id
      WHERE mc.id = model_file_changes.commit_id
      AND (NOT m.is_private OR m.author_id = auth.uid())
    )
  );

CREATE POLICY "Model owners can manage file changes"
  ON model_file_changes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM model_commits mc
      JOIN models m ON mc.model_id = m.id
      WHERE mc.id = model_file_changes.commit_id
      AND m.author_id = auth.uid()
    )
  );

-- Add function to validate commit messages
CREATE OR REPLACE FUNCTION validate_commit_message(message text)
RETURNS boolean AS $$
BEGIN
  -- Check if message is null or empty
  IF message IS NULL OR trim(message) = '' THEN
    RETURN false;
  END IF;

  -- Check message length
  IF length(message) > 1000 THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Add function to handle commit creation
CREATE OR REPLACE FUNCTION handle_model_commit()
RETURNS trigger AS $$
BEGIN
  -- Validate commit message
  IF NOT validate_commit_message(NEW.message) THEN
    RAISE EXCEPTION 'Invalid commit message';
  END IF;

  -- Validate files array
  IF NEW.files IS NULL OR array_length(NEW.files, 1) = 0 THEN
    RAISE EXCEPTION 'At least one file must be changed';
  END IF;

  -- Validate file paths
  FOR i IN 1..array_length(NEW.files, 1) LOOP
    IF NOT validate_file_path(NEW.files[i]) THEN
      RAISE EXCEPTION 'Invalid file path: %', NEW.files[i];
    END IF;
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error details
  RAISE WARNING 'Error in commit: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for commit validation
DROP TRIGGER IF EXISTS handle_model_commit_trigger ON model_commits;
CREATE TRIGGER handle_model_commit_trigger
  BEFORE INSERT OR UPDATE ON model_commits
  FOR EACH ROW
  EXECUTE FUNCTION handle_model_commit();

-- Add function to automatically create file changes
CREATE OR REPLACE FUNCTION create_file_changes()
RETURNS trigger AS $$
BEGIN
  -- Insert file changes for each file in the commit
  INSERT INTO model_file_changes (commit_id, file_path, change_type)
  SELECT 
    NEW.id,
    unnest(NEW.files),
    'modified'
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create file changes
DROP TRIGGER IF EXISTS create_file_changes_trigger ON model_commits;
CREATE TRIGGER create_file_changes_trigger
  AFTER INSERT ON model_commits
  FOR EACH ROW
  EXECUTE FUNCTION create_file_changes();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_model_commits_lookup 
ON model_commits(model_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_model_file_changes_lookup 
ON model_file_changes(commit_id, file_path);