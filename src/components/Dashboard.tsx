import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Task, TaskStats } from '../types';
import { motion } from 'framer-motion';

interface DashboardProps {
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const stats: TaskStats = useMemo(() => {
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'completed').length,
      pendingTasks: tasks.filter(task => task.status === 'pending').length,
      inProgressTasks: tasks.filter(task => task.status === 'in_progress').length,
      highPriorityTasks: tasks.filter(task => task.priority === 'high').length,
      mediumPriorityTasks: tasks.filter(task => task.priority === 'medium').length,
      lowPriorityTasks: tasks.filter(task => task.priority === 'low').length,
    };
  }, [tasks]);

  const statusData = [
    { name: 'Pending', value: stats.pendingTasks, color: '#3B82F6' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#F59E0B' },
    { name: 'Completed', value: stats.completedTasks, color: '#10B981' },
  ];

  const priorityData = [
    { name: 'Low', value: stats.lowPriorityTasks, color: '#3B82F6' },
    { name: 'Medium', value: stats.mediumPriorityTasks, color: '#F59E0B' },
    { name: 'High', value: stats.highPriorityTasks, color: '#EF4444' },
  ];

  // Colors are defined directly in the Cell components

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Task Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <motion.div 
          className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{stats.totalTasks}</p>
        </motion.div>
        
        <motion.div 
          className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-medium text-green-700 dark:text-green-300">Completion Rate</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-200">{completionRate}%</p>
        </motion.div>
        
        <motion.div 
          className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-medium text-red-700 dark:text-red-300">High Priority</h3>
          <p className="text-3xl font-bold text-red-800 dark:text-red-200">{stats.highPriorityTasks}</p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Priority Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
