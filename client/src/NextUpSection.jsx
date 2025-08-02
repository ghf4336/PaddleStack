import React from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId } from './utils/dragDrop';

function NextUpSection({ nextUpPlayers, startNum = 1, activeId, overId, panelId = "nextup" }) {
  // First group: players 1-4
  const firstGroup = nextUpPlayers.slice(0, 4);
  // Second group: players 5-8
  const secondGroup = nextUpPlayers.slice(4, 8);

  return (
    <div className="nextup-section">
      {/* First group: Next Up */}
      <h3>Next Up ({firstGroup.length}/4)</h3>
      <div className="nextup-desc">The following players will be playing next</div>
      <div className="nextup-grid">
        {[0, 1].map(row => (
          <div className="nextup-row" key={row}>
            {[0, 1].map(col => {
              const idx = row * 2 + col;
              const p = firstGroup[idx];
              const dragId = generateDragId(panelId, idx);
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

      {/* Second group: Up in 2 games */}
      <h4 className="nextup-subheader">Next up In 2 Games ({secondGroup.length}/4)</h4>
      <div className="nextup-desc">These players will play in 2 games</div>
      <div className="nextup-grid">
        {[0, 1].map(row => (
          <div className="nextup-row" key={row}>
            {[0, 1].map(col => {
              const idx = row * 2 + col;
              const p = secondGroup[idx];
              // Use a different panelId for dragId to avoid collision
              const dragId = generateDragId(panelId + "-2", idx);
              return p ? (
                <DroppableArea 
                  key={col} 
                  id={dragId}
                  isDropTarget={overId === dragId}
                >
                  {activeId === dragId ? (
                    <div className="nextup-card ghost-player">
                      <div className="nextup-num">#{startNum + 4 + idx}</div>
                      <div className="nextup-name">{p.name}</div>
                    </div>
                  ) : (
                    <DraggablePlayer 
                      id={dragId}
                      player={p}
                    >
                      <div className="nextup-card">
                        <div className="nextup-num">#{startNum + 4 + idx}</div>
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
