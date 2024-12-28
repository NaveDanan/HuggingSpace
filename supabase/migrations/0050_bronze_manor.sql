-- Add updated_at column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create or replace trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatically updating updated_at
DROP TRIGGER IF EXISTS update_profile_updated_at_trigger ON profiles;
CREATE TRIGGER update_profile_updated_at_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_updated_at();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at 
ON profiles(updated_at DESC);