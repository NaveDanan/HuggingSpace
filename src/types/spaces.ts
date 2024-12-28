export type SpaceType = 'space' | 'model' | 'dataset';

export interface Space {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  thumbnail: string;
  likes: number;
  forks: number;
  views: number;
  tags: string[];
  is_private: boolean;
  is_owner: boolean;
  type?: SpaceType;
}

export type SortOption = 'recent' | 'popular' | 'trending' | 'name';

export interface SpaceFilters {
  search: string;
  categories: string[];
  frameworks: string[];
  sort: SortOption;
}