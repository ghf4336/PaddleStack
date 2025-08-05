
import React from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId } from './utils/dragDrop';
import './App.css';

function GeneralQueue({ generalQueue, generalQueueStartNum, activeId, overId, endSessionButton }) {
  return (
    <div
      className="general-queue-container"
      style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: 16,
        width: 320,
        maxWidth: 320,
        minWidth: 280,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="general-queue-header bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          background: 'linear-gradient(to right, #3b82f6, #2563eb)', // fallback for Tailwind classes
          color: '#fff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        <span style={{ marginRight: 8, display: 'flex', alignItems: 'center', height: 22 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="9" stroke="#fff" strokeWidth="2" fill="none"/>
            <path d="M11 6v5l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span>General Queue ({generalQueue.length})</span>
      </div>
      <div className="general-queue-desc" style={{ padding: '12px 16px 8px 16px', fontSize: 14, color: '#666' }}>
        These players are in the general queue
      </div>
      <div
        className="general-queue"
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: 0,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {generalQueue.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', padding: '16px 0' }}>No players in queue</div>
        ) : (
          generalQueue.map((p, i) => {
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
          })
        )}
        {/* End Session button slot, if provided */}
        {endSessionButton && (
          <div style={{ padding: '16px 0 8px 0', textAlign: 'center', borderTop: generalQueue.length > 0 ? '1px solid #e5e7eb' : 'none', marginTop: generalQueue.length > 0 ? 8 : 0 }}>
            {endSessionButton}
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneralQueue;
