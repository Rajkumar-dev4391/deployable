/*
  # Create projects table for organizing chats

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text, project name)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add `project_id` column to existing `chats` table
    - Add constraint to limit 5 chats per project

  3. Security
    - Enable RLS on `projects` table
    - Add policies for users to manage their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Add project_id to chats table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chats' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE chats ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create policies for projects
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to check chat limit per project
CREATE OR REPLACE FUNCTION check_project_chat_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.project_id IS NOT NULL THEN
    IF (
      SELECT COUNT(*)
      FROM chats
      WHERE project_id = NEW.project_id
    ) >= 5 THEN
      RAISE EXCEPTION 'Project cannot have more than 5 chats';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce chat limit
DROP TRIGGER IF EXISTS enforce_project_chat_limit ON chats;
CREATE TRIGGER enforce_project_chat_limit
  BEFORE INSERT OR UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION check_project_chat_limit();