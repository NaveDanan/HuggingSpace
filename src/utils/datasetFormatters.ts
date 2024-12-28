import type { Dataset } from '../types/datasets';
import { getThumbnailUrl } from './images';

export function formatDatasetData(space: any): Dataset {
  return {
    id: space.id,
    title: space.title,
    description: space.description,
    author: space.profiles.display_name || space.profiles.username,
    authorId: space.author_id,
    thumbnail: getThumbnailUrl(space.thumbnail_url, 'dataset'),
    likes: space.likes_count,
    forks: space.forks_count,
    views: space.views_count,
    is_owner: space.is_owner || false,
    tags: space.space_tags
      .map((t: any) => t.tag)
      .filter((tag: string) => tag !== 'dataset'),
  };
}