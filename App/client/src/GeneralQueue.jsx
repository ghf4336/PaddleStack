
import React from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId } from './utils/dragDrop';
import './App.css';

function GeneralQueue({ generalQueue, generalQueueStartNum, activeId, overId, handleRemovePlayer }) {
  return (
    <div className="general-queue-panel" style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 220, marginBottom: '24px' }}>
      <h3 style={{ marginBottom: 16, fontWeight: 700 }}>General Queue</h3>
      <div style={{ maxHeight: '320px', overflowY: 'auto', paddingBottom: 8 }}>
        {generalQueue.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No players in queue</div>
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
                      <button style={{ marginLeft: 'auto', fontSize: '0.9em', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleRemovePlayer(p)} title="Remove or pause player">×</button>
                    </div>
                  </DraggablePlayer>
                )}
              </DroppableArea>
            );
          })
        )}
      </div>
    </div>
  );
}

export default GeneralQueue;
