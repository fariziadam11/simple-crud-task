/*
  # Enhance tasks table with additional features

  1. Add new columns to tasks table:
    - `due_date` (timestamp with time zone, nullable)
    - `tags` (text array, nullable)
    - `category` (text, nullable)
    - `position` (integer, nullable)

  This migration supports the enhanced features of the task management application:
  - Due dates for task deadlines
  - Tags for better organization
  - Categories for grouping tasks
  - Position for drag-and-drop ordering
*/

-- Add new columns to the tasks table
ALTER TABLE tasks 
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS position INTEGER;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on priority for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Create GIN index on tags for efficient array searching
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING GIN(tags);

-- Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
