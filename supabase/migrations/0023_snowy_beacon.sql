/*
  # Migrate Models Data
  
  1. Changes
    - Transfer all spaces with type='model' to models table
    - Copy associated tags
    - Delete transferred records from spaces table
  
  2. Schema Updates
    - Maintains data integrity
    - Preserves all relationships
    - Updates indexes and constraints
*/

-- First, transfer the data from spaces to models
INSERT INTO models (
  title,
  description,
  author_id,
  thumbnail_url,
  framework,
  likes_count,
  forks_count,
  views_count,
  is_featured,
  is_private,
  created_at
)
SELECT 
  title,
  description,
  author_id,
  thumbnail_url,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = spaces.id 
     AND tag IN ('pytorch', 'tensorflow', 'jax', 'scikit-learn')
     LIMIT 1
    ),
    'custom'
  ) as framework,
  likes_count,
  forks_count,
  views_count,
  is_featured,
  is_private,
  created_at
FROM spaces
WHERE type = 'model';

-- Create a temporary table to store the mapping between old and new IDs
CREATE TEMP TABLE model_id_mapping AS
SELECT 
  s.id as old_id,
  m.id as new_id
FROM spaces s
JOIN models m ON 
  s.title = m.title AND 
  s.author_id = m.author_id AND 
  s.created_at = m.created_at
WHERE s.type = 'model';

-- Copy tags to model_tags table
INSERT INTO model_tags (model_id, tag)
SELECT 
  m.new_id,
  st.tag
FROM space_tags st
JOIN model_id_mapping m ON st.space_id = m.old_id
WHERE st.tag != 'model';

-- Delete the original spaces that were migrated
DELETE FROM spaces 
WHERE type = 'model';

-- Clean up
DROP TABLE model_id_mapping;