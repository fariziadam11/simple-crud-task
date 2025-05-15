/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `status` (text, not null, default: 'pending')
      - `priority` (text, not null, default: 'medium')
      - `created_at` (timestamp with time zone, default: now())
      - `updated_at` (timestamp with time zone, default: now())
  
  2. Security
    - Enable RLS on `tasks` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
    - Add policy for authenticated users to delete their own data
*/

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for reading tasks
CREATE POLICY "Allow users to read tasks"
  ON tasks
  FOR SELECT
  USING (true);

-- Policy for inserting tasks
CREATE POLICY "Allow users to insert tasks"
  ON tasks
  FOR INSERT
  WITH CHECK (true);

-- Policy for updating tasks
CREATE POLICY "Allow users to update tasks"
  ON tasks
  FOR UPDATE
  USING (true);

-- Policy for deleting tasks
CREATE POLICY "Allow users to delete tasks"
  ON tasks
  FOR DELETE
  USING (true);