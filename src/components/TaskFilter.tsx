import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

interface TaskFilterProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onCategoryChange: (category: string) => void;
  categories?: { value: string; label: string }[];
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  categories = [{ value: 'all', label: 'All Categories' }],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [category, setCategory] = useState('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    onCategoryChange(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatus('all');
    setPriority('all');
    setCategory('all');
    onSearchChange('');
    onStatusChange('all');
    onPriorityChange('all');
    onCategoryChange('all');
  };

  return (
    <motion.div 
      className="rounded-lg shadow p-4 mb-6 bg-white dark:bg-gray-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
          <Filter size={18} className="mr-2" />
          Filters
        </h2>
        <button 
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isFilterExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 md:gap-4">
        <div className="w-full sm:w-1/2">
          <div className="relative">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="w-full sm:w-1/4">
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
        
        <div className="w-full sm:w-1/4">
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
        
        {(searchQuery || status !== 'all' || priority !== 'all' || category !== 'all') && (
          <button
            onClick={clearFilters}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={16} className="mr-1" />
            Clear
          </button>
        )}
      </div>
      
      {/* Additional filters that appear when expanded */}
      {isFilterExpanded && (
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 flex items-center">
                <Tag size={16} className="mr-1" />
                Category
              </label>
              <Select
                value={category}
                onChange={handleCategoryChange}
                options={categories}
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};