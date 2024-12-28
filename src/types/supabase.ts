export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      spaces: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          author_id: string
          thumbnail_url: string
          likes_count: number
          forks_count: number
          views_count: number
          framework: 'gradio' | 'streamlit' | 'custom'
          is_featured: boolean
          is_private: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          author_id: string
          thumbnail_url: string
          likes_count?: number
          forks_count?: number
          views_count?: number
          framework: 'gradio' | 'streamlit' | 'custom'
          is_featured?: boolean
          is_private?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          author_id?: string
          thumbnail_url?: string
          likes_count?: number
          forks_count?: number
          views_count?: number
          framework?: 'gradio' | 'streamlit' | 'custom'
          is_featured?: boolean
          is_private?: boolean
        }
      }
      space_tags: {
        Row: {
          id: string
          space_id: string
          tag: string
        }
        Insert: {
          id?: string
          space_id: string
          tag: string
        }
        Update: {
          id?: string
          space_id?: string
          tag?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          github_url: string | null
          website_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          github_url?: string | null
          website_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          github_url?: string | null
          website_url?: string | null
        }
      }
    }
  }
}