-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Model files are viewable by everyone" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload model files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update model files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete model files" ON storage.objects;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create simpler, more reliable policies
CREATE POLICY "Model files are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'model-files' AND
    NOT EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 4)
      AND m.is_private = true
    )
  );

CREATE POLICY "Users can manage their own model files"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'model-files' AND
    auth.uid()::text = split_part(name, '/', 2) AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 4)
      AND m.author_id = auth.uid()
    )
  );