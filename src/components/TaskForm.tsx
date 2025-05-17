import React, { useState, useEffect } from 'react';
import { Calendar, Tag, Hash } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { Task, TaskFormData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: undefined,
    tags: [],
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  
  // Predefined categories for selection
  const categories = [
    { value: '', label: 'None' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'study', label: 'Study' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        priority: initialData.priority,
        due_date: initialData.due_date,
        tags: initialData.tags || [],
        category: initialData.category || '',
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      due_date: date ? date.toISOString() : undefined,
    }));
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={`space-y-4 ${isDarkMode ? 'text-white' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task title"
        error={errors.title}
        required
      />
      
      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Task description"
        rows={4}
        error={errors.description}
        required
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </div>
      
      {/* Due Date Picker */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            Due Date
          </div>
        </label>
        <div className={`relative ${isDarkMode ? 'react-datepicker-dark' : ''}`}>
          <DatePicker
            selected={formData.due_date ? new Date(formData.due_date) : null}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            placeholderText="Select a due date"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
          {formData.due_date && (
            <button
              type="button"
              onClick={() => handleDateChange(null)}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Category Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          <div className="flex items-center">
            <Hash size={16} className="mr-1" />
            Category
          </div>
        </label>
        <Select
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          options={categories}
        />
      </div>
      
      {/* Tags Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          <div className="flex items-center">
            <Tag size={16} className="mr-1" />
            Tags
          </div>
        </label>
        <div className="flex items-center">
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag and press Enter"
            className={`flex-grow px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        
        {/* Tags Display */}
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 max-h-[100px] overflow-y-auto">
            {formData.tags.map((tag, index) => (
              <div 
                key={index} 
                className={`flex items-center px-2 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          isLoading={isLoading}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </motion.form>
  );
};