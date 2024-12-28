-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can read public model files" ON storage.objects;
  DROP POLICY IF EXISTS "Owners can manage their model files" ON storage.objects;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create bucket if it doesn't exist
DO $$ 
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('model-files', 'model-files', false)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create more permissive policies for model files
CREATE POLICY "Model files are readable by everyone"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'model-files'
  );

CREATE POLICY "Authenticated users can upload model files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'model-files'
  );

CREATE POLICY "Authenticated users can update their files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'model-files'
  );

CREATE POLICY "Authenticated users can delete their files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'model-files'
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_storage_model_files
  ON storage.objects (name)
  WHERE bucket_id = 'model-files';