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
      className={`rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
        <h3 className={`text-base sm:text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} line-clamp-1`}>{task.title}</h3>
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>
      </div>
      
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 line-clamp-2`}>{task.description}</p>
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          <Tag size={14} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`} />
          {task.tags.map((tag, index) => (
            <span 
              key={index} 
              className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Due date */}
      {task.due_date && (
        <div className={`flex items-center text-sm mb-3 ${isOverdue ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Calendar size={14} className="mr-1" />
          Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
          {isOverdue && (
            <span className="ml-2 text-red-500 flex items-center">
              <Clock size={14} className="mr-1" /> Overdue
            </span>
          )}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 sm:gap-0">
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Created: {format(new Date(task.created_at), 'MMM d')}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStatusChange}
            className={isDarkMode ? 'text-gray-300 border-gray-700 hover:bg-gray-700' : 'text-gray-600'}
          >
            <CheckCircle size={16} className="mr-1" />
            {task.status === 'completed' ? 'Reopen' : 'Complete'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            className={isDarkMode ? 'text-blue-400 border-gray-700 hover:bg-gray-700' : 'text-blue-600'}
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};