/*
  # Fix RLS policies for spaces table

  1. Changes
    - Update RLS policy for space creation to work with authenticated users
    - Add policy for authenticated users to read their own private spaces
    - Add policy for public to read public spaces

  2. Security
    - Ensure authenticated users can create spaces
    - Maintain privacy controls for private spaces
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own spaces" ON spaces;
DROP POLICY IF EXISTS "Public spaces are viewable by everyone" ON spaces;

-- Create new policies
CREATE POLICY "Authenticated users can create spaces"
  ON spaces
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can view public spaces"
  ON spaces
  FOR SELECT
  TO public
  USING (NOT is_private);

CREATE POLICY "Users can view own spaces"
  ON spaces
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);