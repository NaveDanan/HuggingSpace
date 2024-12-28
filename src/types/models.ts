export type SpaceType = 'space' | 'model' | 'dataset';

export interface Model {
  id: string;
  title: string;
  author: string;
  description: string;
  tags: string[];
  downloads: number;
  likes: number;
  forks: number;
  updatedAt: string;
  is_owner: boolean;
  thumbnail_url?: string;
}

export type SortOption = 'downloads' | 'updated' | 'trending' | 'name';

export interface ModelFilters {
  search: string;
  tasks: string[];
  libraries: string[];
  languages: string[];
  sort: SortOption;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  framework: string;
  created_at: string;
  likes_count: number;
  forks_count: number;
  views_count: number;
  thumbnail_url?: string;
  profiles: {
    username: string;
    display_name: string | null;
  };
  space_tags: Array<{
    tag: string;
  }>;
}