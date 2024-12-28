/*
  # Add organizations and interests to profiles

  1. New Fields
    - `organizations` - JSONB array to store organization affiliations
    - `interests` - Text array to store AI/ML interests
  
  2. Changes
    - Add new columns to profiles table
    - Add validation for organizations structure using simpler constraints
*/

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS organizations JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Add constraint to validate organizations is an array
ALTER TABLE profiles
ADD CONSTRAINT valid_organizations_type 
CHECK (jsonb_typeof(organizations) = 'array');

-- Add constraint to validate interests array length
ALTER TABLE profiles
ADD CONSTRAINT valid_interests_length
CHECK (
  interests IS NULL OR 
  array_length(interests, 1) <= 10
);

-- Create function to validate organization structure
CREATE OR REPLACE FUNCTION validate_organization_entry(org jsonb)
RETURNS boolean AS $$
BEGIN
  RETURN (
    jsonb_typeof(org->'id') = 'string' AND
    jsonb_typeof(org->'name') = 'string' AND
    jsonb_typeof(org->'role') = 'string'
  );
END;
$$ LANGUAGE plpgsql;

-- Add trigger to validate organization entries
CREATE OR REPLACE FUNCTION validate_organizations()
RETURNS trigger AS $$
DECLARE
  org jsonb;
BEGIN
  IF NEW.organizations IS NOT NULL THEN
    FOR org IN SELECT * FROM jsonb_array_elements(NEW.organizations)
    LOOP
      IF NOT validate_organization_entry(org) THEN
        RAISE EXCEPTION 'Invalid organization entry structure';
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_organizations_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_organizations();

-- Update RLS policies
CREATE POLICY "Users can update their own organizations and interests"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);