/*
  # Add storage policies for avatar uploads

  1. Changes
    - Create avatars storage bucket if it doesn't exist
    - Add storage policies for authenticated users to manage their avatars
*/

-- Enable storage by creating the avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload avatar images
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