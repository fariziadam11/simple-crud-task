import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { Task, TaskFormData } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/taskService';
import { TaskFilter } from './components/TaskFilter';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Modal } from './components/ui/Modal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Button } from './components/ui/Button';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        toast.error('Failed to load tasks');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Filter tasks
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter && priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      const newTask = await createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      setIsTaskModalOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!currentTask) return;
    
    try {
      setIsSubmitting(true);
      const updatedTask = await updateTask(currentTask.id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setIsTaskModalOpen(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      setIsSubmitting(true);
      await deleteTask(taskToDelete);
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
      setIsDeleteModalOpen(false);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const updatedTask = await updateTask(taskId, { status });
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      toast.success(`Task ${status === 'completed' ? 'completed' : 'updated'} successfully`);
    } catch (error) {
      toast.error('Failed to update task status');
      console.error(error);
    }
  };

  const openCreateModal = () => {
    setCurrentTask(undefined);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const openDeleteModal = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <Button onClick={openCreateModal}>
              <Plus size={18} className="mr-1" />
              Add Task
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskFilter
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
        
        <TaskList
          tasks={filteredTasks}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onStatusChange={handleStatusChange}
        />
      </main>
      
      {/* Task Form Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={currentTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          initialData={currentTask}
          onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => setIsTaskModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
      >
        <ConfirmDialog
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteTask}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default App;