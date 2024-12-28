/*
  # Initial Schema Setup for SpacesClone

  1. New Tables
    - `profiles`: User profiles with extended information
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `display_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `bio` (text, nullable)
      - `github_url` (text, nullable)
      - `website_url` (text, nullable)
      - `created_at` (timestamp with timezone)

    - `spaces`: ML/AI demo spaces
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `author_id` (uuid, references profiles)
      - `thumbnail_url` (text)
      - `framework` (enum: gradio, streamlit, custom)
      - `likes_count` (integer)
      - `forks_count` (integer)
      - `views_count` (integer)
      - `is_featured` (boolean)
      - `is_private` (boolean)
      - `created_at` (timestamp with timezone)

    - `space_tags`: Tags for spaces (many-to-many)
      - `id` (uuid, primary key)
      - `space_id` (uuid, references spaces)
      - `tag` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for non-private spaces
*/

-- Create custom types
CREATE TYPE framework_type AS ENUM ('gradio', 'streamlit', 'custom');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  github_url text,
  website_url text,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  thumbnail_url text NOT NULL,
  framework framework_type NOT NULL,
  likes_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_private boolean DEFAULT false
);

-- Create space_tags table
CREATE TABLE IF NOT EXISTS space_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id uuid REFERENCES spaces(id) ON DELETE CASCADE,
  tag text NOT NULL,
  UNIQUE(space_id, tag)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_tags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Spaces policies
CREATE POLICY "Public spaces are viewable by everyone"
  ON spaces
  FOR SELECT
  USING (NOT is_private OR auth.uid() = author_id);

CREATE POLICY "Users can insert own spaces"
  ON spaces
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own spaces"
  ON spaces
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Space tags policies
CREATE POLICY "Space tags are viewable by everyone"
  ON space_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_tags.space_id
      AND (NOT is_private OR auth.uid() = author_id)
    )
  );

CREATE POLICY "Users can manage tags for own spaces"
  ON space_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE id = space_tags.space_id
      AND auth.uid() = author_id
    )
  );

-- Create indexes for better performance
CREATE INDEX spaces_author_id_idx ON spaces(author_id);
CREATE INDEX space_tags_space_id_idx ON space_tags(space_id);
CREATE INDEX space_tags_tag_idx ON space_tags(tag);