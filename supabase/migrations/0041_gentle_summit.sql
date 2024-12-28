-- Drop existing policy
DROP POLICY IF EXISTS "Model commits are viewable by everyone" ON model_commits;

-- Create new policies with better access control
CREATE POLICY "Model commits are viewable by everyone"
  ON model_commits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM models m
      WHERE m.id = model_id
      AND (NOT m.is_private OR m.author_id = auth.uid())
    )
  );

-- Add retry function for database operations
CREATE OR REPLACE FUNCTION retry_operation(
  max_attempts integer,
  operation_name text,
  VARIADIC args text[]
)
RETURNS void AS $$
DECLARE
  attempt integer := 1;
  success boolean := false;
BEGIN
  WHILE attempt <= max_attempts AND NOT success LOOP
    BEGIN
      -- Log attempt
      RAISE NOTICE 'Attempt % of % for operation %', attempt, max_attempts, operation_name;
      
      -- Execute operation based on args
      EXECUTE format(operation_name, VARIADIC args);
      
      success := true;
    EXCEPTION WHEN OTHERS THEN
      IF attempt = max_attempts THEN
        RAISE;
      END IF;
      -- Wait with exponential backoff
      PERFORM pg_sleep(power(2, attempt - 1));
      attempt := attempt + 1;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql;