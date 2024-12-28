/*
  # Connect spaces to users and add default images

  1. Changes
    - Add default thumbnail URLs for different content types
    - Update existing spaces to use default thumbnails if none set
    - Ensure all spaces are connected to valid user profiles

  2. Default Images
    - Models: AI/neural network themed
    - Datasets: Data analytics themed
    - Spaces: Workspace/collaboration themed

  3. Data Integrity
    - Validates and repairs any orphaned spaces
    - Sets appropriate default thumbnails
*/

-- Add default thumbnails for spaces without one
UPDATE spaces
SET thumbnail_url = CASE
  WHEN EXISTS (
    SELECT 1 FROM space_tags st 
    WHERE st.space_id = spaces.id 
    AND st.tag = 'model'
  ) THEN 'https://source.unsplash.com/random/800x600/?ai,neural-network'
  WHEN EXISTS (
    SELECT 1 FROM space_tags st 
    WHERE st.space_id = spaces.id 
    AND st.tag = 'dataset'
  ) THEN 'https://source.unsplash.com/random/800x600/?data,analytics'
  ELSE 'https://source.unsplash.com/random/800x600/?workspace,collaboration'
END
WHERE thumbnail_url IS NULL;

-- Ensure all spaces have a valid author_id
DO $$
DECLARE
  default_profile_id uuid;
BEGIN
  -- Get a default profile ID (first one in the system)
  SELECT id INTO default_profile_id FROM profiles LIMIT 1;
  
  -- Update any spaces with invalid author_id
  UPDATE spaces
  SET author_id = default_profile_id
  WHERE author_id NOT IN (SELECT id FROM profiles)
  OR author_id IS NULL;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_spaces_type_tag ON space_tags(tag) WHERE tag IN ('model', 'dataset', 'space');
CREATE INDEX IF NOT EXISTS idx_spaces_author_content ON spaces(author_id, created_at DESC);