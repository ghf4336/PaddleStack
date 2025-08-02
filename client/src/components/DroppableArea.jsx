import React from 'react';
import { useDroppable } from '@dnd-kit/core';

function DroppableArea({ id, children, disabled = false, isDropTarget = false }) {
  const { setNodeRef } = useDroppable({
    id: id,
    disabled: disabled,
  });

  // If children is a React element, clone and add drop-highlight class when isDropTarget
  let childWithHighlight = children;
  if (isDropTarget && React.isValidElement(children)) {
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
