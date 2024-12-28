/*
  # Migrate Existing Data to New Tables

  1. Data Migration
    - Move existing model data from space_tags to models table
    - Move existing dataset data from space_tags to datasets table
    - Clean up old tags
*/

-- Migrate models
INSERT INTO models (space_id, framework, task, language)
SELECT DISTINCT
  s.id as space_id,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('pytorch', 'tensorflow', 'jax', 'scikit-learn')
     LIMIT 1
    ),
    'custom'
  ) as framework,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('text-generation', 'image-classification', 'object-detection', 'translation', 'summarization')
     LIMIT 1
    ),
    'other'
  ) as task,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('python', 'javascript', 'rust', 'cpp', 'java')
     LIMIT 1
    ),
    'python'
  ) as language
FROM spaces s
INNER JOIN space_tags st ON s.id = st.space_id
WHERE st.tag = 'model';

-- Migrate datasets
INSERT INTO datasets (space_id, type, format, size)
SELECT DISTINCT
  s.id as space_id,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('tabular', 'image', 'text', 'audio', 'video')
     LIMIT 1
    ),
    'other'
  ) as type,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag IN ('csv', 'json', 'parquet', 'arrow')
     LIMIT 1
    ),
    'custom'
  ) as format,
  COALESCE(
    (SELECT tag FROM space_tags 
     WHERE space_id = s.id 
     AND tag LIKE 'size:%'
     LIMIT 1
    ),
    'size:unknown'
  ) as size
FROM spaces s
INNER JOIN space_tags st ON s.id = st.space_id
WHERE st.tag = 'dataset';