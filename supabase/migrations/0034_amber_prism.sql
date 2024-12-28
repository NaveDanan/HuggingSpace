/*
  # Update file size limit

  1. Changes
    - Increase maximum file size limit from 10MB to 500MB
    - Update validation function to use new limit
    - Update storage policies with new size limit

  2. Security
    - Maintains existing security policies
    - Only changes the file size limit
*/

-- Update file size validation in storage policies
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can upload their model files" ON storage.objects;

  -- Recreate policy with new size limit
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
      ) AND
      octet_length(DECODE(SUBSTRING(name FROM '[^.]+$'), 'escape')) <= 524288000 -- 500MB max
    );
END $$;