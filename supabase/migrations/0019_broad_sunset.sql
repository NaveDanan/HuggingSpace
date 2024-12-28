/*
  # Content Type Refactor
  
  1. Changes
    - Add type column to spaces table
    - Delete existing model records
    - Add type constraints
  
  2. Data Migration
    - Set type for existing spaces
    - Clean up model data
  
  3. Validation
    - Add check constraint for valid types
*/

-- Add type column to spaces table
ALTER TABLE spaces 
ADD COLUMN IF NOT EXISTS type text NOT NULL 
CHECK (type IN ('space', 'model', 'dataset'))
DEFAULT 'space';

-- Delete all records from models table
DELETE FROM models;

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

-- Create index for type column
CREATE INDEX IF NOT EXISTS idx_spaces_type ON spaces(type);

-- Add trigger to ensure type matches tags
CREATE OR REPLACE FUNCTION validate_space_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'model' AND NOT EXISTS (
    SELECT 1 FROM space_tags WHERE space_id = NEW.id AND tag = 'model'
  ) THEN
    RAISE EXCEPTION 'Model spaces must have model tag';
  END IF;
  
  IF NEW.type = 'dataset' AND NOT EXISTS (
    SELECT 1 FROM space_tags WHERE space_id = NEW.id AND tag = 'dataset'
  ) THEN
    RAISE EXCEPTION 'Dataset spaces must have dataset tag';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_space_type
  AFTER INSERT OR UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION validate_space_type();