/*
  # Create demo space

  1. Changes
    - Insert a demo space with sample data
    - Add sample tags for the demo space
*/

-- Insert demo space
INSERT INTO public.spaces (
  title,
  description,
  author_id,
  thumbnail_url,
  framework,
  likes_count,
  forks_count,
  views_count,
  is_featured,
  is_private
) 
SELECT 
  'Image Classification Demo',
  'A demo space showcasing image classification using a pre-trained ResNet model. Upload any image and get instant predictions!',
  id,
  'https://source.unsplash.com/random/800x600/?ai,machine-learning',
  'gradio',
  42,
  12,
  156,
  true,
  false
FROM public.profiles
LIMIT 1;

-- Add tags for the demo space
INSERT INTO public.space_tags (space_id, tag)
SELECT 
  id,
  unnest(ARRAY['machine-learning', 'computer-vision', 'demo'])
FROM public.spaces
WHERE title = 'Image Classification Demo';