/*
  # Fix model file changes policies

  1. Changes
    - Simplify RLS policies for model_file_changes
    - Add better error handling for file changes
    - Add validation for file paths
    - Add indexes for performance

  2. Security
    - Ensure proper access control for file changes
    - Add validation for file paths and change types
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view file changes" ON model_file_changes;
DROP POLICY IF EXISTS "Model owners can manage file changes" ON model_file_changes;

-- Create simplified policies
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

CREATE POLICY "Users can manage their own model file changes"
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

-- Add better validation for file paths
CREATE OR REPLACE FUNCTION validate_file_path(path text)
RETURNS boolean AS $$
BEGIN
  -- Check if path is null or empty
  IF path IS NULL OR path = '' THEN
    RETURN false;
  END IF;

  -- Check for invalid characters
  IF path ~ '[<>:"|?*\x00-\x1F]' THEN
    RETURN false;
  END IF;

  -- Check for relative path traversal
  IF path ~ '(\.\./|\.\.\\)' THEN
    RETURN false;
  END IF;

  -- Check for absolute paths
  IF path ~ '^(/|\\|[A-Za-z]:)' THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Update trigger function with better validation
CREATE OR REPLACE FUNCTION validate_model_file_change()
RETURNS trigger AS $$
BEGIN
  -- Validate file path
  IF NOT validate_file_path(NEW.file_path) THEN
    RAISE EXCEPTION 'Invalid file path';
  END IF;

  -- Validate change type
  IF NEW.change_type NOT IN ('added', 'modified', 'deleted') THEN
    RAISE EXCEPTION 'Invalid change type';
  END IF;

  -- Ensure commit exists
  IF NOT EXISTS (
    SELECT 1 FROM model_commits WHERE id = NEW.commit_id
  ) THEN
    RAISE EXCEPTION 'Invalid commit ID';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS validate_model_file_change_trigger ON model_file_changes;
CREATE TRIGGER validate_model_file_change_trigger
  BEFORE INSERT OR UPDATE ON model_file_changes
  FOR EACH ROW
  EXECUTE FUNCTION validate_model_file_change();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_model_file_changes_path 
ON model_file_changes(file_path);

CREATE INDEX IF NOT EXISTS idx_model_file_changes_commit_lookup
ON model_file_changes(commit_id, change_type);