import type { Space } from '../types/spaces';
import { getThumbnailUrl } from './images';

export function formatSpaceData(space: any): Space {
  return {
    id: space.id,
    title: space.title,
    description: space.description,
    author: space.profiles.display_name || space.profiles.username,
    authorId: space.author_id,
    thumbnail: getThumbnailUrl(space.thumbnail_url, 'space'),
    likes: space.likes_count || 0,
    forks: space.forks_count || 0,
    views: space.views_count || 0,
    tags: space.space_tags
      ?.map((t: any) => t.tag)
      ?.filter((tag: string) => tag !== 'space') || [],
    is_private: space.is_private || false,
    is_owner: space.is_owner || false
  };
}