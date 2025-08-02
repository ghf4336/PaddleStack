import React from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId } from './utils/dragDrop';

function NextUpSection({ nextUpPlayers, startNum = 1, activeId, overId }) {
  return (
    <div className="nextup-section">
      <h3>Next Up ({nextUpPlayers.length}/4)</h3>
      <div className="nextup-desc">Next 4 players to enter any available court</div>
      <div className="nextup-grid">
        {[0, 1].map(row => (
          <div className="nextup-row" key={row}>
            {[0, 1].map(col => {
              const idx = row * 2 + col;
              const p = nextUpPlayers[idx];
              const dragId = generateDragId('nextup', idx);
              return p ? (
                <DroppableArea 
                  key={col} 
                  id={dragId}
                  isDropTarget={overId === dragId}
                >
                  {activeId === dragId ? (
                    <div className="nextup-card ghost-player">
                      <div className="nextup-num">#{startNum + idx}</div>
                      <div className="nextup-name">{p.name}</div>
                    </div>
                  ) : (
                    <DraggablePlayer 
                      id={dragId}
                      player={p}
                    >
                      <div className="nextup-card">
                        <div className="nextup-num">#{startNum + idx}</div>
                        <div className="nextup-name">{p.name}</div>
                      </div>
                    </DraggablePlayer>
                  )}
                </DroppableArea>
              ) : <div className="nextup-card empty" key={col} role="presentation"></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NextUpSection;
