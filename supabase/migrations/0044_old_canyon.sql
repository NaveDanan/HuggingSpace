/*
  # Fix model file changes validation

  1. Changes
    - Add better error handling for file changes
    - Improve validation for commit IDs
    - Add proper cascading deletes
    - Fix RLS policies

  2. Security
    - Ensure proper access control
    - Add validation for file paths
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Model file changes are viewable by everyone" ON model_file_changes;
DROP POLICY IF EXISTS "Users can manage their own model file changes" ON model_file_changes;

-- Create simplified policies with better access control
CREATE POLICY "Anyone can view model file changes"
  ON model_file_changes FOR SELECT
  USING (true);

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

-- Add function to validate and handle file changes
CREATE OR REPLACE FUNCTION handle_model_file_change()
RETURNS trigger AS $$
BEGIN
  -- Validate commit exists and user has access
  IF NOT EXISTS (
    SELECT 1 FROM model_commits mc
    JOIN models m ON mc.model_id = m.id
    WHERE mc.id = NEW.commit_id
    AND m.author_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Invalid or inaccessible commit';
  END IF;

  -- Validate file path
  IF NEW.file_path IS NULL OR NEW.file_path = '' OR 
     NEW.file_path ~ '(\.\./|\.\.\\|^/|^\\|[<>:"|?*\x00-\x1F])' THEN
    RAISE EXCEPTION 'Invalid file path';
  END IF;

  -- Validate change type
  IF NEW.change_type NOT IN ('added', 'modified', 'deleted') THEN
    RAISE EXCEPTION 'Invalid change type';
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error details
  RAISE WARNING 'Error in file change: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS handle_model_file_change_trigger ON model_file_changes;
CREATE TRIGGER handle_model_file_change_trigger
  BEFORE INSERT OR UPDATE ON model_file_changes
  FOR EACH ROW
  EXECUTE FUNCTION handle_model_file_change();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_model_file_changes_lookup 
ON model_file_changes(commit_id, file_path, change_type);

-- Add cascade delete to ensure proper cleanup
ALTER TABLE model_file_changes
DROP CONSTRAINT IF EXISTS model_file_changes_commit_id_fkey,
ADD CONSTRAINT model_file_changes_commit_id_fkey
  FOREIGN KEY (commit_id)
  REFERENCES model_commits(id)
  ON DELETE CASCADE;