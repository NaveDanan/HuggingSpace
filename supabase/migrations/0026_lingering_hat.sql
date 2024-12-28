/*
  # Create datasets schema

  1. New Tables
    - `datasets` table for storing dataset information
    - `dataset_tags` table for dataset categorization
  
  2. Changes
    - Adds proper columns for dataset metadata
    - Sets up RLS policies for data access control
    - Creates necessary indexes for performance
  
  3. Security
    - Enables RLS on both tables
    - Creates policies for proper access control
*/

-- Create datasets table if it doesn't exist
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  thumbnail_url text NOT NULL,
  type text NOT NULL,
  format text NOT NULL,
  size text NOT NULL,
  likes_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

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

-- Create RLS policies for datasets
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Datasets are viewable by everyone" ON datasets;
  DROP POLICY IF EXISTS "Users can create their own datasets" ON datasets;
  DROP POLICY IF EXISTS "Users can update their own datasets" ON datasets;
  DROP POLICY IF EXISTS "Users can delete their own datasets" ON datasets;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Datasets are viewable by everyone"
  ON datasets FOR SELECT
  USING (true);

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

-- Create RLS policies for dataset_tags
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Dataset tags are viewable by everyone" ON dataset_tags;
  DROP POLICY IF EXISTS "Users can manage tags for own datasets" ON dataset_tags;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Dataset tags are viewable by everyone"
  ON dataset_tags FOR SELECT
  USING (true);

CREATE POLICY "Users can manage tags for own datasets"
  ON dataset_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM datasets
      WHERE id = dataset_tags.dataset_id
      AND author_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_datasets_author_id ON datasets(author_id);
CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_datasets_type ON datasets(type);
CREATE INDEX IF NOT EXISTS idx_datasets_format ON datasets(format);
CREATE INDEX IF NOT EXISTS idx_datasets_featured ON datasets(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_dataset_tags_dataset_id ON dataset_tags(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_tags_tag ON dataset_tags(tag);

-- Migrate existing dataset data from spaces
WITH migrated_datasets AS (
  INSERT INTO datasets (
    title,
    description,
    author_id,
    thumbnail_url,
    type,
    format,
    size,
    likes_count,
    forks_count,
    views_count,
    is_featured,
    created_at
  )
  SELECT 
    s.title,
    s.description,
    s.author_id,
    s.thumbnail_url,
    COALESCE(
      (SELECT tag FROM space_tags 
       WHERE space_id = s.id 
       AND tag IN ('tabular', 'image', 'text', 'audio', 'video')
       LIMIT 1
      ),
      'other'
    ) as type,
    COALESCE(
      (SELECT tag FROM space_tags 
       WHERE space_id = s.id 
       AND tag IN ('csv', 'json', 'parquet', 'arrow')
       LIMIT 1
      ),
      'custom'
    ) as format,
    COALESCE(
      (SELECT tag FROM space_tags 
       WHERE space_id = s.id 
       AND tag LIKE 'size:%'
       LIMIT 1
      ),
      'size:unknown'
    ) as size,
    s.likes_count,
    s.forks_count,
    s.views_count,
    s.is_featured,
    s.created_at
  FROM spaces s
  WHERE s.type = 'dataset'
  RETURNING id, title, author_id, created_at
)
INSERT INTO dataset_tags (dataset_id, tag)
SELECT 
  md.id,
  st.tag
FROM migrated_datasets md
JOIN spaces s ON 
  s.title = md.title AND 
  s.author_id = md.author_id AND 
  s.created_at = md.created_at
JOIN space_tags st ON st.space_id = s.id
WHERE st.tag != 'dataset';