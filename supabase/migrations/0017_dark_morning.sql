/*
  # Create Models and Datasets Tables

  1. New Tables
    - `models`
      - `id` (uuid, primary key)
      - `space_id` (uuid, references spaces)
      - `framework` (text)
      - `task` (text)
      - `language` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `datasets`
      - `id` (uuid, primary key)
      - `space_id` (uuid, references spaces)
      - `type` (text)
      - `format` (text)
      - `size` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for read/write access
*/

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id uuid NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  framework text NOT NULL,
  task text NOT NULL,
  language text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id uuid NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  type text NOT NULL,
  format text NOT NULL,
  size text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- Create policies for models
CREATE POLICY "Models are viewable by everyone"
  ON models FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = models.space_id
      AND (NOT is_private OR spaces.author_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert their own models"
  ON models FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_id
      AND author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own models"
  ON models FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_id
      AND author_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own models"
  ON models FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_id
      AND author_id = auth.uid()
    )
  );

-- Create policies for datasets
CREATE POLICY "Datasets are viewable by everyone"
  ON datasets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = datasets.space_id
      AND (NOT is_private OR spaces.author_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert their own datasets"
  ON datasets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_id
      AND author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own datasets"
  ON datasets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_id
      AND author_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own datasets"
  ON datasets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_id
      AND author_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_models_space_id ON models(space_id);
CREATE INDEX IF NOT EXISTS idx_models_framework ON models(framework);
CREATE INDEX IF NOT EXISTS idx_models_task ON models(task);
CREATE INDEX IF NOT EXISTS idx_models_language ON models(language);

CREATE INDEX IF NOT EXISTS idx_datasets_space_id ON datasets(space_id);
CREATE INDEX IF NOT EXISTS idx_datasets_type ON datasets(type);
CREATE INDEX IF NOT EXISTS idx_datasets_format ON datasets(format);
CREATE INDEX IF NOT EXISTS idx_datasets_size ON datasets(size);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datasets_updated_at
  BEFORE UPDATE ON datasets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();