
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

  // Touch event handlers for drag compatibility
  const handleTouchStart = (e) => {
    if (disabled) return;
    if (listeners && listeners.onPointerDown) {
      listeners.onPointerDown({
        ...e,
        pointerType: 'touch',
        preventDefault: () => e.preventDefault(),
      });
    }
  };
  const handleTouchMove = (e) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  );
}

export default DraggablePlayer;
