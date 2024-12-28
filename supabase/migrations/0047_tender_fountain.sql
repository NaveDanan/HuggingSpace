/*
  # Fix commit message handling

  1. Changes
    - Add better validation for commit messages
    - Improve error handling
    - Add proper message constraints

  2. Security
    - Validate message content
    - Prevent SQL injection
*/

-- Add better validation for commit messages
CREATE OR REPLACE FUNCTION validate_commit_message(message text)
RETURNS boolean AS $$
BEGIN
  -- Check if message is null or empty
  IF message IS NULL OR trim(message) = '' THEN
    RETURN false;
  END IF;

  -- Check message length (between 3 and 1000 characters)
  IF length(trim(message)) < 3 OR length(message) > 1000 THEN
    RETURN false;
  END IF;

  -- Check for valid characters
  IF message ~ '[^\x20-\x7E\n]' THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Update commit handling function
CREATE OR REPLACE FUNCTION handle_model_commit()
RETURNS trigger AS $$
BEGIN
  -- Validate commit message
  IF NOT validate_commit_message(NEW.message) THEN
    RAISE EXCEPTION 'Invalid commit message: Message must be between 3 and 1000 characters and contain only valid characters';
  END IF;

  -- Clean message text
  NEW.message := trim(NEW.message);

  -- Generate commit hash
  NEW.hash := encode(digest(NEW.message || array_to_string(NEW.files, ',') || NEW.created_at::text, 'sha1'), 'hex');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in commit: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add message constraints to model_commits table
ALTER TABLE model_commits
ALTER COLUMN message SET NOT NULL,
ADD CONSTRAINT message_length CHECK (length(message) BETWEEN 3 AND 1000),
ADD CONSTRAINT message_characters CHECK (message ~ '^[\x20-\x7E\n]*$');