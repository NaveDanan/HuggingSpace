/*
  # Update Privacy Settings

  1. Changes
    - Sets is_private to false for all existing spaces
    - Ensures new spaces default to public visibility
    - Updates indexes for better query performance

  2. Security
    - Maintains existing RLS policies
    - No changes to access control
*/

-- Set is_private to false for all existing spaces
UPDATE spaces
SET is_private = false
WHERE is_private IS NULL;

-- Add default constraint to ensure new spaces are public by default
ALTER TABLE spaces 
  ALTER COLUMN is_private SET DEFAULT false;

-- Create index for better performance on privacy queries
CREATE INDEX IF NOT EXISTS idx_spaces_privacy 
ON spaces(is_private, author_id)
WHERE is_private = true;

-- Create index for public content queries
CREATE INDEX IF NOT EXISTS idx_spaces_public 
ON spaces(created_at DESC)
WHERE is_private = false;