/*
  # Fix Dataset Tables and Visibility

  1. Changes
    - Add is_private column to datasets table
    - Create dataset_tags table if not exists
    - Add proper RLS policies for private content
    - Add indexes for better performance

  2. Security
    - Enable RLS on all tables
    - Add policies for private content visibility
*/

-- Add is_private column to datasets if it doesn't exist
ALTER TABLE datasets 
ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;

-- Create dataset_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS dataset_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  tag text NOT NULL,
  UNIQUE(dataset_id, tag)
);

-- Enable RLS
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Datasets are viewable by everyone" ON datasets;
DROP POLICY IF EXISTS "Users can create their own datasets" ON datasets;
DROP POLICY IF EXISTS "Users can update their own datasets" ON datasets;
DROP POLICY IF EXISTS "Users can delete their own datasets" ON datasets;
DROP POLICY IF EXISTS "Dataset tags are viewable by everyone" ON dataset_tags;
DROP POLICY IF EXISTS "Users can manage tags for own datasets" ON dataset_tags;

-- Create new RLS policies for datasets
CREATE POLICY "Public datasets are viewable by everyone"
  ON datasets FOR SELECT
  USING (NOT is_private OR auth.uid() = author_id);

CREATE POLICY "Users can create their own datasets"
  ON datasets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own datasets"
  ON datasets FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own datasets"
  ON datasets FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create new RLS policies for dataset_tags
CREATE POLICY "Dataset tags are viewable with dataset"
  ON dataset_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM datasets
      WHERE id = dataset_tags.dataset_id
      AND (NOT is_private OR author_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage tags for own datasets"
  ON dataset_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM datasets
      WHERE id = dataset_tags.dataset_id
      AND author_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_privacy ON datasets(is_private, author_id);
CREATE INDEX IF NOT EXISTS idx_datasets_public ON datasets(created_at DESC) WHERE NOT is_private;
CREATE INDEX IF NOT EXISTS idx_dataset_tags_dataset ON dataset_tags(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_tags_tag ON dataset_tags(tag);