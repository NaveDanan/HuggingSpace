/*
  # Storage policies for model files

  1. Setup
    - Creates model-files bucket
    - Enables RLS on storage.objects
  
  2. Policies
    - Public read access for non-private models
    - Authenticated write access for owned models
    - Path format: res/<user_id>/model/<model_id>/<file_path>
*/

-- Create model-files bucket if it doesn't exist
DO $$ 
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('model-files', 'model-files', false)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

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

-- Create new policies with safer path handling
CREATE POLICY "Model files are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'model-files' AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 4)
      AND NOT m.is_private
    )
  );

CREATE POLICY "Users can upload model files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'model-files' AND
    auth.uid()::text = split_part(name, '/', 2) AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 4)
      AND m.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update model files"
  ON storage.objects FOR UPDATE
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

CREATE POLICY "Users can delete model files"
  ON storage.objects FOR DELETE
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