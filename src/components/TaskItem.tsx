import React from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { Task } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-800 line-clamp-1">{task.title}</h3>
        <div className="flex space-x-2">
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          {new Date(task.created_at).toLocaleDateString()}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStatusChange}
            className="text-gray-600"
          >
            <CheckCircle size={16} className="mr-1" />
            {task.status === 'completed' ? 'Reopen' : 'Complete'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            className="text-blue-600"
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
    </div>
  );
};