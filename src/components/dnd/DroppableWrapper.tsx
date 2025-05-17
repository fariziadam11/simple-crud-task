import React from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

// This wrapper component helps avoid the defaultProps warning from react-beautiful-dnd
export const DroppableWrapper: React.FC<DroppableProps> = (props) => {
  // Simply pass all props to the original Droppable component
  return <Droppable {...props} />;
};
