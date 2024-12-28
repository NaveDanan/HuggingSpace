-- Add theme_preference column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS theme_preference text 
CHECK (theme_preference IN ('light', 'dark', 'system'))
DEFAULT 'system';

-- Update RLS policies
CREATE POLICY "Users can read their own theme preference"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own theme preference"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);