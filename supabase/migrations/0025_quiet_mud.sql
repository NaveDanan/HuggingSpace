/*
  # Models Table Migration

  1. Changes
    - Create models table with proper structure
    - Add RLS policies
    - Create indexes for performance
    - Drop existing policies first to avoid conflicts

  2. Security
    - Enable RLS
    - Add appropriate policies for data access
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Models are viewable by everyone" ON models;
DROP POLICY IF EXISTS "Users can create their own models" ON models;
DROP POLICY IF EXISTS "Users can update their own models" ON models;
DROP POLICY IF EXISTS "Users can delete their own models" ON models;
DROP POLICY IF EXISTS "Model tags are viewable by everyone" ON model_tags;
DROP POLICY IF EXISTS "Users can manage tags for own models" ON model_tags;

-- Create models table if not exists
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  thumbnail_url text NOT NULL,
  framework text NOT NULL,
  task text,
  language text,
  likes_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create model_tags table if not exists
CREATE TABLE IF NOT EXISTS model_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid REFERENCES models(id) ON DELETE CASCADE,
  tag text NOT NULL,
  UNIQUE(model_id, tag)
);

-- Enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_tags ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies for models
CREATE POLICY "Models are viewable by everyone"
  ON models FOR SELECT
  USING (true);

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

-- Create new RLS policies for model_tags
CREATE POLICY "Model tags are viewable by everyone"
  ON model_tags FOR SELECT
  USING (true);

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_models_author_id ON models(author_id);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_framework ON models(framework);
CREATE INDEX IF NOT EXISTS idx_models_featured ON models(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_model_tags_model_id ON model_tags(model_id);
CREATE INDEX IF NOT EXISTS idx_model_tags_tag ON model_tags(tag);