/*
  # Add isOwner field to content types

  1. Changes
    - Drop existing triggers temporarily
    - Add isOwner column to spaces, models, and datasets tables
    - Set default value to true for new content
    - Update existing content to set isOwner to true
    - Recreate triggers
*/

-- Temporarily drop triggers
DROP TRIGGER IF EXISTS update_models_updated_at ON models;
DROP TRIGGER IF EXISTS update_datasets_updated_at ON datasets;

-- Add isOwner column to spaces
ALTER TABLE spaces
ADD COLUMN IF NOT EXISTS is_owner boolean DEFAULT true;

-- Add isOwner column to models 
ALTER TABLE models
ADD COLUMN IF NOT EXISTS is_owner boolean DEFAULT true;

-- Add isOwner column to datasets
ALTER TABLE datasets
ADD COLUMN IF NOT EXISTS is_owner boolean DEFAULT true;

-- Update existing content to set isOwner to true
UPDATE spaces SET is_owner = true;
UPDATE models SET is_owner = true;
UPDATE datasets SET is_owner = true;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_spaces_is_owner ON spaces(is_owner) WHERE is_owner = true;
CREATE INDEX IF NOT EXISTS idx_models_is_owner ON models(is_owner) WHERE is_owner = true;
CREATE INDEX IF NOT EXISTS idx_datasets_is_owner ON datasets(is_owner) WHERE is_owner = true;

-- Recreate triggers
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datasets_updated_at
  BEFORE UPDATE ON datasets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();