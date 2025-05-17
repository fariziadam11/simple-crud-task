import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Plus, Moon, Sun, LayoutDashboard, Kanban, List, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Task, TaskFormData } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/taskService';
import { TaskFilter } from './components/TaskFilter';
import { TaskList } from './components/TaskList';
import { TaskBoard } from './components/TaskBoard';
import { Dashboard } from './components/Dashboard';
import { TaskForm } from './components/TaskForm';
import { Modal } from './components/ui/Modal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Button } from './components/ui/Button';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { ResetPassword } from './components/auth/ResetPassword';
import { UserProfile } from './components/auth/UserProfile';

const AppContent = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // View mode state (list, board, dashboard, profile)
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'dashboard' | 'profile'>('board');

  // Load tasks when user changes
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return; // Don't fetch tasks if not logged in
      
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
  }, [user]); // Re-fetch when user changes

  // Filter tasks
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter((task) => task.category === categoryFilter);
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      const newTask = await createTask(data);
      setTasks((prev) => [...prev, newTask]);
      setIsTaskModalOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteConfirmation = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
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
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = await updateTask(taskId, { ...taskToUpdate, status });
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

  // Handle task reordering from the board view
  const handleTasksReordered = async (reorderedTasks: Task[]) => {
    try {
      // Update the local state first for immediate UI response
      setTasks(reorderedTasks);

      // For each task that had its status changed, call the API
      for (const task of reorderedTasks) {
        const originalTask = tasks.find(t => t.id === task.id);
        if (originalTask && originalTask.status !== task.status) {
          await updateTask(task.id, { status: task.status, position: task.position });
        }
      }
    } catch (error) {
      toast.error('Failed to update task order');
      console.error(error);
    }
  };

  // Get unique categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    ...Array.from(new Set(tasks.filter(task => task.category).map(task => task.category)))
      .filter((category): category is string => category !== undefined)
      .map(category => ({ value: category, label: category }))
  ];

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: isDarkMode ? {
            background: '#374151',
            color: '#fff',
          } : undefined,
        }} 
      />
      
      <header className="shadow transition-colors duration-200 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <motion.h1 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Task Manager
            </motion.h1>
            <div className="flex items-center space-x-2">
              {/* View Mode Toggles */}
              <div className="hidden sm:flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mr-4">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  title="List View"
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-2 rounded-md ${viewMode === 'board' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  title="Board View"
                >
                  <Kanban size={20} />
                </button>
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`p-2 rounded-md ${viewMode === 'dashboard' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  title="Dashboard View"
                >
                  <LayoutDashboard size={20} />
                </button>
                <button
                  onClick={() => setViewMode('profile')}
                  className={`p-2 rounded-md ${viewMode === 'profile' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  title="User Profile"
                >
                  <User size={20} />
                </button>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="
                  p-2 
                  sm:p-2 
                  md:p-3 
                  rounded-full 
                  bg-gray-100 
                  dark:bg-gray-700 
                  text-gray-700 
                  dark:text-yellow-300 
                  hover:bg-gray-200 
                  dark:hover:bg-gray-600 
                  transition-colors 
                  fixed bottom-4 right-4 
                  sm:bottom-6 sm:right-6 
                  z-50
                "
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Button onClick={openCreateModal}>
                <Plus size={18} className="mr-1" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {viewMode !== 'profile' && (
          <TaskFilter
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
        )}
        
        <AnimatePresence mode="wait">
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TaskList 
                tasks={filteredTasks} 
                isLoading={isLoading}
                onEdit={handleEditTask} 
                onDelete={handleDeleteConfirmation} 
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          )}
          {viewMode === 'board' && (
            <motion.div
              key="board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TaskBoard
                tasks={filteredTasks}
                isLoading={isLoading}
                onEdit={handleEditTask}
                onDelete={handleDeleteConfirmation}
                onStatusChange={handleStatusChange}
                onTasksReordered={handleTasksReordered}
              />
            </motion.div>
          )}
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard tasks={tasks} />
            </motion.div>
          )}
          {viewMode === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserProfile />
            </motion.div>
          )}
        </AnimatePresence>
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
};

function AppRoutes() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        user ? <AppContent /> : <Navigate to="/auth" replace />
      } />
      <Route path="/auth" element={
        user ? <Navigate to="/" replace /> : <AuthLayout />
      } />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
