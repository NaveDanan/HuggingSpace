/*
  # Create Dedicated Models Table
  
  1. New Tables
    - `models` table for dedicated model storage
    - Proper constraints and defaults
    - Timestamps and metadata
  
  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Add indexes for performance
  
  3. Data Migration
    - Move existing model data from spaces
    - Clean up old data
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  framework text NOT NULL,
  task text NOT NULL,
  language text NOT NULL,
  thumbnail_url text NOT NULL,
  likes_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  private boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public models are viewable by everyone"
  ON models FOR SELECT
  USING (NOT private OR auth.uid() = author_id);

CREATE POLICY "Users can create their own models"
  ON models FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own models"
  ON models FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own models"
  ON models FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_models_author_id ON models(author_id);
CREATE INDEX IF NOT EXISTS idx_models_framework ON models(framework);
CREATE INDEX IF NOT EXISTS idx_models_task ON models(task);
CREATE INDEX IF NOT EXISTS idx_models_language ON models(language);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_privacy ON models(private, author_id);

-- Create updated_at trigger
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing models from spaces
WITH model_spaces AS (
  SELECT DISTINCT s.*
  FROM spaces s
  JOIN space_tags st ON s.id = st.space_id
  WHERE st.tag = 'model'
)
INSERT INTO models (
  title,
  description,
  author_id,
  framework,
  task,
  language,
  thumbnail_url,
  likes_count,
  forks_count,
  views_count,
  created_at
)
SELECT 
  s.title,
  s.description,
  s.author_id,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('pytorch', 'tensorflow', 'jax', 'scikit-learn')
     LIMIT 1
    ),
    'custom'
  ) as framework,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('text-generation', 'image-classification', 'object-detection', 'translation', 'summarization')
     LIMIT 1
    ),
    'other'
  ) as task,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('python', 'javascript', 'rust', 'cpp', 'java')
     LIMIT 1
    ),
    'python'
  ) as language,
  s.thumbnail_url,
  s.likes_count,
  s.forks_count,
  s.views_count,
  s.created_at
FROM model_spaces s;

-- Delete migrated models from spaces
DELETE FROM spaces s
WHERE EXISTS (
  SELECT 1 FROM space_tags st 
  WHERE st.space_id = s.id 
  AND st.tag = 'model'
);