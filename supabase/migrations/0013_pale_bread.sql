/*
  # Update default Space image

  1. Changes
    - Updates the default thumbnail URL for spaces without one
    - Only updates spaces that don't have a model or dataset tag
*/

UPDATE spaces
SET thumbnail_url = CASE
  WHEN EXISTS (
    SELECT 1 FROM space_tags st 
    WHERE st.space_id = spaces.id 
    AND st.tag = 'model'
  ) THEN 'https://source.unsplash.com/random/800x600/?ai,neural-network'
  WHEN EXISTS (
    SELECT 1 FROM space_tags st 
    WHERE st.space_id = spaces.id 
    AND st.tag = 'dataset'
  ) THEN 'https://source.unsplash.com/random/800x600/?data,analytics'
  ELSE 'https://raw.githubusercontent.com/huggingface/huggingface.js/main/packages/hub/src/spaces-default.png'
END
WHERE thumbnail_url IS NULL
OR thumbnail_url = 'https://source.unsplash.com/random/800x600/?workspace,collaboration';