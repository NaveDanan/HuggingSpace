-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Model files are readable by everyone" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload their model files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their model files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their model files" ON storage.objects;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create function to validate storage path structure
CREATE OR REPLACE FUNCTION storage.validate_model_file_path(path text)
RETURNS boolean AS $$
DECLARE
  path_parts text[];
BEGIN
  -- Split path into parts
  path_parts := string_to_array(path, '/');
  
  -- Validate path has exactly 4 parts: userId/models/modelId/filename
  IF array_length(path_parts, 1) != 4 THEN
    RETURN false;
  END IF;

  -- Validate second part is 'models'
  IF path_parts[2] != 'models' THEN
    RETURN false;
  END IF;

  -- Validate filename exists and is not empty
  IF path_parts[4] IS NULL OR path_parts[4] = '' THEN
    RETURN false;
  END IF;

  -- Validate modelId exists and is a valid UUID
  IF path_parts[3] !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Create policies with proper validation
CREATE POLICY "Model files are readable by everyone"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'model-files' AND
    storage.validate_model_file_path(name) AND
    NOT EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 3)
      AND m.is_private = true
    )
  );

CREATE POLICY "Users can upload their model files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'model-files' AND
    storage.validate_model_file_path(name) AND
    auth.uid()::text = split_part(name, '/', 1) AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 3)
      AND m.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their model files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'model-files' AND
    storage.validate_model_file_path(name) AND
    auth.uid()::text = split_part(name, '/', 1) AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 3)
      AND m.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their model files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'model-files' AND
    storage.validate_model_file_path(name) AND
    auth.uid()::text = split_part(name, '/', 1) AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 3)
      AND m.author_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_storage_model_files
  ON storage.objects (name)
  WHERE bucket_id = 'model-files';