import React from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId } from './utils/dragDrop';

function GeneralQueueSection({
  generalQueue,
  generalQueueStartNum = 5,
  activeId,
  overId,
  endSessionButton
}) {
  return (
    <div
      className="general-queue-container"
      style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb',
        marginBottom: 0,
      }}
    >
      <h4 className="sticky-queue-title" style={{ padding: '16px 16px 12px 16px', margin: 0, background: '#fff', zIndex: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', height: 22 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="9" stroke="#222" strokeWidth="2" fill="none"/>
            <path d="M11 6v5l4 2" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span>General Queue ({generalQueue.length})</span>
      </h4>
      <div
        className="general-queue"
        style={{
          maxHeight: '272px', // 320px minus header height
          overflowY: 'auto',
          overflowX: 'hidden', // Prevent horizontal scrollbar
          marginBottom: 0,
          paddingBottom: 8,
        }}
      >
        {generalQueue.map((p, i) => {
          const dragId = generateDragId('general', i);
          return (
            <DroppableArea
              key={i}
              id={dragId}
              isDropTarget={overId === dragId}
            >
              {activeId === dragId ? (
                <div className="queue-player ghost-player">
                  <span className="queue-dot" /> {p.name}
                  <span className="queue-num">#{generalQueueStartNum + i}</span>
                </div>
              ) : (
                <DraggablePlayer
                  id={dragId}
                  player={p}
                >
                  <div className="queue-player">
                    <span className="queue-dot" /> {p.name}
                    <span className="queue-num">#{generalQueueStartNum + i}</span>
                  </div>
                </DraggablePlayer>
              )}
            </DroppableArea>
          );
        })}
        {/* End Session button slot, if provided */}
        <div style={{ padding: '8px 16px' }}>{endSessionButton}</div>
      </div>
    </div>
  );
}

export default GeneralQueueSection;
