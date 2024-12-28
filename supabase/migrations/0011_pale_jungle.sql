/*
  # Connect Demo Space to User Profile

  1. Changes
    - Updates the demo space to be associated with a specific user profile
    - Adds indexes for better query performance
    - Updates space tags for better categorization

  2. Notes
    - Uses a safe approach to update the space only if it exists
    - Maintains existing data integrity
*/

-- First, get a user profile to associate the space with
DO $$
DECLARE
  target_profile_id uuid;
BEGIN
  -- Get the first profile from the profiles table
  SELECT id INTO target_profile_id FROM profiles LIMIT 1;

  -- Only proceed if we have a profile
  IF target_profile_id IS NOT NULL THEN
    -- Update the demo space to be associated with this profile
    UPDATE spaces
    SET 
      author_id = target_profile_id,
      title = 'Image Classification Demo',
      description = 'A demo space showcasing image classification using a pre-trained ResNet model. Upload any image and get instant predictions!',
      framework = 'gradio',
      thumbnail_url = 'https://source.unsplash.com/random/800x600/?ai,machine-learning',
      likes_count = 42,
      forks_count = 12,
      views_count = 156,
      is_featured = true,
      is_private = false,
      slug = 'image-classification-demo'
    WHERE title = 'Image Classification Demo';

    -- Update or insert space tags
    WITH new_tags AS (
      SELECT unnest(ARRAY['machine-learning', 'computer-vision', 'demo', 'image-classification', 'pytorch']) AS tag
    )
    INSERT INTO space_tags (space_id, tag)
    SELECT 
      s.id,
      nt.tag
    FROM spaces s
    CROSS JOIN new_tags nt
    WHERE s.title = 'Image Classification Demo'
    ON CONFLICT (space_id, tag) DO NOTHING;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_spaces_author_featured ON spaces(author_id) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_spaces_created_at ON spaces(created_at DESC);