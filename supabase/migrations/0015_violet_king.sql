/*
  # Update framework type enum

  1. Changes
    - Add new framework values for ML models
    - Preserve existing data
    - Add performance index

  2. Safety
    - Uses safe type casting
    - Handles existing data
    - Preserves constraints
*/

-- First create new enum type with all values
CREATE TYPE framework_type_new AS ENUM (
  'gradio',
  'streamlit', 
  'custom',
  'pytorch',
  'tensorflow',
  'jax',
  'scikit-learn'
);

-- Create new column with new type
ALTER TABLE spaces 
ADD COLUMN framework_temp framework_type_new;

-- Update the new column, mapping existing values
UPDATE spaces
SET framework_temp = CASE 
  WHEN framework::text = 'gradio' THEN 'gradio'::framework_type_new
  WHEN framework::text = 'streamlit' THEN 'streamlit'::framework_type_new
  WHEN framework::text = 'pytorch' THEN 'pytorch'::framework_type_new
  WHEN framework::text = 'tensorflow' THEN 'tensorflow'::framework_type_new
  WHEN framework::text = 'jax' THEN 'jax'::framework_type_new
  WHEN framework::text = 'scikit-learn' THEN 'scikit-learn'::framework_type_new
  ELSE 'custom'::framework_type_new
END;

-- Drop the old column and type
ALTER TABLE spaces DROP COLUMN framework;
DROP TYPE IF EXISTS framework_type;

-- Rename new type and column
ALTER TYPE framework_type_new RENAME TO framework_type;
ALTER TABLE spaces RENAME COLUMN framework_temp TO framework;

-- Add NOT NULL constraint and set default
ALTER TABLE spaces 
  ALTER COLUMN framework SET NOT NULL,
  ALTER COLUMN framework SET DEFAULT 'custom'::framework_type;

-- Add index for better query performance  
CREATE INDEX IF NOT EXISTS idx_spaces_framework ON spaces(framework);