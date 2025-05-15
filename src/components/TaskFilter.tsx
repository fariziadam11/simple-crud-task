import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

interface TaskFilterProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearchChange]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    onStatusChange(value);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPriority(value);
    onPriorityChange(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatus('all');
    setPriority('all');
    onSearchChange('');
    onStatusChange('all');
    onPriorityChange('all');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <Select
            value={status}
            onChange={handleStatusChange}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </div>
        
        <div className="w-full md:w-1/4">
          <Select
            value={priority}
            onChange={handlePriorityChange}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
        </div>
        
        {(searchQuery || status !== 'all' || priority !== 'all') && (
          <button
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X size={16} className="mr-1" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};