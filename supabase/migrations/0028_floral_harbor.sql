/*
  # Add model files storage

  1. Create storage bucket for model files
  2. Set up RLS policies for file access
  3. Add helper function for path extraction
*/

-- Create model-files bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('model-files', 'model-files', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create function to extract model ID from storage path
CREATE OR REPLACE FUNCTION storage.extract_model_id(path text)
RETURNS text AS $$
BEGIN
  -- Extract first path segment (model ID)
  RETURN split_part(path, '/', 1);
END;
$$ LANGUAGE plpgsql;

-- Create policies for model files
CREATE POLICY "Model files are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'model-files' AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = storage.extract_model_id(name)
      AND NOT m.is_private
    )
  );

CREATE POLICY "Users can manage their own model files"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'model-files' AND
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id::text = storage.extract_model_id(name)
      AND m.author_id = auth.uid()
    )
  );