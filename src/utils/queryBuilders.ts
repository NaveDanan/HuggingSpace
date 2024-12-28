import { SupabaseClient } from '@supabase/supabase-js';
import type { ModelFilters } from '../types/models';
import type { DatasetFilters } from '../types/datasets';
import type { SpaceFilters } from '../types/spaces';

export function buildModelQuery(supabase: SupabaseClient, filters: ModelFilters) {
  let query = supabase
    .from('models')
    .select(`
      *,
      model_tags (tag),
      profiles!inner (username, display_name)
    `);

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.tasks.length > 0) {
    query = query.in('task', filters.tasks.map(t => t.toLowerCase()));
  }

  if (filters.libraries.length > 0) {
    query = query.in('framework', filters.libraries.map(l => l.toLowerCase()));
  }

  if (filters.languages.length > 0) {
    query = query.in('language', filters.languages.map(l => l.toLowerCase()));
  }

  switch (filters.sort) {
    case 'downloads':
      query = query.order('views_count', { ascending: false });
      break;
    case 'updated':
      query = query.order('created_at', { ascending: false });
      break;
    case 'trending':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'name':
      query = query.order('title');
      break;
  }

  return query;
}

export function buildDatasetQuery(supabase: SupabaseClient, filters: DatasetFilters) {
  let query = supabase
    .from('datasets')
    .select(`
      *,
      dataset_tags (tag),
      profiles!inner (username, display_name)
    `);

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.types.length > 0) {
    query = query.in('type', filters.types.map(t => t.toLowerCase()));
  }

  if (filters.formats.length > 0) {
    query = query.in('format', filters.formats.map(f => f.toLowerCase()));
  }

  if (filters.sizes.length > 0) {
    query = query.in('size', filters.sizes.map(s => s.toLowerCase()));
  }

  switch (filters.sort) {
    case 'downloads':
      query = query.order('views_count', { ascending: false });
      break;
    case 'updated':
      query = query.order('created_at', { ascending: false });
      break;
    case 'trending':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'name':
      query = query.order('title');
      break;
  }

  return query;
}

export function buildSpaceQuery(supabase: SupabaseClient, filters: SpaceFilters, options: { featured?: boolean; limit?: number } = {}) {
  let query = supabase
    .from('spaces')
    .select(`
      *,
      space_tags (tag),
      profiles!inner (username, display_name)
    `)
    .eq('type', 'space');

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.categories.length > 0) {
    query = query.in('space_tags.tag', filters.categories);
  }

  if (filters.frameworks.length > 0) {
    query = query.in('framework', filters.frameworks);
  }

  if (options.featured) {
    query = query.eq('is_featured', true);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  switch (filters.sort) {
    case 'recent':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('views_count', { ascending: false });
      break;
    case 'trending':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'name':
      query = query.order('title');
      break;
  }

  return query;
}