import React from 'react';
import { Edit, Trash2, CheckCircle, Calendar, Tag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Task } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onEdit, 
  onDelete,
  onStatusChange
}) => {
  const { isDarkMode } = useTheme();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge variant="info">Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="info">Low</Badge>;
    }
  };

  const handleStatusChange = () => {
    const newStatus = task.status === 'completed' 
      ? 'pending' 
      : task.status === 'pending' 
        ? 'in_progress' 
        : 'completed';
    
    onStatusChange(task.id, newStatus);
  };

  // Check if task is overdue
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <motion.div 
      className={`rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
      } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header with title and badges */}
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start mb-3">
        <h3 className={`text-base sm:text-lg font-medium ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        } line-clamp-1 flex-1 min-w-0`}>
          {task.title}
        </h3>
        <div className="flex flex-wrap gap-2 sm:ml-4">
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>
      </div>
      
      {/* Description */}
      <p className={`${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      } mb-3 line-clamp-2 text-sm sm:text-base`}>
        {task.description}
      </p>
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Tag size={14} className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } flex-shrink-0`} />
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Due date */}
      {task.due_date && (
        <div className={`flex flex-wrap items-center text-sm mb-3 ${
          isOverdue ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Calendar size={14} className="mr-1 flex-shrink-0" />
          <span className="mr-2">Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
          {isOverdue && (
            <span className="flex items-center">
              <Clock size={14} className="mr-1" /> Overdue
            </span>
          )}
        </div>
      )}
      
      {/* Footer with creation date and actions */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mt-4">
        <div className={`text-xs sm:text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Created: {format(new Date(task.created_at), 'MMM d, yyyy')}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStatusChange}
            className={`flex items-center ${
              isDarkMode ? 'text-gray-300 border-gray-700 hover:bg-gray-700' : 'text-gray-600'
            }`}
          >
            <CheckCircle size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">
              {task.status === 'completed' ? 'Reopen' : 'Complete'}
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            className={`flex items-center ${
              isDarkMode ? 'text-blue-400 border-gray-700 hover:bg-gray-700' : 'text-blue-600'
            }`}
          >
            <Edit size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="flex items-center"
          >
            <Trash2 size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};