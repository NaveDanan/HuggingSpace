-- Create model_file_changes table to track specific file changes
CREATE TABLE model_file_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id uuid NOT NULL REFERENCES model_commits(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  change_type text NOT NULL CHECK (change_type IN ('added', 'modified', 'deleted')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE model_file_changes ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create indexes
CREATE INDEX idx_model_file_changes_commit_id ON model_file_changes(commit_id);
CREATE INDEX idx_model_file_changes_file_path ON model_file_changes(file_path);