/*
  # Implement Content Deletion

  1. Changes
    - Add cascade deletion for space_tags when a space is deleted
    - Add RLS policies for deletion
    - Add indexes for better deletion performance

  2. Security
    - Only allow authors to delete their own content
    - Ensure all related data is properly cleaned up
*/

-- Update foreign key constraint to cascade delete tags
ALTER TABLE space_tags
DROP CONSTRAINT space_tags_space_id_fkey,
ADD CONSTRAINT space_tags_space_id_fkey
  FOREIGN KEY (space_id)
  REFERENCES spaces(id)
  ON DELETE CASCADE;

-- Add RLS policy for deletion
CREATE POLICY "Users can delete their own spaces"
  ON spaces
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_space_tags_space_id ON space_tags(space_id);
CREATE INDEX IF NOT EXISTS idx_spaces_author_id ON spaces(author_id);