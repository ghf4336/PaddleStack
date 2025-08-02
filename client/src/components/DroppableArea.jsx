import React from 'react';
import { useDroppable } from '@dnd-kit/core';

function DroppableArea({ id, children, disabled = false }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: disabled,
  });

  const style = {
    backgroundColor: isOver ? 'rgba(25, 195, 125, 0.1)' : undefined,
    borderColor: isOver ? '#19c37d' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default DroppableArea;
