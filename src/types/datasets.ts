export type DatasetSortOption = 'downloads' | 'updated' | 'trending' | 'name';

export interface DatasetFilters {
  search: string;
  types: string[];
  formats: string[];
  sizes: string[];
  sort: DatasetSortOption;
}

export interface Dataset {
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
}