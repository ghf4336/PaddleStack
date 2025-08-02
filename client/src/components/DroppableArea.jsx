import React from 'react';
import { useDroppable } from '@dnd-kit/core';

function DroppableArea({ id, children, disabled = false }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: disabled,
  });

  // If children is a React element, clone and add drop-highlight class when isOver
  let childWithHighlight = children;
  if (isOver && React.isValidElement(children)) {
    childWithHighlight = React.cloneElement(children, {
      className: (children.props.className || '') + ' drop-highlight',
    });
  }
  return (
    <div ref={setNodeRef}>
      {childWithHighlight}
    </div>
  );
}

export default DroppableArea;
