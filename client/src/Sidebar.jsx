import React from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId } from './utils/dragDrop';

function Sidebar({
  sessionPlayers,
  courts,
  pausedPlayers,
  handleAddPlayer,
  handleLoadTestData,
  handleEnablePausedPlayer,
  handleRemovePlayer,
  toast,
  toastTimeout,
  generalQueue,
  generalQueueStartNum = 5,
  endSessionButton,
  activeId,
  overId
}) {
  return (
    <div className="sidebar" style={{ position: 'relative' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>👤</span> Players ({sessionPlayers.length})
        <button className="add-btn" style={{ marginLeft: 'auto', fontWeight: 600, fontSize: 16, background: '#11121a', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }} onClick={handleAddPlayer}>
          Add Player
        </button>
      </h3>
      <button className="load-test-btn" style={{ margin: '8px 0', width: '100%' }} onClick={handleLoadTestData}>
        Load Test Data
      </button>
      {/* PaidModal will be rendered here if present */}
      {/** @ts-ignore: PaidModal is injected as a prop by App.jsx for in-panel rendering */}
      {typeof window !== 'undefined' && window.__PaidModalInSidebar}
      <div className="session-list">
        {[...sessionPlayers]
          .sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0))
          .map((p, i) => {
            const inCourt = courts.some(court => (court.players || []).some(cp => cp && cp.name === p.name));
            const isPaused = pausedPlayers.some(pp => pp.name === p.name);
            return (
              <div className={`session-player${isPaused ? ' paused' : ''}`} key={p.name} style={isPaused ? { opacity: 0.5, background: '#f6f6fa' } : {}}>
                <span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: p.paid ? '#19c37d' : '#e74c3c',
                      marginRight: 8,
                      verticalAlign: 'middle',
                    }}
                    title={p.paid ? 'Paid' : 'Unpaid'}
                  />
                  {p.name}
                  {isPaused && <span className="paused-badge" style={{ background: '#bbb', color: '#222', borderRadius: 6, padding: '2px 8px', fontSize: 13, marginLeft: 6 }}>Paused</span>}
                </span>
                {isPaused ? (
                  <button
                    className="enable-btn"
                    title="Enable player"
                    style={{ marginLeft: 8, background: '#0ae04aff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '4px 12px', cursor: 'pointer' }}
                    onClick={() => handleEnablePausedPlayer(p)}
                  >Continue</button>
                ) : (
                  <button
                    className="remove-btn"
                    title="Remove or pause player"
                    disabled={inCourt}
                    onClick={() => {
                      if (inCourt) {
                        if (toast && toastTimeout && toastTimeout.current) {
                          clearTimeout(toastTimeout.current);
                        }
                        return;
                      }
                      handleRemovePlayer(p);
                    }}
                  >×</button>
                )}
              </div>
            );
          })}
      </div>
      <div
        className="general-queue"
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          overflowX: 'hidden', // Prevent horizontal scrollbar
          marginBottom: 56, // space for End Session button
          paddingBottom: 8,
        }}
      >
        <h4>General Queue ({generalQueue.length})</h4>
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
      </div>
      {/* End Session button slot, if provided */}
      {endSessionButton}
    </div>
  );
}

export default Sidebar;
