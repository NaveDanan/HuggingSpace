/*
  # Add URL slug fields and constraints

  1. Changes
    - Add slug field to spaces table
    - Add unique constraint for slug + author combination
    - Add trigger to auto-generate slug from title
  
  2. Security
    - No changes to RLS policies needed
*/

-- Add slug field to spaces table
ALTER TABLE spaces ADD COLUMN IF NOT EXISTS slug text;

-- Create unique constraint for slug + author combination
ALTER TABLE spaces 
ADD CONSTRAINT unique_slug_per_author 
UNIQUE (author_id, slug);

-- Create function to generate slug
CREATE OR REPLACE FUNCTION generate_slug(title text)
RETURNS text AS $$
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  RETURN lower(regexp_replace(
    regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spaces_set_slug
  BEFORE INSERT OR UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION set_slug();