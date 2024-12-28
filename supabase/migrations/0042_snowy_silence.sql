-- Drop existing policies
DROP POLICY IF EXISTS "Model file changes are viewable by everyone" ON model_file_changes;
DROP POLICY IF EXISTS "Users can insert file changes for their commits" ON model_file_changes;

-- Create new policies with improved access control
CREATE POLICY "Anyone can view file changes"
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_model_file_changes_lookup 
ON model_file_changes(commit_id, file_path);

-- Add function to handle file change errors
CREATE OR REPLACE FUNCTION handle_file_change_error()
RETURNS trigger AS $$
BEGIN
  BEGIN
    -- Validate file path
    IF NEW.file_path IS NULL OR NEW.file_path = '' THEN
      RAISE EXCEPTION 'Invalid file path';
    END IF;

    -- Validate change type
    IF NEW.change_type NOT IN ('added', 'modified', 'deleted') THEN
      RAISE EXCEPTION 'Invalid change type';
    END IF;

    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    -- Log error and return NULL to prevent insert
    RAISE WARNING 'Error in file change: %', SQLERRM;
    RETURN NULL;
  END;
END;
$$ LANGUAGE plpgsql;