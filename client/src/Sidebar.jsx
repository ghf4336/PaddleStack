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
    <div className="sidebar" style={{ position: 'relative', padding: 0, background: 'none', boxShadow: 'none', border: 'none' }}>
      {/* Player List Container */}
      <div
        className="player-list-container"
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: 16,
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          className="sidebar-header bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            background: 'linear-gradient(to right, #22c55e, #16a34a)', // fallback for Tailwind classes
            color: '#fff',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            margin: '-1px -1px 0 -1px', // Extend to edges
          }}
        >
          <img src="/PaddleStack/logo_white.png" alt="Pickle Park Logo" style={{ height: 32, width: 'auto', verticalAlign: 'middle' }} />
          <span style={{ fontWeight: 600, fontSize: 18 }}>Players ({sessionPlayers.length})</span>
          <button
            className="add-btn"
            style={{ marginLeft: 'auto', fontWeight: 600, fontSize: 16, background: '#fff', color: '#111', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}
            onClick={handleAddPlayer}
          >
            Add Player
          </button>
        </div>
        {/* AddPlayerModal will be rendered here if present */}
        {/** @ts-ignore: AddPlayerModal is injected as a prop by App.jsx for in-panel rendering */}
        {typeof window !== 'undefined' && window.__AddPlayerModalInSidebar}
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
                    {inCourt && (
                      <span className="incourt-badge" style={{ background: '#2196f3', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 13, marginLeft: 6, fontWeight: 600 }}>On Court</span>
                    )}
                  </span>
                  {isPaused ? (
                    <button
                      className="enable-btn"
                      title="Enable player"
                      style={{ marginLeft: 8, background: '#0ae04aff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '4px 12px', cursor: 'pointer' }}
                      onClick={() => handleEnablePausedPlayer(p)}
                    >Continue</button>
                  ) : (
                    !inCourt && (
                      <button
                        className="remove-btn"
                        title="Remove or pause player"
                        onClick={() => handleRemovePlayer(p)}
                      >×</button>
                    )
                  )}
                </div>
              );
            })}
        </div>
      </div>
      {/* General Queue Container */}
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
            margin: '-1px -1px 0 -1px', // Extend to edges
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', height: 22 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="9" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M11 6v5l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>General Queue ({generalQueue.length})</span>
        </div>
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
    </div>
  );
}

export default Sidebar;
