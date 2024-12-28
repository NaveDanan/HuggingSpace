import type { Model } from '../types/models';
import { getThumbnailUrl } from './images';

export function formatModelData(model: any): Model {
  return {
    id: model.id,
    title: model.title,
    author: model.profiles.username,
    description: model.description,
    tags: model.model_tags?.map((t: any) => t.tag) || [],
    downloads: model.views_count,
    likes: model.likes_count,
    forks: model.forks_count,
    updatedAt: model.created_at,
    is_owner: model.is_owner || false,
    thumbnail_url: getThumbnailUrl(model.thumbnail_url, 'model')
  };
}