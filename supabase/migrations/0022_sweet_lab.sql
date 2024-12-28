/*
  # Migrate Models Data
  
  1. Changes
    - Transfer all spaces with type='model' to models table
    - Delete transferred records from spaces table
    - Update related tags
  
  2. Schema Updates
    - Preserves all data and relationships
    - Maintains data integrity
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
  framework,
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

-- Transfer tags to new model_tags table
CREATE TABLE IF NOT EXISTS model_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid REFERENCES models(id) ON DELETE CASCADE,
  tag text NOT NULL,
  UNIQUE(model_id, tag)
);

-- Enable RLS on model_tags
ALTER TABLE model_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for model_tags
CREATE POLICY "Model tags are viewable by everyone"
  ON model_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM models
      WHERE id = model_tags.model_id
      AND (NOT is_private OR author_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage tags for own models"
  ON model_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM models
      WHERE id = model_tags.model_id
      AND author_id = auth.uid()
    )
  );

-- Copy tags to new table
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

-- Create indexes for model_tags
CREATE INDEX idx_model_tags_model_id ON model_tags(model_id);
CREATE INDEX idx_model_tags_tag ON model_tags(tag);

-- Clean up
DROP TABLE model_id_mapping;