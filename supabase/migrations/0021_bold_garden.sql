/*
  # Update Models Table Schema
  
  1. Changes
    - Drop existing models table
    - Recreate models table with same structure as spaces
    - Add appropriate constraints and indexes
    - Enable RLS with proper policies
  
  2. Schema Updates
    - All columns from spaces table
    - Proper constraints and defaults
    - Indexes for performance
*/

-- Drop existing models table if it exists
DROP TABLE IF EXISTS models;

-- Create new models table with same structure as spaces
CREATE TABLE models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  thumbnail_url text NOT NULL,
  framework text NOT NULL,
  likes_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_private boolean DEFAULT false,
  type text NOT NULL DEFAULT 'model' CHECK (type = 'model')
);

-- Enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public models are viewable by everyone"
  ON models FOR SELECT
  USING (NOT is_private OR auth.uid() = author_id);

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

-- Create indexes for better performance
CREATE INDEX idx_models_author_id ON models(author_id);
CREATE INDEX idx_models_created_at ON models(created_at DESC);
CREATE INDEX idx_models_framework ON models(framework);
CREATE INDEX idx_models_featured ON models(is_featured) WHERE is_featured = true;
CREATE INDEX idx_models_privacy ON models(is_private, author_id);

-- Create updated_at trigger
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Transfer data from spaces to models
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