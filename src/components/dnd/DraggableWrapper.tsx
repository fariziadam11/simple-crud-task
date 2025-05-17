import React from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';

// This wrapper component helps avoid the defaultProps warning from react-beautiful-dnd
export const DraggableWrapper: React.FC<DraggableProps> = (props) => {
  // Simply pass all props to the original Draggable component
  return <Draggable {...props} />;
};
