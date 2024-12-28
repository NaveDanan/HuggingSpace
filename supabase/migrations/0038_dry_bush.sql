/*
  # Add commits table for model version control

  1. New Tables
    - `model_commits`
      - `id` (uuid, primary key)
      - `model_id` (uuid, references models)
      - `author_id` (uuid, references profiles)
      - `message` (text)
      - `created_at` (timestamptz)
      - `files` (text[])
      - `hash` (text)

  2. Security
    - Enable RLS on model_commits table
    - Add policies for read/write access
*/

-- Create model_commits table
CREATE TABLE model_commits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  files text[] NOT NULL DEFAULT '{}',
  hash text NOT NULL,
  CONSTRAINT valid_hash CHECK (hash ~ '^[0-9a-f]{40}$')
);

-- Enable RLS
ALTER TABLE model_commits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Model commits are viewable by everyone"
  ON model_commits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM models
      WHERE id = model_id
      AND (NOT is_private OR author_id = auth.uid())
    )
  );

CREATE POLICY "Users can create commits for their models"
  ON model_commits FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM models
      WHERE id = model_id
      AND author_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_model_commits_model_id ON model_commits(model_id);
CREATE INDEX idx_model_commits_created_at ON model_commits(created_at DESC);
CREATE INDEX idx_model_commits_author_id ON model_commits(author_id);
CREATE INDEX idx_model_commits_hash ON model_commits(hash);