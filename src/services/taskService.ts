import { supabase } from '../lib/supabase';
import type { Task, TaskFormData } from '../types';

export const fetchTasks = async (searchQuery?: string) => {
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as Task[];
};

export const fetchTaskById = async (id: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Task;
};

export const createTask = async (task: TaskFormData) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, updated_at: new Date().toISOString() }])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Task;
};

export const updateTask = async (id: string, task: Partial<TaskFormData>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...task, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Task;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};