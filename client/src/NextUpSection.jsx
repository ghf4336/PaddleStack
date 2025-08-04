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
      <div
        className="nextup-header bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-t-lg"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          background: 'linear-gradient(to right, #facc15, #f59e0b)', // fallback for Tailwind classes
          color: '#b45309',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        <span style={{ marginRight: 8, display: 'flex', alignItems: 'center', height: 22 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="9" stroke="#222" strokeWidth="2" fill="none"/>
            <path d="M11 6v5l4 2" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span>Next Up ({firstGroup.length}/4)</span>
      </div>
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
      <div
        className="nextup2-header bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900 rounded-t-lg"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          background: 'linear-gradient(to right, #fdba74, #fb923c)', // fallback for Tailwind classes
          color: '#b45309',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="9" stroke="#222" strokeWidth="2" fill="none"/>
            <path d="M11 6v5l4 2" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span>Next up In 2 Games ({secondGroup.length}/4)</span>
      </div>
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
