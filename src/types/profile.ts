export interface Space {
  id: string;
  title: string;
  description: string;
  author: string;
  thumbnail_url: string;
  likes_count: number;
  forks_count: number;
  views_count: number;
  tags: string[];
}

// Model and Dataset types extend Space since they share the same structure
export type Model = Space;
export type Dataset = Space;

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  website_url: string | null;
  organizations: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  interests: string[];
  models_count: number;
  datasets_count: number;
  spaces_count: number;
  likes_count: number;
  is_current_user: boolean;
  recent_spaces?: Space[];
  recent_models?: Model[];
  recent_datasets?: Dataset[];
}