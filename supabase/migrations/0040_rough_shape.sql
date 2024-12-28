-- Drop existing policy
DROP POLICY IF EXISTS "Model file changes are viewable by everyone" ON model_file_changes;

-- Create new policies
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

CREATE POLICY "Users can insert file changes for their commits"
  ON model_file_changes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM model_commits mc
      JOIN models m ON mc.model_id = m.id
      WHERE mc.id = model_file_changes.commit_id
      AND m.author_id = auth.uid()
    )
  );

-- Create function to validate file changes
CREATE OR REPLACE FUNCTION validate_file_changes()
RETURNS trigger AS $$
BEGIN
  -- Ensure file path is not empty
  IF NEW.file_path IS NULL OR NEW.file_path = '' THEN
    RAISE EXCEPTION 'File path cannot be empty';
  END IF;

  -- Ensure change type is valid
  IF NEW.change_type NOT IN ('added', 'modified', 'deleted') THEN
    RAISE EXCEPTION 'Invalid change type';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_file_changes_trigger ON model_file_changes;
CREATE TRIGGER validate_file_changes_trigger
  BEFORE INSERT OR UPDATE ON model_file_changes
  FOR EACH ROW
  EXECUTE FUNCTION validate_file_changes();