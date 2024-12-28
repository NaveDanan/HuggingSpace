-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Model files are viewable by everyone" ON storage.objects;
  DROP POLICY IF EXISTS "Users can manage their own model files" ON storage.objects;
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

-- Create simplified policies
CREATE POLICY "Anyone can read public model files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'model-files' AND
    NOT EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 4)
      AND m.is_private = true
    )
  );

CREATE POLICY "Owners can manage their model files"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'model-files' AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = split_part(name, '/', 4)
      AND m.author_id = auth.uid()
    )
  );