/*
  # Add Type Column and Fix Models
  
  1. Changes
    - Add type column to spaces table
    - Update existing spaces with correct type
    - Create index and validation trigger
  
  2. Schema Updates
    - Add type column with validation
    - Proper constraints and indexes
    - Data migration for existing records
*/

-- Add type column to spaces table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'spaces' AND column_name = 'type') 
  THEN
    ALTER TABLE spaces 
    ADD COLUMN type text NOT NULL 
    CHECK (type IN ('space', 'model', 'dataset'))
    DEFAULT 'space';
  END IF;
END $$;

-- Update existing spaces with correct type based on tags
UPDATE spaces s
SET type = CASE
  WHEN EXISTS (
    SELECT 1 FROM space_tags st 
    WHERE st.space_id = s.id 
    AND st.tag = 'model'
  ) THEN 'model'
  WHEN EXISTS (
    SELECT 1 FROM space_tags st 
    WHERE st.space_id = s.id 
    AND st.tag = 'dataset'
  ) THEN 'dataset'
  ELSE 'space'
END;

-- Create index for type column if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_spaces_type ON spaces(type);

-- Create or replace the validation trigger function
CREATE OR REPLACE FUNCTION validate_space_type()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate model type
  IF NEW.type = 'model' AND NOT EXISTS (
    SELECT 1 FROM space_tags WHERE space_id = NEW.id AND tag = 'model'
  ) THEN
    INSERT INTO space_tags (space_id, tag) VALUES (NEW.id, 'model');
  END IF;
  
  -- Validate dataset type
  IF NEW.type = 'dataset' AND NOT EXISTS (
    SELECT 1 FROM space_tags WHERE space_id = NEW.id AND tag = 'dataset'
  ) THEN
    INSERT INTO space_tags (space_id, tag) VALUES (NEW.id, 'dataset');
  END IF;
  
  -- Validate space type
  IF NEW.type = 'space' AND NOT EXISTS (
    SELECT 1 FROM space_tags WHERE space_id = NEW.id AND tag = 'space'
  ) THEN
    INSERT INTO space_tags (space_id, tag) VALUES (NEW.id, 'space');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS ensure_space_type ON spaces;

-- Create new trigger
CREATE TRIGGER ensure_space_type
  AFTER INSERT OR UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION validate_space_type();