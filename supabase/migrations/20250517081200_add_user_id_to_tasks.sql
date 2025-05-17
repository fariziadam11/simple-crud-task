/*
  # Add user_id column to tasks table
  
  This migration adds a user_id column to the tasks table to support authentication
  and row-level security policies. The user_id column will store the UUID of the
  user who created the task.
*/

-- Add user_id column to tasks table
ALTER TABLE tasks 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index on user_id for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Update existing tasks to have a default user_id if needed
-- This is a placeholder - in a real migration, you might want to assign tasks to specific users
-- or leave them as NULL depending on your requirements
