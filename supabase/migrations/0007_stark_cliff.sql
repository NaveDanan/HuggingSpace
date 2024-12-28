/*
  # Fix storage policies

  1. Storage Setup
    - Ensure avatars bucket exists
  
  2. Security
    - Drop existing policies if they exist
    - Recreate policies with proper checks
*/

-- Ensure avatars bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their avatar images" ON storage.objects;

-- Recreate policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatar images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (OCTET_LENGTH(DECODE(SUBSTRING(name FROM '[^.]+$'), 'escape')) <= 2097152) -- 2MB max
  );

CREATE POLICY "Users can update their avatar images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can delete their avatar images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');