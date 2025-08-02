
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function DraggablePlayer({ id, player, children, disabled = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: id,
    disabled: disabled,
  });


  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: disabled ? 'default' : 'grab',
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'dragging-player' : ''}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

export default DraggablePlayer;
