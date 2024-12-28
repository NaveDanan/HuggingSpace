/*
  # Remove Duplicate Models and Fix Tag References
  
  1. Changes
    - Identifies and removes duplicate models while preserving tags
    - Updates model_tags references
    - Adds unique constraint
  
  2. Data Integrity
    - Preserves unique tags
    - Updates references safely
*/

-- Create temporary table for models to keep
WITH RankedModels AS (
  SELECT 
    id,
    title,
    author_id,
    created_at,
    likes_count + forks_count + views_count as engagement,
    ROW_NUMBER() OVER (
      PARTITION BY title, author_id
      ORDER BY 
        likes_count + forks_count + views_count DESC,
        created_at DESC
    ) as rn
  FROM models
)
SELECT id INTO TEMP TABLE models_to_keep
FROM RankedModels
WHERE rn = 1;

-- Create mapping for duplicate IDs
WITH DuplicateGroups AS (
  SELECT 
    m1.id as keeper_id,
    m2.id as duplicate_id
  FROM models m1
  JOIN models m2 ON 
    m1.title = m2.title AND 
    m1.author_id = m2.author_id AND
    m1.id != m2.id
  JOIN models_to_keep mk ON m1.id = mk.id
)
SELECT * INTO TEMP TABLE model_id_mapping
FROM DuplicateGroups;

-- Create temporary table for unique tags
CREATE TEMP TABLE unique_model_tags AS
SELECT DISTINCT ON (keeper_id, tag) 
  m.keeper_id as model_id,
  mt.tag
FROM model_id_mapping m
JOIN model_tags mt ON mt.model_id IN (m.keeper_id, m.duplicate_id);

-- Delete all affected tags
DELETE FROM model_tags mt
WHERE EXISTS (
  SELECT 1 FROM model_id_mapping m
  WHERE mt.model_id IN (m.keeper_id, m.duplicate_id)
);

-- Reinsert unique tags
INSERT INTO model_tags (model_id, tag)
SELECT model_id, tag
FROM unique_model_tags;

-- Remove duplicates
DELETE FROM models m
WHERE NOT EXISTS (
  SELECT 1 FROM models_to_keep mk
  WHERE mk.id = m.id
);

-- Add unique constraint
ALTER TABLE models
ADD CONSTRAINT unique_model_per_author 
UNIQUE (title, author_id);

-- Clean up
DROP TABLE models_to_keep;
DROP TABLE model_id_mapping;
DROP TABLE unique_model_tags;