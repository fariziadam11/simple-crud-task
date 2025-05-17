import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DroppableWrapper } from './dnd/DroppableWrapper';
import { DraggableWrapper } from './dnd/DraggableWrapper';
import { Task, TaskStatus } from '../types';
import { TaskItem } from './TaskItem';
import { motion } from 'framer-motion';

interface TaskBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onTasksReordered: (tasks: Task[]) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onTasksReordered
}) => {
  // Group tasks by status
  const tasksByStatus = {
    pending: tasks.filter(task => task.status === 'pending'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed')
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // If the task was dropped in the same column and same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Get the task that was dragged
    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;
    const taskToMove = tasksByStatus[sourceStatus][source.index];
    
    // Create a copy of the tasks array
    const updatedTasks = [...tasks];
    
    // Remove the task from its original position
    const sourceTaskIndex = updatedTasks.findIndex(t => t.id === taskToMove.id);
    updatedTasks.splice(sourceTaskIndex, 1);
    
    // If the task was moved to a different column, update its status
    const updatedTask = {
      ...taskToMove,
      status: destinationStatus
    };
    
    // Insert the task at its new position
    updatedTasks.splice(
      updatedTasks.filter(t => t.status === destinationStatus).length > 0
        ? updatedTasks.findIndex(t => t.status === destinationStatus) + destination.index
        : updatedTasks.length,
      0,
      updatedTask
    );
    
    // Update the positions of all tasks
    const finalTasks = updatedTasks.map((task, index) => ({
      ...task,
      position: index
    }));
    
    // Call the callback to update the tasks in the parent component
    onTasksReordered(finalTasks);
  };

  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'in_progress':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4">
        {Object.keys(tasksByStatus).map((status) => (
          <motion.div
            key={status}
            className={`rounded-lg shadow-md ${getColumnColor(status)} p-4`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800 dark:text-white flex items-center">
              {getColumnTitle(status)}
              <span className="ml-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5">
                {tasksByStatus[status as keyof typeof tasksByStatus].length}
              </span>
            </h3>
            
            <DroppableWrapper droppableId={status}>
              {(provided: any, snapshot: any) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-[150px] md:min-h-[200px] transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700/50' : ''
                  }`}
                >
                  {tasksByStatus[status as keyof typeof tasksByStatus].length === 0 ? (
                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                      No tasks
                    </div>
                  ) : (
                    tasksByStatus[status as keyof typeof tasksByStatus].map((task, index) => (
                      <DraggableWrapper key={task.id} draggableId={task.id} index={index}>
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 transition-transform ${
                              snapshot.isDragging ? 'rotate-1 scale-105' : ''
                            }`}
                          >
                            <TaskItem
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onStatusChange={onStatusChange}
                            />
                          </div>
                        )}
                      </DraggableWrapper>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </DroppableWrapper>
          </motion.div>
        ))}
      </div>
    </DragDropContext>
  );
};
